---
tieu_de: "SQRT: căn bậc hai, và vì sao số âm luôn báo lỗi thay vì ra số ảo"
slug: "ham-sqrt-can-bac-hai"
danh_muc: "Excel"
the: ["SQRT", "hàm toán học"]
mo_ta: "SQRT tính căn bậc hai của một số — đơn giản với số dương, nhưng luôn báo lỗi #NUM! với số âm thay vì trả về số ảo như một số máy tính khoa học. Ứng dụng thực tế phổ biến nhất là tính khoảng cách giữa hai điểm toạ độ."
tu_khoa: "hàm SQRT Excel, căn bậc hai Excel, tính khoảng cách Pythagoras Excel, lỗi NUM SQRT số âm"
anh_bia: "/images/bai-viet/ham-sqrt/cover.png"
thu_muc_anh: "ham-sqrt"
trang_thai: "draft"
---

Bài trước, [SIGN](/blog/ham-sign-dau-cua-mot-so) hỏi một số dương hay âm. `SQRT` làm một việc khác hẳn — tính căn bậc hai — nhưng cũng có một quy tắc về dấu đáng chú ý không kém.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=SQRT(so)
```

{{anh:sq-01-cu-phap-co-ban}}

`SQRT(16)` trả về `4`, vì `4×4=16`. Đơn giản với mọi số không âm.

## Ứng dụng: tính khoảng cách giữa hai điểm toạ độ

Công thức Pythagoras — khoảng cách giữa hai điểm `(x1,y1)` và `(x2,y2)` — cần đúng một lần `SQRT` ở bước cuối:

```excel
=SQRT((X2-X1)^2+(Y2-Y1)^2)
```

{{anh:sq-02-khoang-cach-toa-do}}

Công thức này dùng trong các bài toán đo khoảng cách thực tế trên bản đồ toạ độ (kinh độ/vĩ độ quy đổi tương đối) hay bố trí mặt bằng, sơ đồ kỹ thuật đơn giản trong Excel.

## Điểm cần nhớ: số âm luôn báo lỗi, không trả về số ảo

```excel
=SQRT(-16)
```

{{anh:sq-03-loi-so-am}}

Kết quả là `#NUM!`. Về mặt toán học, căn bậc hai của số âm là một số ảo (`4i`) — nhưng Excel không có kiểu dữ liệu số phức trong các hàm tính toán thông thường, nên thay vì cố tính ra kết quả không biểu diễn được, Excel báo lỗi ngay. Đây là điểm khác với một số máy tính khoa học hay ngôn ngữ lập trình có hỗ trợ số phức.

## Cách xử lý khi biết chắc chỉ cần độ lớn

Nếu phép tính có thể vô tình cho ra số âm bên trong (ví dụ do sai số làm tròn khiến một hiệu số lẽ ra bằng `0` lại thành `-0,0000001`), bọc thêm `ABS` trước khi tính căn:

```excel
=SQRT(ABS(so))
```

{{anh:sq-04-boc-abs-truoc}}

Cần cẩn thận: cách này chỉ hợp lý khi biết chắc số âm chỉ là do sai số kỹ thuật cần loại bỏ, không phải một giá trị âm có ý nghĩa thật trong bài toán — nếu số âm mang ý nghĩa tính toán thực sự (ví dụ khoản lỗ), bọc `ABS` sẽ âm thầm đổi luôn bản chất phép tính, không còn là "khoảng cách" hay "độ lớn" nữa mà chỉ là che giấu lỗi.

## Ứng dụng: tính độ lệch chuẩn thủ công từng bước

Trước khi có `STDEV` dựng sẵn (xem [hàm thống kê](/blog/ham-thong-ke-trong-excel-average-median-mode-stdev-percentile)), độ lệch chuẩn được tính thủ công qua bước cuối là một `SQRT`:

```excel
=SQRT(SUMPRODUCT((A2:A10-AVERAGE(A2:A10))^2)/(COUNT(A2:A10)-1))
```

{{anh:sq-05-do-lech-chuan-thu-cong}}

Nhìn vào công thức dài này dễ thấy vì sao Excel dựng sẵn `STDEV` — nhưng hiểu được `SQRT` nằm ở đâu trong chuỗi tính toán giúp gỡ lỗi dễ hơn khi một công thức thống kê phức tạp hơn cho ra kết quả `#NUM!` bất ngờ.

## Tổng kết

`SQRT` tính căn bậc hai của một số, nhưng luôn báo lỗi `#NUM!` với số âm thay vì trả về số ảo. Ứng dụng phổ biến nhất là tính khoảng cách theo công thức Pythagoras; khi phép tính có thể vô tình ra số âm do sai số, cân nhắc bọc `ABS` — nhưng chỉ khi chắc chắn số âm đó không mang ý nghĩa tính toán thật.

Đọc tiếp trong cùng cụm bài: [POWER — tính luỹ thừa rõ ràng hơn dấu mũ, và một số mũ không nguyên gây lỗi bất ngờ](/blog/ham-power-luy-thua-ro-rang).
