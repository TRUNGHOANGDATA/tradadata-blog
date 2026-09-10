---
tieu_de: "NETWORKDAYS.INTL: đếm ngày làm việc khi cuối tuần không phải Thứ Bảy-Chủ Nhật"
slug: "ham-networkdays-intl-cuoi-tuan-tuy-chinh"
danh_muc: "Excel"
the: ["NETWORKDAYS.INTL", "hàm ngày tháng"]
mo_ta: "NETWORKDAYS.INTL đếm số ngày làm việc giữa hai mốc thời gian như NETWORKDAYS, nhưng cho phép tự chọn cặp ngày nghỉ cuối tuần thay vì mặc định cố định Thứ Bảy-Chủ Nhật — cần thiết khi lịch làm việc không theo chuẩn phổ biến."
tu_khoa: "hàm NETWORKDAYS.INTL Excel, dem ngay lam viec cuoi tuan tuy chinh, NETWORKDAYS khac NETWORKDAYS.INTL"
anh_bia: "/images/bai-viet/ham-networkdays-intl/cover.png"
thu_muc_anh: "ham-networkdays-intl"
trang_thai: "draft"
---

Bài [DATEDIF, YEARFRAC, NETWORKDAYS](/blog/ham-datedif-yearfrac-networkdays-tinh-khoang-cach-thoi-gian-trong-excel) đếm số ngày làm việc giữa hai mốc, mặc định coi Thứ Bảy và Chủ Nhật là ngày nghỉ cố định, không đổi được. `NETWORKDAYS.INTL` làm đúng việc đó nhưng cho phép tự chọn cặp ngày nghỉ khác — giống cách [`WORKDAY.INTL`](/blog/ham-workday-workday-intl-tinh-ngay-lam-viec) mở rộng từ `WORKDAY`.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=NETWORKDAYS.INTL(ngay_bat_dau, ngay_ket_thuc, [kieu_cuoi_tuan], [ngay_nghi])
```

{{anh:ni-01-cu-phap-co-ban}}

`kieu_cuoi_tuan` nhận cùng bộ giá trị với `WORKDAY.INTL`: `1` (mặc định, Thứ Bảy-Chủ Nhật), `7` (Thứ Sáu-Thứ Bảy), `11` (chỉ Chủ Nhật), và nhiều lựa chọn khác.

## So sánh với NETWORKDAYS mặc định

```excel
=NETWORKDAYS(DATE(2026,9,10),DATE(2026,9,20))
=NETWORKDAYS.INTL(DATE(2026,9,10),DATE(2026,9,20),11)
```

{{anh:ni-02-so-sanh-mac-dinh}}

Từ `10/09/2026` (Thứ Năm) đến `20/09/2026` (Chủ Nhật): `NETWORKDAYS` mặc định đếm được `7` ngày làm việc, loại cả hai ngày Thứ Bảy trong khoảng đó. `NETWORKDAYS.INTL` với kiểu `11` (chỉ Chủ Nhật nghỉ, Thứ Bảy vẫn tính là ngày làm việc) đếm được `9` ngày — nhiều hơn hẳn vì Thứ Bảy giờ không còn bị loại.

## Ứng dụng: tính số ngày công cho lịch làm việc 6 ngày/tuần

Một số ngành (bán lẻ, sản xuất, dịch vụ) làm việc `6` ngày/tuần, chỉ nghỉ Chủ Nhật. Nếu vẫn dùng `NETWORKDAYS` mặc định để tính công, kết quả sẽ thiếu hẳn các ngày Thứ Bảy lẽ ra vẫn được tính lương:

```excel
=NETWORKDAYS.INTL(NgayVao,NgayRa,11)
```

{{anh:ni-03-ung-dung-luong-6-ngay}}

Chọn đúng kiểu `11` giúp bảng tính công khớp với thực tế lịch làm việc của công ty, không cần công thức phụ để cộng bù lại các ngày Thứ Bảy bị đếm thiếu.

## Vẫn hỗ trợ loại trừ thêm ngày nghỉ lễ

```excel
=NETWORKDAYS.INTL(NgayVao,NgayRa,11,NgayNghiLe)
```

{{anh:ni-04-them-ngay-nghi-le}}

Tham số cuối cùng hoạt động y hệt `NETWORKDAYS` gốc — đưa vào một vùng chứa các ngày nghỉ lễ để loại trừ thêm, ngoài quy tắc cuối tuần đã chọn ở tham số `kieu_cuoi_tuan`.

## Kiểu số tuỳ chỉnh: khai theo chuỗi 7 ký tự 0/1

Ngoài các mã số dựng sẵn (`1`, `7`, `11`...), `NETWORKDAYS.INTL` còn nhận một chuỗi `7` ký tự gồm `0` và `1`, đại diện cho `7` ngày trong tuần bắt đầu từ Thứ Hai — `1` là ngày nghỉ, `0` là ngày làm việc:

```excel
=NETWORKDAYS.INTL(NgayVao,NgayRa,"0000011")
```

{{anh:ni-05-chuoi-tuy-chinh}}

Chuỗi `"0000011"` nghĩa là năm ngày đầu tuần (Hai đến Sáu) làm việc, hai ngày cuối (Bảy, Chủ Nhật) nghỉ — chính là mã số `1` viết ra tường minh. Cách viết chuỗi này linh hoạt hơn khi lịch nghỉ không khớp với bất kỳ mã số dựng sẵn nào, ví dụ chỉ nghỉ giữa tuần.

## Tổng kết

`NETWORKDAYS.INTL` đếm số ngày làm việc giữa hai mốc thời gian như `NETWORKDAYS`, nhưng cho phép tự chọn cặp ngày nghỉ cuối tuần thay vì mặc định cố định Thứ Bảy-Chủ Nhật — cần thiết với lịch làm việc `6` ngày/tuần hoặc bất kỳ quy tắc cuối tuần nào khác.

Đọc tiếp trong cùng cụm bài: [GCD — ước số chung lớn nhất, dùng để rút gọn một tỷ lệ về dạng đơn giản nhất](/blog/ham-gcd-uoc-chung-lon-nhat).
