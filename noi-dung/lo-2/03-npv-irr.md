---
tieu_de: "NPV và IRR: đánh giá dự án đầu tư có đáng làm hay không"
slug: "ham-npv-irr-danh-gia-du-an-dau-tu"
danh_muc: "Excel"
the: ["NPV", "IRR", "hàm tài chính", "đánh giá dự án đầu tư"]
mo_ta: "Cách dùng NPV và IRR để đánh giá một dự án đầu tư có nhiều dòng tiền qua các năm, và lỗi phổ biến nhất: đưa vốn đầu tư ban đầu vào sai vị trí trong công thức NPV."
tu_khoa: "hàm NPV Excel, hàm IRR Excel, đánh giá dự án đầu tư, NPV vốn đầu tư ban đầu, tỷ suất hoàn vốn nội bộ"
anh_bia: "/images/bai-viet/ham-npv-irr/cover.png"
thu_muc_anh: "ham-npv-irr"
trang_thai: "draft"
---

Bài trước đã nói về `PV` — quy một khoản tiền tương lai **duy nhất** về giá trị hiện tại. Một dự án đầu tư thực tế hiếm khi chỉ có một dòng tiền: có vốn bỏ ra ban đầu, rồi có dòng tiền thu về ở nhiều năm liên tiếp, mỗi năm một con số khác nhau. `NPV` và `IRR` là hai hàm được thiết kế riêng cho đúng bài toán đó.

Cả hai hàm đều trả lời câu hỏi "dự án này có đáng làm không", chỉ khác cách diễn đạt câu trả lời. Và cả hai đều có một điểm dễ gây lỗi nhất khi mới dùng: cách đưa vốn đầu tư ban đầu vào công thức khác nhau giữa hai hàm, dùng lẫn cách này cho hàm kia sẽ ra kết quả sai.

Công thức viết bằng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Bộ dữ liệu dùng trong bài

Một dự án cần vốn đầu tư ban đầu 200 triệu đồng, dự kiến thu về dòng tiền dương trong 4 năm tiếp theo: 60, 70, 80, 90 triệu đồng. Mức lãi suất chiết khấu tham chiếu là 10%/năm — đây là mức lợi nhuận tối thiểu nhà đầu tư chấp nhận được, thường lấy từ chi phí vốn hoặc lãi suất của phương án đầu tư thay thế.

{{anh:npv-01-du-lieu}}

## NPV — quy toàn bộ dòng tiền về hiện tại rồi cộng lại

```excel
=NPV(rate, value1, [value2], ...)
```

`NPV` nhận một dãy các dòng tiền, chiết khấu từng dòng về hiện tại theo `rate`, rồi cộng lại thành một số duy nhất. Nếu số đó dương, tổng giá trị thu về (đã quy đổi) lớn hơn những gì bỏ ra; dự án đáng làm ở mức lãi suất chiết khấu đó.

Điểm quan trọng nhất, và cũng là nguồn lỗi phổ biến nhất: **`NPV` mặc định coi dòng tiền đầu tiên trong danh sách xảy ra ở cuối kỳ thứ nhất, không phải ở thời điểm hiện tại (kỳ thứ 0).** Vốn đầu tư ban đầu bỏ ra ngay bây giờ — ở kỳ 0 — nên **không được đưa vào bên trong `NPV`**. Nó phải cộng vào **sau khi** hàm `NPV` đã tính xong.

```excel
=-200000000 + NPV(10%, 60000000, 70000000, 80000000, 90000000)
```

{{anh:npv-02-cong-thuc-dung}}

Đọc theo cấu trúc: `NPV(10%, ...)` chỉ chiết khấu 4 dòng tiền thu về của 4 năm sau. Vốn đầu tư `-200000000` cộng vào ở ngoài, không bị chiết khấu, vì nó đã ở đúng thời điểm hiện tại rồi — chiết khấu thêm một lần nữa cho nó là sai.

Kết quả xấp xỉ **34 triệu đồng**, một số dương — nghĩa là ở mức chiết khấu 10%/năm, dự án này đáng làm.

## Lỗi phổ biến: nhét vốn đầu tư ban đầu vào trong NPV

Cách viết sai thường gặp:

```excel
=NPV(10%, -200000000, 60000000, 70000000, 80000000, 90000000)
```

{{anh:npv-03-loi-von-dau-tu}}

Nhìn qua có vẻ hợp lý — liệt kê đủ cả vốn đầu tư lẫn dòng tiền thu về trong cùng một hàm. Nhưng vì `NPV` coi giá trị đầu tiên trong danh sách là dòng tiền của **kỳ 1**, không phải kỳ 0, công thức này đã chiết khấu luôn cả khoản vốn đầu tư về một kỳ trước đó — tức là tính như thể tiền bỏ ra ở năm trước khi dự án bắt đầu, chứ không phải ngay lúc bắt đầu. Kết quả sai lệch, dù không sai cú pháp nên Excel không báo lỗi gì.

Cách kiểm tra nhanh xem công thức có viết đúng không: đếm số giá trị dòng tiền nằm **trong** dấu ngoặc của `NPV` — con số đó phải đúng bằng số kỳ **sau** thời điểm hiện tại, không nhiều hơn.

## IRR — quy ước ngược lại với NPV

`IRR` trả lời cùng câu hỏi nhưng theo một cách khác: thay vì cho trước lãi suất và tính ra một giá trị tiền, `IRR` đi tìm mức lãi suất khiến `NPV` của toàn bộ dự án đúng bằng **0** — gọi là tỷ suất hoàn vốn nội bộ.

