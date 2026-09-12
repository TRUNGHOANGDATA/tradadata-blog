-- =============================================================================
-- Sân chơi hàm Excel 365 ở /thuc-hanh — CHẠY TAY trên Supabase SQL Editor
-- =============================================================================
-- Vì sao chạy tay: repo không có Supabase CLI, `supabase/migrations/` chỉ là lịch
-- sử một phần và KHÔNG dựng lại được DB (xem supabase/migrations/README.md).
-- Schema thật sửa trực tiếp trên Supabase, đúng như 10 bảng app đang dùng.
--
-- Chạy lại nhiều lần được: mọi lệnh đều `if not exists` / `on conflict do nothing`.
--
-- Hai bảng:
--   vi_du_ham     — danh mục hàm 365 + ví dụ nạp sẵn (admin soạn ở /admin/vi-du-ham)
--   bai_lam_excel — bài đang làm của từng người đăng nhập (thay sessionStorage)
--
-- KHÔNG bật RLS: app đọc/ghi qua service role key, phân quyền nằm ở API route
-- (đúng kiến trúc chung của dự án — xem CLAUDE.md, mục Data access).
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- 1) Danh mục hàm + ví dụ
-- -----------------------------------------------------------------------------
create table if not exists public.vi_du_ham (
    id           uuid primary key default gen_random_uuid(),
    ten_ham      text not null unique,              -- 'XLOOKUP' (viết hoa, không dấu =)
    nhom         text not null,                     -- 'Tra cứu & mảng động'
    mo_ta        text,                              -- 3–5 dòng tiếng Việt: làm gì, khi nào dùng
    cong_thuc_mau text,                             -- '=XLOOKUP(E2, A2:A9, B2:B9)'
    snapshot     jsonb,                             -- IWorkbookData (Univer), null = chưa soạn ví dụ
    post_slug    text,                              -- slug bài viết giải thích hàm này, null = chưa có
    ho_tro       boolean not null default true,     -- false = engine chưa có hàm này (hiện badge)
    thu_tu       int  not null default 0,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

create index if not exists vi_du_ham_nhom_thu_tu_idx on public.vi_du_ham (nhom, thu_tu);

-- -----------------------------------------------------------------------------
-- 2) Bài đang làm của người đăng nhập
-- -----------------------------------------------------------------------------
-- Mỗi người × mỗi hàm một dòng; '_tu_do' là bảng trắng không gắn hàm nào.
-- `updated_at` cũng là tín hiệu "ai còn quan tâm Excel" cho /admin/users.
create table if not exists public.bai_lam_excel (
    id           uuid primary key default gen_random_uuid(),
    profile_id   uuid not null references public.profiles (id) on delete cascade,
    ten_ham      text not null default '_tu_do',
    snapshot     jsonb not null,
    updated_at   timestamptz not null default now(),
    unique (profile_id, ten_ham)
);

create index if not exists bai_lam_excel_profile_idx on public.bai_lam_excel (profile_id, updated_at desc);

-- -----------------------------------------------------------------------------
-- 3) Dữ liệu mồi: danh mục hàm 365, đối chiếu với engine Univer 0.25.1 (13/09/2026)
-- -----------------------------------------------------------------------------
-- `ho_tro = false` là 8 hàm engine CHƯA có — vẫn liệt kê để người dùng không tưởng
-- mình gõ sai. Snapshot ví dụ soạn trong admin, ở đây chỉ mồi 6 hàm hay dùng nhất.

