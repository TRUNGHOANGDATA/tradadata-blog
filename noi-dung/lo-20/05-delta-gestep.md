---
tieu_de: "DELTA, GESTEP: hai hàm so sánh trả về đúng 0 hoặc 1, tiện làm cờ hiệu trong công thức"
slug: "ham-delta-gestep-co-hieu-0-va-1"
danh_muc: "Excel"
the: ["DELTA", "GESTEP", "hàm kỹ thuật"]
mo_ta: "DELTA kiểm tra hai số có bằng nhau hay không, GESTEP kiểm tra một số có đạt ngưỡng hay không — cả hai đều trả về đúng 0 hoặc 1 thay vì TRUE/FALSE, tiện dùng làm cờ hiệu số học nhân trực tiếp vào công thức khác."
tu_khoa: "hàm DELTA Excel, ham GESTEP Excel, co hieu 0 va 1 Excel, so sanh tra ve so thay vi TRUE FALSE"
anh_bia: "/images/bai-viet/ham-delta-gestep/cover.png"
thu_muc_anh: "ham-delta-gestep"
trang_thai: "draft"
---

Bốn bài trước xoay quanh việc chuyển đổi giữa các hệ đếm. `DELTA` và `GESTEP` khép lại nhóm hàm kỹ thuật (Engineering) bằng một việc khác hẳn: so sánh hai giá trị, nhưng trả về **số** `0`/`1` thay vì `TRUE`/`FALSE` như các phép so sánh thông thường.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=DELTA(so1, [so2])
=GESTEP(so, [buoc])
```

{{anh:dg-01-cu-phap-co-ban}}

`DELTA` trả về `1` nếu hai số **bằng nhau tuyệt đối**, `0` nếu khác. `GESTEP` trả về `1` nếu số đầu **lớn hơn hoặc bằng** ngưỡng, `0` nếu nhỏ hơn. Cả hai tham số thứ hai đều mặc định là `0` nếu bỏ trống.

## So với phép so sánh thông thường: khác nhau ở kiểu dữ liệu trả về

```excel
=A1=A2
=DELTA(A1,A2)
```

{{anh:dg-02-khac-phep-so-sanh-thuong}}

`A1=A2` trả về `TRUE`/`FALSE` — giá trị luận lý. `DELTA(A1,A2)` trả về `1`/`0` — giá trị số học thật sự, nhân/cộng trực tiếp được vào công thức khác mà không cần ép kiểu bằng dấu `--` như vẫn hay làm với `TRUE`/`FALSE`.

## Ứng dụng: đếm số lần khớp đúng một giá trị bằng SUMPRODUCT

```excel
=SUMPRODUCT(DELTA(A2:A20,10))
```

{{anh:dg-03-dem-khop-gia-tri}}

Đếm số ô trong vùng `A2:A20` có giá trị đúng bằng `10` — về bản chất tương đương `COUNTIF(A2:A20,10)`, nhưng viết theo dạng số học thuần, tiện khi cần kết hợp trong một công thức mảng lớn hơn đã dùng `SUMPRODUCT` sẵn.

## Ứng dụng: tạo cờ hiệu 0/1 theo ngưỡng để nhân vào công thức khác

```excel
=DoanhSo*GESTEP(DoanhSo,ChiTieu)
```

{{anh:dg-04-co-hieu-nguong}}

`GESTEP(DoanhSo,ChiTieu)` cho `1` nếu đạt chỉ tiêu, `0` nếu chưa đạt — nhân trực tiếp vào `DoanhSo` để chỉ giữ lại doanh số của những dòng đạt chỉ tiêu, các dòng chưa đạt tự động thành `0` mà không cần viết `IF`.

## GESTEP với ngưỡng âm hoặc bỏ trống

```excel
=GESTEP(-5)
=GESTEP(5)
```

{{anh:dg-05-gestep-bo-trong-nguong}}

Bỏ trống `buoc`, `GESTEP` mặc định so với `0` — `GESTEP(-5)` cho `0` (vì `-5` nhỏ hơn `0`), `GESTEP(5)` cho `1`. Cách dùng ngắn gọn này tiện khi chỉ cần kiểm tra nhanh một số có phải không âm hay không, thay cho viết `IF(so>=0,1,0)` dài hơn.

## Tổng kết

`DELTA` kiểm tra hai số có bằng nhau hay không, `GESTEP` kiểm tra một số có đạt ngưỡng hay không — cả hai đều trả về `0`/`1` dạng số thay vì `TRUE`/`FALSE`, tiện dùng làm cờ hiệu nhân trực tiếp vào các công thức số học khác như `SUMPRODUCT`, không cần ép kiểu luận lý sang số.

Đây là bài cuối trong cụm 5 bài lô 20 về nhóm hàm kỹ thuật (Engineering), bắt đầu từ [DEC2BIN, BIN2DEC](/blog/ham-dec2bin-bin2dec-chuyen-doi-nhi-phan).
