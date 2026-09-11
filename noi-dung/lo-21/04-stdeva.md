---
tieu_de: "STDEVA: độ lệch chuẩn tính cả văn bản và luận lý, dễ thổi phồng độ phân tán dữ liệu"
slug: "ham-stdeva-do-lech-chuan-tinh-ca-van-ban-va-luan-ly"
danh_muc: "Excel"
the: ["STDEVA", "hàm thống kê"]
mo_ta: "STDEVA tính độ lệch chuẩn như STDEV, nhưng quy đổi văn bản thành 0 và TRUE thành 1 thay vì bỏ qua — một ô ghi chú lẫn vào dữ liệu số có thể thổi phồng độ lệch chuẩn lên gấp nhiều lần, khiến dữ liệu trông phân tán hơn hẳn thực tế."
tu_khoa: "hàm STDEVA Excel, STDEVA khac STDEV, do lech chuan tinh ca van ban, STDEVA thoi phong do phan tan"
anh_bia: "/images/bai-viet/ham-stdeva/cover.png"
thu_muc_anh: "ham-stdeva"
trang_thai: "draft"
---

Bài trước, [MINA](/blog/ham-mina-nho-nhat-tinh-ca-van-ban-va-luan-ly) khép lại nhóm tìm giá trị lớn/nhỏ nhất. `STDEVA` chuyển sang một phép tính phức tạp hơn — độ lệch chuẩn — nhưng vẫn giữ nguyên quy tắc quy đổi quen thuộc: văn bản và luận lý không bị bỏ qua như [`STDEV`](/blog/ham-thong-ke-trong-excel-average-median-mode-stdev-percentile), mà được tính vào như những con số thật.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=STDEVA(gia_tri1, [gia_tri2], ...)
```

{{anh:sd-01-cu-phap-co-ban}}

Cùng quy tắc: `TRUE`=`1`, `FALSE`=`0`, mọi văn bản=`0`. `STDEVA` là phiên bản mẫu (sample), tương ứng với `STDEV`, không phải phiên bản tổng thể (`STDEVP`).

## Một ô văn bản có thể thổi phồng độ lệch chuẩn gấp nhiều lần

Ba học sinh đạt điểm `80`, `85`, `90` — khá đồng đều. Một học sinh thứ tư chưa có điểm, ghi tạm bằng chữ `"Chưa chấm"`:

```excel
=STDEV(80,85,90)
=STDEVA(80,85,90,"Chưa chấm")
```

{{anh:sd-02-thoi-phong-do-lech-chuan}}

`STDEV` bỏ qua ô văn bản, cho kết quả `5,00` — phản ánh đúng mức độ đồng đều thực sự của `3` điểm số. `STDEVA` quy đổi `"Chưa chấm"` thành `0`, biến nó thành một giá trị cách xa hẳn nhóm điểm `80`-`90`, khiến độ lệch chuẩn nhảy vọt lên `42,70` — gấp hơn `8` lần. Dữ liệu trông như phân tán rất mạnh, dù thực chất chỉ vì một ô ghi chú không phải điểm số thật.

## Vì sao đây là lỗi nghiêm trọng hơn hẳn so với AVERAGEA

Ở bài [`AVERAGEA`](/blog/ham-averagea-trung-binh-tinh-ca-van-ban-va-luan-ly), một ô văn bản kéo trung bình lệch theo tỷ lệ tuyến tính. Với độ lệch chuẩn, phép tính liên quan đến **bình phương** khoảng cách tới trung bình — một giá trị `0` lạc lõng giữa các số `80`-`90` tạo ra khoảng cách rất lớn, và khoảng cách đó bị **bình phương lên** trước khi tính trung bình, khiến sai lệch phóng đại nhanh hơn hẳn so với chỉ tính trung bình thông thường.

{{anh:sd-03-vi-sao-nghiem-trong-hon}}

## Ứng dụng: đo độ phân tán khi checkbox thật sự mang ý nghĩa 0/1

```excel
=STDEVA(B2:B20)
```

{{anh:sd-04-ung-dung-dung-cho}}

Nếu cột dữ liệu là mức độ hài lòng từ `1` đến `5`, trộn với vài ô checkbox biểu thị "hoàn toàn không hài lòng" (`FALSE`=`0`) hay "hoàn toàn hài lòng" (`TRUE`=`1`), `STDEVA` phản ánh đúng độ phân tán chung của toàn bộ phản hồi, kể cả những phản hồi ghi bằng checkbox.

## Luôn kiểm tra dữ liệu trước khi tin vào STDEVA

```excel
=COUNTA(B2:B20)-COUNT(B2:B20)
```

{{anh:sd-05-kiem-tra-du-lieu-truoc}}

Công thức này đếm số ô **không phải số** trong vùng dữ liệu (tổng số ô có dữ liệu trừ đi số ô là số) — nếu kết quả khác `0`, cần xem lại từng ô đó trước khi tin vào kết quả `STDEVA`, vì bất kỳ ô văn bản hay luận lý nào cũng có thể đang thổi phồng độ lệch chuẩn một cách âm thầm.

## Tổng kết

`STDEVA` tính độ lệch chuẩn, quy đổi văn bản và luận lý thành số thay vì bỏ qua như `STDEV` — vì phép tính liên quan đến bình phương khoảng cách, một ô văn bản lạc lõng có thể thổi phồng kết quả gấp nhiều lần chỉ sau một phép quy đổi tưởng như vô hại.

Đọc tiếp trong cùng cụm bài: [VARA — phương sai, chính là STDEVA trước khi khai căn](/blog/ham-vara-phuong-sai-tinh-ca-van-ban-va-luan-ly).