insert into public.vi_du_ham (ten_ham, nhom, thu_tu, ho_tro, cong_thuc_mau, mo_ta, snapshot) values
-- Tra cứu & mảng động ----------------------------------------------------------
('XLOOKUP', 'Tra cứu & mảng động', 10, true,
 '=XLOOKUP(E2, A2:A7, C2:C7, "Không thấy")',
 'Thay cho VLOOKUP: tra theo bất kỳ cột nào, trả về cột nào tuỳ ý, có sẵn giá trị khi không thấy. Không cần đếm số cột, không cần sắp xếp trước.',
 '{"sheetOrder":["s1"],"sheets":{"s1":{"id":"s1","name":"XLOOKUP","rowCount":60,"columnCount":16,"columnData":{"0":{"w":90},"1":{"w":160},"2":{"w":110},"4":{"w":110},"5":{"w":140}},
   "cellData":{
     "0":{"0":{"v":"Mã SP"},"1":{"v":"Tên sản phẩm"},"2":{"v":"Giá"},"4":{"v":"Tra mã"},"5":{"v":"Kết quả"}},
     "1":{"0":{"v":"SP01"},"1":{"v":"Trà đá chanh"},"2":{"v":15000},"4":{"v":"SP04"},"5":{"f":"=XLOOKUP(E2, A2:A7, C2:C7, \"Không thấy\")"}},
     "2":{"0":{"v":"SP02"},"1":{"v":"Trà đá gừng"},"2":{"v":18000},"4":{"v":"SP99"},"5":{"f":"=XLOOKUP(E3, A2:A7, C2:C7, \"Không thấy\")"}},
     "3":{"0":{"v":"SP03"},"1":{"v":"Trà sữa"},"2":{"v":35000}},
     "4":{"0":{"v":"SP04"},"1":{"v":"Cà phê đen"},"2":{"v":25000}},
     "5":{"0":{"v":"SP05"},"1":{"v":"Cà phê sữa"},"2":{"v":29000}},
     "6":{"0":{"v":"SP06"},"1":{"v":"Nước cam"},"2":{"v":30000}},
     "8":{"0":{"v":"Thử: đổi ô E2 thành SP06, hoặc đổi C2:C7 thành B2:B7 để lấy tên thay vì giá."}}
   }}}}'::jsonb),
('XMATCH', 'Tra cứu & mảng động', 20, true, '=XMATCH("SP04", A2:A7)', 'Vị trí của một giá trị trong vùng — bản mới của MATCH, mặc định khớp chính xác.', null),
('FILTER', 'Tra cứu & mảng động', 30, true,
 '=FILTER(A2:C9, C2:C9 > 20000)',
 'Lọc bảng theo điều kiện và TRÀN kết quả ra nhiều ô. Đổi điều kiện là kết quả đổi theo — không cần bấm Filter tay.',
 '{"sheetOrder":["s1"],"sheets":{"s1":{"id":"s1","name":"FILTER","rowCount":60,"columnCount":16,"columnData":{"0":{"w":90},"1":{"w":160},"2":{"w":110},"4":{"w":90},"5":{"w":160},"6":{"w":110}},
   "cellData":{
     "0":{"0":{"v":"Mã SP"},"1":{"v":"Tên"},"2":{"v":"Giá"},"4":{"v":"Giá > 20.000"}},
     "1":{"0":{"v":"SP01"},"1":{"v":"Trà đá chanh"},"2":{"v":15000},"4":{"f":"=FILTER(A2:C9, C2:C9 > 20000)"}},
     "2":{"0":{"v":"SP02"},"1":{"v":"Trà đá gừng"},"2":{"v":18000}},
     "3":{"0":{"v":"SP03"},"1":{"v":"Trà sữa"},"2":{"v":35000}},
     "4":{"0":{"v":"SP04"},"1":{"v":"Cà phê đen"},"2":{"v":25000}},
     "5":{"0":{"v":"SP05"},"1":{"v":"Cà phê sữa"},"2":{"v":29000}},
     "6":{"0":{"v":"SP06"},"1":{"v":"Nước cam"},"2":{"v":30000}},
     "7":{"0":{"v":"SP07"},"1":{"v":"Sinh tố bơ"},"2":{"v":40000}},
     "8":{"0":{"v":"SP08"},"1":{"v":"Nước suối"},"2":{"v":10000}},
     "10":{"0":{"v":"Thử: đổi 20000 thành 30000, hoặc điều kiện thành (C2:C9 > 20000) * (C2:C9 < 35000)."}}
   }}}}'::jsonb),
