-- =============================================================================
-- SIẾT QUYỀN CỦA `anon` VÀ `authenticated` TRÊN SCHEMA public
-- Chạy tay trong Supabase Dashboard → SQL Editor. Chạy lại nhiều lần vô hại.
--
-- ĐÃ CHẠY 13/09/2026. Nghiệm thu ngay sau đó: 20/20 bảng trả `42501 permission
-- denied` cho cả đọc lẫn ghi bằng anon key; site không suy suyển (`/`, `/blog`,
-- `/thuc-hanh`, `/courses`, `/categories` đều 200; trang chủ ra 10 bài + 8 chủ đề;
-- /api/vi-du-ham vẫn 49 hàm).
-- ⚠️ Tạo bảng MỚI qua Dashboard là Supabase lại cấp quyền cho anon ⇒ CHẠY LẠI file này.
--
-- VẤN ĐỀ (đo 13/09/2026 bằng chính anon key của dự án):
--   profiles            -> đọc được 61 dòng  (có email, phone)
--   orders              -> đọc được  7 dòng  (có email, phone, số tiền)
--   user_subscriptions  -> đọc được  3 dòng
--   site_settings       -> đọc được  4 dòng  (có bank_info)
--   coupons             -> đọc được  1 dòng
--   posts               -> đọc được 288 dòng — GỒM CẢ `content` CỦA BÀI PREMIUM,
--                          tức là lấy hết nội dung bán tiền mà không cần mua.
--   (vi_du_ham, bai_lam_excel, subscribers, software_leads đã bị chặn.)
-- Ghi thì đã bị chặn sẵn; vấn đề nằm ở ĐỌC.
--
-- `anon` key KHÔNG phải bí mật: Next nhúng thẳng `NEXT_PUBLIC_SUPABASE_ANON_KEY`
-- vào bundle trình duyệt, và git history của repo public còn bản cũ. Phải coi là
-- ai cũng có.
--
-- VÌ SAO SIẾT ĐƯỢC MÀ KHÔNG GÃY GÌ (đã kiểm 13/09/2026):
--   Toàn bộ app đọc/ghi bằng `supabaseAdmin` (service role) trong
--   src/lib/supabase/server.ts. `src/lib/supabase/client.ts` (anon) TỒN TẠI
--   nhưng KHÔNG file nào import — grep cả repo, 0 chỗ dùng.
--   ⇒ Hai vai `anon`/`authenticated` không cần một quyền nào trên schema này.
--   service_role KHÔNG bị ảnh hưởng: lệnh dưới chỉ thu hồi của hai vai kia.
--
-- VÌ SAO SIẾT Ở TẦNG GRANT CHỨ KHÔNG CHỈ RLS:
--   RLS phải bật + viết policy đúng cho TỪNG bảng; quên một bảng là hở một bảng,
--   và bảng mới tạo sau này mặc định lại hở. Thu hồi GRANT chặn từ gốc, không
--   phụ thuộc việc nhớ bật RLS. Vẫn nên bật RLS như lớp thứ hai.
--
-- MUỐN QUAY LẠI (nếu sau này thật sự cần dùng client anon ở trình duyệt):
--   grant select on public.<ten_bang> to anon;  -- cấp lại ĐÚNG bảng cần, kèm RLS
-- =============================================================================

-- 1) Thu hồi mọi quyền hiện có của anon/authenticated trên schema public.
revoke all on all tables    in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all functions in schema public from anon, authenticated;

-- 2) Bảng/hàm TẠO SAU này cũng không tự được cấp quyền nữa.
--    Lưu ý: ALTER DEFAULT PRIVILEGES chỉ áp cho đối tượng do vai đang chạy tạo
--    ra. Dự án này tạo bảng bằng SQL Editor (vai postgres) nên khai cả hai cho
--    chắc; vai không tồn tại thì bỏ dòng đó đi.
alter default privileges in schema public revoke all on tables    from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public revoke all on functions from anon, authenticated;

-- 3) Lớp phòng thủ thứ hai: bật RLS cho mọi bảng trong public.
--    Không viết policy nào = không ai qua được, trừ service_role (bỏ qua RLS).
do $$
declare r record;
begin
    for r in
        select tablename from pg_tables where schemaname = 'public'
    loop
        execute format('alter table public.%I enable row level security', r.tablename);
    end loop;
end $$;

-- =============================================================================
-- NGHIỆM THU — chạy sau khi áp dụng.
--
-- (a) Trong SQL Editor: phải trả về 0 dòng.
--     Nếu còn dòng nào tức là vẫn có bảng cấp quyền cho anon/authenticated.
select table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and grantee in ('anon', 'authenticated')
order by table_name, grantee;

-- (b) Ngoài SQL Editor: gọi lại bằng anon key, mọi bảng phải trả lỗi 42501
--     (permission denied) thay vì trả dữ liệu. Site vẫn phải chạy bình thường
--     vì app dùng service role — kiểm /, /blog, /thuc-hanh sau khi chạy.
-- =============================================================================
