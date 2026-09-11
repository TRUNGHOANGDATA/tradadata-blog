---
tieu_de: "SHEET, SHEETS: biết vị trí và tổng số trang tính trong một workbook"
slug: "ham-sheet-sheets-vi-tri-va-tong-so-trang-tinh"
danh_muc: "Excel"
the: ["SHEET", "SHEETS", "hàm thông tin"]
mo_ta: "SHEET cho biết số thứ tự của một sheet theo vị trí tab, SHEETS đếm tổng số sheet trong workbook — cả hai đều tính luôn các sheet đang ẩn, hữu ích để kiểm tra công thức 3D đã cộng đủ số sheet mong đợi hay chưa."
tu_khoa: "hàm SHEET Excel, hàm SHEETS Excel, dem so trang tinh, vi tri sheet theo tab, kiem tra sheet an"
anh_bia: "/images/bai-viet/ham-sheet-sheets/cover.png"
thu_muc_anh: "ham-sheet-sheets"
trang_thai: "draft"
---

Bài trước, [DECIMAL](/blog/ham-decimal-doc-so-tu-he-dem-khac-ve-thap-phan) khép lại phần chuyển đổi hệ đếm. `SHEET` và `SHEETS` chuyển sang một nhóm hoàn toàn khác — hai hàm thông tin nhỏ gọn cho biết vị trí và số lượng trang tính trong một workbook.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=SHEET([gia_tri])
=SHEETS([pham_vi])
```

{{anh:sh-01-cu-phap-co-ban}}

`SHEET()` không tham số trả về số thứ tự của **sheet hiện tại**, tính theo vị trí tab từ trái sang phải. `SHEETS()` không tham số trả về **tổng số sheet** trong toàn bộ workbook.

## Ví dụ cơ bản

```excel
=SHEET()
=SHEETS()
```

{{anh:sh-02-vi-du-co-ban}}

Nếu công thức nằm trên sheet thứ `3` tính từ trái, và workbook có tổng cộng `12` sheet, `SHEET()` trả về `3`, `SHEETS()` trả về `12`.

## Tìm vị trí của một sheet bất kỳ theo tên

```excel
=SHEET("Thang6")
```

{{anh:sh-03-tim-vi-tri-theo-ten}}

Đưa tên sheet vào làm tham số, `SHEET` trả về đúng vị trí tab của sheet đó — không cần chuyển qua sheet đích rồi mới đếm bằng mắt xem nó đứng thứ mấy.

## Ứng dụng: kiểm tra công thức 3D đã cộng đủ sheet trước khi tin tưởng kết quả

Nhắc lại [công thức `SUM` xuyên nhiều sheet](/blog/ham-sum-cong-tong-va-nhung-dieu-de-bi-bo-qua) đã nói — nếu ai đó lỡ tay thêm một sheet tháng mới vào giữa `Thang1` và `Thang12` nhưng quên kiểm tra, công thức `3D` vẫn chạy nhưng có thể không bao gồm đúng sheet mới đó tuỳ vị trí chèn vào:

```excel
=SHEETS(Thang1:Thang12)
```

{{anh:sh-04-kiem-tra-so-sheet-3d}}

So sánh kết quả này với số sheet **mong đợi** (ví dụ `12` cho một năm) là cách nhanh để phát hiện sớm nếu phạm vi `3D` đang thiếu hoặc thừa sheet so với dự kiến, trước khi tin tưởng vào kết quả `SUM` tính ra.

## Lưu ý: cả hai đều tính luôn sheet đang ẩn

```excel
=SHEETS()
```

{{anh:sh-05-tinh-ca-sheet-an}}

Nếu workbook có `10` sheet hiển thị và `2` sheet đang ẩn (`Hide Sheet`), `SHEETS()` vẫn trả về `12` — tính đủ cả những sheet không hiển thị trên thanh tab. Cần nhớ điều này khi dùng `SHEETS()` để kiểm tra hay hiển thị "tổng số trang" cho người dùng cuối, vì con số đó có thể nhiều hơn số tab họ nhìn thấy trên màn hình.

## Tổng kết

`SHEET` cho biết vị trí của một sheet theo thứ tự tab, `SHEETS` đếm tổng số sheet trong workbook — cả hai đều tính luôn sheet đang ẩn. Ứng dụng thực tế hữu ích nhất là kiểm tra nhanh xem một công thức tham chiếu `3D` xuyên nhiều sheet có đang bao trọn đúng số sheet mong đợi hay không.

Đây là bài cuối trong cụm 5 bài lô 18, bắt đầu từ [ROMAN](/blog/ham-roman-chuyen-so-thanh-chu-so-la-ma).
