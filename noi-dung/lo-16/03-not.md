---
tieu_de: "NOT: đảo ngược một giá trị luận lý, đôi khi diễn đạt rõ ý hơn viết điều kiện thuận"
slug: "ham-not-dao-nguoc-gia-tri-luan-ly"
danh_muc: "Excel"
the: ["NOT", "hàm luận lý"]
mo_ta: "NOT đảo ngược TRUE thành FALSE và ngược lại. Đơn giản nhưng đôi khi giúp công thức đọc rõ ý hơn hẳn — nhất là khi ghép với các hàm ISBLANK, ISERROR vốn đã mang sẵn ý phủ định trong tên gọi."
tu_khoa: "hàm NOT Excel, dao nguoc gia tri luan ly, NOT ISBLANK Excel, NOT chi nhan mot doi so"
anh_bia: "/images/bai-viet/ham-not/cover.png"
thu_muc_anh: "ham-not"
trang_thai: "draft"
---

Bài trước, [OR](/blog/ham-or-mot-dieu-kien-dung-la-du) chỉ cần một điều kiện đúng. `NOT` đơn giản hơn hẳn cả hai hàm đã nói — chỉ làm đúng một việc: đảo ngược một giá trị luận lý.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=NOT(dieu_kien)
```

{{anh:nt-01-cu-phap-co-ban}}

`NOT(TRUE)` cho `FALSE`, `NOT(FALSE)` cho `TRUE` — không có gì phức tạp hơn thế.

## Khác AND/OR: NOT chỉ nhận đúng một đối số

```excel
=NOT(dieu_kien1,dieu_kien2)
```

{{anh:nt-02-chi-nhan-mot-doi-so}}

Khác với `AND`/`OR` nhận tối đa `255` điều kiện, `NOT` chỉ nhận **đúng một** đối số — đưa vào hai điều kiện như trên sẽ báo lỗi. Cần điều kiện phức tạp hơn thì gộp trước bằng `AND`/`OR` rồi mới bọc `NOT` ra ngoài: `NOT(AND(dieu_kien1,dieu_kien2))`.

## Ứng dụng: diễn đạt rõ ý hơn khi ghép với các hàm mang sẵn nghĩa phủ định

```excel
=IF(NOT(ISBLANK(A2)),"Đã nhập","Chưa nhập")
```

{{anh:nt-03-not-isblank}}

So với viết `IF(A2<>"","Đã nhập","Chưa nhập")`, cách dùng `NOT(ISBLANK(A2))` — tham khảo lại [`ISBLANK`](/blog/ham-isnumber-istext-isblank-iserror-kiem-tra-kieu-du-lieu) — đọc gần với ngôn ngữ tự nhiên hơn: "nếu **không phải** ô trống". Cả hai công thức cho cùng kết quả, nhưng cách viết bằng `NOT` giúp người đọc lại công thức sau này hiểu ngay ý định ban đầu mà không cần suy luận ngược từ ký hiệu `<>`.

## Ứng dụng: đảo ngược điều kiện lọc mà không cần viết lại từ đầu

```excel
=IF(NOT(OR(NhomHang="Ngừng bán",TonKho=0)),"Còn bán được","Ngừng")
```

{{anh:nt-04-dao-nguoc-dieu-kien-loc}}

Đôi khi dễ diễn đạt điều kiện **loại trừ** hơn là điều kiện **chấp nhận** — ở đây, dễ liệt kê "trường hợp nào coi là ngừng bán" hơn là liệt kê hết mọi trường hợp còn bán được. `NOT` bọc quanh `OR` đảo ngược lại toàn bộ kết quả, tránh phải viết lại điều kiện theo chiều thuận phức tạp hơn.

## Lưu ý: NOT không thay thế được toán tử so sánh cơ bản

```excel
=NOT(A2=B2)
```

{{anh:nt-05-so-sanh-truc-tiep}}

`NOT(A2=B2)` và `A2<>B2` cho cùng kết quả — với phép so sánh đơn giản như thế này, dùng trực tiếp `<>` thường gọn hơn. `NOT` phát huy giá trị rõ nhất khi bọc quanh một hàm hoặc biểu thức phức tạp hơn, nơi việc "phủ định trực tiếp" khó viết gọn bằng toán tử so sánh thông thường.

## Tổng kết

`NOT` đảo ngược một giá trị luận lý, chỉ nhận đúng một đối số — khác `AND`/`OR` nhận nhiều điều kiện. Giá trị lớn nhất của `NOT` là giúp công thức đọc rõ ý hơn khi ghép với các hàm đã mang sẵn nghĩa phủ định như `ISBLANK`, hoặc khi dễ diễn đạt điều kiện loại trừ hơn điều kiện chấp nhận.

Đọc tiếp trong cùng cụm bài: [TIME — dựng một giá trị giờ từ ba con số riêng lẻ, chiều ngược lại của HOUR/MINUTE/SECOND](/blog/ham-time-dung-gio-tu-gio-phut-giay).
