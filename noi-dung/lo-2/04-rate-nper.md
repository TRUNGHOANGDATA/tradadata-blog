---
tieu_de: "RATE và NPER: tìm lãi suất thực và thời gian trả hết nợ"
slug: "ham-rate-nper-tim-lai-suat-thuc-va-thoi-gian-tra-no"
danh_muc: "Excel"
the: ["RATE", "NPER", "hàm tài chính", "lãi suất thực", "trả góp"]
mo_ta: "Dùng RATE để lật tẩy lãi suất thực đằng sau chương trình trả góp 0% lãi, và NPER để tính cần bao nhiêu tháng mới trả hết một khoản vay."
tu_khoa: "hàm RATE Excel, hàm NPER Excel, lãi suất thực trả góp 0 phần trăm, tính số tháng trả nợ, RATE trả góp"
anh_bia: "/images/bai-viet/ham-rate-nper/cover.png"
thu_muc_anh: "ham-rate-nper"
trang_thai: "draft"
---

Ba bài trước đã đi qua bốn trong năm biến số quan hệ chặt với nhau trong mọi bài toán vay - trả góp: lãi suất mỗi kỳ, số kỳ trả, khoản trả mỗi kỳ, và số tiền vay. Biết bốn trong số này, Excel tính ra biến còn lại — đó chính xác là việc `PMT`, `FV`, `PV` đã làm ở các bài trước.

`RATE` và `NPER` hoàn thiện nốt bộ năm biến số đó. `RATE` tìm ra lãi suất khi đã biết số tiền vay, khoản trả mỗi kỳ và số kỳ. `NPER` tìm ra cần bao nhiêu kỳ khi đã biết lãi suất, khoản trả mỗi kỳ và số tiền vay. Cả hai đều hữu ích nhất khi cần **lật ngược** một tình huống đã biết sẵn kết quả để tìm ra thứ đứng sau nó.

Công thức viết bằng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác. Quy ước dấu giữ nguyên như các bài trước: dòng tiền chi ra mang dấu âm, dòng tiền nhận vào mang dấu dương.

## RATE — lật tẩy lãi suất thực đằng sau "trả góp 0% lãi suất"

```excel
=RATE(nper, pmt, pv, [fv], [type], [guess])
```

Đây là ứng dụng thực tế nhất của `RATE`: nhiều chương trình trả góp quảng cáo "lãi suất 0%" nhưng thu thêm một khoản phí ngay từ đầu — gọi là phí hồ sơ, phí dịch vụ, phí thẩm định. Khoản phí đó thực chất là lãi suất, chỉ đổi tên và đổi cách thu để tránh gọi thẳng là lãi.

Ví dụ: một cửa hàng bán điện thoại giá 24 triệu đồng, trả góp 12 tháng "lãi suất 0%", nhưng thu ngay một khoản phí hồ sơ 1,2 triệu đồng khi ký hợp đồng. Mỗi tháng vẫn trả đúng `24.000.000 / 12 = 2.000.000`.

{{anh:rn-01-du-lieu-tra-gop-0}}

Nhìn qua, "0% lãi suất" nghĩa là không phải trả thêm gì ngoài giá gốc. Nhưng vì phí 1,2 triệu đã thu ngay từ đầu, số tiền bạn **thực sự được vay** chỉ còn `24.000.000 - 1.200.000 = 22.800.000`, trong khi vẫn phải trả đủ `2.000.000` mỗi tháng như thể vay đủ 24 triệu. Chênh lệch đó chính là lãi suất ẩn.

```excel
=RATE(12, -2000000, 22800000)
```

{{anh:rn-02-rate-that}}

Kết quả xấp xỉ **0,8%/tháng** — tương đương gần **9,6%/năm** nếu nhân đơn giản với 12. Con số này hoàn toàn khác với ấn tượng "0% lãi suất" ban đầu. Đây là lý do nên luôn quy đổi mọi chương trình trả góp có phí kèm theo về cùng một lãi suất thực bằng `RATE`, thay vì tin theo con số phần trăm được quảng cáo — hai chương trình cùng ghi "0%" nhưng mức phí khác nhau có thể có lãi suất thực chênh nhau rất xa.

Lưu ý dấu ở đây: `pmt` nhập âm (`-2000000`) vì đó là khoản bạn **chi ra** mỗi tháng, còn `pv` nhập dương (`22800000`) vì đó là khoản bạn **nhận được** (giá trị hàng hoá thực nhận sau khi trừ phí) — đúng quy ước đã dùng xuyên suốt cụm bài.

## NPER — cần bao nhiêu kỳ mới trả hết nợ

```excel
=NPER(rate, pmt, pv, [fv], [type])
```

Tình huống ngược lại: biết lãi suất, biết số tiền vay, và biết khả năng trả mỗi tháng của mình — nhưng chưa biết sẽ mất bao lâu để trả hết.

Ví dụ: vay 300 triệu đồng, lãi suất 9%/năm, khả năng trả mỗi tháng tối đa là 6 triệu đồng.

