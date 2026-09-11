---
tieu_de: "MODE.SNGL, MODE.MULT: khi dữ liệu có nhiều hơn một giá trị lặp lại nhiều nhất"
slug: "ham-mode-sngl-mode-mult-nhieu-gia-tri-lap-lai-nhat"
danh_muc: "Excel"
the: ["MODE.SNGL", "MODE.MULT", "hàm thống kê"]
mo_ta: "MODE.SNGL là bản thay thế hiện đại của MODE cũ, vẫn chỉ trả về đúng một giá trị dù dữ liệu có nhiều mode bằng nhau. MODE.MULT giải đúng vấn đề đó — trả về toàn bộ các giá trị đang đồng hạng lặp lại nhiều nhất dưới dạng một mảng."
tu_khoa: "hàm MODE.SNGL Excel, ham MODE.MULT Excel, nhieu mode bang nhau, MODE cu va moi"
anh_bia: "/images/bai-viet/ham-mode-sngl-mult/cover.png"
thu_muc_anh: "ham-mode-sngl-mult"
trang_thai: "draft"
---

[`MODE`](/blog/ham-thong-ke-trong-excel-average-median-mode-stdev-percentile) tìm giá trị xuất hiện nhiều lần nhất trong một tập dữ liệu — nhưng có một tình huống hàm gốc xử lý không trọn vẹn: khi có **nhiều hơn một** giá trị cùng lặp lại nhiều nhất. `MODE.SNGL` và `MODE.MULT` là hai hàm hiện đại thay thế, giải quyết đúng tình huống đó theo hai cách khác nhau.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=MODE.SNGL(so1, [so2], ...)
=MODE.MULT(so1, [so2], ...)
```

{{anh:md-01-cu-phap-co-ban}}

`MODE.SNGL` là tên gọi mới của `MODE` cũ — hoạt động giống hệt, chỉ đổi tên cho nhất quán với các hàm `.SNGL`/`.MULT` khác. `MODE.MULT` là hàm hoàn toàn mới, không có ở phiên bản cũ.

## Trường hợp cả hai khác biệt: dữ liệu có nhiều mode bằng nhau

Dãy số `1, 2, 2, 3, 3, 4` — cả `2` và `3` đều xuất hiện đúng `2` lần, nhiều hơn hẳn các số còn lại:

```excel
=MODE.SNGL(1,2,2,3,3,4)
=MODE.MULT(1,2,2,3,3,4)
```

{{anh:md-02-nhieu-mode-bang-nhau}}

`MODE.SNGL` chỉ trả về `2` — giá trị lặp lại nhiều nhất được gặp **đầu tiên** khi quét qua dãy số theo thứ tự, âm thầm bỏ qua việc `3` cũng lặp lại y hệt `2` lần. `MODE.MULT` trả về **cả hai**: `2` và `3`, dưới dạng một mảng — không bỏ sót thông tin phân phối đa đỉnh (multimodal) như `MODE.SNGL`.

## Cách nhập MODE.MULT: mảng động hoặc công thức mảng cổ điển

Trên Excel 365 có mảng động, gõ công thức vào một ô rồi `Enter` bình thường, kết quả tự tràn (spill) ra đủ số ô cần thiết cho tất cả các mode tìm được:

{{anh:md-03-nhap-mang-dong}}

Trên Excel bản cũ hơn, cần chọn trước một vùng đủ lớn theo chiều dọc rồi nhấn `Ctrl+Shift+Enter` — chọn thiếu ô sẽ làm mất các mode phía sau không hiển thị hết.

## Khi dữ liệu chỉ có đúng một mode: cả hai hàm cho cùng kết quả

```excel
=MODE.SNGL(1,2,2,2,3,4)
=MODE.MULT(1,2,2,2,3,4)
```

{{anh:md-04-chi-mot-mode}}

Cả hai đều trả về `2` — khi chỉ có đúng một giá trị lặp lại nhiều nhất, `MODE.MULT` cũng chỉ trả về một kết quả duy nhất, không tràn thành mảng nhiều ô.

## Không có giá trị nào lặp lại: cả hai đều báo lỗi

```excel
=MODE.SNGL(1,2,3,4,5)
```

{{anh:md-05-khong-co-gia-tri-lap-lai}}

Nếu mọi giá trị trong dãy đều chỉ xuất hiện đúng một lần (không có số nào lặp lại), cả `MODE.SNGL` và `MODE.MULT` đều báo lỗi `#N/A` — vì khái niệm "giá trị lặp lại nhiều nhất" không tồn tại khi không có giá trị nào lặp lại cả.

## Tổng kết

`MODE.SNGL` là tên hiện đại của `MODE` cũ, vẫn chỉ trả về đúng một giá trị dù có nhiều mode bằng nhau. `MODE.MULT` giải quyết đúng hạn chế đó — trả về toàn bộ các giá trị đang đồng hạng lặp lại nhiều nhất dưới dạng một mảng, cần `Ctrl+Shift+Enter` trên Excel bản cũ.

Đọc tiếp trong cùng cụm bài: [STDEV.P, STDEV.S — chọn đúng công thức độ lệch chuẩn tuỳ dữ liệu là toàn bộ tổng thể hay chỉ một mẫu](/blog/ham-stdev-p-stdev-s-tong-the-va-mau).
