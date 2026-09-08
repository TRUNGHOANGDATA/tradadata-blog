---
tieu_de: "Hàm PMT: tính khoản trả góp vay hàng tháng, và lỗi dấu âm ai cũng gặp"
slug: "ham-pmt-tinh-khoan-tra-gop-vay-hang-thang"
danh_muc: "Excel"
the: ["PMT", "hàm tài chính", "trả góp", "vay ngân hàng"]
mo_ta: "Cách dùng hàm PMT để tính khoản trả góp hàng tháng khi vay mua nhà, mua xe, và vì sao kết quả PMT luôn ra số âm."
tu_khoa: "hàm PMT, tính trả góp Excel, PMT trả góp ngân hàng, PMT âm, công thức trả góp vay"
anh_bia: "/images/bai-viet/ham-pmt/cover.png"
thu_muc_anh: "ham-pmt"
trang_thai: "draft"
---

Vay mua nhà, mua xe, hay vay tiêu dùng trả góp — câu hỏi đầu tiên luôn là: mỗi tháng phải trả bao nhiêu? Ngân hàng có bảng tính riêng, nhưng Excel có sẵn một hàm làm đúng việc này chỉ trong một dòng công thức: `PMT`.

Hàm này không khó dùng, nhưng có một điều gây bối rối gần như 100% người dùng lần đầu: **kết quả luôn ra số âm**. Bài này giải thích vì sao, cùng với cách đọc đúng các tham số để không tính nhầm.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp và một ví dụ cụ thể

```excel
=PMT(rate, nper, pv, [fv], [type])
```

- `rate` — lãi suất của **một kỳ trả**, không phải lãi suất năm.
- `nper` — tổng số kỳ trả, tính bằng đúng đơn vị kỳ của `rate`.
- `pv` — số tiền vay (present value — giá trị ở thời điểm hiện tại).
- `fv` — số tiền còn nợ lại sau khi trả hết `nper` kỳ, thường bỏ trống vì mặc định là `0` (trả hết nợ).
- `type` — `0` (mặc định, trả cuối kỳ) hoặc `1` (trả đầu kỳ).

Ví dụ: vay 500 triệu đồng, lãi suất 8%/năm, trả góp đều trong 5 năm, mỗi tháng trả một lần.

```excel
=PMT(8%/12, 5*12, 500000000)
```

{{anh:pmt-01-cong-thuc-co-ban}}

Kết quả xấp xỉ **-10.137.000**. Đúng số tiền cần trả mỗi tháng — nhưng vì sao lại có dấu trừ?

## Vì sao PMT luôn ra số âm

Đây là điều quan trọng nhất cần hiểu trước khi dùng bất kỳ hàm tài chính nào của Excel, không riêng `PMT`: cả nhóm hàm này (`PMT`, `PV`, `FV`, `RATE`, `NPER`) dùng chung một quy ước dấu — **tiền nhận vào mang dấu dương, tiền chi ra mang dấu âm**, nhìn từ góc độ của người đang thực hiện phép tính.

Khi vay tiền, bạn **nhận** khoản vay — đó là dòng tiền dương, nên `pv` trong công thức trên nhập là số dương (`500000000`). Nhưng mỗi tháng bạn phải **trả** — đó là dòng tiền chi ra, nên Excel trả về `PMT` là số âm để phản ánh đúng bản chất: tiền đang đi ra khỏi túi bạn.

{{anh:pmt-02-quy-uoc-dau}}

Không phải Excel tính sai. Nó đang mô tả đúng chiều dòng tiền. Vấn đề chỉ là khi lập bảng theo dõi trả nợ, nhìn thấy số âm giữa các số dương khác thường gây khó chịu.

## Hai cách lấy số dương mà không tính sai

**Cách 1 — thêm dấu trừ trước cả hàm:**

```excel
=-PMT(8%/12, 5*12, 500000000)
```

Đảo dấu kết quả cuối cùng, không đụng vào cách hiểu bên trong công thức. Đây là cách phổ biến nhất và ít gây nhầm lẫn nhất khi đọc lại công thức sau này.

**Cách 2 — nhập `pv` là số âm:**

```excel
=PMT(8%/12, 5*12, -500000000)
```

{{anh:pmt-03-hai-cach-ra-duong}}

Cách này đổi góc nhìn: coi khoản vay là dòng tiền **chi ra** từ phía ngân hàng (ngân hàng bỏ tiền ra cho bạn vay), nên `pv` âm, và khoản bạn trả về mỗi tháng trở thành dòng tiền **dương** từ góc nhìn đó. Về mặt số học hai cách cho cùng một kết quả dương; khác nhau ở cách diễn giải dấu, không phải cách tính.

Dùng cách nào cũng được, miễn nhất quán trong cùng một bảng tính — trộn lẫn hai cách trong các công thức liên quan đến nhau là nguồn lỗi dấu khó phát hiện nhất.

## Lỗi hay gặp: quên đổi lãi suất năm sang lãi suất kỳ

