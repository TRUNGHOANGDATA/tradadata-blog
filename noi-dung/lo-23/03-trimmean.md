---
tieu_de: "TRIMMEAN: trung bình cắt bớt, cách chấm điểm thi đấu công bằng khi có giám khảo cho điểm lệch"
slug: "ham-trimmean-trung-binh-cat-bot"
danh_muc: "Excel"
the: ["TRIMMEAN", "hàm thống kê"]
mo_ta: "TRIMMEAN loại bỏ một tỷ lệ dữ liệu ở cả hai đầu (cao nhất và thấp nhất) trước khi tính trung bình — đúng cách nhiều cuộc thi thể thao, nghệ thuật chấm điểm để một giám khảo cho điểm quá lệch không làm sai kết quả chung."
tu_khoa: "hàm TRIMMEAN Excel, trung binh cat bot, cham diem thi dau loai outlier, TRIMMEAN ty le cat"
anh_bia: "/images/bai-viet/ham-trimmean/cover.png"
thu_muc_anh: "ham-trimmean"
trang_thai: "draft"
---

Bài trước, [HARMEAN](/blog/ham-harmean-trung-binh-dieu-hoa) tính trung bình cho bài toán tốc độ. `TRIMMEAN` quay lại với `AVERAGE` quen thuộc, nhưng thêm một bước xử lý trước khi tính: loại bỏ những giá trị cực đoan ở hai đầu.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác. Tỷ lệ cắt là số thập phân, viết bằng dấu chấm (`0.2`) để không lẫn với dấu phẩy phân cách đối số.

## Cú pháp

```excel
=TRIMMEAN(mang, ty_le_cat)
```

{{anh:tm-01-cu-phap-co-ban}}

`ty_le_cat` là tỷ lệ **tổng số** dữ liệu bị loại, chia đều cho cả hai đầu (cao nhất và thấp nhất). `ty_le_cat=0.2` nghĩa là cắt tổng cộng `20%` dữ liệu — `10%` từ đầu thấp nhất, `10%` từ đầu cao nhất.

## Ứng dụng: chấm điểm thi đấu công bằng khi có giám khảo cho điểm lệch

`10` giám khảo chấm điểm một tiết mục, điểm số: `10, 9, 8, 7, 6, 9, 8, 7, 9, 2` — giám khảo cuối cùng cho điểm `2`, thấp bất thường so với phần còn lại:

```excel
=AVERAGE(A2:A11)
=TRIMMEAN(A2:A11,0.2)
```

{{anh:tm-02-ung-dung-cham-diem}}

`AVERAGE` cho `7,50` — bị kéo tụt bởi điểm `2` bất thường. `TRIMMEAN(...,0.2)` cho `7,875` — sau khi loại bỏ điểm cao nhất và thấp nhất (bao gồm điểm `2` lệch hẳn), trung bình phản ánh đúng hơn đánh giá chung của đa số giám khảo. Đây chính xác là cách nhiều cuộc thi thể thao, nghệ thuật (trượt băng nghệ thuật, thể dục dụng cụ) chấm điểm trong thực tế.

## Số ô bị cắt luôn làm tròn xuống tới số chẵn gần nhất

```excel
=TRIMMEAN(A2:A11,0.15)
```

{{anh:tm-03-lam-tron-xuong-so-chan}}

Với `10` giá trị, `ty_le_cat=0.15` về lý thuyết cắt `1,5` ô (`10×0.15=1.5`) — nhưng tổng số ô cắt phải là một số **chẵn** để chia đều cho hai đầu, nên Excel làm tròn `1,5` xuống tới số chẵn gần nhất: `0`. Kết quả là không có ô nào bị cắt cả — `TRIMMEAN(A2:A11,0.15)` cho ra kết quả giống hệt `AVERAGE(A2:A11)`, dù đã khai tỷ lệ cắt khác `0`.

## Với dữ liệu ít, tỷ lệ cắt nhỏ có thể không cắt được gì

{{anh:tm-04-du-lieu-it-khong-cat-duoc}}

Đây là điều cần nhớ: `TRIMMEAN` không đảm bảo luôn loại bỏ ít nhất một giá trị — nếu cỡ dữ liệu nhỏ và tỷ lệ cắt thấp, kết quả có thể giống hệt `AVERAGE` thông thường vì không đủ điều kiện làm tròn lên số ô cắt.

## So sánh nhanh: AVERAGE, TRIMMEAN và MEDIAN

```excel
=MEDIAN(A2:A11)
```

{{anh:tm-05-so-sanh-median}}

`MEDIAN` (đã có trong [bài thống kê](/blog/ham-thong-ke-trong-excel-average-median-mode-stdev-percentile)) cũng không bị ảnh hưởng bởi giá trị cực đoan, nhưng theo cách khác hẳn: chỉ lấy đúng giá trị ở giữa, bỏ qua toàn bộ thông tin từ các giá trị còn lại. `TRIMMEAN` dung hoà giữa hai thái cực — vẫn dùng phần lớn dữ liệu để tính trung bình, chỉ loại bỏ phần cực đoan nhất ở hai đầu.

## Tổng kết

`TRIMMEAN` loại bỏ một tỷ lệ dữ liệu ở cả hai đầu trước khi tính trung bình, giúp kết quả không bị một giá trị lệch hẳn kéo sai lệch — ứng dụng phổ biến nhất là chấm điểm thi đấu. Số ô bị cắt luôn làm tròn xuống số chẵn gần nhất, nên với dữ liệu ít và tỷ lệ cắt thấp, có thể không cắt được giá trị nào cả.

Đọc tiếp trong cùng cụm bài: [DEVSQ — tổng bình phương độ lệch, chính là tử số ẩn giấu bên trong công thức phương sai](/blog/ham-devsq-tong-binh-phuong-do-lech).
