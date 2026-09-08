---
tieu_de: "Khấu hao tài sản cố định trong Excel: SLN, DDB và DB khác nhau thế nào"
slug: "khau-hao-tai-san-co-dinh-sln-ddb-db-trong-excel"
danh_muc: "Excel"
the: ["SLN", "DDB", "DB", "khấu hao", "tài sản cố định"]
mo_ta: "So sánh ba phương pháp khấu hao trong Excel — đường thẳng SLN, số dư giảm dần nhanh DDB, số dư giảm dần cố định DB — và vì sao cùng một tài sản lại ra ba con số khấu hao khác nhau mỗi năm."
tu_khoa: "hàm SLN Excel, hàm DDB Excel, hàm DB Excel, khấu hao tài sản cố định, phương pháp khấu hao nhanh, khấu hao đường thẳng"
anh_bia: "/images/bai-viet/khau-hao/cover.png"
thu_muc_anh: "khau-hao"
trang_thai: "draft"
---

Một tài sản cố định mua với giá 100 triệu đồng, dùng trong 5 năm, cuối cùng thanh lý được 10 triệu — tổng số tiền cần phân bổ thành chi phí khấu hao trong 5 năm đó là cố định: 90 triệu. Nhưng **chia 90 triệu đó ra từng năm như thế nào** lại có nhiều cách khác nhau, và cách chọn ảnh hưởng trực tiếp tới lợi nhuận báo cáo mỗi năm — dù tổng cộng 5 năm luôn ra cùng một con số.

Excel có ba hàm dựng sẵn cho ba phương pháp khấu hao phổ biến nhất: `SLN` (đường thẳng — chia đều), `DDB` (số dư giảm dần nhanh), và `DB` (số dư giảm dần cố định). Bài này so sánh cả ba trên cùng một tài sản để thấy rõ chúng khác nhau ở đâu, và vì sao.

## Bộ dữ liệu dùng trong bài

Tài sản cố định: nguyên giá 100 triệu đồng, giá trị thanh lý ước tính 10 triệu đồng, thời gian sử dụng 5 năm.

{{anh:kh-01-du-lieu}}

## SLN — chia đều, đơn giản nhất

```excel
=SLN(cost, salvage, life)
```

`SLN` (straight-line) chia đều phần giá trị hao mòn cho từng năm sử dụng, ra cùng một con số mỗi năm, không đổi:

```excel
=SLN(100000000, 10000000, 5)
```

Kết quả: **18.000.000** mỗi năm, suốt cả 5 năm. Đây là phương pháp dễ hiểu nhất, dễ lập kế hoạch tài chính nhất, và cũng là phương pháp phổ biến nhất trong báo cáo tài chính thông thường vì tính đơn giản và ổn định qua các năm.

## DDB — khấu hao nhanh, giảm dần theo số dư còn lại

```excel
=DDB(cost, salvage, life, period, [factor])
```

`DDB` (double-declining balance) tính khấu hao mỗi năm dựa trên **giá trị còn lại** của tài sản ở đầu năm đó, nhân với một tỷ lệ cố định — mặc định gấp đôi tỷ lệ khấu hao đường thẳng, đúng như tên gọi. Vì tính trên giá trị còn lại đang giảm dần, số tiền khấu hao mỗi năm cũng giảm dần theo.

Với tài sản 5 năm, tỷ lệ mặc định là `2/5 = 40%` mỗi năm:

```excel
=DDB(100000000, 10000000, 5, 1)   ' Năm 1
=DDB(100000000, 10000000, 5, 2)   ' Năm 2
=DDB(100000000, 10000000, 5, 3)   ' Năm 3
```

{{anh:kh-02-ddb-tung-nam}}

Năm 1 khấu hao `40.000.000` (40% của 100 triệu), năm 2 khấu hao `24.000.000` (40% của giá trị còn lại 60 triệu), năm 3 khấu hao `14.400.000` (40% của giá trị còn lại 36 triệu) — mỗi năm giảm dần vì tính trên phần còn lại đang nhỏ đi.

**Một điều dễ gây bất ngờ:** đến năm cuối, `DDB` **tự động giới hạn** để giá trị còn lại của tài sản không tụt xuống dưới giá trị thanh lý đã khai báo. Ở ví dụ này, nếu tính đúng công thức `40%` cho năm 5 sẽ ra một con số kéo giá trị còn lại xuống dưới 10 triệu — Excel tự động cắt bớt, chỉ khấu hao đúng phần chênh lệch còn thiếu để giá trị còn lại dừng lại đúng ở mức giá trị thanh lý, không xuống thấp hơn.

Tham số `factor` (bỏ trống mặc định là `2`) cho phép đổi mức độ "nhanh" của khấu hao — ví dụ `1.5` sẽ khấu hao nhanh hơn đường thẳng nhưng chậm hơn `DDB` chuẩn.

## DB — số dư giảm dần với tỷ lệ cố định tính sẵn

```excel
=DB(cost, salvage, life, period, [month])
```

`DB` (fixed-declining balance) cũng giảm dần theo giá trị còn lại như `DDB`, nhưng khác ở cách xác định tỷ lệ: thay vì lấy gấp đôi tỷ lệ đường thẳng như `DDB`, `DB` tự tính ra một tỷ lệ cố định sao cho khấu hao đủ 5 năm sẽ đưa giá trị còn lại về **gần đúng** mức thanh lý đã khai báo — làm tròn tỷ lệ này tới 3 chữ số thập phân.