```excel
=NPER(9%/12, -6000000, 300000000)
```

{{anh:rn-03-nper}}

Kết quả xấp xỉ **63 tháng**, tức hơn 5 năm. Chú ý `rate` đã chia cho 12 để khớp đơn vị tháng với `pmt` trả hàng tháng — đúng nguyên tắc "đơn vị của `rate` và `nper` phải khớp nhau" đã nói từ bài `PMT`.

Ứng dụng thực tế của `NPER`: khi ngân hàng đưa ra một mức trả góp tối đa mà thu nhập của bạn cho phép, `NPER` cho biết chính xác cần cam kết bao lâu, thay vì chỉ áng chừng. Tăng khoản trả mỗi tháng lên bao nhiêu thì rút ngắn được bao nhiêu tháng cũng là câu hỏi trả lời được ngay bằng cách đổi `pmt` rồi tính lại.

## Vì sao RATE đôi khi cần tham số guess

`RATE` không có công thức đại số đóng để giải trực tiếp ra lãi suất — Excel phải dò tìm bằng phương pháp lặp, bắt đầu từ một điểm khởi đầu gọi là `guess`. Bỏ trống, Excel tự lấy `10%` làm điểm xuất phát.

Với hầu hết bài toán vay - trả góp thông thường, mặc định `10%` là đủ để `RATE` hội tụ về đúng nghiệm. Nhưng với những trường hợp lãi suất thực chênh lệch rất xa so với `10%` — ví dụ khoản phí quá cao khiến lãi suất thực vọt lên rất lớn, hoặc ngược lại rất nhỏ gần bằng 0 — Excel có thể trả về lỗi `#NUM!` vì phép lặp không hội tụ từ điểm xuất phát mặc định. Khi đó, truyền thêm một giá trị `guess` gần với khoảng lãi suất bạn ước lượng bằng trực giác, ví dụ `RATE(12, -2000000, 22800000, 0, 0, 2%)`, thường giúp Excel tìm ra nghiệm.

## Đặt cả 5 hàm cạnh nhau

Cả cụm bài này xoay quanh cùng một mối quan hệ giữa 5 biến số: lãi suất mỗi kỳ, số kỳ, khoản trả mỗi kỳ, số tiền vay ở hiện tại, và số dư còn lại ở tương lai. Biết 4 trong 5, Excel luôn tính ra biến còn lại bằng đúng một hàm tương ứng:

| Muốn tìm | Đã biết | Hàm dùng |
|---|---|---|
| Khoản trả mỗi kỳ | lãi suất, số kỳ, số tiền vay | `PMT` |
| Số tiền vay tối đa có thể vay | lãi suất, số kỳ, khoản trả mỗi kỳ | `PV` |
| Số dư trong tương lai | lãi suất, số kỳ, khoản gửi mỗi kỳ | `FV` |
| Lãi suất thực | số kỳ, khoản trả mỗi kỳ, số tiền vay | `RATE` |
| Số kỳ cần để trả hết | lãi suất, khoản trả mỗi kỳ, số tiền vay | `NPER` |

Nhìn theo bảng này, cả 5 hàm không phải 5 công cụ rời rạc — chúng là 5 cách hỏi khác nhau về cùng một phương trình. Nhớ được mối quan hệ này quan trọng hơn nhớ thuộc lòng cú pháp từng hàm, vì nó giúp nhận ra ngay nên dùng hàm nào khi gặp một bài toán vay - trả góp mới, chỉ cần xác định "cái gì đã biết, cái gì cần tìm".

## Tổng kết

`RATE` và `NPER` hoàn thiện bộ 5 hàm tài chính xoay quanh quan hệ giữa lãi suất, số kỳ, khoản trả mỗi kỳ và số tiền vay. `RATE` có giá trị thực tế lớn nhất ở việc lật tẩy lãi suất thực đằng sau các chương trình trả góp có phí ẩn — một khoản phí thu trước tưởng vô hại có thể tương đương một mức lãi suất hai chữ số mỗi năm. `NPER` giúp biết chính xác cần cam kết bao lâu với một khả năng trả góp cho trước, thay vì áng chừng.

Cả 5 hàm — `PMT`, `PV`, `FV`, `RATE`, `NPER` — cùng xoay quanh một phương trình duy nhất, chỉ khác biến nào là ẩn số cần tìm. Xem lại từ đầu: [PMT: tính khoản trả góp vay hàng tháng](/blog/ham-pmt-tinh-khoan-tra-gop-vay-hang-thang), [FV và PV: giá trị tương lai và hiện tại](/blog/ham-fv-pv-gia-tri-tuong-lai-va-hien-tai), và khi cần đánh giá một dự án nhiều dòng tiền thay vì một khoản vay đơn giản, xem [NPV và IRR: đánh giá dự án đầu tư](/blog/ham-npv-irr-danh-gia-du-an-dau-tu).
