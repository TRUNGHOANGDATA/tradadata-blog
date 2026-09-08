---
tieu_de: "FV và PV: giá trị tương lai và hiện tại của một khoản tiền"
slug: "ham-fv-pv-gia-tri-tuong-lai-va-hien-tai"
danh_muc: "Excel"
the: ["FV", "PV", "hàm tài chính", "tiết kiệm", "đầu tư"]
mo_ta: "Cách dùng FV để biết một khoản tiết kiệm sẽ lớn thành bao nhiêu sau nhiều năm, và PV để biết một khoản tiền tương lai đáng giá bao nhiêu ở hiện tại."
tu_khoa: "hàm FV Excel, hàm PV Excel, giá trị tương lai, giá trị hiện tại, tính lãi kép Excel, chiết khấu dòng tiền"
anh_bia: "/images/bai-viet/ham-fv-pv/cover.png"
thu_muc_anh: "ham-fv-pv"
trang_thai: "draft"
---

100 triệu đồng hôm nay và 100 triệu đồng nhận sau 5 năm không có giá trị như nhau — đây là nguyên lý cơ bản nhất của tài chính: tiền có giá trị theo thời gian, vì tiền hôm nay đem gửi tiết kiệm hay đầu tư sẽ sinh lời, còn tiền tương lai thì chưa sinh lời gì cả tính đến thời điểm hiện tại.

`FV` và `PV` là hai hàm dùng để định lượng chính xác sự khác biệt đó. `FV` trả lời câu hỏi: một khoản tiền hôm nay, hoặc một khoản gửi đều đặn, sẽ lớn thành bao nhiêu sau một số năm. `PV` trả lời câu hỏi ngược lại: một khoản tiền nhận được trong tương lai, quy về hôm nay thì đáng giá bao nhiêu.

Bài này dùng chung quy ước dấu đã nói ở [bài về hàm PMT](/blog/ham-pmt-tinh-khoan-tra-gop-vay-hang-thang): tiền nhận vào mang dấu dương, tiền chi ra mang dấu âm. Công thức viết bằng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## FV — một khoản tiền gửi một lần sẽ lớn thành bao nhiêu

Cú pháp:

```excel
=FV(rate, nper, pmt, [pv], [type])
```

- `rate` — lãi suất của một kỳ.
- `nper` — tổng số kỳ.
- `pmt` — khoản gửi thêm đều đặn mỗi kỳ, `0` nếu không gửi thêm.
- `pv` — khoản tiền gửi một lần ban đầu.
- `type` — `0` (mặc định) hoặc `1`, giống hệt ý nghĩa ở `PMT`.

Ví dụ: gửi tiết kiệm 200 triệu đồng, lãi suất 6%/năm, không rút không gửi thêm, sau 10 năm được bao nhiêu?

```excel
=FV(6%, 10, 0, -200000000)
```

{{anh:fvpv-01-fv-mot-lan}}

Kết quả xấp xỉ **358.170.000**. Chú ý `pv` nhập là số **âm** — vì đây là khoản tiền bạn **gửi ra** (chi ra khỏi túi để đưa vào tài khoản tiết kiệm), nên mang dấu âm theo đúng quy ước đã nói ở bài trước. Kết quả `FV` ra số dương vì đó là khoản tiền bạn sẽ **nhận lại** trong tương lai.

## FV — cộng thêm khoản gửi đều đặn mỗi kỳ

Thực tế phổ biến hơn: vừa có một khoản gửi ban đầu, vừa gửi thêm đều đặn mỗi tháng. Ví dụ: gửi ban đầu 50 triệu, sau đó gửi thêm 5 triệu mỗi tháng, lãi suất 6%/năm, trong 10 năm.

```excel
=FV(6%/12, 10*12, -5000000, -50000000)
```

{{anh:fvpv-02-fv-co-gop-them}}

Cả `pmt` (khoản gửi thêm mỗi tháng) và `pv` (khoản gửi ban đầu) đều nhập âm, vì cả hai đều là dòng tiền chi ra từ phía người gửi. Lưu ý `rate` và `nper` đã đổi sang đơn vị tháng cho khớp với `pmt` được gửi hàng tháng — đúng nguyên tắc "đơn vị của `rate` và `nper` phải khớp nhau" đã nhấn mạnh ở bài `PMT`.

Kết quả cho thấy rõ sức mạnh của gửi đều đặn: phần lớn số tiền cuối kỳ đến từ các khoản gửi thêm hàng tháng cộng dồn, không chỉ từ 50 triệu ban đầu.

## PV — một khoản tiền tương lai đáng giá bao nhiêu ở hiện tại

`PV` làm ngược lại `FV`: quy một khoản tiền trong tương lai về giá trị tương đương ở hiện tại.

```excel
=PV(rate, nper, pmt, [fv], [type])
```