('SORT', 'Tra cứu & mảng động', 40, true, '=SORT(A2:C9, 3, -1)', 'Sắp xếp một vùng theo cột chỉ định, tràn ra vùng mới; bảng gốc giữ nguyên.', null),
('SORTBY', 'Tra cứu & mảng động', 50, true, '=SORTBY(A2:A9, C2:C9, -1)', 'Sắp xếp vùng này theo giá trị của vùng khác.', null),
('UNIQUE', 'Tra cứu & mảng động', 60, true,
 '=UNIQUE(B2:B12)',
 'Lấy danh sách giá trị không trùng, tràn ra dọc. Ghép với COUNTIF là có bảng tổng hợp không cần PivotTable.',
 '{"sheetOrder":["s1"],"sheets":{"s1":{"id":"s1","name":"UNIQUE","rowCount":60,"columnCount":16,"columnData":{"0":{"w":100},"1":{"w":130},"3":{"w":130},"4":{"w":90}},
   "cellData":{
     "0":{"0":{"v":"Ngày"},"1":{"v":"Khu vực"},"3":{"v":"Khu vực (duy nhất)"},"4":{"v":"Số đơn"}},
     "1":{"0":{"v":"01/09"},"1":{"v":"Miền Bắc"},"3":{"f":"=UNIQUE(B2:B12)"},"4":{"f":"=COUNTIF(B2:B12, D2)"}},
     "2":{"0":{"v":"01/09"},"1":{"v":"Miền Nam"},"4":{"f":"=COUNTIF(B2:B12, D3)"}},
     "3":{"0":{"v":"02/09"},"1":{"v":"Miền Bắc"},"4":{"f":"=COUNTIF(B2:B12, D4)"}},
     "4":{"0":{"v":"02/09"},"1":{"v":"Miền Trung"}},
     "5":{"0":{"v":"03/09"},"1":{"v":"Miền Nam"}},
     "6":{"0":{"v":"03/09"},"1":{"v":"Miền Bắc"}},
     "7":{"0":{"v":"04/09"},"1":{"v":"Miền Nam"}},
     "8":{"0":{"v":"04/09"},"1":{"v":"Miền Bắc"}},
     "9":{"0":{"v":"05/09"},"1":{"v":"Miền Trung"}},
     "10":{"0":{"v":"05/09"},"1":{"v":"Miền Nam"}},
     "11":{"0":{"v":"06/09"},"1":{"v":"Miền Bắc"}},
     "13":{"0":{"v":"Thử: thêm một khu vực mới vào B13 rồi kéo dài vùng thành B2:B13."}}
   }}}}'::jsonb),
('SEQUENCE', 'Tra cứu & mảng động', 70, true,
 '=SEQUENCE(5, 3, 1, 1)',
 'Sinh dãy số theo hàng × cột, tràn ra vùng. Dùng để đánh số, tạo lịch, làm chỉ số cho INDEX.',
 '{"sheetOrder":["s1"],"sheets":{"s1":{"id":"s1","name":"SEQUENCE","rowCount":60,"columnCount":16,
   "cellData":{
     "0":{"0":{"v":"5 hàng × 3 cột, bắt đầu 1, bước 1"},"5":{"v":"Ngày trong tháng"}},
     "1":{"0":{"f":"=SEQUENCE(5, 3, 1, 1)"},"5":{"f":"=SEQUENCE(30)"}},
     "7":{"0":{"v":"Thử: =SEQUENCE(3, 4, 10, 10) hoặc =SEQUENCE(1, 7) để ra một hàng ngang."}}
   }}}}'::jsonb),
