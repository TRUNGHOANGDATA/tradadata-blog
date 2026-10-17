---
tieu_de: "SUBSTITUTE: thay thế theo nội dung, khác REPLACE theo vị trí"
slug: "ham-substitute-thay-the-theo-noi-dung"
danh_muc: "Excel"
the: ["SUBSTITUTE", "REPLACE", "xử lý văn bản"]
mo_ta: "SUBSTITUTE tìm một đoạn văn bản và thay bằng đoạn khác, bất kể nó nằm ở đâu — dùng để bỏ ký tự, chuẩn hoá định dạng, hay đếm số lần xuất hiện. Khác hẳn REPLACE vốn thay theo vị trí đếm được."
tu_khoa: "hàm SUBSTITUTE, SUBSTITUTE trong Excel, thay thế văn bản, SUBSTITUTE và REPLACE, bỏ ký tự trong chuỗi, đếm số lần xuất hiện"
anh_bia: "/images/bai-viet/substitute/cover.png"
thu_muc_anh: "substitute"
trang_thai: "draft"
---

Bạn có một cột số điện thoại lẫn lộn dấu chấm, dấu gạch, khoảng trắng và muốn bỏ hết cho sạch. Hoặc một cột giá ghi `"1.500.000đ"` cần gỡ chữ `đ` để tính toán. `SUBSTITUTE` sinh ra cho những việc "tìm đoạn này, thay bằng đoạn kia" — bất kể nó nằm ở đâu trong chuỗi.

## Cú pháp: tìm nội dung, thay nội dung

```excel
=SUBSTITUTE(chuỗi, đoạn_cũ, đoạn_mới, [lần_thứ])
```

- **chuỗi** — ô văn bản nguồn.
- **đoạn_cũ** — nội dung cần tìm để thay.
- **đoạn_mới** — nội dung thay vào. Để `""` (rỗng) nghĩa là **xoá** đoạn cũ.
- **lần_thứ** — tuỳ chọn: chỉ thay đúng lần xuất hiện thứ mấy; bỏ trống thì thay **tất cả**.

{{anh:sub-01-thay-va-xoa}}

Ví dụ `=SUBSTITUTE(A2,".","")` xoá mọi dấu chấm trong chuỗi. Vì đoạn mới là rỗng, mỗi dấu chấm bị thay bằng "không có gì" — tức bị gỡ đi.

## SUBSTITUTE khác REPLACE ở chỗ nào

Excel có hai hàm thay thế và người mới hay nhầm. Khác biệt gọn trong một câu: **SUBSTITUTE thay theo *nội dung*, [REPLACE](/blog/ham-replace-thay-the-theo-vi-tri) thay theo *vị trí*.**

{{anh:sub-02-so-replace}}

- Dùng **SUBSTITUTE** khi bạn biết *cần thay chữ gì* nhưng không biết nó nằm ở đâu — ví dụ đổi mọi chữ "Q1" thành "Quý 1".
- Dùng **REPLACE** khi bạn biết *vị trí* cần thay nhưng không quan tâm nội dung — ví dụ che 4 số giữa của thẻ, thay ký tự thứ 5 đến 8 bằng `****`.

## Mẹo đếm số lần xuất hiện

Có một cách dùng SUBSTITUTE rất hay để đếm một ký tự xuất hiện bao nhiêu lần: so [độ dài chuỗi](/blog/ham-len-rept-dem-do-dai-chuoi-lap-ky-tu) trước và sau khi xoá ký tự đó.

```excel
=LEN(A2) - LEN(SUBSTITUTE(A2, ",", ""))
```

{{anh:sub-03-dem}}

Chuỗi ban đầu dài bao nhiêu, sau khi bỏ hết dấu phẩy ngắn đi bấy nhiêu ký tự — hiệu số chính là số dấu phẩy. Đây là mẹo kinh điển để đếm số phần tử trong một danh sách ngăn bằng dấu phẩy (số phần tử = số dấu phẩy + 1).

## Cẩn thận với chữ hoa chữ thường

SUBSTITUTE **phân biệt hoa thường**: tìm `"excel"` sẽ không khớp `"Excel"`. Nếu cần thay bất kể hoa thường, chuẩn hoá chuỗi bằng [LOWER](/blog/ham-proper-upper-lower-chuan-hoa-chu-hoa-thuong) trước, hoặc viết đúng dạng chữ bạn muốn tìm. Và nếu việc bạn thật sự cần chỉ là dọn khoảng trắng thừa, đừng dùng SUBSTITUTE thủ công — [TRIM](/blog/ham-trim-clean-don-khoang-trang) làm gọn hơn.

## Kiểm nhanh trên máy bạn

- Gõ `"0912.345.678"` rồi `=SUBSTITUTE(A2,".","")` để thấy số sạch dấu chấm.
- Thử mẹo đếm: `=LEN(A2)-LEN(SUBSTITUTE(A2,",",""))` trên một chuỗi nhiều dấu phẩy.
