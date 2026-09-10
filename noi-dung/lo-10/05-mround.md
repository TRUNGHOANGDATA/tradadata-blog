---
tieu_de: "MROUND: làm tròn tới bội số bất kỳ, không chỉ chẵn lẻ"
slug: "ham-mround-lam-tron-toi-boi-so"
danh_muc: "Excel"
the: ["MROUND", "hàm toán học"]
mo_ta: "MROUND làm tròn một số tới bội số gần nhất của một giá trị bất kỳ do bạn chọn — làm tròn giá bán tới 500đ, hay làm tròn giờ chấm công tới từng 15 phút. Number và multiple phải cùng dấu, khác dấu là lỗi #NUM!."
tu_khoa: "hàm MROUND Excel, làm tròn bội số Excel, làm tròn giá tiền Excel, làm tròn giờ chấm công 15 phút, lỗi NUM MROUND"
anh_bia: "/images/bai-viet/ham-mround/cover.png"
thu_muc_anh: "ham-mround"
trang_thai: "draft"
---

Bài trước, [ODD và EVEN](/blog/ham-odd-even-lam-tron-len-so-le-chan) chỉ làm tròn tới số lẻ hoặc số chẵn — tức bội số của `2`. `MROUND` tổng quát hơn hẳn: làm tròn tới bội số gần nhất của **bất kỳ** giá trị nào tự chọn, không chỉ giới hạn ở `2`.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=MROUND(so, boi_so)
```

{{anh:mr-01-cu-phap-co-ban}}

`MROUND(11,3)` trả về `12` — bội số của `3` gần `11` nhất là `12` (cách `1`), gần hơn `9` (cách `2`). Khác với `ODD`/`EVEN` vốn chọn hướng cố định ra xa số `0`, `MROUND` luôn chọn bội số **gần nhất**, có thể làm tròn lên hoặc xuống tuỳ trường hợp nào gần hơn.

## Ứng dụng: làm tròn giá bán tới mệnh giá tiền lẻ gần nhất

Sau khi tính giá vốn cộng lợi nhuận, giá bán ra thường lẻ tới từng đồng — không thực tế để niêm yết. Làm tròn tới bội số `500` cho gọn:

```excel
=MROUND(12345,500)
```

{{anh:mr-02-lam-tron-gia-tien}}

Kết quả `12.500` — `12.345` gần `12.500` hơn (cách `155`) so với `12.000` (cách `345`), nên `MROUND` chọn làm tròn lên.

## Ứng dụng: làm tròn giờ chấm công tới từng khối 15 phút

Nhiều nơi tính công theo khối 15 phút thay vì tính chính xác tới từng giây, để đơn giản hoá lúc chấm lương. Quy đổi phút lẻ về khối 15 phút gần nhất:

```excel
=MROUND(SoPhut,15)
```

{{anh:mr-03-lam-tron-gio-cham-cong}}

Nhân viên quét thẻ lúc `8` giờ `7` phút — `MROUND(7,15)` cho `0`, làm tròn xuống thành đúng `8:00`. Nhân viên khác quét lúc `8` giờ `9` phút — `MROUND(9,15)` cho `15`, làm tròn lên thành `8:15`. Chỉ lệch `2` phút thời điểm quét thẻ gốc nhưng đã đủ để rơi sang hai phía khác nhau của mốc giữa (`7,5` phút).

## Lỗi thường gặp: number và multiple khác dấu

`MROUND` yêu cầu `so` và `boi_so` phải **cùng dấu** (cùng dương hoặc cùng âm), hoặc một trong hai bằng `0`. Khác dấu là lỗi ngay lập tức:

```excel
=MROUND(10,-3)
```

{{anh:mr-04-loi-num-khac-dau}}

Kết quả `#NUM!` — không phải vì phép toán vô nghĩa về mặt số học, mà đây là quy tắc Excel cố tình đặt ra để tránh trường hợp mập mờ: làm tròn `10` theo bội số `-3` có thể hiểu là làm tròn tới `9` hoặc `12` tuỳ cách diễn giải dấu, nên Excel chọn báo lỗi thay vì tự đoán. Lỗi này hay gặp nhất khi `boi_so` được lấy từ một ô khác và vô tình chứa dấu trừ, ví dụ do dán nhầm công thức chênh lệch thay vì một hằng số dương.

## Tổng kết

`MROUND` làm tròn một số tới bội số gần nhất của bất kỳ giá trị nào — tổng quát hơn `ODD`/`EVEN` vốn chỉ làm tròn theo bội số `2`. Cần nhớ `so` và `boi_so` phải cùng dấu, nếu không sẽ gặp lỗi `#NUM!` ngay lập tức thay vì một kết quả tự đoán.

Đây là bài cuối trong cụm 5 bài về các hàm toán học chia và làm tròn cơ bản, bắt đầu từ [ABS](/blog/ham-abs-tri-tuyet-doi).