('RANDARRAY', 'Tra cứu & mảng động', 80, true, '=RANDARRAY(5, 2, 1, 100, TRUE)', 'Mảng số ngẫu nhiên theo kích thước và khoảng cho trước; TRUE = số nguyên.', null),
-- Ghép & cắt mảng ---------------------------------------------------------------
('VSTACK', 'Ghép & cắt mảng', 10, true, '=VSTACK(A2:B4, D2:E4)', 'Chồng nhiều vùng lên nhau theo chiều dọc thành một bảng — gộp dữ liệu từ nhiều sheet không cần copy.', null),
('HSTACK', 'Ghép & cắt mảng', 20, true, '=HSTACK(A2:A4, C2:C4)', 'Ghép nhiều vùng cạnh nhau theo chiều ngang.', null),
('TAKE', 'Ghép & cắt mảng', 30, true, '=TAKE(A2:C20, 5)', 'Lấy N hàng/cột đầu (số âm = từ cuối). Ghép với SORT là có Top 5.', null),
('DROP', 'Ghép & cắt mảng', 40, true, '=DROP(A1:C20, 1)', 'Bỏ N hàng/cột đầu (hay cuối) — bỏ dòng tiêu đề trong một bước.', null),
('CHOOSECOLS', 'Ghép & cắt mảng', 50, true, '=CHOOSECOLS(A2:F20, 1, 3, 5)', 'Chọn các cột theo số thứ tự, đúng thứ tự mình muốn.', null),
('CHOOSEROWS', 'Ghép & cắt mảng', 60, true, '=CHOOSEROWS(A2:C20, 1, 2, 3)', 'Chọn các hàng theo số thứ tự.', null),
('TOCOL', 'Ghép & cắt mảng', 70, true, '=TOCOL(A2:E6, 1)', 'Trải một vùng 2 chiều thành một cột; tham số 1 bỏ ô trống.', null),
('TOROW', 'Ghép & cắt mảng', 80, true, '=TOROW(A2:E6, 1)', 'Trải một vùng thành một hàng.', null),
('WRAPROWS', 'Ghép & cắt mảng', 90, true, '=WRAPROWS(A2:A13, 4)', 'Cuộn một cột dài thành bảng nhiều cột, mỗi hàng N phần tử.', null),
('WRAPCOLS', 'Ghép & cắt mảng', 100, true, '=WRAPCOLS(A2:A13, 4)', 'Cuộn một cột dài thành bảng, đổ theo cột.', null),
('EXPAND', 'Ghép & cắt mảng', 110, true, '=EXPAND(A2:B4, 5, 3, "-")', 'Nới vùng ra kích thước lớn hơn, điền ô mới bằng giá trị cho trước.', null),
('TRIMRANGE', 'Ghép & cắt mảng', 120, false, '=TRIMRANGE(A:A)', 'Cắt hàng/cột trống ở biên của vùng. Engine hiện chưa có.', null),
-- LAMBDA & bạn bè -----------------------------------------------------------------
('LET', 'LAMBDA & bạn bè', 10, true,
 '=LET(gia, C2:C7, thue, 0.1, gia * (1 + thue))',
 'Đặt tên cho giá trị trung gian ngay trong công thức: đọc được, không phải lặp cùng một biểu thức nhiều lần.',
 '{"sheetOrder":["s1"],"sheets":{"s1":{"id":"s1","name":"LET","rowCount":60,"columnCount":16,"columnData":{"0":{"w":90},"1":{"w":160},"2":{"w":110},"4":{"w":140}},
   "cellData":{
     "0":{"0":{"v":"Mã SP"},"1":{"v":"Tên"},"2":{"v":"Giá gốc"},"4":{"v":"Giá sau thuế 10%"}},
     "1":{"0":{"v":"SP01"},"1":{"v":"Trà đá chanh"},"2":{"v":15000},"4":{"f":"=LET(gia, C2:C7, thue, 0.1, gia * (1 + thue))"}},
     "2":{"0":{"v":"SP02"},"1":{"v":"Trà đá gừng"},"2":{"v":18000}},
     "3":{"0":{"v":"SP03"},"1":{"v":"Trà sữa"},"2":{"v":35000}},
     "4":{"0":{"v":"SP04"},"1":{"v":"Cà phê đen"},"2":{"v":25000}},
     "5":{"0":{"v":"SP05"},"1":{"v":"Cà phê sữa"},"2":{"v":29000}},
     "6":{"0":{"v":"SP06"},"1":{"v":"Nước cam"},"2":{"v":30000}},
     "8":{"0":{"v":"Thử: đổi thue thành 0.08, hoặc thêm biến giam, 0.05 rồi nhân thêm (1 - giam)."}}
   }}}}'::jsonb),
