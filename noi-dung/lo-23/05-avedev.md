---
tieu_de: "AVEDEV: độ lệch tuyệt đối trung bình, cách đo độ phân tán dễ hiểu hơn hẳn phương sai"
slug: "ham-avedev-do-lech-tuyet-doi-trung-binh"
danh_muc: "Excel"
the: ["AVEDEV", "hàm thống kê"]
mo_ta: "AVEDEV đo độ phân tán bằng trung bình của các khoảng cách tuyệt đối tới trung bình — cùng đơn vị với dữ liệu gốc, dễ diễn giải hơn hẳn độ lệch chuẩn vốn phải đi qua bước bình phương rồi khai căn."
tu_khoa: "hàm AVEDEV Excel, do lech tuyet doi trung binh, AVEDEV khac STDEV, do phan tan de hieu"
anh_bia: "/images/bai-viet/ham-avedev/cover.png"
thu_muc_anh: "ham-avedev"
trang_thai: "draft"
---

Bài trước, [DEVSQ](/blog/ham-devsq-tong-binh-phuong-do-lech) tính tổng **bình phương** độ lệch. `AVEDEV` đo độ phân tán theo một cách trực quan hơn hẳn — dùng khoảng cách **tuyệt đối** thay vì bình phương, cho ra một con số cùng đơn vị với dữ liệu gốc, dễ hình dung hơn hẳn độ lệch chuẩn.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=AVEDEV(so1, [so2], ...)
```

{{anh:ad-01-cu-phap-co-ban}}

Công thức: lấy từng giá trị trừ trung bình, lấy [trị tuyệt đối](/blog/ham-abs-tri-tuyet-doi) của hiệu đó, rồi tính trung bình cộng của tất cả các khoảng cách tuyệt đối này.

## Ví dụ tính toán: cùng dữ liệu đã dùng ở các bài trước

```excel
=AVEDEV(80,85,90,95,100)
```

{{anh:ad-02-vi-du-tinh-toan}}

Trung bình của `5` số này là `90`. Khoảng cách tuyệt đối tới trung bình lần lượt là `10, 5, 0, 5, 10` — trung bình cộng của các khoảng cách đó là `6`. Kết quả `AVEDEV=6` có nghĩa trực tiếp: "trung bình, mỗi điểm dữ liệu cách giá trị trung bình `6` đơn vị" — dễ hiểu hơn hẳn con số `STDEV.P=7,07` đã tính ở [bài trước đó](/blog/ham-stdev-p-stdev-s-tong-the-va-mau) trên cùng dữ liệu.

## Vì sao AVEDEV dễ diễn giải hơn STDEV

{{anh:ad-03-vi-sao-de-dien-giai-hon}}

`STDEV` phải đi qua hai bước biến đổi (bình phương rồi khai căn) để loại bỏ dấu âm của độ lệch, khiến con số cuối cùng không còn ý nghĩa "khoảng cách trung bình" trực tiếp nữa — nó là căn bậc hai của trung bình **bình phương** khoảng cách, không phải trung bình khoảng cách. `AVEDEV` dùng trị tuyệt đối để loại dấu âm, giữ nguyên ý nghĩa "khoảng cách trung bình thực tế" mà không cần qua bước bình phương/khai căn nào.

## Vì sao thống kê suy luận vẫn ưu tiên STDEV hơn AVEDEV

```excel
=AVEDEV(A2:A50)
=STDEV.S(A2:A50)
```

{{anh:ad-04-vi-sao-van-uu-tien-stdev}}

Dù dễ hiểu hơn, `AVEDEV` ít được dùng trong các phép kiểm định thống kê chính thức, vì hàm trị tuyệt đối không "mượt" về mặt toán học (không khả vi tại điểm bằng `0`), gây khó khăn khi cần đạo hàm hay biến đổi đại số trong các mô hình thống kê phức tạp hơn. `STDEV`/`VAR` dùng phép bình phương vì có tính chất toán học đẹp hơn hẳn cho các phép biến đổi đó, dù kết quả khó diễn giải trực quan hơn.

## Ứng dụng: giải thích độ đồng đều dữ liệu cho người không chuyên thống kê

```excel
="Trung bình mỗi tháng lệch "&AVEDEV(DoanhSo)&" so với mức chung"
```

{{anh:ad-05-ung-dung-giai-thich-de-hieu}}

Khi cần trình bày độ ổn định của doanh số qua các tháng cho người không quen thuật ngữ "độ lệch chuẩn", `AVEDEV` cho một câu diễn giải tự nhiên hơn hẳn: "trung bình mỗi tháng lệch bao nhiêu so với mức chung" — đúng nghĩa đen của con số, không cần giải thích thêm về phép bình phương hay khai căn.

## Tổng kết

`AVEDEV` đo độ phân tán bằng trung bình khoảng cách tuyệt đối tới giá trị trung bình — cùng đơn vị với dữ liệu gốc, dễ diễn giải hơn hẳn `STDEV`. Vẫn ít được dùng trong thống kê suy luận chính thức vì tính chất toán học của trị tuyệt đối kém "mượt" hơn phép bình phương, nhưng là lựa chọn tốt khi cần giải thích độ phân tán cho người không chuyên.

Đây là bài cuối trong cụm 5 bài lô 23 về các loại trung bình và đo độ phân tán khác, bắt đầu từ [GEOMEAN](/blog/ham-geomean-trung-binh-nhan).
