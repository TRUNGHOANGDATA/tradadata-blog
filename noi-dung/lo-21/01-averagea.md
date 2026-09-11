---
tieu_de: "AVERAGEA: tính trung bình cả ô văn bản và TRUE/FALSE, dễ kéo tụt kết quả nếu không để ý"
slug: "ham-averagea-trung-binh-tinh-ca-van-ban-va-luan-ly"
danh_muc: "Excel"
the: ["AVERAGEA", "hàm thống kê"]
mo_ta: "AVERAGEA tính trung bình như AVERAGE, nhưng không bỏ qua ô văn bản và luận lý — coi TRUE là 1, FALSE và mọi văn bản là 0. Một ô ghi chú tưởng vô hại như 'Chưa chấm' có thể kéo tụt kết quả rất mạnh mà không có dấu hiệu cảnh báo nào."
tu_khoa: "hàm AVERAGEA Excel, AVERAGEA khac AVERAGE, trung binh tinh ca van ban, AVERAGEA TRUE FALSE"
anh_bia: "/images/bai-viet/ham-averagea/cover.png"
thu_muc_anh: "ham-averagea"
trang_thai: "draft"
---

[`AVERAGE`](/blog/ham-thong-ke-trong-excel-average-median-mode-stdev-percentile) tự động bỏ qua ô văn bản và ô trống khi tính trung bình, chỉ tính trên các ô là số. `AVERAGEA` trông giống hệt nhưng lại tính theo một quy tắc khác hẳn — không bỏ qua văn bản hay giá trị luận lý, mà quy đổi chúng thành số trước khi tính.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=AVERAGEA(gia_tri1, [gia_tri2], ...)
```

{{anh:ag-01-cu-phap-co-ban}}

Quy tắc quy đổi: `TRUE` tính là `1`, `FALSE` tính là `0`, **mọi văn bản** (bất kể nội dung gì) cũng tính là `0`. Chỉ có ô thực sự **trống** mới bị bỏ qua hoàn toàn, không tính vào cả tử số lẫn mẫu số.

## So sánh trực tiếp: một ô văn bản kéo tụt kết quả ra sao

Cột điểm có `4` ô: `8`, `9`, `"Chưa chấm"`, `7` — một học sinh chưa có điểm, ghi chú tạm bằng chữ:

```excel
=AVERAGE(A2:A5)
=AVERAGEA(A2:A5)
```

{{anh:ag-02-so-sanh-average}}

`AVERAGE` cho `8` — tự động bỏ qua ô chữ `"Chưa chấm"`, chỉ tính trung bình của `3` điểm số thật. `AVERAGEA` cho `5` — coi `"Chưa chấm"` là `0`, kéo trung bình tụt xuống rất mạnh dù không có học sinh nào thực sự đạt điểm thấp. Không có cảnh báo hay dấu hiệu gì cho biết kết quả đã bị lệch — cả hai công thức đều chạy "bình thường".

## Ứng dụng: khi checkbox thật sự cần đóng góp vào trung bình

```excel
=AVERAGEA(B2:B10)
```

{{anh:ag-03-ung-dung-checkbox}}

Nếu cột dữ liệu trộn lẫn cả điểm số phần trăm hoàn thành cụ thể (`75%`) lẫn các ô checkbox `TRUE`/`FALSE` (hiểu là hoàn thành `100%` hoặc `0%`), `AVERAGEA` là lựa chọn đúng — nó quy đổi `TRUE` thành `1` để tính chung vào trung bình, thay vì bỏ qua như `AVERAGE` sẽ làm, khiến kết quả thiếu hẳn phần đóng góp của các ô checkbox.

## Ô trống vẫn được bỏ qua như bình thường

```excel
=AVERAGEA(8,9,,7)
```

{{anh:ag-04-o-trong-van-bo-qua}}

Kết quả tính trung bình của đúng `3` giá trị `8`, `9`, `7` — ô trống (không phải văn bản, không phải `0`) vẫn bị loại khỏi cả tử số lẫn mẫu số, đúng như `AVERAGE` vẫn làm. Điểm khác biệt của `AVERAGEA` chỉ nằm ở cách xử lý văn bản và luận lý, không phải ô trống.

## Quy tắc cần nhớ: mọi văn bản đều là 0, kể cả văn bản trông giống số

```excel
=AVERAGEA(8,"9",7)
```

{{anh:ag-05-van-ban-giong-so}}

Nếu ô thứ hai chứa chuỗi văn bản `"9"` (căn trái, không phải số `9` thật căn phải), `AVERAGEA` vẫn tính nó là `0`, không phải `9` — vì bản chất ô đó vẫn là văn bản, bất kể nội dung trông có vẻ là một con số. Kết quả trung bình `(8+0+7)/3 = 5`, không phải `(8+9+7)/3 = 8` như nhiều người kỳ vọng khi nhìn thấy con số `9`.

## Tổng kết

`AVERAGEA` tính trung bình như `AVERAGE`, nhưng quy đổi `TRUE` thành `1`, còn `FALSE` và mọi văn bản (kể cả văn bản trông giống số) thành `0` thay vì bỏ qua. Một ô ghi chú tưởng vô hại có thể kéo tụt kết quả rất mạnh mà không có cảnh báo nào — cần chắc chắn hiểu rõ dữ liệu trước khi chọn `AVERAGEA` thay vì `AVERAGE`.

Đọc tiếp trong cùng cụm bài: [MAXA — cùng nguyên tắc quy đổi, áp dụng cho giá trị lớn nhất](/blog/ham-maxa-lon-nhat-tinh-ca-van-ban-va-luan-ly).