Đây là lỗi phổ biến thứ hai, và nó không gây lỗi cú pháp — Excel vẫn tính ra một con số, chỉ là con số sai hoàn toàn.

Ngân hàng luôn niêm yết lãi suất theo **năm**. Nhưng nếu bạn trả góp theo **tháng**, tham số `rate` của `PMT` phải là lãi suất của **một tháng**, không phải lãi suất năm.

```excel
=PMT(8%, 5*12, 500000000)
```

{{anh:pmt-04-quen-chia-12}}

Công thức này quên chia lãi suất năm cho 12. Excel hiểu nhầm rằng mỗi kỳ trả có lãi suất 8% — cao gấp 12 lần thực tế — và trả về một khoản trả góp lớn hơn thực tế rất nhiều, dù cú pháp hoàn toàn hợp lệ.

**Nguyên tắc bắt buộc phải nhớ: đơn vị của `rate` và đơn vị của `nper` phải khớp nhau.** Trả theo tháng thì `rate` là lãi suất tháng (`lãi_suất_năm/12`) và `nper` là tổng số tháng (`số_năm*12`). Trả theo quý thì chia cho 4 và nhân cho 4. Sai một trong hai vế, kết quả sai theo cả một hệ số nhân, không phải sai lệch nhỏ dễ nhận ra.

## Tính tổng số tiền lãi phải trả

Một câu hỏi thực tế hay đi kèm: vay 500 triệu, tổng cộng phải trả bao nhiêu tiền lãi trong suốt thời gian vay?

```excel
=PMT(8%/12, 5*12, 500000000) * 5*12 - 500000000
```

Đọc theo từng bước: `PMT(...) * 5*12` là tổng số tiền đã trả sau toàn bộ 60 tháng (khoản trả mỗi tháng nhân với số tháng). Trừ đi số tiền gốc đã vay (`500000000`), phần còn lại chính là tổng lãi. Vì `PMT` trả về số âm, kết quả phép trừ này cũng ra số âm — muốn hiển thị số dương thì bọc thêm dấu trừ như cách đã nói ở trên, hoặc dùng giá trị tuyệt đối bằng hàm `ABS`.

{{anh:pmt-05-tong-lai}}

So sánh con số này giữa các gói vay khác nhau (lãi suất khác nhau, hoặc thời hạn vay khác nhau) là cách nhìn thực chất hơn nhiều so với chỉ so sánh số tiền trả mỗi tháng — vay thời hạn dài hơn luôn làm khoản trả mỗi tháng thấp hơn, nhưng thường kéo theo tổng lãi phải trả cao hơn.

## Tham số type: trả cuối kỳ hay đầu kỳ

Tham số cuối cùng, thường bị bỏ qua vì ít khi cần đổi, quyết định thời điểm trả trong mỗi kỳ:

- `0` (mặc định, có thể bỏ trống) — trả vào **cuối** mỗi kỳ. Đúng với hầu hết khoản vay ngân hàng thông thường.
- `1` — trả vào **đầu** mỗi kỳ. Thường gặp ở hợp đồng thuê nhà, thuê tài sản, nơi tiền thuê được trả trước khi bắt đầu kỳ sử dụng.

Chênh lệch giữa hai chế độ này không lớn nhưng có thật, vì trả sớm hơn một chút nghĩa là số dư nợ giảm sớm hơn, kéo theo lãi tính trên phần dư nợ đó cũng giảm theo. Với khoản vay giá trị lớn hoặc lãi suất cao, chênh lệch này đủ để đáng tính riêng bằng cách đổi `type` thành `1` và so sánh kết quả.

## Tổng kết

`PMT` tính đúng khoản trả góp mỗi kỳ, nhưng luôn trả về số âm vì Excel đang mô tả đúng chiều dòng tiền — bạn nhận khoản vay (dương) rồi trả dần (âm). Thêm dấu trừ trước cả hàm là cách gọn nhất để lấy số dương mà không làm sai bản chất phép tính.

Lỗi thực tế hay gặp nhất không phải dấu, mà là quên đổi lãi suất năm sang lãi suất đúng kỳ trả — `rate` và `nper` bắt buộc phải cùng đơn vị thời gian, sai một trong hai là sai cả kết quả theo một hệ số nhân, không phải sai lệch nhỏ.

Đọc tiếp trong cùng cụm bài: khi cần tính ngược lại — biết khoản trả mỗi tháng, muốn tìm lãi suất thực hoặc thời gian trả hết nợ — xem [RATE và NPER: tìm lãi suất thực và thời gian trả hết nợ](/blog/ham-rate-nper-tim-lai-suat-thuc-va-thoi-gian-tra-no). Và khi cần biết một khoản tiền hôm nay đáng giá bao nhiêu trong tương lai, hoặc ngược lại, xem [FV và PV: giá trị tương lai và hiện tại của một khoản tiền](/blog/ham-fv-pv-gia-tri-tuong-lai-va-hien-tai).
