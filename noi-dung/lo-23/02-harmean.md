---
tieu_de: "HARMEAN: trung bình điều hoà, cách tính đúng tốc độ trung bình khi quãng đường bằng nhau"
slug: "ham-harmean-trung-binh-dieu-hoa"
danh_muc: "Excel"
the: ["HARMEAN", "hàm thống kê"]
mo_ta: "HARMEAN tính trung bình điều hoà — nghịch đảo của trung bình cộng các nghịch đảo — cho kết quả đúng khi cần tính tốc độ trung bình của một hành trình đi cùng một quãng đường ở nhiều tốc độ khác nhau. Chỉ nhận số dương."
tu_khoa: "hàm HARMEAN Excel, trung binh dieu hoa, toc do trung binh dung, HARMEAN khac AVERAGE"
anh_bia: "/images/bai-viet/ham-harmean/cover.png"
thu_muc_anh: "ham-harmean"
trang_thai: "draft"
---

Bài trước, [GEOMEAN](/blog/ham-geomean-trung-binh-nhan) tính đúng tỷ lệ tăng trưởng trung bình. `HARMEAN` là kiểu trung bình thứ ba — trung bình điều hoà (harmonic mean) — cần dùng khi bài toán liên quan tới **tốc độ** hay **tỷ lệ trên một đơn vị chung**, thay vì bản thân các con số.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=HARMEAN(so1, [so2], ...)
```

{{anh:hm-01-cu-phap-co-ban}}

Về công thức, `HARMEAN` bằng `n` chia cho tổng của các nghịch đảo (`1/x`) — khác hẳn cách tính của `AVERAGE` hay `GEOMEAN`.

## Bài toán kinh điển: tốc độ trung bình cả hành trình

Một người đi nửa đầu quãng đường với tốc độ `60` km/h, nửa quãng đường còn lại (cùng độ dài) với tốc độ `40` km/h. Tốc độ trung bình cả hành trình là bao nhiêu?

```excel
=AVERAGE(60,40)
=HARMEAN(60,40)
```

{{anh:hm-02-bai-toan-kinh-dien}}

`AVERAGE` cho `50` km/h — sai. `HARMEAN` cho `48` km/h — đúng. Lý do: người đó đi **quãng đường bằng nhau** ở hai tốc độ, nên **thời gian** đi ở mỗi chặng khác nhau (chặng chậm hơn mất nhiều thời gian hơn) — trung bình cộng đơn giản không phản ánh đúng việc chặng đi chậm chiếm nhiều thời gian hơn trong tổng thời gian cả hành trình.

## Vì sao trung bình cộng sai trong tình huống này

{{anh:hm-03-vi-sao-trung-binh-cong-sai}}

Giả sử quãng đường mỗi chặng là `120` km: chặng đầu mất `120/60=2` giờ, chặng sau mất `120/40=3` giờ. Tổng quãng đường `240` km, tổng thời gian `5` giờ — tốc độ trung bình thật sự là `240/5=48` km/h, khớp đúng với `HARMEAN(60,40)`, không phải `50` km/h mà `AVERAGE` đưa ra.

## Khi nào dùng AVERAGE, khi nào dùng HARMEAN

{{anh:hm-04-khi-nao-dung-ham-nao}}

- Đi cùng **quãng đường**, tốc độ khác nhau → `HARMEAN` (thời gian mỗi chặng khác nhau).
- Đi cùng **thời gian**, tốc độ khác nhau (ví dụ mỗi giờ đi một tốc độ khác) → `AVERAGE` là đúng, vì lúc này quãng đường mỗi chặng mới là đại lượng thay đổi, còn thời gian là cố định như nhau.

## Giới hạn: chỉ nhận số dương

```excel
=HARMEAN(60,-40)
```

{{anh:hm-05-gioi-han-so-duong}}

Kết quả là lỗi `#NUM!` — giống `GEOMEAN`, `HARMEAN` không chấp nhận số `0` hay số âm, vì phép nghịch đảo `1/0` không xác định và ý nghĩa "tốc độ âm" không phù hợp với bài toán trung bình điều hoà thường gặp.

## Tổng kết

`HARMEAN` tính trung bình điều hoà, cho kết quả đúng khi các đại lượng cần lấy trung bình gắn với một **quãng đường** hay **khối lượng công việc** cố định, còn thời gian hoàn thành mới là thứ khác nhau giữa các chặng. Chỉ nhận số dương, giống `GEOMEAN`.

Đọc tiếp trong cùng cụm bài: [TRIMMEAN — trung bình cắt bớt, cách chấm điểm thi đấu công bằng khi có giám khảo cho điểm lệch](/blog/ham-trimmean-trung-binh-cat-bot).
