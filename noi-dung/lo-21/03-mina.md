---
tieu_de: "MINA: chiều ngược lại, và cùng cái bẫy nhưng lộn phía"
slug: "ham-mina-nho-nhat-tinh-ca-van-ban-va-luan-ly"
danh_muc: "Excel"
the: ["MINA", "hàm thống kê"]
mo_ta: "MINA tìm giá trị nhỏ nhất như MIN, nhưng tính cả FALSE (=0) và văn bản (=0) thay vì bỏ qua. Nguy hiểm nhất khi dữ liệu toàn số dương — một ô FALSE hay văn bản duy nhất có thể kéo kết quả MINA về 0."
tu_khoa: "hàm MINA Excel, MINA khac MIN, gia tri nho nhat tinh ca van ban, MINA voi so duong"
anh_bia: "/images/bai-viet/ham-mina/cover.png"
thu_muc_anh: "ham-mina"
trang_thai: "draft"
---

Bài trước, [MAXA](/blog/ham-maxa-lon-nhat-tinh-ca-van-ban-va-luan-ly) nguy hiểm nhất khi dữ liệu toàn số âm. `MINA` là hàm song sinh — tìm giá trị **nhỏ nhất** theo cùng quy tắc quy đổi, và nguy hiểm nhất lại rơi vào tình huống ngược lại: dữ liệu toàn số **dương**.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=MINA(gia_tri1, [gia_tri2], ...)
```

{{anh:mn-01-cu-phap-co-ban}}

Cùng quy tắc: `TRUE`=`1`, `FALSE`=`0`, mọi văn bản=`0`. [`MIN`](/blog/ham-max-min-large-small-tim-gia-tri-xep-hang) bỏ qua hoàn toàn văn bản và luận lý.

## Trường hợp nguy hiểm nhất: dữ liệu toàn số dương lẫn một ô FALSE

```excel
=MIN(5,8,3)
=MINA(5,8,3,FALSE)
```

{{anh:mn-02-nguy-hiem-so-duong}}

`MIN(5,8,3)` cho đúng `3` — số nhỏ nhất trong ba số dương. `MINA(5,8,3,FALSE)` cho `0` — vì `FALSE` quy đổi thành `0`, nhỏ hơn cả `3`. Nếu cột dữ liệu là số lượng tồn kho hay điểm số (luôn dương) và vô tình lẫn một ô checkbox chưa tick (`FALSE`), `MINA` báo `0` — trông như có một dòng tồn kho bằng `0` thực sự, dù dữ liệu gốc không hề có giá trị đó.

## Văn bản gây hiệu ứng tương tự FALSE

```excel
=MINA(5,8,3,"Không rõ")
```

{{anh:mn-03-van-ban-tuong-tu-false}}

Kết quả cũng là `0` — văn bản `"Không rõ"` quy đổi thành `0` giống hệt `FALSE`, kéo kết quả xuống thấp hơn mọi số dương trong danh sách.

## Ứng dụng: khi 0 thực sự là một khả năng hợp lệ cần tính đến

```excel
=MINA(B2:B10)
```

{{anh:mn-04-ung-dung-hop-le}}

Nếu checkbox `FALSE` trong cột dữ liệu thực sự đại diện cho mức `0` hợp lệ (ví dụ "chưa hoàn thành" = `0%` tiến độ), `MINA` mới là lựa chọn đúng — nó phản ánh đúng có tồn tại một mức `0` trong dữ liệu, điều `MIN` sẽ bỏ sót vì coi `FALSE` không phải là một con số.

## Luôn kiểm tra dữ liệu trước khi chọn MINA thay vì MIN

```excel
=MIN(B2:B10)
=MINA(B2:B10)
```

{{anh:mn-05-kiem-tra-truoc-khi-chon}}

Chạy thử cả hai công thức song song trên cùng một vùng dữ liệu là cách nhanh để phát hiện xem có ô văn bản hay luận lý nào đang âm thầm ảnh hưởng tới kết quả hay không — nếu hai kết quả khác nhau, cần xem lại xem `MINA` đang phản ánh đúng ý định hay đang bị kéo lệch bởi một ô không phải số thực sự.

## Tổng kết

`MINA` tìm giá trị nhỏ nhất, quy đổi `FALSE` và văn bản thành `0` thay vì bỏ qua như `MIN`. Nguy hiểm nhất khi dữ liệu toàn số dương — một ô `FALSE` hay văn bản đơn thuần có thể kéo kết quả về `0`, trông như một giá trị dữ liệu thật dù không hề có ý nghĩa đó.

Đọc tiếp trong cùng cụm bài: [STDEVA — độ lệch chuẩn tính cả văn bản và luận lý, dễ thổi phồng độ phân tán dữ liệu](/blog/ham-stdeva-do-lech-chuan-tinh-ca-van-ban-va-luan-ly).
