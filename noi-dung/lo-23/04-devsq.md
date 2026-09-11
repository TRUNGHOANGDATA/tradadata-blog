---
tieu_de: "DEVSQ: tổng bình phương độ lệch, chính là tử số ẩn giấu bên trong công thức phương sai"
slug: "ham-devsq-tong-binh-phuong-do-lech"
danh_muc: "Excel"
the: ["DEVSQ", "hàm thống kê"]
mo_ta: "DEVSQ tính tổng bình phương độ lệch so với trung bình — chính là phần tử số trong công thức VAR.P và VAR.S, trước khi chia cho n hoặc n-1. Hữu ích khi cần so sánh trực tiếp mức phân tán tuyệt đối giữa các nhóm cùng cỡ mẫu."
tu_khoa: "hàm DEVSQ Excel, tong binh phuong do lech, quan he DEVSQ VAR, tu so cong thuc phuong sai"
anh_bia: "/images/bai-viet/ham-devsq/cover.png"
thu_muc_anh: "ham-devsq"
trang_thai: "draft"
---

Bài trước, [TRIMMEAN](/blog/ham-trimmean-trung-binh-cat-bot) vẫn xoay quanh khái niệm trung bình. `DEVSQ` chuyển sang đo độ **phân tán** — nhưng dừng lại ở một bước sớm hơn hẳn [`VAR.P`/`VAR.S`](/blog/ham-var-p-var-s-tong-the-va-mau) đã nói ở lô trước: chưa chia cho `n` hay `(n-1)`, chỉ dừng ở tổng bình phương độ lệch.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=DEVSQ(so1, [so2], ...)
```

{{anh:dv-01-cu-phap-co-ban}}

Công thức: lấy từng giá trị trừ đi trung bình, bình phương kết quả, rồi cộng tất cả lại — không chia cho bất kỳ số nào.

## Quan hệ trực tiếp: DEVSQ là tử số của VAR.P và VAR.S

Cùng dữ liệu `80, 85, 90, 95, 100` đã dùng ở bài `VAR.P`/`VAR.S`:

```excel
=DEVSQ(80,85,90,95,100)
=VAR.P(80,85,90,95,100)
=VAR.S(80,85,90,95,100)
```

{{anh:dv-02-quan-he-devsq-var}}

`DEVSQ` cho `250`. `VAR.P` cho `50` — đúng bằng `250/5` (chia cho `n=5`). `VAR.S` cho `62,5` — đúng bằng `250/4` (chia cho `n-1=4`). Cả hai hàm phương sai thực chất chỉ là `DEVSQ` chia cho một mẫu số khác nhau tuỳ tổng thể hay mẫu.

## Ứng dụng: so sánh độ phân tán tuyệt đối giữa các nhóm cùng cỡ mẫu

```excel
=DEVSQ(NhomA)
=DEVSQ(NhomB)
```

{{anh:dv-03-so-sanh-nhom-cung-co-mau}}

Nếu hai nhóm dữ liệu có **cùng số lượng phần tử**, so sánh trực tiếp `DEVSQ` cho biết nhóm nào phân tán nhiều hơn mà không cần quan tâm tới việc chia cho `n` hay `(n-1)` — vì cả hai nhóm đều chia cho cùng một mẫu số, tỷ lệ so sánh không đổi. Nếu cỡ mẫu hai nhóm khác nhau, cần dùng `VAR.P`/`VAR.S` (đã chuẩn hoá theo cỡ mẫu) thay vì so `DEVSQ` trực tiếp.

## DEVSQ không phân biệt tổng thể hay mẫu

{{anh:dv-04-khong-phan-biet-tong-the-mau}}

Khác với `VAR.P`/`VAR.S` phải chọn đúng loại theo khái niệm tổng thể/mẫu, `DEVSQ` chỉ đơn thuần là một phép tính tổng bình phương độ lệch — không có khái niệm "tổng thể" hay "mẫu" nào ở bước này, vì chưa hề chia cho mẫu số nào cả.

## Giá trị luôn không âm

```excel
=DEVSQ(5,5,5,5)
```

{{anh:dv-05-gia-tri-khong-am}}

Kết quả là `0` — khi mọi giá trị đều bằng nhau, không có độ lệch nào so với trung bình, nên `DEVSQ` bằng `0`. Vì là tổng của các số đã bình phương, `DEVSQ` không bao giờ cho kết quả âm, dù dữ liệu gốc có giá trị âm hay dương.

## Tổng kết

`DEVSQ` tính tổng bình phương độ lệch so với trung bình — chính là tử số ẩn trong công thức `VAR.P`/`VAR.S`, trước khi chia cho `n` hay `(n-1)`. Hữu ích để so sánh trực tiếp độ phân tán tuyệt đối giữa các nhóm có cùng cỡ mẫu.

Đọc tiếp trong cùng cụm bài: [AVEDEV — độ lệch tuyệt đối trung bình, cách đo độ phân tán dễ hiểu hơn hẳn phương sai](/blog/ham-avedev-do-lech-tuyet-doi-trung-binh).
