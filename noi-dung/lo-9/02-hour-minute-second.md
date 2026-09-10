---
tieu_de: "HOUR, MINUTE, SECOND: tách giờ, phút, giây từ một ô thời gian"
slug: "ham-hour-minute-second-tach-gio-phut-giay"
danh_muc: "Excel"
the: ["HOUR", "MINUTE", "SECOND", "hàm ngày tháng"]
mo_ta: "HOUR, MINUTE, SECOND làm với giờ giấc đúng như YEAR, MONTH, DAY làm với ngày tháng — tách một ô thời gian thành ba con số riêng, dùng để phân ca làm việc hoặc lọc dữ liệu theo khung giờ."
tu_khoa: "hàm HOUR Excel, hàm MINUTE Excel, hàm SECOND Excel, tách giờ phút giây trong Excel, phân ca làm việc theo giờ"
anh_bia: "/images/bai-viet/ham-hour-minute-second/cover.png"
thu_muc_anh: "ham-hour-minute-second"
trang_thai: "draft"
---

Bài trước nói về [YEAR, MONTH, DAY](/blog/ham-year-month-day-tach-nam-thang-ngay) — tách một ngày thành năm/tháng/ngày. `HOUR`, `MINUTE`, `SECOND` làm đúng việc tương tự nhưng cho thời gian trong ngày: tách một ô giờ thành giờ, phút, giây riêng biệt.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=HOUR(gio)
=MINUTE(gio)
=SECOND(gio)
```

{{anh:hms-01-cu-phap-co-ban}}

Với ô chứa giờ `08:45:30`: `HOUR` trả về `8`, `MINUTE` trả về `45`, `SECOND` trả về `30`. Kết quả luôn là số nguyên từ 0 đến 23 (với `HOUR`) hoặc 0 đến 59 (với `MINUTE`, `SECOND`).

## Bản chất: giờ chỉ là phần thập phân của một ngày

Excel lưu ngày tháng và giờ giấc trong cùng một hệ số: phần nguyên là số ngày, phần thập phân là tỷ lệ thời gian đã trôi qua trong ngày đó. `12:00:00` trưa là `0.5`, `06:00:00` sáng là `0.25`. Vì `HOUR`/`MINUTE`/`SECOND` chỉ đọc phần thập phân này, chúng cho ra đúng kết quả dù ô chứa riêng giờ (`08:45:30`) hay chứa cả ngày lẫn giờ (`10/09/2026 08:45:30`) — phần ngày ở đầu không ảnh hưởng gì tới ba hàm này.

{{anh:hms-02-datetime-day-va-gio}}

## Ứng dụng: phân ca làm việc từ dữ liệu chấm công

Một bảng chấm công ghi lại thời điểm quét thẻ, cần phân loại xem đó là ca sáng, ca chiều hay ngoài giờ:

```excel
=IF(HOUR(B2)<12,"Ca sáng",IF(HOUR(B2)<18,"Ca chiều","Ngoài giờ"))
```

{{anh:hms-03-phan-ca-lam-viec}}

`HOUR(B2)` lấy đúng giờ quét thẻ bất kể ô đó có kèm ngày tháng hay không, rồi `IF` lồng nhau phân vào một trong ba nhóm ca.

## Ứng dụng: gộp giờ và phút thành số phút để so sánh, sắp xếp

Muốn biết một khoảng thời gian (ví dụ thời lượng cuộc gọi) dài bao nhiêu phút để so sánh hoặc `SUM`, không thể cộng trực tiếp giá trị giờ:phút vì đó là định dạng thời gian, không phải số phút thuần:

```excel
=HOUR(C2)*60+MINUTE(C2)
```

{{anh:hms-04-quy-doi-ra-phut}}

Công thức này quy đổi một khoảng thời gian dạng `01:35:00` thành `95` (phút), một con số thuần để tính tổng hay so sánh trực tiếp mà không lo Excel hiển thị nhầm sang định dạng giờ.

## Lỗi thường gặp: nhầm giờ 24 tiếng và định dạng AM/PM

`HOUR` luôn trả về giá trị theo hệ 24 giờ (0-23) bất kể ô đang hiển thị theo định dạng `AM/PM` hay không — đây là bản chất số bên trong, không phụ thuộc cách hiển thị. Nhầm lẫn thường xảy ra ngược lại: khi nhập tay giờ chấm công buổi chiều mà quên gõ `PM`, ví dụ gõ `3:00` thay vì `3:00 PM`, Excel hiểu đó là `03:00` sáng, khiến `HOUR` trả về `3` thay vì `15` — công thức phân ca ở trên sẽ xếp nhầm một ca chiều thành ca sáng.

{{anh:hms-05-nham-am-pm}}

## Tổng kết

`HOUR`, `MINUTE`, `SECOND` tách một ô thời gian thành ba con số theo hệ 24 giờ, hoạt động dựa trên phần thập phân của giá trị ngày-giờ nên không bị ảnh hưởng bởi phần ngày đi kèm. Ứng dụng thực tế phổ biến nhất là phân loại theo khung giờ hoặc quy đổi thời lượng ra một đơn vị số để tính toán.

Đọc tiếp trong cùng cụm bài: [WEEKNUM — tìm số thứ tự tuần trong năm](/blog/ham-weeknum-tim-so-thu-tu-tuan-trong-nam).
