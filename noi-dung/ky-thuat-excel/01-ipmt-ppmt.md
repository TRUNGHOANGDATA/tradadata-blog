---
tieu_de: "IPMT và PPMT: tách khoản trả góp PMT thành phần lãi và phần gốc"
slug: "ipmt-ppmt-tach-khoan-tra-gop-thanh-lai-va-goc"
danh_muc: "Excel"
the: ["IPMT", "PPMT", "hàm tài chính"]
mo_ta: "PMT cho biết tổng số tiền phải trả mỗi kỳ, nhưng không nói rõ bao nhiêu là lãi, bao nhiêu là gốc. IPMT và PPMT tách đúng hai phần đó cho từng kỳ cụ thể — nền tảng để dựng một bảng lịch trả nợ đầy đủ."
tu_khoa: "ham IPMT Excel, ham PPMT Excel, tach lai va goc, lich tra no Excel, bang khau tru no vay, IPMT PPMT khac PMT"
anh_bia: "/images/bai-viet/ipmt-ppmt/cover.png"
thu_muc_anh: "ipmt-ppmt"
trang_thai: "draft"
---

[PMT](/blog/ham-pmt-tinh-khoan-tra-gop-vay-hang-thang) cho biết mỗi tháng phải trả bao nhiêu, nhưng con số đó là **tổng gộp** — không nói rõ bao nhiêu trong đó là tiền lãi ngân hàng thu, bao nhiêu là tiền gốc bạn thực sự trả bớt nợ. `IPMT` và `PPMT` tách đúng hai phần này cho từng kỳ trả nợ cụ thể.

## Hai hàm, hai phần của cùng một khoản trả

```excel
=IPMT(lai_suat, ky_thu, tong_so_ky, gia_tri_vay)
=PPMT(lai_suat, ky_thu, tong_so_ky, gia_tri_vay)
```

{{anh:ip-01-hai-phan}}

Cú pháp của `IPMT` và `PPMT` giống hệt nhau, chỉ khác mục đích: `IPMT` trả về phần **lãi** phải trả ở kỳ thứ `ky_thu`, còn `PPMT` trả về phần **gốc** phải trả ở đúng kỳ đó. Tham số `ky_thu` là điểm khác biệt so với `PMT` — nó cho biết bạn đang hỏi về kỳ trả nợ **thứ mấy**, vì tỷ lệ lãi/gốc thay đổi theo từng kỳ.

## IPMT cộng PPMT luôn bằng đúng PMT

Đây là mối quan hệ cần nhớ để kiểm tra công thức có đúng không:

```excel
=IPMT(5%/12,1,36,100000000)  →  -416.667
=PPMT(5%/12,1,36,100000000)  →  -2.361.111
=PMT(5%/12,36,100000000)     →  -2.777.778
```

{{anh:ip-02-cong-lai-bang-pmt}}

Ở bất kỳ kỳ nào, `IPMT` + `PPMT` của kỳ đó luôn cho ra đúng con số `PMT`. Nếu cộng lại mà không khớp, gần như chắc chắn tham số `lai_suat`, `tong_so_ky`, hoặc `gia_tri_vay` đang bị khai không nhất quán giữa ba hàm.

## Vì sao lãi giảm dần, gốc tăng dần theo thời gian

Đây là điều thú vị nhất khi dựng cả một lịch trả nợ: dù tổng số tiền trả mỗi tháng (`PMT`) không đổi suốt thời gian vay, tỷ lệ giữa lãi và gốc bên trong nó lại **thay đổi liên tục**:

{{anh:ip-03-lich-tra-no}}

Ở những kỳ đầu, dư nợ còn cao nên tiền lãi tính trên số dư đó cũng cao — phần lớn khoản trả tháng đầu là trả lãi, phần gốc chỉ chiếm một phần nhỏ. Càng về sau, dư nợ giảm dần, tiền lãi giảm theo, nên phần gốc trong mỗi khoản trả ngày càng lớn hơn — dù tổng số tiền trả mỗi tháng vẫn y hệt nhau từ đầu đến cuối. Đây là lý do trả nợ trước hạn ở giai đoạn đầu tiết kiệm được nhiều lãi hơn hẳn so với trả trước hạn ở giai đoạn cuối.

## Dựng một bảng lịch trả nợ đầy đủ

Kéo công thức `IPMT`/`PPMT` xuống theo từng kỳ (1, 2, 3... đến hết `tong_so_ky`), khoá các tham số cố định bằng [`$`](/blog/tham-chieu-tuong-doi-va-tuyet-doi-trong-excel), chỉ để `ky_thu` trượt theo hàng:

```excel
=IPMT($B$1,A2,$B$2,$B$3)
=PPMT($B$1,A2,$B$2,$B$3)
```

Thêm một cột "Dư nợ còn lại" bằng cách trừ dần phần gốc đã trả, bạn có ngay một bảng lịch trả nợ hoàn chỉnh — đúng loại bảng ngân hàng vẫn gửi kèm khi duyệt vay.

## Cùng gặp quy ước dấu âm như PMT

`IPMT` và `PPMT` mang cùng quy ước dấu với `PMT`: kết quả trả về là số **âm**, vì đây là dòng tiền **ra khỏi túi bạn**. Muốn hiển thị số dương cho dễ đọc trên báo cáo, thêm dấu trừ phía trước hoặc bọc trong `ABS()` — [bài về PMT](/blog/ham-pmt-tinh-khoan-tra-gop-vay-hang-thang) đã giải thích kỹ lý do đằng sau quy ước này.

## Kiểm nhanh trên máy bạn

- Tính `IPMT` và `PPMT` cho kỳ đầu tiên và kỳ cuối cùng của một khoản vay, so sánh tỷ lệ lãi/gốc giữa hai kỳ để thấy rõ xu hướng đảo ngược.
- Cộng `IPMT` và `PPMT` của cùng một kỳ, đối chiếu với kết quả `PMT` để chắc chắn cả ba hàm đang dùng đúng cùng bộ tham số.
