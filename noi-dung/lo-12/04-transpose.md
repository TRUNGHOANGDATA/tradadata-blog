---
tieu_de: "TRANSPOSE: hoán đổi hàng thành cột, cột thành hàng chỉ với một công thức"
slug: "ham-transpose-hoan-doi-hang-cot"
danh_muc: "Excel"
the: ["TRANSPOSE", "hàm tra cứu"]
mo_ta: "TRANSPOSE xoay một bảng dữ liệu 90 độ — hàng thành cột, cột thành hàng — chỉ với một công thức duy nhất. Trên Excel 365 kết quả tự trải ra như một mảng động; trên bản cũ hơn phải chọn đúng vùng kích thước đã đảo trước khi nhấn Ctrl+Shift+Enter."
tu_khoa: "hàm TRANSPOSE Excel, hoán đổi hàng cột Excel, xoay bảng dữ liệu, TRANSPOSE mảng động"
anh_bia: "/images/bai-viet/ham-transpose/cover.png"
thu_muc_anh: "ham-transpose"
trang_thai: "draft"
---

Bài trước nhắc tới việc xoay lại một bảng [HLOOKUP](/blog/ham-hlookup-tra-cuu-theo-hang-ngang) từ ngang sang dọc. `TRANSPOSE` chính là hàm làm việc đó — hoán đổi toàn bộ hàng thành cột, cột thành hàng, chỉ với một công thức duy nhất thay vì gõ lại tay từng ô.

## Cú pháp

```excel
=TRANSPOSE(mang)
```

{{anh:tp-01-cu-phap-co-ban}}

Một bảng `3` hàng `× 2` cột đưa vào `TRANSPOSE` sẽ cho ra kết quả `2` hàng `× 3` cột — đúng bằng việc xoay 90 độ, ô ở vị trí hàng `i` cột `j` chuyển sang hàng `j` cột `i`.

## Trên Excel 365: chỉ cần Enter, kết quả tự trải ra

```excel
=TRANSPOSE(A1:C4)
```

{{anh:tp-02-mang-dong-365}}

Với các phiên bản có mảng động (Microsoft 365, Excel 2021 trở lên), gõ công thức vào đúng một ô rồi nhấn `Enter` bình thường — kết quả tự "tràn" (spill, xem thêm ở [bài SPILL](/blog/ham-spill-trong-excel-tai-sao-khong-tran-cach-khac-phuc)) ra đủ số ô cần thiết, không cần chọn trước vùng kết quả.

## Trên bản cũ hơn: phải chọn đúng vùng trước khi nhấn Ctrl+Shift+Enter

Với Excel 2019 trở về trước (không có mảng động), `TRANSPOSE` là một công thức mảng cổ điển — bắt buộc phải **chọn trước** đúng vùng có kích thước đã đảo ngược (ví dụ nguồn `3×2` thì chọn vùng `2×3`), rồi nhấn `Ctrl+Shift+Enter` thay vì `Enter` thường:

{{anh:tp-03-chon-vung-truoc-cse}}

Chọn thiếu vùng sẽ khiến phần dữ liệu thừa ra bị cắt mất không hiển thị, dù công thức bên trong vẫn đúng — đây là lỗi hay gặp nhất với người mới dùng `TRANSPOSE` trên bản Excel cũ.

## Ứng dụng: chuyển bảng nhập theo tháng ngang thành dữ liệu dọc để vẽ biểu đồ

Dữ liệu nhập tay thường tiện theo hàng ngang — mỗi tháng một cột, cùng nằm trên một dòng cho dễ nhìn khi nhập:

{{anh:tp-04-du-lieu-nhap-ngang}}

Nhưng Pivot Table và phần lớn kiểu biểu đồ chuẩn lại yêu cầu dữ liệu xếp dọc, mỗi bản ghi một dòng. `TRANSPOSE` xoay lại đúng chiều mà không cần gõ lại tay từng số:

```excel
=TRANSPOSE(B1:G2)
```

{{anh:tp-05-xoay-thanh-du-lieu-doc}}

## Kết quả TRANSPOSE liên kết với vùng gốc, không sửa tay được từng ô

Giống các công thức mảng khác, vùng kết quả của `TRANSPOSE` là một khối liên kết với công thức gốc — sửa dữ liệu ở bảng nguồn thì kết quả xoay tự cập nhật theo, nhưng không thể click vào một ô đơn lẻ trong vùng kết quả để sửa riêng giá trị đó; phải sửa ở bảng gốc.

## Tổng kết

`TRANSPOSE` hoán đổi hàng thành cột và ngược lại chỉ với một công thức. Trên Excel 365, kết quả tự tràn ra như một mảng động; trên bản cũ hơn, phải chọn đúng trước vùng kích thước đã đảo ngược rồi nhấn `Ctrl+Shift+Enter`, nếu không phần dữ liệu thừa sẽ bị cắt mất.

Đọc tiếp trong cùng cụm bài: [GETPIVOTDATA — công thức Excel tự chèn khi bấm vào một ô trong Pivot Table](/blog/ham-getpivotdata-lay-du-lieu-tu-pivot-table).
