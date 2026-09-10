---
tieu_de: "TRUE, FALSE: hai hàm không đối số, và vì sao gõ trong ngoặc kép lại thành một thứ khác hẳn"
slug: "ham-true-false-hang-luan-ly"
danh_muc: "Excel"
the: ["TRUE", "FALSE", "hàm luận lý"]
mo_ta: "TRUE() và FALSE() là hai hàm ngắn nhất Excel có — không nhận đối số nào, chỉ trả về đúng một giá trị luận lý cố định. Bài này cũng giải thích vì sao gõ \"TRUE\" trong dấu ngoặc kép lại tạo ra một thứ hoàn toàn khác, dùng ISLOGICAL để phân biệt."
tu_khoa: "hàm TRUE Excel, hàm FALSE Excel, giá trị luận lý Excel, TRUE và chuỗi TRUE khác nhau, ISLOGICAL kiểm tra"
anh_bia: "/images/bai-viet/ham-true-false/cover.png"
thu_muc_anh: "ham-true-false"
trang_thai: "draft"
---

Bài trước, [POWER](/blog/ham-power-luy-thua-ro-rang) khép lại phần các hàm toán học. `TRUE` và `FALSE` chuyển hẳn sang nhóm luận lý — và là hai trong số những hàm đơn giản nhất Excel có: không nhận đối số nào, chỉ trả về đúng một giá trị cố định.

## Cú pháp

```excel
=TRUE()
=FALSE()
```

{{anh:tf-01-cu-phap-co-ban}}

`TRUE()` luôn trả về giá trị luận lý `TRUE`. `FALSE()` luôn trả về `FALSE`. Không có gì để tính toán — cả hai chỉ đơn giản là một cách khác để gõ ra hằng số luận lý.

## Vì sao ít khi cần gõ TRUE() thay vì gõ thẳng TRUE

Excel tự nhận diện `TRUE` và `FALSE` gõ trực tiếp (không có dấu ngoặc kép, không có dấu ngoặc đơn) là giá trị luận lý thật, không cần gọi qua hàm:

```excel
=IF(TRUE,"Đúng","Sai")
=IF(TRUE(),"Đúng","Sai")
```

{{anh:tf-02-hai-cach-viet-tuong-duong}}

Hai công thức cho cùng kết quả `"Đúng"`. Cặp hàm `TRUE()`/`FALSE()` chủ yếu còn sót lại vì lý do tương thích ngược với các bảng tính rất cũ, và đôi khi hữu ích khi cần chèn một hằng luận lý vào một chỗ mà cú pháp công thức đòi hỏi phải có dấu ngoặc theo sau, ví dụ trong định nghĩa `LAMBDA` hoặc giá trị mặc định tham số.

## Vùng dễ nhầm nhất: gõ trong dấu ngoặc kép tạo ra một thứ khác hẳn

Đây là điểm quan trọng nhất của bài, và có liên hệ trực tiếp tới bài [ISLOGICAL](/blog/ham-islogical-phan-biet-luan-ly-that-va-chu) đã viết trước đó: gõ `TRUE` không có dấu ngoặc kép là giá trị luận lý thật, nhưng gõ `"TRUE"` có dấu ngoặc kép lại là một **chuỗi văn bản** trông giống hệt, hiển thị y hệt nhau trên bảng tính:

```excel
=ISLOGICAL(TRUE)
=ISLOGICAL("TRUE")
```

{{anh:tf-03-islogical-phan-biet}}

`ISLOGICAL(TRUE)` cho `TRUE` — đúng là giá trị luận lý. `ISLOGICAL("TRUE")` cho `FALSE` — chỉ là chữ, không phải luận lý, dù hiển thị giống hệt nhau trên màn hình.

## Hệ quả: hai thứ trông giống nhau nhưng tính toán khác hẳn

```excel
=TRUE+5
="TRUE"+5
```

{{anh:tf-04-anh-huong-tinh-toan}}

`TRUE+5` cho ra `6` — Excel tự động quy đổi giá trị luận lý `TRUE` thành `1` khi đưa vào phép tính số học, `FALSE` thành `0`. `"TRUE"+5` thì báo lỗi `#VALUE!` — vì đây là một chuỗi chữ, không có cách nào cộng một chữ với một số.

## Ứng dụng nhỏ: TRUE()/FALSE() làm giá trị mặc định trong LAMBDA

```excel
=LAMBDA(so,hienThem,IF(hienThem,so&"đ",so))(1000,TRUE())
```

{{anh:tf-05-mac-dinh-trong-lambda}}

Khi định nghĩa một hàm `LAMBDA` tuỳ chỉnh có tham số luận lý, gọi rõ `TRUE()`/`FALSE()` ở vị trí truyền tham số đôi khi giúp công thức dễ đọc hơn là chỉ gõ `TRUE`/`FALSE` trần, đặc biệt trong công thức dài có nhiều tham số cùng lúc.

## Tổng kết

`TRUE()` và `FALSE()` là hai hàm không đối số, trả về đúng một giá trị luận lý cố định — hiếm khi cần thiết vì gõ thẳng `TRUE`/`FALSE` cho cùng kết quả. Điều quan trọng hơn là phân biệt giá trị luận lý thật với chuỗi văn bản `"TRUE"`/`"FALSE"` trông giống hệt nhau nhưng tính toán khác hẳn — dùng `ISLOGICAL` để kiểm tra khi không chắc chắn.

Đây là bài cuối trong cụm 5 bài về các hàm cơ bản dễ bị bỏ qua, bắt đầu từ [REPLACE](/blog/ham-replace-thay-the-theo-vi-tri).
