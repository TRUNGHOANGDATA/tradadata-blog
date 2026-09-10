---
tieu_de: "ISLOGICAL: phân biệt giá trị TRUE/FALSE thật với chuỗi chữ 'TRUE'"
slug: "ham-islogical-phan-biet-luan-ly-that-va-chu"
danh_muc: "Excel"
the: ["ISLOGICAL", "TRUE FALSE", "kiểm tra dữ liệu", "hàm cơ bản"]
mo_ta: "ISLOGICAL kiểm tra một ô có đang chứa giá trị luận lý TRUE/FALSE thật hay không — phân biệt với chuỗi chữ 'TRUE' trông giống hệt nhưng bản chất là văn bản, gây sai lệch khi đưa vào công thức khác."
tu_khoa: "hàm ISLOGICAL Excel, phân biệt TRUE FALSE thật và chữ, kiểm tra giá trị luận lý, checkbox Excel 365 TRUE FALSE"
anh_bia: "/images/bai-viet/ham-islogical/cover.png"
thu_muc_anh: "ham-islogical"
trang_thai: "draft"
---

Cùng họ với [`ISNUMBER`, `ISTEXT`, `ISBLANK`, `ISERROR`](/blog/ham-isnumber-istext-isblank-iserror-kiem-tra-kieu-du-lieu) đã nói ở cụm bài trước, `ISLOGICAL` kiểm tra đúng kiểu dữ liệu còn thiếu trong bộ đó: giá trị **luận lý** — `TRUE` hoặc `FALSE` thật sự, không phải chuỗi chữ trông giống hệt.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Vấn đề: TRUE thật và chữ "TRUE" trông giống hệt nhau

```excel
=TRUE            ' Giá trị luận lý thật
="TRUE"          ' Chuỗi văn bản, chỉ trông giống
```

{{anh:il-01-hai-loai-true}}

Cả hai đều hiển thị chữ `TRUE` trên màn hình, căn giữa ô giống nhau — mắt thường không phân biệt được. Nhưng bản chất phía sau hoàn toàn khác: một bên là giá trị luận lý dùng được ngay trong các phép so sánh và điều kiện, một bên chỉ là văn bản.

## ISLOGICAL — phân biệt rạch ròi

```excel
=ISLOGICAL(value)
```

```excel
=ISLOGICAL(TRUE)     ' TRUE  — đây là giá trị luận lý thật
=ISLOGICAL("TRUE")   ' FALSE — đây chỉ là chuỗi chữ
```

{{anh:il-02-islogical-hai-truong-hop}}

## Ứng dụng: kiểm tra dữ liệu từ checkbox Excel 365

Tính năng Checkbox mới trong Excel 365 liên kết trực tiếp với một ô, tự động ghi giá trị luận lý `TRUE`/`FALSE` thật vào ô đó khi tích hoặc bỏ tích. Nhưng nếu dữ liệu đến từ nguồn khác — nhập tay, dán từ một hệ thống khác, hay xuất ra từ phần mềm ngoài — rất dễ vô tình có chữ `"TRUE"`/`"FALSE"` dạng văn bản lẫn vào thay vì giá trị luận lý thật.

{{anh:il-03-du-lieu-checkbox}}

```excel
=IF(ISLOGICAL(B2), "Dữ liệu hợp lệ", "CẢNH BÁO — chỉ là chữ, không phải TRUE/FALSE thật")
```

{{anh:il-04-kiem-tra-checkbox}}

Rà soát toàn bộ cột liên kết checkbox bằng công thức này giúp phát hiện những dòng dữ liệu đã bị lẫn văn bản thay vì giá trị luận lý thật — một lỗi khó nhận ra bằng mắt vì hiển thị hoàn toàn giống nhau.

## Vì sao sự khác biệt này ảnh hưởng tới kết quả tính toán

Đưa `TRUE` thật vào một phép cộng, Excel tự động hiểu là `1`. Đưa chuỗi `"TRUE"` vào cùng phép cộng đó, Excel sẽ báo lỗi `#VALUE!` vì không thể cộng trực tiếp một chuỗi văn bản.

```excel
=TRUE + 5      ' Kết quả: 6
="TRUE" + 5    ' Kết quả: #VALUE!
```

{{anh:il-05-anh-huong-tinh-toan}}

Đây chính là loại lỗi kiểu dữ liệu tương tự đã nói ở bài [ISNUMBER, ISTEXT, ISBLANK và ISERROR](/blog/ham-isnumber-istext-isblank-iserror-kiem-tra-kieu-du-lieu) — khác biệt chỉ nằm ở loại dữ liệu đang xét (luận lý thay vì số), nhưng hệ quả giống hệt nhau: một công thức tưởng chạy đúng bỗng dưng báo lỗi, chỉ vì kiểu dữ liệu bên trong không phải như mắt nhìn thấy.

## So sánh nhanh: ISLOGICAL với EXACT

Dùng dấu `=` để so `B2 = TRUE` sẽ luôn trả về `TRUE` cho cả hai trường hợp — Excel tự ép kiểu ngầm khi so sánh, không phân biệt được luận lý thật với chữ. Đây cùng một dạng vấn đề đã nói ở bài [EXACT](/blog/ham-exact-so-sanh-chinh-xac-hai-chuoi): phép so sánh thông thường trong Excel thường "dễ dãi" hơn người dùng tưởng, và cần một hàm kiểm tra chuyên biệt — `ISLOGICAL` ở đây, `EXACT` ở bài trước — để có được câu trả lời chính xác về bản chất dữ liệu.

## Tổng kết

`ISLOGICAL` kiểm tra một ô có đang chứa giá trị luận lý `TRUE`/`FALSE` thật hay không, phân biệt với chuỗi chữ trông giống hệt nhưng bản chất là văn bản — hai thứ hiển thị giống nhau trên màn hình nhưng gây lỗi khác nhau hoàn toàn khi đưa vào phép tính. Hữu ích nhất để rà soát dữ liệu liên kết với checkbox hoặc bất kỳ cột nào cần đúng giá trị luận lý thật, không phải chỉ trông giống.

Đây là bài cuối trong cụm 5 bài về kiểm tra công thức và tham chiếu. Xem lại từ đầu: [ISFORMULA và FORMULATEXT](/blog/ham-isformula-formulatext-kiem-tra-cong-thuc), [ISREF](/blog/ham-isref-kiem-tra-tham-chieu-hop-le), [NA](/blog/ham-na-tao-loi-co-chu-dich), [ERROR.TYPE](/blog/ham-error-type-ma-so-loai-loi).
