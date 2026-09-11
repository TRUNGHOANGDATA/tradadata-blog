---
tieu_de: "STDEV.P, STDEV.S: chọn đúng công thức độ lệch chuẩn tuỳ dữ liệu là toàn bộ tổng thể hay chỉ một mẫu"
slug: "ham-stdev-p-stdev-s-tong-the-va-mau"
danh_muc: "Excel"
the: ["STDEV.P", "STDEV.S", "hàm thống kê"]
mo_ta: "STDEV.S tính độ lệch chuẩn khi dữ liệu chỉ là một mẫu rút ra từ tổng thể lớn hơn, STDEV.P tính khi dữ liệu là toàn bộ tổng thể cần khảo sát. Chọn sai loại cho ra kết quả khác nhau, chênh lệch rõ nhất khi cỡ dữ liệu nhỏ."
tu_khoa: "hàm STDEV.P Excel, ham STDEV.S Excel, do lech chuan tong the va mau, STDEV.P khac STDEV.S"
anh_bia: "/images/bai-viet/ham-stdev-p-stdev-s/cover.png"
thu_muc_anh: "ham-stdev-p-stdev-s"
trang_thai: "draft"
---

Bài trước, [MODE.SNGL, MODE.MULT](/blog/ham-mode-sngl-mode-mult-nhieu-gia-tri-lap-lai-nhat) là phiên bản hiện đại của `MODE`. `STDEV.P` và `STDEV.S` cũng là hai hàm hiện đại — thay thế `STDEVP` và `STDEV` cũ — nhưng khác biệt giữa chúng không phải chuyện đặt tên, mà là một khái niệm thống kê thật sự cần hiểu đúng: **tổng thể** và **mẫu**.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=STDEV.S(so1, [so2], ...)
=STDEV.P(so1, [so2], ...)
```

{{anh:sp-01-cu-phap-co-ban}}

`STDEV.S` (Sample — mẫu) là tên mới của `STDEV` cũ. `STDEV.P` (Population — tổng thể) là tên mới của `STDEVP` cũ.

## Câu hỏi cốt lõi: dữ liệu đang có là TOÀN BỘ hay chỉ một PHẦN

{{anh:sp-02-cau-hoi-cot-loi}}

- Dữ liệu là **toàn bộ** đối tượng cần khảo sát (điểm của **tất cả** học sinh trong một lớp cụ thể, doanh số của **tất cả** cửa hàng công ty đang có) → dùng `STDEV.P`.
- Dữ liệu chỉ là một **mẫu** rút ra từ một tổng thể lớn hơn (khảo sát `50` khách hàng trong số hàng chục nghìn khách hàng thực tế, đo `10` sản phẩm mẫu để suy luận cho cả lô hàng) → dùng `STDEV.S`.

## Ví dụ tính toán: cùng dữ liệu, hai kết quả khác nhau

Điểm `5` bài kiểm tra: `80, 85, 90, 95, 100`:

```excel
=STDEV.P(80,85,90,95,100)
=STDEV.S(80,85,90,95,100)
```

{{anh:sp-03-vi-du-tinh-toan}}

`STDEV.P` cho `7,07`. `STDEV.S` cho `7,91` — cùng một dãy số nhưng hai kết quả khác nhau, vì `STDEV.S` chia cho `(n-1)` thay vì `n` trong công thức, nhằm bù trừ cho việc mẫu nhỏ thường đánh giá thấp độ phân tán thật của cả tổng thể.

## Chênh lệch giữa hai công thức thu hẹp dần khi cỡ dữ liệu tăng lên

{{anh:sp-04-chenh-lech-thu-hep}}

Với `5` giá trị, chênh lệch giữa `STDEV.P` và `STDEV.S` khá rõ (`7,07` so với `7,91`). Nhưng khi cỡ dữ liệu lên tới hàng trăm, hàng nghìn giá trị, chênh lệch giữa `(n-1)` và `n` trở nên không đáng kể, hai kết quả gần như trùng khít — đây là lý do trong thực tế với dữ liệu lớn, nhiều người dùng lẫn `STDEV.P`/`STDEV.S` cho nhau mà không thấy sai lệch rõ rệt, dù về mặt khái niệm vẫn nên chọn đúng loại.

## Hậu quả chọn sai: đánh giá sai độ tin cậy của kết luận

```excel
=STDEV.S(DiemToanBoLop)
```

{{anh:sp-05-hau-qua-chon-sai}}

Nếu dữ liệu thực chất là điểm của **toàn bộ** học sinh trong lớp (không phải mẫu), nhưng lại dùng `STDEV.S`, kết quả bị thổi phồng nhẹ so với độ lệch chuẩn thật của tổng thể đó — không sai nghiêm trọng về mặt số học, nhưng sai về mặt khái niệm: không có "mẫu" nào ở đây để cần bù trừ, toàn bộ dữ liệu tổng thể đã nằm trong tay.

## Tổng kết

`STDEV.P` dùng khi dữ liệu là toàn bộ tổng thể, `STDEV.S` dùng khi dữ liệu chỉ là một mẫu — khác nhau ở việc chia cho `n` hay `(n-1)`. Chênh lệch giữa hai kết quả rõ nhất khi cỡ dữ liệu nhỏ, gần như biến mất khi dữ liệu đủ lớn, nhưng việc chọn đúng loại vẫn quan trọng về mặt khái niệm thống kê.

Đọc tiếp trong cùng cụm bài: [VAR.P, VAR.S — cùng khái niệm tổng thể và mẫu, áp dụng cho phương sai](/blog/ham-var-p-var-s-tong-the-va-mau).
