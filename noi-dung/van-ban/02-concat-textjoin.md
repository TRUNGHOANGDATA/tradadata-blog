---
tieu_de: "CONCAT và TEXTJOIN: nối chuỗi gọn hơn dấu &"
slug: "ham-concat-textjoin-noi-chuoi"
danh_muc: "Excel"
the: ["CONCAT", "TEXTJOIN", "xử lý văn bản"]
mo_ta: "Dấu & nối được vài ô nhưng dài dòng khi nhiều. CONCAT nối cả một vùng trong một lần, còn TEXTJOIN thêm dấu phân cách và bỏ qua ô trống — thứ mà dấu & và CONCATENATE cũ không làm được."
tu_khoa: "hàm CONCAT TEXTJOIN, nối chuỗi trong Excel, ghép văn bản, TEXTJOIN dấu phân cách, thay CONCATENATE, nối ô có điều kiện"
anh_bia: "/images/bai-viet/concat-textjoin/cover.png"
thu_muc_anh: "concat-textjoin"
trang_thai: "draft"
---

Ghép họ và tên thành một ô, dựng địa chỉ đầy đủ từ nhiều cột, gộp danh sách thành một dòng — đó là việc nối chuỗi. Excel có ba cách, và biết chọn đúng sẽ tiết kiệm rất nhiều công gõ.

## Dấu & — nối tay, tốt cho vài ô

Cách cơ bản nhất là toán tử `&`:

```excel
=A2 & " " & B2
```

{{anh:ct-01-ba-cach}}

Nó ghép giá trị các ô lại, và bạn tự chèn dấu cách hay dấu phẩy giữa chúng bằng `" "`. Gọn khi chỉ có hai, ba ô. Nhưng nối mười ô thì công thức thành một chuỗi `&` dài lê thê và rất dễ sót một dấu phân cách.

## CONCAT — nối cả một vùng

`CONCAT` (thay cho `CONCATENATE` cũ, từ Excel 365/2019) cho phép chọn nguyên một vùng thay vì liệt kê từng ô:

```excel
=CONCAT(A2:D2)
```

Nó dán tất cả ô trong vùng lại liền nhau. Nhanh, nhưng có một hạn chế: nó **không tự chèn dấu phân cách** — mọi thứ dính vào nhau. Đó là lúc cần đến hàm thứ ba.

## TEXTJOIN — thêm dấu phân cách và bỏ ô trống

`TEXTJOIN` là hàm nối mạnh nhất, giải quyết đúng hai việc khó chịu nhất:

```excel
=TEXTJOIN(", ", TRUE, A2:D2)
```

{{anh:ct-02-textjoin}}

Ba tham số: **dấu phân cách** (`", "`), **bỏ ô trống hay không** (`TRUE` là bỏ), và **vùng** cần nối. Cái hay nằm ở tham số thứ hai: khi một ô trong vùng trống, TEXTJOIN không để lại dấu phẩy thừa lơ lửng — điều mà dấu `&` và CONCAT đều làm được nhưng phải xử lý tay.

Ví dụ dựng địa chỉ từ bốn cột số nhà, đường, phường, quận: dòng nào thiếu phường thì kết quả vẫn liền mạch, không có `, ,` giữa chừng.

{{anh:ct-03-ket-qua}}

## Xuống dòng trong một ô

Muốn mỗi phần nằm trên một dòng riêng trong cùng ô (địa chỉ nhiều dòng, thông tin liên hệ), dùng [CHAR(10)](/blog/ham-char-code-ky-tu-dac-biet-ngat-dong) làm dấu phân cách:

```excel
=TEXTJOIN(CHAR(10), TRUE, A2:A5)
```

`CHAR(10)` là ký tự xuống dòng. Nhớ bật **Wrap Text** cho ô thì mới thấy các dòng tách ra.

## Kết quả nối là văn bản

Như mọi hàm văn bản, kết quả nối luôn là chuỗi. Ghép một con số vào chuỗi thì con số đó thành văn bản, không tính toán được nữa — hợp lý, vì `"Đơn hàng 5"` đâu phải một con số. Nếu cần định dạng con số khi nối (ngày tháng, tiền tệ), bọc nó trong `TEXT()` trước. Và nếu muốn chuẩn hoá chữ hoa chữ thường của phần chữ trước khi ghép, [PROPER/UPPER/LOWER](/blog/ham-proper-upper-lower-chuan-hoa-chu-hoa-thuong) sẽ giúp.

## Kiểm nhanh trên máy bạn

- Nối họ và tên bằng `&`, rồi bằng `TEXTJOIN(" ",TRUE,...)` — thấy TEXTJOIN gọn hơn khi số cột tăng.
- Để trống một ô giữa vùng rồi so `CONCAT` với `TEXTJOIN(", ",TRUE,...)`: chỉ TEXTJOIN không để lại dấu phẩy thừa.
