-- =============================================================================
-- Tối ưu Disk IO cho DB blog Trà Đá Data  (chạy TAY trên Supabase SQL Editor)
-- =============================================================================
-- Bối cảnh: Supabase cảnh báo cạn Disk IO Budget. Bộ đếm lượt xem ghi thẳng
-- Postgres mỗi lượt đọc là nguồn ghi liên tục (mỗi commit là một lần fsync WAL =
-- disk IO) 24/7 — đúng kiểu bào mòn ngân sách IO đều đều. Code đã chuyển sang đệm
-- lượt xem trong Redis + gộp qua cron để cắt tần suất commit đó.
--
-- Sau khi ĐO thực tế (11/09/2026), phần DB đi kèm BẮT BUỘC chỉ còn (1) hàm RPC:
--   (1) Hàm RPC increment_view_counts — BẮT BUỘC, cron flush gọi.
--   (2) Index — KHÔNG cần: bảng quá nhỏ, nằm sẵn trong RAM (xem chú thích mục 2).
--   (3) Dọn bloat — KHÔNG cần: n_dead_tup rất nhỏ, autovacuum theo kịp.
--
-- Schema thật quản trên Supabase (repo không dựng lại được) nên hãy đối chiếu tên
-- cột/bảng với DB thật nếu có gì lệch.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- (0) CHẨN ĐOÁN — chạy trước, đọc kết quả
-- -----------------------------------------------------------------------------

-- 0a. Bảng nào bị quét tuần tự (seq_scan) nhiều + bao nhiêu rác (n_dead_tup).
--     seq_scan cao mà idx_scan thấp = thiếu index. n_dead_tup cao = cần VACUUM.
select relname,
       seq_scan, idx_scan, n_live_tup, n_dead_tup,
       last_autovacuum,
       pg_size_pretty(pg_relation_size(relid)) as table_size
from pg_stat_user_tables
order by seq_scan desc
limit 20;

-- 0b. Các index đang CÓ trên những bảng ta sắp đụng — để không tạo trùng.
select tablename, indexname, indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in ('posts', 'post_categories', 'post_tags', 'categories')
order by tablename, indexname;

-- 0c. (Tuỳ chọn) Query nào ghi đĩa nhiều nhất. Cần bật extension trước:
--     create extension if not exists pg_stat_statements;
-- select substring(query, 1, 90) as query, calls,
--        shared_blks_written, shared_blks_dirtied, total_exec_time::bigint as ms
-- from pg_stat_statements
-- order by shared_blks_written desc nulls last
-- limit 20;


-- -----------------------------------------------------------------------------
-- (1) HÀM RPC — BẮT BUỘC: cron /api/cron/flush-views gọi hàm này
-- -----------------------------------------------------------------------------
-- Cộng dồn lượt xem cho nhiều bài trong MỘT câu lệnh, nguyên tử. Nhận mảng JSON
-- dạng: [{"slug":"bai-a","delta":12}, {"slug":"bai-b","delta":3}].
create or replace function increment_view_counts(updates jsonb)
returns void
language sql
security definer
set search_path = public
as $$
    update posts p
    set view_count = coalesce(p.view_count, 0) + u.delta
    from jsonb_to_recordset(updates) as u(slug text, delta bigint)
    where p.slug = u.slug;
$$;

-- Chỉ service_role (key server dùng) mới được gọi; không mở cho anon/authenticated.
revoke all on function increment_view_counts(jsonb) from public, anon, authenticated;
grant execute on function increment_view_counts(jsonb) to service_role;


-- -----------------------------------------------------------------------------
-- (2) INDEX — KHÔNG cần, cố ý KHÔNG tạo
-- -----------------------------------------------------------------------------
-- Đo thực tế (11/09/2026): mọi bảng đều TÍ HON — posts 368 kB / 288 hàng,
-- post_tags 48 kB, categories 8 kB... Cả DB gói gọn trong RAM (shared_buffers).
-- Với bảng cỡ này Postgres planner CHỌN seq scan là ĐÚNG: quét một bảng một trang
-- nằm sẵn trong bộ nhớ nhanh hơn đi qua index, và gần như 0 disk IO (đọc từ cache).
-- seq_scan cao trong pg_stat_user_tables ở đây là do SỐ LƯỢNG query nhiều, KHÔNG
-- phải scan chậm. Thêm index lúc này còn PHẢN tác dụng: mỗi INSERT/UPDATE phải cập
-- nhật thêm index = thêm ghi = thêm IO, đúng thứ ta đang muốn giảm.
--
-- ⇒ Chỉ xem lại index khi một bảng vượt ~vài chục nghìn hàng (đo lại bằng 0a).


-- -----------------------------------------------------------------------------
-- (3) DỌN BLOAT — KHÔNG cần
-- -----------------------------------------------------------------------------
-- Đo thực tế: n_dead_tup rất nhỏ (posts 80, post_tags 46...) và autovacuum đang
-- theo kịp. KHÔNG có bloat ⇒ KHÔNG chạy VACUUM FULL (vô ích mà lại khoá bảng).
-- Cùng lắm chạy ANALYZE để làm mới thống kê planner (nhẹ, không khoá):
analyze posts;
