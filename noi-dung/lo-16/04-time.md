---
tieu_de: "TIME: dựng một giá trị giờ từ ba con số riêng lẻ, chiều ngược lại của HOUR/MINUTE/SECOND"
slug: "ham-time-dung-gio-tu-gio-phut-giay"
danh_muc: "Excel"
the: ["TIME", "hàm ngày tháng"]
mo_ta: "TIME ghép ba con số giờ, phút, giây riêng lẻ thành một giá trị thời gian thật — chiều ngược lại của HOUR/MINUTE/SECOND. Vượt quá 24 tiếng không báo lỗi mà tự động cuộn vòng, dễ gây bất ngờ nếu không để ý."
tu_khoa: "hàm TIME Excel, dung gio tu so Excel, TIME vuot 24 tieng, TIME nguoc lai HOUR MINUTE SECOND"
anh_bia: "/images/bai-viet/ham-time/cover.png"
thu_muc_anh: "ham-time"
trang_thai: "draft"
---

Bài [HOUR, MINUTE, SECOND](/blog/ham-hour-minute-second-tach-gio-phut-giay) tách một ô thời gian thành ba con số riêng. `TIME` làm đúng chiều ngược lại: ghép ba con số giờ, phút, giây thành một giá trị thời gian thật.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=TIME(gio, phut, giay)
```

{{anh:tm-01-cu-phap-co-ban}}

`TIME(8,30,0)` trả về giá trị thời gian `08:30:00` — một giá trị thời gian thật, định dạng lại được, tính toán được, không phải chuỗi văn bản trông giống giờ.

## Ứng dụng: tính giờ kết thúc ca làm từ giờ bắt đầu cộng số giờ làm việc

```excel
=TIME(HOUR(GioBatDau)+8,MINUTE(GioBatDau),0)
```

{{anh:tm-02-tinh-gio-ket-thuc-ca}}

Tách giờ và phút của `GioBatDau` bằng `HOUR`/`MINUTE`, cộng thêm `8` tiếng làm việc, rồi dựng lại thành một giá trị giờ kết thúc hoàn chỉnh bằng `TIME` — kết hợp cả hai chiều tách và ghép trong cùng một công thức.

## Ứng dụng: dựng giờ từ dữ liệu nhập tay theo ba cột riêng

Một số biểu mẫu nhập liệu tách riêng giờ, phút thành hai cột khác nhau cho dễ chọn (dropdown), cần ghép lại thành một giá trị giờ thật để tính toán:

```excel
=TIME(A2,B2,0)
```

{{anh:tm-03-ghep-tu-cot-rieng}}

Với `A2` chứa giờ (`0`-`23`) và `B2` chứa phút (`0`-`59`) nhập từ hai ô riêng, `TIME` ghép lại thành một giá trị giờ hoàn chỉnh, dùng được ngay với các phép tính thời gian khác.

## Điểm cần nhớ: vượt quá phạm vi tự động cuộn vòng, không báo lỗi

```excel
=TIME(25,0,0)
```

{{anh:tm-04-vuot-24-tieng-cuon-vong}}

Kết quả là `01:00:00`, không phải lỗi. `25` giờ vượt quá một ngày `24` giờ — phần dư sau khi trừ đi trọn một ngày (`25-24=1`) chính là giờ hiển thị ra, còn phần "một ngày" bị cuộn qua mất, không được `TIME` giữ lại (vì `TIME` chỉ trả về phần giờ trong ngày, không phải một ngày-giờ đầy đủ). Cần cẩn thận nếu công thức cộng dồn số giờ có thể vượt `24` — kết quả trông vẫn hợp lệ nhưng đã âm thầm mất đi phần "ngày" bị cuộn qua.

## Nếu cần giữ cả phần ngày khi cộng dồn giờ vượt 24 tiếng

Muốn giữ đúng cả ngày lẫn giờ khi tổng số giờ có thể vượt `24` (ví dụ cộng dồn nhiều ca làm việc qua đêm), cần cộng trực tiếp bằng phân số của ngày thay vì dùng `TIME`:

```excel
=NgayGio+8/24
```

{{anh:tm-05-giu-ca-ngay-khi-cong-gio}}

Cộng thẳng `8/24` (tức `8` giờ, biểu diễn dưới dạng phân số của một ngày) vào một giá trị ngày-giờ đầy đủ sẽ giữ nguyên cả phần ngày, tăng đúng sang ngày hôm sau nếu tổng giờ vượt `24` — khác với `TIME` chỉ làm việc trong phạm vi một ngày, luôn cuộn vòng và bỏ mất phần ngày.

## Tổng kết

`TIME` ghép ba con số giờ, phút, giây thành một giá trị thời gian thật, đúng chiều ngược lại của `HOUR`/`MINUTE`/`SECOND`. Vượt quá `24` giờ không báo lỗi mà tự động cuộn vòng về đầu ngày, bỏ mất phần "ngày" dư ra — cần cộng trực tiếp phân số của ngày nếu muốn giữ lại phần đó.

Đọc tiếp trong cùng cụm bài: [NOW — ngày và giờ hiện tại, và vì sao không nên dùng để đóng dấu thời gian cố định](/blog/ham-now-ngay-gio-hien-tai).
