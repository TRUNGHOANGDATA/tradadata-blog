---
tieu_de: "TRIM và CLEAN: dọn khoảng trắng thừa và ký tự ẩn"
slug: "ham-trim-clean-don-khoang-trang"
danh_muc: "Excel"
the: ["TRIM", "CLEAN", "xử lý văn bản"]
mo_ta: "TRIM cắt khoảng trắng thừa, CLEAN gỡ ký tự không in được. Đây là thủ phạm thầm lặng khiến VLOOKUP trả #N/A và phép so sánh sai — và vì sao TRIM đôi khi vẫn không dọn sạch dữ liệu dán từ web."
tu_khoa: "hàm TRIM CLEAN, dọn khoảng trắng Excel, TRIM không hết, khoảng trắng thừa VLOOKUP, ký tự ẩn, CHAR(160) non-breaking space"
anh_bia: "/images/bai-viet/trim-clean/cover.png"
thu_muc_anh: "trim-clean"
trang_thai: "draft"
---

Hai chuỗi trông y hệt nhau trên màn hình, nhưng Excel lại bảo chúng khác nhau — và [VLOOKUP trả #N/A](/blog/ham-vlookup-do-tim-theo-cot-doc) dù bạn thấy rõ giá trị nằm đó. Thủ phạm gần như luôn là một thứ vô hình: khoảng trắng thừa hoặc ký tự ẩn. `TRIM` và `CLEAN` là bộ đôi dọn dẹp cho đúng những ca này.

## TRIM: cắt khoảng trắng thừa, giữ lại một dấu cách giữa từ

```excel
=TRIM(chuỗi)
```

{{anh:tc-01-trim}}

`TRIM` bỏ mọi khoảng trắng ở **đầu** và **cuối** chuỗi, và ép mọi khoảng trắng **giữa các từ** về đúng một dấu cách. `"  Hà   Nội  "` thành `"Hà Nội"` sạch sẽ. Điểm tinh tế: nó không xoá sạch mọi dấu cách — nó giữ lại một dấu giữa hai từ, đúng như bạn muốn.

## Vì sao một dấu cách thừa làm hỏng tra cứu

Đây là lý do TRIM quan trọng hơn vẻ ngoài của nó. Với Excel, `"SP03 "` (thừa một dấu cách cuối) và `"SP03"` là **hai giá trị khác nhau**. Một phép [so sánh bằng](/blog/kieu-du-lieu-trong-excel) sẽ cho `FALSE`, và VLOOKUP sẽ không tìm ra.

{{anh:tc-02-vlookup-loi}}

Cách chữa gọn là bọc giá trị dò trong TRIM ngay trong công thức tra cứu:

```excel
=VLOOKUP(TRIM(A2), DanhMuc, 2, FALSE)
```

Khi một cột dữ liệu nhập tay hoặc dán từ nơi khác cứ trả `#N/A` khó hiểu, TRIM là thứ đầu tiên nên thử.

## CLEAN: gỡ ký tự không in được

Dữ liệu dán từ web, PDF hay phần mềm khác thường mang theo những ký tự điều khiển vô hình — ngắt dòng lạ, tab ẩn. Chúng không hiện ra nhưng vẫn nằm trong ô và phá vỡ so sánh. `CLEAN` gỡ các ký tự không in được đó:

```excel
=CLEAN(A2)
```

Thường dùng chồng cả hai cho chắc: `=TRIM(CLEAN(A2))` — gỡ ký tự ẩn trước, rồi cắt khoảng trắng thừa.

## Khi TRIM vẫn không dọn sạch

Đây là ca gài bẫy nhiều người nhất. Dữ liệu sao chép từ trang web thường chứa **khoảng trắng không ngắt** — ký tự `CHAR(160)`, trông hệt dấu cách thường nhưng TRIM **không** đụng tới (TRIM chỉ xử lý dấu cách thường `CHAR(32)`).

{{anh:tc-03-char160}}

Kết quả: ô nhìn có vẻ đã sạch mà so sánh vẫn sai. Cách xử lý là đổi `CHAR(160)` thành dấu cách thường bằng [SUBSTITUTE](/blog/ham-substitute-thay-the-theo-noi-dung) rồi mới TRIM:

```excel
=TRIM(SUBSTITUTE(A2, CHAR(160), " "))
```

Nếu bạn đã thử TRIM mà hai chuỗi "giống hệt" vẫn không khớp, gần như chắc chắn thủ phạm là `CHAR(160)` này.

## Kiểm nhanh trên máy bạn

- Gõ `"  Hà   Nội  "` rồi `=TRIM(A2)`; dùng `=LEN(A2)` trước và sau để thấy số ký tự giảm đi.
- Tạo một ô `"SP03 "` có dấu cách cuối, dò bằng VLOOKUP để thấy `#N/A`, rồi bọc `TRIM()` cho lỗi biến mất.
