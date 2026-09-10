---
tieu_de: "HLOOKUP: tra cứu theo hàng ngang, khi dữ liệu không nằm dọc theo cột"
slug: "ham-hlookup-tra-cuu-theo-hang-ngang"
danh_muc: "Excel"
the: ["HLOOKUP", "hàm tra cứu"]
mo_ta: "HLOOKUP là bản song sinh nằm ngang của VLOOKUP — tìm giá trị trên hàng đầu tiên của bảng, rồi lấy kết quả từ một hàng bên dưới thay vì một cột bên phải. Ít dùng hơn hẳn VLOOKUP vì bảng dữ liệu thường xếp dọc, nhưng vẫn cần thiết khi dữ liệu vốn đã nằm ngang."
tu_khoa: "hàm HLOOKUP Excel, tra cứu theo hàng ngang, HLOOKUP khác VLOOKUP, tra cuu bang xep ngang"
anh_bia: "/images/bai-viet/ham-hlookup/cover.png"
thu_muc_anh: "ham-hlookup"
trang_thai: "draft"
---

[VLOOKUP](/blog/lam-chu-ham-vlookup-trong-excel) tìm giá trị trong **cột đầu tiên** của một bảng, rồi lấy kết quả từ một cột bên phải. `HLOOKUP` làm đúng việc tương tự nhưng xoay ngang 90 độ: tìm trong **hàng đầu tiên**, lấy kết quả từ một hàng bên dưới.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=HLOOKUP(gia_tri_tim, bang, so_hang, [phai_khop_chinh_xac])
```

{{anh:hl-01-cu-phap-co-ban}}

`so_hang` đếm từ hàng đầu tiên của `bang` là hàng `1` — khác hẳn `VLOOKUP` đếm theo **cột**. `phai_khop_chinh_xac` hoạt động y hệt `VLOOKUP`: `FALSE` (hoặc `0`) để tìm khớp chính xác, gần như luôn nên dùng giá trị này trừ khi tra cứu theo khoảng.

## Vì sao HLOOKUP ít gặp hơn hẳn VLOOKUP

Đa số dữ liệu thực tế xếp theo chiều dọc — mỗi dòng một bản ghi, càng nhiều bản ghi thì càng kéo dài xuống dưới, rất tự nhiên với cách người dùng nhập liệu. `HLOOKUP` chỉ thực sự cần khi bảng tra cứu vốn đã có sẵn dạng ngang, ví dụ bảng biểu thuế hay bảng đơn giá xếp các mức theo cột ngang thay vì dòng dọc:

```excel
=HLOOKUP(MucLuong,BangThue,2,TRUE)
```

{{anh:hl-02-vi-du-bang-ngang}}

Bảng tra cứu ở đây có hàng đầu tiên là các ngưỡng lương, hàng thứ `2` bên dưới là tỷ lệ thuế tương ứng — `HLOOKUP` tìm đúng ngưỡng khớp với `MucLuong` trên hàng đầu, rồi lấy kết quả từ hàng `2`.

## Giới hạn giống hệt VLOOKUP: chỉ tìm được ở hàng đầu tiên

```excel
=HLOOKUP(TenSanPham,Bang,3,FALSE)
```

{{anh:hl-03-gioi-han-hang-dau}}

Y hệt giới hạn nổi tiếng của `VLOOKUP` chỉ tìm được ở cột đầu tiên bên trái, `HLOOKUP` cũng chỉ tìm được ở **hàng đầu tiên** phía trên của bảng. Nếu giá trị cần tra nằm ở một hàng khác — không phải hàng trên cùng — `HLOOKUP` không có cách nào tìm ra, phải dùng `INDEX`/`MATCH` (xem [bài INDEX/MATCH](/blog/ham-match-index-match-match-tra-cuu-2-chieu-linh-hoat)) để tra theo bất kỳ hàng nào, không bị ràng buộc phải là hàng trên cùng.

## Ứng dụng: bảng chi phí theo quý xếp ngang

Một số báo cáo tài chính trình bày các quý theo cột ngang (`Q1`, `Q2`, `Q3`, `Q4` nằm cùng một hàng) để tiện so sánh cạnh nhau. Tra cứu chi phí của một khoản mục ở đúng quý cần xem:

```excel
=HLOOKUP("Q3",BangChiPhi,5,FALSE)
```

{{anh:hl-04-bao-cao-theo-quy}}

Tìm cột `"Q3"` trên hàng tiêu đề, rồi lấy giá trị ở hàng `5` bên dưới — đúng dòng chứa khoản mục chi phí đang cần xem.

## Cân nhắc: có cần xoay lại bảng thay vì dùng HLOOKUP không

Nếu bảng vốn được nhập ngang chỉ vì thói quen, nhưng sau này cần tra cứu thường xuyên, đôi khi xoay lại bảng cho đúng chiều dọc (bằng [`TRANSPOSE`](/blog/ham-transpose-hoan-doi-hang-cot)) rồi dùng `VLOOKUP` quen thuộc lại dễ bảo trì hơn là giữ nguyên bảng ngang và nhớ dùng đúng `HLOOKUP` mỗi lần — nhất là khi làm việc nhóm, phần lớn người dùng quen `VLOOKUP` hơn hẳn `HLOOKUP`.

{{anh:hl-05-can-nhac-xoay-bang}}

## Tổng kết

`HLOOKUP` là bản song sinh nằm ngang của `VLOOKUP` — tìm trên hàng đầu tiên, lấy kết quả từ một hàng bên dưới theo số thứ tự hàng. Ít gặp hơn hẳn `VLOOKUP` vì dữ liệu thường xếp dọc, nhưng vẫn cần thiết khi bảng tra cứu vốn đã có sẵn dạng ngang, và mang chung giới hạn "chỉ tìm được ở hàng trên cùng" như `VLOOKUP` chỉ tìm được ở cột bên trái.

Đọc tiếp trong cùng cụm bài: [TRANSPOSE — hoán đổi hàng thành cột, cột thành hàng chỉ với một công thức](/blog/ham-transpose-hoan-doi-hang-cot).
