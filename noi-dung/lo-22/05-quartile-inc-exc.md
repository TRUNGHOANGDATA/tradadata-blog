---
tieu_de: "QUARTILE.INC, QUARTILE.EXC: cùng khác biệt bao gồm/loại trừ đó, áp dụng cho tứ phân vị"
slug: "ham-quartile-inc-exc-hai-cach-dinh-nghia-tu-phan-vi"
danh_muc: "Excel"
the: ["QUARTILE.INC", "QUARTILE.EXC", "hàm thống kê"]
mo_ta: "QUARTILE.INC và QUARTILE.EXC chia dữ liệu thành bốn phần bằng nhau, cùng khác biệt bao gồm/loại trừ đầu mút như PERCENTILE.INC/EXC — nhưng QUARTILE.EXC còn không chấp nhận tham số quart bằng 0 hoặc 4, vì hai giá trị đó tương ứng đúng giá trị nhỏ nhất và lớn nhất bị loại trừ."
tu_khoa: "hàm QUARTILE.INC Excel, ham QUARTILE.EXC Excel, tu phan vi bao gom loai tru, QUARTILE khac nhau"
anh_bia: "/images/bai-viet/ham-quartile-inc-exc/cover.png"
thu_muc_anh: "ham-quartile-inc-exc"
trang_thai: "draft"
---

Bài trước, [PERCENTILE.INC, PERCENTILE.EXC](/blog/ham-percentile-inc-exc-hai-cach-dinh-nghia-phan-vi) khác nhau ở việc bao gồm hay loại trừ hai đầu mút. `QUARTILE.INC` và `QUARTILE.EXC` mang đúng khác biệt đó, áp dụng cho một trường hợp riêng của phân vị: chia dữ liệu thành đúng **bốn phần bằng nhau**.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=QUARTILE.INC(mang, quart)
=QUARTILE.EXC(mang, quart)
```

{{anh:qt-01-cu-phap-co-ban}}

`quart` là số nguyên chỉ định tứ phân vị cần tìm — không phải số thập phân như `k` của `PERCENTILE`, nên không có rủi ro nhầm với dấu phẩy phân cách đối số.

## Ý nghĩa các giá trị quart

`quart=0` là giá trị nhỏ nhất, `quart=1` là tứ phân vị thứ nhất (`25%`), `quart=2` là trung vị (`50%`), `quart=3` là tứ phân vị thứ ba (`75%`), `quart=4` là giá trị lớn nhất. `QUARTILE.INC` chấp nhận đủ cả `5` mốc này; `QUARTILE.EXC` chỉ chấp nhận `1`, `2`, `3` — từ chối hẳn hai đầu mút `0` và `4`.

{{anh:qt-02-y-nghia-quart}}

## Ví dụ: cùng dữ liệu, hai kết quả khác nhau ở quart=1

```excel
=QUARTILE.INC({1,2,3,4,5,6,7,8,9,10},1)
=QUARTILE.EXC({1,2,3,4,5,6,7,8,9,10},1)
```

{{anh:qt-03-vi-du-tinh-toan}}

`QUARTILE.INC` cho `3,25` — đúng bằng `PERCENTILE.INC(...,0.25)` đã tính ở bài trước. `QUARTILE.EXC` cho `2,75` — đúng bằng `PERCENTILE.EXC(...,0.25)`. Về bản chất, `QUARTILE.INC`/`QUARTILE.EXC` chỉ là cách gọi thuận tiện hơn của `PERCENTILE.INC`/`PERCENTILE.EXC` tại đúng bốn mốc `0%`, `25%`, `50%`, `75%`, `100%`.

## Lỗi thường gặp: QUARTILE.EXC không chấp nhận quart=0 hoặc quart=4

```excel
=QUARTILE.EXC({1,2,3,4,5,6,7,8,9,10},0)
=QUARTILE.EXC({1,2,3,4,5,6,7,8,9,10},4)
```

{{anh:qt-04-loi-quart-0-va-4}}

Cả hai đều báo lỗi `#NUM!` — vì định nghĩa "loại trừ" của `QUARTILE.EXC` không công nhận giá trị nhỏ nhất (`quart=0`) hay lớn nhất (`quart=4`) là một tứ phân vị hợp lệ, đúng cùng nguyên tắc đã nói ở `PERCENTILE.EXC` không nhận `k=0` hay `k=1`. Cần dùng `MIN`/`MAX` trực tiếp nếu thực sự cần giá trị nhỏ nhất/lớn nhất, thay vì cố gọi `QUARTILE.EXC` với `quart=0`/`4`.

## Ứng dụng: xác định khoảng tứ phân vị (IQR) để phát hiện ngoại lệ

```excel
=QUARTILE.INC(A2:A50,3)-QUARTILE.INC(A2:A50,1)
```

{{anh:qt-05-ung-dung-iqr}}

Hiệu số giữa tứ phân vị thứ ba và thứ nhất (`IQR` — Interquartile Range) là một thước đo phổ biến để phát hiện giá trị ngoại lệ: những điểm dữ liệu nằm cách xa khoảng `IQR` này (thường theo quy tắc `1,5×IQR`) được coi là bất thường, cần xem xét lại trước khi đưa vào các phân tích tiếp theo.

## Tổng kết

`QUARTILE.INC` và `QUARTILE.EXC` chia dữ liệu thành bốn phần bằng nhau, mang đúng khác biệt bao gồm/loại trừ đầu mút như `PERCENTILE.INC`/`PERCENTILE.EXC` — thực chất chỉ là cách gọi gọn hơn tại bốn mốc cố định. Riêng `QUARTILE.EXC` báo lỗi `#NUM!` với `quart=0` hoặc `4`, vì hai giá trị đó tương ứng đúng phần bị loại trừ khỏi định nghĩa.

Đây là bài cuối trong cụm 5 bài lô 22 về các hàm thống kê hiện đại thay thế cho phiên bản cũ, bắt đầu từ [MODE.SNGL, MODE.MULT](/blog/ham-mode-sngl-mode-mult-nhieu-gia-tri-lap-lai-nhat).
