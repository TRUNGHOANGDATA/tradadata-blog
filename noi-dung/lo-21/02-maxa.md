---
tieu_de: "MAXA: cùng nguyên tắc quy đổi, áp dụng cho giá trị lớn nhất — nguy hiểm khi dữ liệu toàn số âm"
slug: "ham-maxa-lon-nhat-tinh-ca-van-ban-va-luan-ly"
danh_muc: "Excel"
the: ["MAXA", "hàm thống kê"]
mo_ta: "MAXA tìm giá trị lớn nhất như MAX, nhưng tính cả TRUE (=1) và văn bản (=0) thay vì bỏ qua. Nguy hiểm nhất khi dữ liệu toàn số âm — một ô TRUE duy nhất có thể khiến MAXA trả về 1, sai lệch hoàn toàn so với giá trị lớn nhất thực sự."
tu_khoa: "hàm MAXA Excel, MAXA khac MAX, gia tri lon nhat tinh ca van ban, MAXA voi so am"
anh_bia: "/images/bai-viet/ham-maxa/cover.png"
thu_muc_anh: "ham-maxa"
trang_thai: "draft"
---

Bài trước, [AVERAGEA](/blog/ham-averagea-trung-binh-tinh-ca-van-ban-va-luan-ly) áp dụng quy tắc quy đổi văn bản/luận lý cho trung bình. `MAXA` áp dụng đúng quy tắc đó cho việc tìm giá trị **lớn nhất** — và đây là trường hợp quy tắc đó gây hậu quả bất ngờ nhất trong cả họ hàm này.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=MAXA(gia_tri1, [gia_tri2], ...)
```

{{anh:mx-01-cu-phap-co-ban}}

Cùng quy tắc quy đổi với `AVERAGEA`: `TRUE`=`1`, `FALSE`=`0`, mọi văn bản=`0`. `MAX` (đã có [bài riêng](/blog/ham-max-min-large-small-tim-gia-tri-xep-hang)) bỏ qua hoàn toàn văn bản và luận lý, chỉ so sánh giữa các ô là số.

## Trường hợp nguy hiểm nhất: dữ liệu toàn số âm lẫn một ô TRUE

```excel
=MAX(-5,-2,-8)
=MAXA(-5,-2,-8,TRUE)
```

{{anh:mx-02-nguy-hiem-so-am}}

`MAX(-5,-2,-8)` cho đúng `-2` — số lớn nhất trong ba số âm. Nhưng `MAXA(-5,-2,-8,TRUE)` cho `1` — vì `TRUE` được quy đổi thành `1`, và `1` lớn hơn hẳn mọi số âm trong danh sách. Nếu cột dữ liệu là mức chênh lệch (có thể âm) và vô tình lẫn một ô checkbox `TRUE` ở đâu đó, `MAXA` sẽ báo kết quả `1` — hoàn toàn sai lệch ý nghĩa so với "chênh lệch lớn nhất" mà người dùng thực sự muốn tìm.

## Ứng dụng đúng chỗ: tìm giá trị lớn nhất khi checkbox đại diện cho một mức cụ thể

```excel
=MAXA(B2:B10)
```

{{anh:mx-03-ung-dung-dung-cho}}

Nếu cột dữ liệu là điểm đánh giá từ `0` đến `10`, nhưng vài ô dùng checkbox `TRUE` để đại diện cho mức tối đa (`10` được đơn giản hoá thành đánh dấu chọn thay vì gõ số), cần quy đổi `TRUE` thành một giá trị lớn tương xứng trước, `MAXA` mới dùng đúng chỗ — nếu không, `TRUE` chỉ được tính là `1`, thấp hơn hẳn ý nghĩa "điểm tối đa" ban đầu.

## Văn bản cũng gây đúng lỗi tương tự, không chỉ riêng TRUE

```excel
=MAX(-5,-2,"Không có dữ liệu")
=MAXA(-5,-2,"Không có dữ liệu")
```

{{anh:mx-04-van-ban-cung-gay-loi}}

`MAX` bỏ qua ô văn bản, trả về đúng `-2` — số lớn nhất thật sự trong hai số âm. `MAXA` thì không: văn bản quy đổi thành `0`, mà `0` lớn hơn cả `-5` và `-2`, nên kết quả là `0` — không phải `TRUE` mới gây ra vấn đề này, bất kỳ ô văn bản nào lẫn vào một dãy toàn số âm cũng đủ để kéo `MAXA` lên `0`.

{{anh:mx-05-luon-kiem-tra-du-lieu-am}}

Luôn kiểm tra kỹ khi dữ liệu có thể toàn số âm (chênh lệch, biến động, lỗ/lãi...) trước khi dùng `MAXA` — chỉ cần một ô văn bản hoặc checkbox lẫn vào là kết quả có thể lệch hẳn khỏi giá trị lớn nhất thực sự về mặt số học.

## Tổng kết

`MAXA` tìm giá trị lớn nhất, quy đổi `TRUE` thành `1` và văn bản thành `0` thay vì bỏ qua như `MAX`. Nguy hiểm nhất khi dữ liệu toàn số âm — một ô `TRUE` hay thậm chí một ô văn bản đơn thuần cũng có thể trở thành "giá trị lớn nhất" theo nghĩa số học, dù về mặt logic không hề mang ý nghĩa đó.

Đọc tiếp trong cùng cụm bài: [MINA — chiều ngược lại, và cùng cái bẫy nhưng lộn phía](/blog/ham-mina-nho-nhat-tinh-ca-van-ban-va-luan-ly).