Ví dụ: có một hợp đồng hứa trả 500 triệu đồng sau đúng 5 năm, không có khoản trả nào ở giữa. Với mức lãi suất tham chiếu 7%/năm, số tiền đó đáng giá bao nhiêu nếu quy về hôm nay?

```excel
=PV(7%, 5, 0, 500000000)
```

{{anh:fvpv-03-pv-mot-lan}}

Kết quả xấp xỉ **-356.500.000**. Dấu âm ở đây có nghĩa: để **nhận được** 500 triệu sau 5 năm với lãi suất 7%, bạn cần **bỏ ra** khoảng 356,5 triệu ngay hôm nay và đem đầu tư ở đúng mức lãi suất đó. `fv` (500 triệu tương lai) là dòng tiền dương vì bạn sẽ nhận nó; `PV` trả về âm vì đó là khoản bạn phải chi ra ở đầu.

## Vì sao PV lại quan trọng: so sánh hai lựa chọn nhận tiền khác thời điểm

Đây là ứng dụng thực tế nhất của `PV`, và là lý do nó xuất hiện trong hầu hết quyết định tài chính nghiêm túc: khi phải chọn giữa hai phương án trả tiền ở các thời điểm khác nhau, con số tuyệt đối không so sánh được trực tiếp — phải quy về cùng một thời điểm trước.

Ví dụ: một bên đề nghị trả ngay 300 triệu, một bên đề nghị trả 400 triệu nhưng sau 4 năm. Mức lãi suất tham chiếu là 8%/năm. Trả ngay đáng giá đúng 300 triệu ở hiện tại. Còn 400 triệu sau 4 năm quy về hiện tại là:

```excel
=PV(8%, 4, 0, 400000000)
```

{{anh:fvpv-04-so-sanh-hai-phuong-an}}

Kết quả xấp xỉ **-294.000.000**. Vì giá trị quy về hiện tại của phương án 2 (khoảng 294 triệu) thấp hơn 300 triệu của phương án 1, phương án nhận tiền ngay có lợi hơn về mặt giá trị thời gian của tiền, dù con số tuyệt đối 400 triệu nhìn có vẻ lớn hơn 300 triệu.

Đây chính là nguyên lý nằm sau việc đánh giá dự án đầu tư bằng `NPV`, sẽ nói ở bài tiếp theo — quy mọi dòng tiền về cùng một thời điểm rồi mới so sánh, thay vì cộng trừ trực tiếp các con số ở các thời điểm khác nhau.

## Mức lãi suất dùng để chiết khấu chọn thế nào

Cả `FV` lẫn `PV` đều cần một `rate` làm mốc, nhưng chọn con số nào cho đúng lại tuỳ vào câu hỏi đang đặt ra, không có một con số đúng cho mọi trường hợp.

- Đang so sánh với gửi tiết kiệm ngân hàng — dùng đúng lãi suất tiết kiệm ngân hàng đang áp dụng.
- Đang đánh giá một khoản đầu tư có rủi ro — dùng mức lợi nhuận kỳ vọng tối thiểu cho loại rủi ro đó, thường cao hơn lãi suất tiết kiệm vì rủi ro cao hơn.
- Đang so sánh hai phương án nhận tiền như ví dụ trên — dùng mức lãi suất là cơ hội đầu tư thay thế tốt nhất mà bạn có, tức là nếu không nhận theo phương án nào ở đây thì tiền của bạn có thể sinh lời bao nhiêu ở nơi khác.

Chọn sai `rate` không làm hỏng công thức — Excel vẫn tính ra một con số hợp lệ — nhưng kết luận rút ra từ con số đó sẽ sai theo đúng mức chênh lệch giữa `rate` đã chọn và `rate` đáng lẽ phải dùng.

## Tổng kết

`FV` trả lời "tiền hôm nay sẽ lớn thành bao nhiêu trong tương lai", `PV` trả lời "tiền tương lai đáng giá bao nhiêu ở hiện tại" — hai chiều ngược nhau của cùng một nguyên lý: tiền có giá trị theo thời gian. Quy ước dấu giữ nguyên như `PMT`: dòng tiền chi ra mang dấu âm, dòng tiền nhận vào mang dấu dương.

Ứng dụng thực tế quan trọng nhất của `PV` không phải tính một con số đơn lẻ, mà là so sánh các phương án nhận tiền ở các thời điểm khác nhau bằng cách quy chúng về cùng một mốc thời gian trước khi so sánh.

Đọc tiếp trong cùng cụm bài: khi cần đánh giá một dự án có nhiều dòng tiền vào ra ở nhiều thời điểm khác nhau, không chỉ một khoản duy nhất, xem [NPV và IRR: đánh giá dự án đầu tư có đáng làm hay không](/blog/ham-npv-irr-danh-gia-du-an-dau-tu). Và khi cần tính ngược lại khoản trả góp hàng tháng, quay lại [PMT: tính khoản trả góp vay hàng tháng](/blog/ham-pmt-tinh-khoan-tra-gop-vay-hang-thang).
