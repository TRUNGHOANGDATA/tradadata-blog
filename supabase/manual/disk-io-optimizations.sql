-- =============================================================================
-- Chẩn đoán Disk IO cho DB blog Trà Đá Data  (TUỲ CHỌN — chạy tay trên SQL Editor)
-- =============================================================================
-- Bối cảnh: Supabase cảnh báo cạn Disk IO Budget. Bộ đếm lượt xem ghi thẳng
-- Postgres mỗi lượt đọc là nguồn ghi liên tục (mỗi commit = một fsync WAL = disk
-- IO) 24/7 — đúng kiểu bào mòn ngân sách IO đều đều. Code đã chuyển sang đệm lượt
-- xem trong Redis + gộp qua cron `/api/cron/flush-views` để cắt tần suất commit đó.
--
-- ⚠️ FILE NÀY KHÔNG BẮT BUỘC. Cách gộp mới cộng dồn bằng read-modify-write qua
-- service role key nên KHÔNG cần tạo hàm RPC, KHÔNG cần thay đổi schema. Đo thực
-- tế (11/09/2026) cũng cho thấy: bảng đều tí hon nằm gọn trong RAM, cache hit
-- 100%, không bloat ⇒ KHÔNG cần thêm index, KHÔNG cần VACUUM. Giữ file này chỉ để
-- CHẨN ĐOÁN và theo dõi hiệu quả sau khi deploy.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- (1) Bảng nào bị quét tuần tự nhiều + có bloat không
-- -----------------------------------------------------------------------------
-- seq_scan cao mà bảng nhỏ (size vài trăm kB) = KHÔNG phải vấn đề: quét từ RAM.
-- n_dead_tup cao mới đáng lo (cần VACUUM). Đo 11/09: mọi bảng nhỏ, dead tuple bé.
select relname,
       seq_scan, idx_scan, n_live_tup, n_dead_tup,
       last_autovacuum,
       pg_size_pretty(pg_relation_size(relid)) as table_size
from pg_stat_user_tables
order by seq_scan desc
limit 20;


-- -----------------------------------------------------------------------------
-- (2) Tỉ lệ cache hit — với DB tí hon phải ~100%
-- -----------------------------------------------------------------------------
-- Thấp (dưới ~99%) mới nghĩa là thiếu RAM ⇒ đọc chạm đĩa. Đo 11/09: 100%,
-- tức đọc gần như 0 disk IO ⇒ toàn bộ IO budget bị đốt là do GHI.
select sum(heap_blks_read) as disk_reads,
       sum(heap_blks_hit) as cache_hits,
       round(100.0 * sum(heap_blks_hit) / nullif(sum(heap_blks_hit) + sum(heap_blks_read), 0), 2) as hit_pct
from pg_statio_user_tables;


-- -----------------------------------------------------------------------------
-- (3) Query nào SINH WAL nhiều nhất — chính là disk IO ghi
-- -----------------------------------------------------------------------------
-- Cần bật extension (chạy 1 lần):  create extension if not exists pg_stat_statements;
-- Để nó tích luỹ ~1 ngày dưới traffic THƯỜNG (không đang nhập bài) rồi mới đọc,
-- nếu không snapshot sẽ bị chi phối bởi thao tác hàng loạt (nhập bài/đổi ảnh bìa).
-- Muốn đo lại sạch:  select pg_stat_statements_reset();
--
-- Sau khi deploy bản đệm-view, dòng UPDATE ... posts SET view_count phải BIẾN MẤT
-- khỏi top (route /view không còn ghi DB); thay vào đó chỉ còn cron flush ghi thưa.
select substring(query, 1, 90) as query, calls, wal_bytes, wal_records, shared_blks_dirtied
from pg_stat_statements
order by wal_bytes desc nulls last
limit 15;