```excel
=DB(100000000, 10000000, 5, 1)   ' Năm 1
=DB(100000000, 10000000, 5, 2)   ' Năm 2
```

{{anh:kh-03-db-tung-nam}}

Năm 1 khấu hao xấp xỉ **36.900.000**, năm 2 khấu hao xấp xỉ **23.283.900** — cũng giảm dần, nhưng theo một nhịp độ khác `DDB` vì tỷ lệ nền tảng khác nhau. Vì tỷ lệ đã bị làm tròn tới 3 chữ số thập phân, giá trị còn lại ở cuối năm thứ 5 thường **lệch một chút** so với giá trị thanh lý khai báo ban đầu — không phải lỗi, mà là hệ quả của việc làm tròn.

Tham số `month` là nơi hay bị bỏ qua nhưng quan trọng khi tài sản không mua đúng đầu năm tài chính: nó khai số tháng sử dụng trong **năm đầu tiên**. Bỏ trống, Excel mặc định `12` — coi như tài sản dùng đủ cả năm đầu. Nếu tài sản mua vào giữa năm, ví dụ chỉ dùng 6 tháng trong năm đầu, khai `month=6`, khấu hao năm đầu sẽ tính theo tỷ lệ 6/12 của mức thông thường, và năm cuối cùng của vòng đời tài sản được kéo dài thêm để bù đủ số tháng còn thiếu.

## Đặt cả ba phương pháp cạnh nhau

Nhìn cả 5 năm cùng lúc mới thấy rõ khác biệt thực sự giữa ba phương pháp:

{{anh:kh-04-so-sanh-ca-3}}

| Năm | SLN | DDB | DB |
|---|---|---|---|
| 1 | 18.000.000 | 40.000.000 | 36.900.000 |
| 2 | 18.000.000 | 24.000.000 | 23.283.900 |
| 3 | 18.000.000 | 14.400.000 | 14.690.100 |
| 4 | 18.000.000 | 8.640.000 | 9.271.500 |
| 5 | 18.000.000 | 2.960.000 | 5.850.300 |
| **Tổng** | **90.000.000** | **90.000.000** | **~90.000.000** |

Cả ba đều cộng dồn về đúng 90 triệu (phần chênh lệch nhỏ ở `DB` do làm tròn tỷ lệ như đã nói ở trên) — không phương pháp nào khấu hao nhiều hơn hay ít hơn tổng số tiền thực tế đã hao mòn. Khác biệt duy nhất là **thời điểm** ghi nhận chi phí đó: `SLN` trải đều, còn `DDB` và `DB` dồn phần lớn chi phí vào những năm đầu, giảm dần về sau.

## Chọn phương pháp nào

Không có phương pháp nào "đúng" tuyệt đối — lựa chọn tuỳ vào mục đích sử dụng con số:

- **`SLN`** phù hợp khi muốn báo cáo lợi nhuận ổn định, dễ so sánh giữa các năm, và là lựa chọn mặc định phổ biến nhất trong kế toán tài chính thông thường.
- **`DDB`** và **`DB`** phù hợp với tài sản mất giá trị sử dụng nhanh trong những năm đầu — ví dụ máy móc công nghệ, thiết bị điện tử — vì phản ánh đúng thực tế hao mòn nhanh hơn so với đường thẳng. Đồng thời, việc ghi nhận nhiều chi phí hơn ở các năm đầu cũng làm giảm lợi nhuận chịu thuế trong giai đoạn đó nhiều hơn so với đường thẳng.

Vì khấu hao ảnh hưởng trực tiếp tới chi phí được trừ khi tính thuế thu nhập doanh nghiệp, phương pháp và khung thời gian khấu hao cho từng loại tài sản thường phải tuân theo quy định kế toán - thuế hiện hành, không phải muốn chọn phương pháp nào cũng được tự do áp dụng cho báo cáo thuế chính thức. Ba hàm trong bài phù hợp để lập kế hoạch, so sánh phương án, hoặc dùng cho báo cáo quản trị nội bộ; khi lập báo cáo thuế chính thức, nên đối chiếu với văn bản quy định đang áp dụng cho loại tài sản cụ thể.

## Tổng kết

`SLN`, `DDB` và `DB` cùng phân bổ một số tiền khấu hao tổng như nhau trong suốt vòng đời tài sản, chỉ khác nhau ở việc dồn phần lớn chi phí đó vào giai đoạn nào. `SLN` chia đều mỗi năm một số tiền cố định; `DDB` và `DB` dồn nhiều hơn vào những năm đầu rồi giảm dần, khác nhau ở cách xác định tỷ lệ giảm dần đó.

Đây cũng là bài cuối trong cụm 5 bài về hàm tài chính Excel. Xem lại từ đầu: [PMT: tính khoản trả góp vay hàng tháng](/blog/ham-pmt-tinh-khoan-tra-gop-vay-hang-thang), [FV và PV: giá trị tương lai và hiện tại](/blog/ham-fv-pv-gia-tri-tuong-lai-va-hien-tai), [NPV và IRR: đánh giá dự án đầu tư](/blog/ham-npv-irr-danh-gia-du-an-dau-tu), và [RATE và NPER: tìm lãi suất thực và thời gian trả hết nợ](/blog/ham-rate-nper-tim-lai-suat-thuc-va-thoi-gian-tra-no).