```excel
=IRR(values, [guess])
```

Điểm khác biệt quan trọng cần nhớ: **`IRR` nhận vốn đầu tư ban đầu ngay bên trong cùng một dãy giá trị**, khác hẳn cách `NPV` yêu cầu tách nó ra ngoài.

```excel
=IRR(A1:A5)
```

{{anh:npv-04-irr}}

Trong đó `A1:A5` là 5 ô liên tiếp: `-200000000` ở `A1` (vốn đầu tư, kỳ 0), rồi `60000000`, `70000000`, `80000000`, `90000000` ở các kỳ tiếp theo. Đây chính là cấu trúc từng bị coi là sai khi dùng cho `NPV` ở trên — nhưng lại là cấu trúc **đúng** cho `IRR`. Dùng lẫn quy ước của hàm này cho hàm kia là lỗi thực tế phổ biến nhất khi mới chuyển từ `NPV` sang `IRR` hoặc ngược lại.

Kết quả `IRR` cho dữ liệu trên xấp xỉ **17%**. Cách đọc: dự án này tự nó sinh lời với tỷ suất khoảng 17%/năm.

## Đọc kết quả: so sánh IRR với mức lãi suất yêu cầu

`NPV` và `IRR` đưa ra cùng một kết luận, chỉ khác cách trình bày:

- `NPV` dương ở một mức lãi suất chiết khấu cho trước → dự án đáng làm ở mức đó.
- `IRR` cao hơn mức lãi suất yêu cầu tối thiểu (thường gọi là *hurdle rate*) → dự án đáng làm.

Với ví dụ trên: `NPV` ở mức chiết khấu 10% ra số dương (~34 triệu), và `IRR` (~17%) cao hơn 10% — hai cách tính đồng thuận với nhau, dự án này vượt qua ngưỡng sinh lời yêu cầu.

Điểm mạnh thực tế của `IRR` là không cần biết chính xác mức lãi suất chiết khấu trước khi tính — nó tự tìm ra mức lãi suất "hoà vốn" của dự án, rồi người đọc mới đem so với ngưỡng của riêng mình. Ngược lại, `NPV` cho biết đúng con số tiền chênh lệch, hữu ích hơn khi cần so sánh **quy mô** giữa các dự án khác nhau — hai dự án có thể cùng `IRR` nhưng chênh lệch rất xa về số tiền tạo ra thực tế.

## Khi IRR báo lỗi hoặc cho kết quả không tin cậy

`IRR` yêu cầu dãy dòng tiền phải có **ít nhất một giá trị âm và một giá trị dương** — hợp lý, vì nếu toàn bộ đều dương hoặc toàn bộ đều âm thì không tồn tại mức lãi suất nào làm `NPV` bằng 0. Thiếu điều kiện này, `IRR` trả về lỗi `#NUM!`.

Một trường hợp khác cần cẩn thận: nếu dòng tiền của dự án **đổi dấu nhiều lần** — ví dụ âm, dương, rồi lại âm (như một dự án cần đầu tư bổ sung giữa chừng) — có thể tồn tại **nhiều hơn một** mức lãi suất làm `NPV` bằng 0, và `IRR` chỉ trả về một trong số đó, không báo cho biết còn nghiệm khác. Với dòng tiền đổi dấu nhiều lần, nên đối chiếu thêm bằng `NPV` ở vài mức lãi suất khác nhau thay vì tin tuyệt đối vào một con số `IRR` duy nhất.

Tham số `guess` (bỏ trống thì Excel tự dùng `10%` làm điểm xuất phát) là nơi Excel bắt đầu dò tìm nghiệm bằng phương pháp lặp. Với dòng tiền phức tạp mà `IRR` báo lỗi `#NUM!` dù chắc chắn có đổi dấu, thử truyền một giá trị `guess` khác — ví dụ `IRR(A1:A5, 20%)` — đôi khi giúp Excel tìm ra nghiệm mà điểm xuất phát mặc định bỏ lỡ.

## Tổng kết

`NPV` và `IRR` cùng trả lời một câu hỏi — dự án này có đáng làm không — nhưng có quy ước đưa vốn đầu tư ban đầu vào công thức khác hẳn nhau: `NPV` yêu cầu tách vốn đầu tư ra ngoài và cộng riêng, còn `IRR` yêu cầu đưa nó vào ngay đầu dãy giá trị. Nhầm lẫn giữa hai quy ước này là lỗi phổ biến nhất, và nó không gây lỗi cú pháp — chỉ ra một con số sai mà nhìn qua vẫn có vẻ hợp lý.

`NPV` cho biết số tiền chênh lệch thực tế ở một mức lãi suất cụ thể; `IRR` cho biết dự án tự sinh lời ở mức bao nhiêu phần trăm, không cần biết trước mức lãi suất chiết khấu. Dùng cả hai cùng lúc để đối chiếu là cách chắc chắn nhất, đặc biệt với dòng tiền có đổi dấu nhiều lần.

Đọc tiếp trong cùng cụm bài: nguyên lý quy dòng tiền về hiện tại đã nói ở [FV và PV: giá trị tương lai và hiện tại của một khoản tiền](/blog/ham-fv-pv-gia-tri-tuong-lai-va-hien-tai) chính là nền tảng của `NPV`. Và khi cần tìm ngược lại lãi suất thực hoặc thời gian trả nợ từ một khoản vay đã biết trước khoản trả góp, xem [RATE và NPER: tìm lãi suất thực và thời gian trả hết nợ](/blog/ham-rate-nper-tim-lai-suat-thuc-va-thoi-gian-tra-no).
