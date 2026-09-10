---
tieu_de: "WORKDAY, WORKDAY.INTL: tính ngày làm việc sau N ngày, bỏ qua cuối tuần và ngày nghỉ"
slug: "ham-workday-workday-intl-tinh-ngay-lam-viec"
danh_muc: "Excel"
the: ["WORKDAY", "WORKDAY.INTL", "hàm ngày tháng"]
mo_ta: "WORKDAY tính ra ngày kết thúc sau khi cộng thêm N ngày làm việc, tự động bỏ qua cuối tuần và danh sách ngày nghỉ — ngược chiều với NETWORKDAYS. WORKDAY.INTL thêm khả năng đổi cuối tuần sang bất kỳ hai ngày nào trong tuần."
tu_khoa: "hàm WORKDAY Excel, WORKDAY.INTL, tính ngày làm việc Excel, tính deadline bỏ qua cuối tuần, ngày nghỉ lễ Excel"
anh_bia: "/images/bai-viet/ham-workday/cover.png"
thu_muc_anh: "ham-workday"
trang_thai: "draft"
---

Bài [DATEDIF, YEARFRAC, NETWORKDAYS](/blog/ham-datedif-yearfrac-networkdays-tinh-khoang-cach-thoi-gian-trong-excel) tính số ngày làm việc **giữa** hai mốc đã biết. `WORKDAY` làm chiều ngược lại: biết ngày bắt đầu và số ngày làm việc cần cộng thêm, tìm ra ngày kết thúc — đúng bài toán "hôm nay giao việc, 5 ngày làm việc nữa là hạn chót, vậy hạn chót là ngày nào".

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=WORKDAY(ngay_bat_dau, so_ngay, [ngay_nghi])
```

`so_ngay` dương thì tính tới tương lai, âm thì lùi về quá khứ. `ngay_nghi` là tham số tuỳ chọn — một vùng chứa các ngày nghỉ lễ cần loại trừ thêm, ngoài thứ Bảy Chủ Nhật vốn đã tự động bị bỏ qua.

## Ví dụ cơ bản: không có ngày nghỉ lễ

```excel
=WORKDAY(DATE(2026,9,10), 5)
```

{{anh:wd-01-vi-du-co-ban}}

Ngày 10/09/2026 là Thứ Năm. Đếm 5 ngày làm việc tiếp theo — Thứ Sáu 11/09, rồi bỏ qua Thứ Bảy 12/09 và Chủ Nhật 13/09, tiếp tục Thứ Hai đến Thứ Năm tuần sau — kết quả là **17/09/2026**.

## Thêm danh sách ngày nghỉ lễ

Thực tế còn cần loại trừ cả ngày lễ, không chỉ cuối tuần. Đưa các ngày nghỉ vào một cột riêng rồi đưa cả vùng đó vào tham số thứ ba:

```excel
=WORKDAY(DATE(2026,9,10), 5, NgayNghi)
```

{{anh:wd-02-them-ngay-nghi}}

Nếu `14/09/2026` (Thứ Hai) nằm trong danh sách `NgayNghi`, kết quả dịch thêm một ngày nữa, thành **18/09/2026** — vì Excel loại trừ luôn cả ngày lễ đó khỏi 5 ngày làm việc, không tính nó là một trong số 5.

{{anh:wd-03-ket-qua-co-ngay-nghi}}

## WORKDAY.INTL: đổi được cuối tuần, không chỉ mặc định Thứ Bảy-Chủ Nhật

`WORKDAY` mặc định luôn coi Thứ Bảy và Chủ Nhật là ngày nghỉ, không đổi được. `WORKDAY.INTL` thêm một tham số để chọn cặp ngày nghỉ khác:

```excel
=WORKDAY.INTL(ngay_bat_dau, so_ngay, [kieu_cuoi_tuan], [ngay_nghi])
```

{{anh:wd-04-bang-kieu-cuoi-tuan}}

Một vài giá trị `kieu_cuoi_tuan` hay dùng: `1` (mặc định, Thứ Bảy-Chủ Nhật), `7` (Thứ Sáu-Thứ Bảy — lịch làm việc phổ biến ở một số nước Trung Đông), `11` (chỉ Chủ Nhật nghỉ, làm cả Thứ Bảy).

```excel
=WORKDAY.INTL(DATE(2026,9,10), 5, 11)
```

{{anh:wd-05-so-sanh-ket-qua}}

Với kiểu `11` (chỉ Chủ Nhật nghỉ), cùng 5 ngày làm việc từ Thứ Năm 10/09/2026 nhưng giờ Thứ Bảy cũng được tính là ngày làm việc, kết quả rút ngắn còn **16/09/2026** — sớm hơn một ngày so với kết quả mặc định `17/09/2026` ở ví dụ đầu bài, vì Thứ Bảy không còn bị loại trừ.

## Dùng đúng chiều: WORKDAY hay NETWORKDAYS

Hai hàm dễ nhầm vì cùng nói về ngày làm việc nhưng trả lời hai câu hỏi ngược nhau:

{{anh:wd-06-so-sanh-workday-networkdays}}

- **Biết cả ngày bắt đầu và ngày kết thúc, muốn đếm có bao nhiêu ngày làm việc ở giữa** → dùng `NETWORKDAYS`.
- **Biết ngày bắt đầu và số ngày làm việc cần cộng, muốn tìm ngày kết thúc** → dùng `WORKDAY`.

## Tổng kết

`WORKDAY` cộng thêm N ngày làm việc vào một ngày bắt đầu, tự động bỏ qua cuối tuần và danh sách ngày nghỉ tuỳ chọn — ngược chiều tính toán với `NETWORKDAYS`. `WORKDAY.INTL` thêm khả năng đổi cuối tuần sang bất kỳ cặp ngày nào, cần thiết khi lịch làm việc không theo chuẩn Thứ Bảy-Chủ Nhật.

Đây là bài cuối trong cụm 5 bài về trích xuất và tính toán ngày giờ cơ bản, bắt đầu từ [YEAR, MONTH, DAY](/blog/ham-year-month-day-tach-nam-thang-ngay).
