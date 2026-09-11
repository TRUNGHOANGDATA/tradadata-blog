---
tieu_de: "GEOMEAN: trung bình nhân, cách tính đúng tỷ lệ tăng trưởng trung bình qua nhiều kỳ"
slug: "ham-geomean-trung-binh-nhan"
danh_muc: "Excel"
the: ["GEOMEAN", "hàm thống kê"]
mo_ta: "GEOMEAN tính trung bình nhân — căn bậc n của tích n số — cho kết quả khác hẳn AVERAGE khi cần tính tỷ lệ tăng trưởng trung bình qua nhiều kỳ. Chỉ nhận số dương, số 0 hoặc âm đều báo lỗi."
tu_khoa: "hàm GEOMEAN Excel, trung binh nhan, ty le tang truong trung binh, GEOMEAN khac AVERAGE"
anh_bia: "/images/bai-viet/ham-geomean/cover.png"
thu_muc_anh: "ham-geomean"
trang_thai: "draft"
---

[`AVERAGE`](/blog/ham-thong-ke-trong-excel-average-median-mode-stdev-percentile) tính trung bình **cộng** — quen thuộc với hầu hết mọi người. `GEOMEAN` tính trung bình **nhân** (geometric mean) — ít gặp hơn, nhưng lại là cách tính đúng duy nhất cho một bài toán rất phổ biến: tỷ lệ tăng trưởng trung bình qua nhiều kỳ.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác. Riêng các hệ số thập phân như `1.10` được viết bằng dấu chấm, để không lẫn với dấu phẩy đang dùng phân cách nhiều đối số trong cùng công thức.

## Cú pháp

```excel
=GEOMEAN(so1, [so2], ...)
```

{{anh:gm-01-cu-phap-co-ban}}

Về bản chất, `GEOMEAN` tính căn bậc `n` của tích `n` số — khác hẳn `AVERAGE` cộng rồi chia cho `n`.

## Vấn đề: trung bình cộng cho kết quả sai với tỷ lệ tăng trưởng

Doanh thu tăng trưởng `3` năm liên tiếp: `+10%`, `+20%`, `+5%`. Tính "tăng trưởng trung bình mỗi năm" bằng cách cộng rồi chia `3`:

```excel
=AVERAGE(10%,20%,5%)
```

{{anh:gm-02-van-de-trung-binh-cong}}

Kết quả `11,67%` — nghe hợp lý, nhưng **sai**. Nếu áp dụng đúng `11,67%` mỗi năm trong `3` năm liên tiếp, doanh thu cuối cùng sẽ **không khớp** với doanh thu thực tế đã tăng qua đúng ba tỷ lệ `10%`, `20%`, `5%` ban đầu — vì tăng trưởng có tính chất **nhân dồn** (kép) qua từng năm, không phải cộng dồn.

## Cách tính đúng: GEOMEAN trên các hệ số tăng trưởng

```excel
=GEOMEAN(1.10,1.20,1.05)-1
```

{{anh:gm-03-cach-tinh-dung}}

Đưa vào `GEOMEAN` không phải tỷ lệ phần trăm, mà **hệ số nhân** tương ứng (`110%`→`1.10`, `120%`→`1.20`, `105%`→`1.05`), rồi trừ `1` để đổi lại thành tỷ lệ phần trăm. Kết quả `11,49%` — thấp hơn con số `11,67%` tính bằng trung bình cộng, nhưng mới là tỷ lệ **thực sự** khi áp dụng đều mỗi năm sẽ cho ra đúng kết quả cuối cùng như ba tỷ lệ tăng trưởng gốc.

## Trung bình cộng luôn lớn hơn hoặc bằng trung bình nhân

{{anh:gm-04-am-gm}}

Đây không phải trùng hợp — theo bất đẳng thức AM-GM (Arithmetic Mean - Geometric Mean) trong toán học, trung bình cộng của một tập số dương **luôn lớn hơn hoặc bằng** trung bình nhân của chính tập đó, chỉ bằng nhau khi tất cả các số đều giống hệt nhau. Vì vậy dùng nhầm `AVERAGE` cho bài toán tăng trưởng luôn cho kết quả **cao hơn** thực tế, không bao giờ thấp hơn.

## Giới hạn: chỉ nhận số dương

```excel
=GEOMEAN(10,-5,8)
```

{{anh:gm-05-gioi-han-so-duong}}

Kết quả là lỗi `#NUM!` — `GEOMEAN` không chấp nhận số `0` hay số âm trong danh sách, vì căn bậc `n` của một tích có chứa số âm hoặc bằng `0` không cho ra kết quả có ý nghĩa theo cách hàm này định nghĩa.

## Tổng kết

`GEOMEAN` tính trung bình nhân, cho kết quả đúng khi cần tìm tỷ lệ tăng trưởng trung bình qua nhiều kỳ — khác hẳn `AVERAGE` vốn luôn cho ra con số cao hơn thực tế trong trường hợp này. Chỉ nhận số dương, số `0` hoặc âm đều báo lỗi `#NUM!`.

Đọc tiếp trong cùng cụm bài: [HARMEAN — trung bình điều hoà, cách tính đúng tốc độ trung bình khi quãng đường bằng nhau](/blog/ham-harmean-trung-binh-dieu-hoa).
