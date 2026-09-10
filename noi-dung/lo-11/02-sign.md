---
tieu_de: "SIGN: biết ngay một số dương, âm hay bằng 0 mà không cần so sánh tay"
slug: "ham-sign-dau-cua-mot-so"
danh_muc: "Excel"
the: ["SIGN", "hàm toán học"]
mo_ta: "SIGN trả về đúng ba giá trị: 1, -1 hoặc 0, cho biết một số dương, âm hay bằng không. Kết hợp với CHOOSE là mẹo hay để gán nhãn Tăng/Giảm/Không đổi chỉ bằng một công thức, không cần IF lồng nhau."
tu_khoa: "hàm SIGN Excel, dấu của số Excel, xác định tăng giảm Excel, SIGN kết hợp CHOOSE, thay thế IF lồng nhau"
anh_bia: "/images/bai-viet/ham-sign/cover.png"
thu_muc_anh: "ham-sign"
trang_thai: "draft"
---

Bài trước, [REPLACE](/blog/ham-replace-thay-the-theo-vi-tri) làm việc với văn bản theo vị trí. `SIGN` chuyển sang một hàm toán học nhỏ gọn khác: chỉ trả lời đúng một câu hỏi — số này dương, âm hay bằng `0`?

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=SIGN(so)
```

{{anh:sg-01-cu-phap-co-ban}}

Chỉ có đúng ba kết quả có thể xảy ra: `1` nếu số dương, `-1` nếu số âm, `0` nếu đúng bằng `0` — bất kể số đưa vào lớn hay nhỏ tới đâu.

## Ứng dụng: xác định xu hướng tăng giảm mà không cần biết độ lớn

So sánh doanh số hai tháng liên tiếp, chỉ cần biết xu hướng là tăng hay giảm, chưa cần quan tâm tăng giảm bao nhiêu:

```excel
=SIGN(ThangNay-ThangTruoc)
```

{{anh:sg-02-xu-huong-tang-giam}}

Kết quả `1` là tăng, `-1` là giảm, `0` là giữ nguyên — gọn hơn hẳn so với viết `IF(ThangNay>ThangTruoc,...,IF(ThangNay<ThangTruoc,...,...))`.

## Mẹo hay: kết hợp SIGN với CHOOSE để gán nhãn

Vì `SIGN` chỉ trả về đúng ba giá trị `-1`, `0`, `1`, cộng thêm `2` sẽ ra `1`, `2`, `3` — vừa khớp với chỉ số thứ tự mà `CHOOSE` cần:

```excel
=CHOOSE(SIGN(B2-C2)+2,"Giảm","Không đổi","Tăng")
```

{{anh:sg-03-ket-hop-choose}}

Công thức này thay thế gọn cho hai lớp `IF` lồng nhau, đọc dễ hiểu hơn với những ai đã quen `CHOOSE`: `SIGN(...)+2` cho ra `1` (giảm) chọn đối số thứ nhất `"Giảm"`, ra `2` (không đổi) chọn `"Không đổi"`, ra `3` (tăng) chọn `"Tăng"`.

## Ứng dụng: giữ nguyên hướng dấu khi nhân với một hệ số dương

Một số phép tính tài chính cần giữ đúng chiều âm/dương của một khoản chênh lệch sau khi nhân với một tỷ lệ, ví dụ tính phần trăm thay đổi có dấu:

```excel
=SIGN(ChenhLech)*ABS(ChenhLech)/GiaTriGoc
```

{{anh:sg-04-giu-dau-khi-tinh-ty-le}}

Ở đây `SIGN` giữ lại đúng chiều tăng/giảm ban đầu, còn `ABS` (đã nói ở [bài đầu cụm hàm toán học trước](/blog/ham-abs-tri-tuyet-doi)) đảm bảo phần tính tỷ lệ phần trăm luôn thao tác trên độ lớn dương, tránh việc nhân hai số âm triệt tiêu dấu ngoài ý muốn ở những công thức phức tạp hơn.

## Lỗi thường gặp: đưa vào văn bản

```excel
=SIGN("mười")
```

{{anh:sg-05-loi-voi-text}}

`SIGN` chỉ nhận số — đưa vào một chuỗi văn bản không tự động chuyển đổi được thành số sẽ cho lỗi `#VALUE!`, giống hầu hết các hàm toán học khác trong Excel.

## Tổng kết

`SIGN` trả về `1`, `-1` hoặc `0` tuỳ một số là dương, âm hay bằng không — dùng phổ biến nhất để xác định xu hướng tăng giảm mà chưa cần biết độ lớn, và kết hợp khéo với `CHOOSE` để thay thế `IF` lồng nhau khi gán nhãn theo ba trường hợp.

Đọc tiếp trong cùng cụm bài: [SQRT — căn bậc hai, và vì sao số âm luôn báo lỗi thay vì ra số ảo](/blog/ham-sqrt-can-bac-hai).