('LAMBDA', 'LAMBDA & bạn bè', 20, true, '=LAMBDA(x, y, x * y)(3, 4)', 'Tự viết hàm bằng công thức. Gọi ngay bằng cặp ngoặc thứ hai, hoặc đặt tên trong Name Manager.', null),
('MAP', 'LAMBDA & bạn bè', 30, true, '=MAP(A2:A7, LAMBDA(x, x * 2))', 'Áp một LAMBDA lên từng phần tử của mảng, trả về mảng mới.', null),
('REDUCE', 'LAMBDA & bạn bè', 40, true, '=REDUCE(0, A2:A7, LAMBDA(a, x, a + x))', 'Gộp cả mảng về một giá trị bằng cách tích luỹ.', null),
('SCAN', 'LAMBDA & bạn bè', 50, true, '=SCAN(0, A2:A7, LAMBDA(a, x, a + x))', 'Như REDUCE nhưng giữ lại từng bước — cộng dồn (running total) trong một công thức.', null),
('BYROW', 'LAMBDA & bạn bè', 60, true, '=BYROW(A2:C7, LAMBDA(r, SUM(r)))', 'Áp LAMBDA cho từng hàng, trả về một cột kết quả.', null),
('BYCOL', 'LAMBDA & bạn bè', 70, true, '=BYCOL(A2:C7, LAMBDA(c, MAX(c)))', 'Áp LAMBDA cho từng cột.', null),
('MAKEARRAY', 'LAMBDA & bạn bè', 80, true, '=MAKEARRAY(3, 3, LAMBDA(r, c, r * c))', 'Sinh mảng theo hàng × cột từ một LAMBDA nhận chỉ số.', null),
('ISOMITTED', 'LAMBDA & bạn bè', 90, true, '=LAMBDA(x, [y], IF(ISOMITTED(y), x, x + y))(5)', 'Kiểm tra tham số tuỳ chọn của LAMBDA có được truyền hay không.', null),
-- Chữ -----------------------------------------------------------------------------
('TEXTSPLIT', 'Xử lý chữ', 10, true,
 '=TEXTSPLIT(A2, ", ")',
 'Tách chuỗi theo dấu phân cách, tràn ra nhiều ô. Thay cho combo LEFT/MID/FIND dài dòng.',
 '{"sheetOrder":["s1"],"sheets":{"s1":{"id":"s1","name":"TEXTSPLIT","rowCount":60,"columnCount":16,"columnData":{"0":{"w":260}},
   "cellData":{
     "0":{"0":{"v":"Chuỗi gốc"},"2":{"v":"Tách theo \", \""}},
     "1":{"0":{"v":"Nguyễn Văn A, Hà Nội, 0912345678"},"2":{"f":"=TEXTSPLIT(A2, \", \")"}},
     "2":{"0":{"v":"Trần Thị B, Đà Nẵng, 0987654321"},"2":{"f":"=TEXTSPLIT(A3, \", \")"}},
     "3":{"0":{"v":"Lê Văn C, TP.HCM, 0909090909"},"2":{"f":"=TEXTSPLIT(A4, \", \")"}},
     "5":{"0":{"v":"Thử: =TEXTSPLIT(A2, \", \", \" \") để tách thêm theo dấu cách thành bảng 2 chiều."}}
   }}}}'::jsonb),
