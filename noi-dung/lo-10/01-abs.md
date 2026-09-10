---
tieu_de: "ABS: lấy trị tuyệt đối, biến mọi chênh lệch thành số dương"
slug: "ham-abs-tri-tuyet-doi"
danh_muc: "Excel"
the: ["ABS", "hàm toán học"]
mo_ta: "ABS là hàm toán học ngắn nhất trong Excel — chỉ bỏ dấu âm. Đơn giản nhưng rất hay dùng khi cần so sánh độ lớn chênh lệch giữa hai giá trị mà không quan tâm bên nào lớn hơn."
tu_khoa: "hàm ABS Excel, trị tuyệt đối Excel, tính chênh lệch không âm, sai số tuyệt đối Excel"
anh_bia: "/images/bai-viet/ham-abs/cover.png"
thu_muc_anh: "ham-abs"
trang_thai: "draft"
---

`ABS` là một trong những hàm đơn giản nhất Excel có — chỉ làm đúng một việc: bỏ dấu âm, giữ nguyên độ lớn. Nghe tầm thường, nhưng lại là hàm được gọi lồng bên trong rất nhiều công thức khác mỗi khi cần so sánh độ lớn chênh lệch mà không quan tâm giá trị nào lớn hơn.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=ABS(so)
```

{{anh:abs-01-cu-phap-co-ban}}

`ABS(-15.5)` trả về `15.5`. `ABS(15.5)` cũng trả về `15.5`. Số dương giữ nguyên, số âm mất dấu trừ.

## Vấn đề: phép trừ có thể ra âm hoặc dương tuỳ thứ tự

Giả sử so sánh doanh số dự toán và thực tế của từng nhân viên để xem ai lệch xa mục tiêu nhất — không quan trọng lệch **thiếu** hay lệch **thừa**, chỉ cần biết mức độ lệch:

```excel
=DuToan-ThucTe
```

{{anh:abs-02-chenh-lech-co-am}}

Công thức trừ trực tiếp cho ra kết quả âm với người vượt chỉ tiêu, dương với người chưa đạt — hai dấu khác nhau khiến việc so sánh "ai lệch nhiều nhất" và sắp xếp theo `LARGE`/`RANK` cho ra kết quả sai, vì Excel coi `-500.000` nhỏ hơn `200.000`, dù độ lệch thực tế của người đầu lớn hơn.

## Bọc ABS để so sánh đúng độ lớn

```excel
=ABS(DuToan-ThucTe)
```

{{anh:abs-03-boc-abs}}

Giờ mọi chênh lệch đều là số dương, phản ánh đúng "lệch bao nhiêu" bất kể lệch theo hướng nào. Xếp hạng bằng `RANK` hay lọc bằng `LARGE` trên cột này mới cho đúng người lệch xa mục tiêu nhất, thay vì bị dấu âm đánh lừa thành "nhỏ nhất".

## Ứng dụng: tính sai số trung bình giữa dự báo và thực tế

Một cách đánh giá độ chính xác của mô hình dự báo hay dùng là sai số tuyệt đối trung bình — lấy trung bình của các `ABS(dự báo - thực tế)` qua nhiều kỳ, thay vì lấy trung bình chênh lệch có dấu (dễ bị các sai số dương âm triệt tiêu lẫn nhau, trông có vẻ chính xác hơn thực tế):

```excel
=AVERAGE(ABS(B2:B7-C2:C7))
```

{{anh:abs-04-sai-so-trung-binh}}

Công thức này cần nhập bằng `Ctrl+Shift+Enter` trên các phiên bản Excel cũ (công thức mảng), vì `ABS` áp lên cả một vùng dữ liệu cùng lúc; các phiên bản Excel 365 có mảng động thì gõ `Enter` bình thường là đủ.

## Lỗi bên trong vẫn là lỗi — ABS không "sửa" được

Một hiểu lầm thường gặp: tưởng bọc `ABS` ra ngoài sẽ khiến công thức hết báo lỗi. Không đúng — `ABS` chỉ xử lý số, nếu phép tính bên trong đã lỗi (chia cho `0`, tham chiếu bị xoá...) thì lỗi đó vẫn hiện nguyên, `ABS` không có cách nào "làm cho hết âm" một thứ còn chưa ra được số:

```excel
=ABS(10/0)
```

{{anh:abs-05-abs-khong-sua-loi}}

Kết quả vẫn là `#DIV/0!`, y hệt như không có `ABS` bọc ngoài.

## Tổng kết

`ABS` bỏ dấu âm của một số, dùng phổ biến nhất để so sánh đúng độ lớn của một chênh lệch mà không quan tâm hướng lệch. Cần nhớ `ABS` không xử lý được lỗi — nếu phép tính bên trong đã lỗi thì kết quả vẫn lỗi nguyên vẹn.

Đọc tiếp trong cùng cụm bài: [MOD — lấy phần dư phép chia, và vì sao số âm dễ gây bất ngờ](/blog/ham-mod-phan-du-phep-chia).