('TEXTBEFORE', 'Xử lý chữ', 20, true, '=TEXTBEFORE(A2, "@")', 'Lấy phần chữ TRƯỚC dấu phân cách — ví dụ tên tài khoản trước @ của email.', null),
('TEXTAFTER', 'Xử lý chữ', 30, true, '=TEXTAFTER(A2, "@")', 'Lấy phần chữ SAU dấu phân cách — ví dụ tên miền sau @.', null),
('TEXTJOIN', 'Xử lý chữ', 40, true, '=TEXTJOIN(", ", TRUE, A2:A7)', 'Nối nhiều ô thành một chuỗi có dấu phân cách, bỏ ô trống.', null),
('ARRAYTOTEXT', 'Xử lý chữ', 50, true, '=ARRAYTOTEXT(A2:C4, 1)', 'Biến cả mảng thành một chuỗi mô tả.', null),
('VALUETOTEXT', 'Xử lý chữ', 60, true, '=VALUETOTEXT(A2, 1)', 'Biến một giá trị bất kỳ thành chữ.', null),
('REGEXEXTRACT', 'Xử lý chữ', 70, true, '=REGEXEXTRACT(A2, "[0-9]+")', 'Rút phần khớp biểu thức chính quy — lấy số điện thoại, mã đơn ra khỏi chuỗi lộn xộn.', null),
('REGEXREPLACE', 'Xử lý chữ', 80, true, '=REGEXREPLACE(A2, "[^0-9]", "")', 'Thay phần khớp regex bằng chuỗi khác — xoá mọi ký tự không phải số.', null),
('REGEXTEST', 'Xử lý chữ', 90, false, '=REGEXTEST(A2, "^[0-9]{10}$")', 'Kiểm tra chuỗi có khớp regex không. Engine hiện chưa có.', null),
('TRANSLATE', 'Xử lý chữ', 100, false, '=TRANSLATE(A2, "vi", "en")', 'Dịch chữ — cần dịch vụ online của Microsoft, không chạy được ở đây.', null),
('DETECTLANGUAGE', 'Xử lý chữ', 110, false, '=DETECTLANGUAGE(A2)', 'Nhận diện ngôn ngữ — cần dịch vụ online của Microsoft.', null),
-- Điều kiện & tổng hợp -----------------------------------------------------------
('IFS', 'Điều kiện & tổng hợp', 10, true, '=IFS(A2 >= 90, "A", A2 >= 80, "B", TRUE, "C")', 'Nhiều điều kiện xếp hàng, không phải lồng IF trong IF.', null),
('SWITCH', 'Điều kiện & tổng hợp', 20, true, '=SWITCH(A2, 1, "Một", 2, "Hai", "Khác")', 'So một giá trị với nhiều trường hợp, trả về kết quả tương ứng.', null),
('SUMIFS', 'Điều kiện & tổng hợp', 30, true, '=SUMIFS(C2:C20, A2:A20, "Miền Bắc", B2:B20, ">=01/09/2026")', 'Cộng theo nhiều điều kiện cùng lúc.', null),
('MAXIFS', 'Điều kiện & tổng hợp', 40, true, '=MAXIFS(C2:C20, A2:A20, "Miền Bắc")', 'Giá trị lớn nhất thoả điều kiện — không cần cột phụ.', null),
('GROUPBY', 'Điều kiện & tổng hợp', 50, false, '=GROUPBY(A2:A20, C2:C20, SUM)', 'Tổng hợp theo nhóm như PivotTable trong một công thức. Engine hiện chưa có — dùng UNIQUE + SUMIFS thay.', null),
('PIVOTBY', 'Điều kiện & tổng hợp', 60, false, '=PIVOTBY(A2:A20, B2:B20, C2:C20, SUM)', 'Bảng chéo hai chiều trong một công thức. Engine hiện chưa có.', null),
('PERCENTOF', 'Điều kiện & tổng hợp', 70, false, '=PERCENTOF(C2:C5, C2:C20)', 'Tỉ trọng một phần trên tổng. Engine hiện chưa có — dùng SUM(...)/SUM(...).', null),
('IMAGE', 'Khác', 10, true, '=IMAGE("https://www.tradadata.com/api/brand/logo")', 'Chèn ảnh từ URL vào ô bằng công thức.', null),
('STOCKHISTORY', 'Khác', 20, false, '=STOCKHISTORY("MSFT", "01/01/2026")', 'Lịch sử giá cổ phiếu — cần dịch vụ online của Microsoft.', null)
on conflict (ten_ham) do nothing;
