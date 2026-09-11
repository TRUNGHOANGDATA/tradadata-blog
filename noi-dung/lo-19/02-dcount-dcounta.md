---
tieu_de: "DCOUNT, DCOUNTA: đếm kiểu cơ sở dữ liệu, và khác biệt giữa đếm số với đếm mọi ô có dữ liệu"
slug: "ham-dcount-dcounta-dem-kieu-co-so-du-lieu"
danh_muc: "Excel"
the: ["DCOUNT", "DCOUNTA", "hàm cơ sở dữ liệu"]
mo_ta: "DCOUNT chỉ đếm các ô chứa số thoả điều kiện, DCOUNTA đếm mọi ô có dữ liệu (số, chữ, ngày). Cùng chung vùng điều kiện kiểu bảng với DSUM, hỗ trợ cả điều kiện HOẶC lẫn VÀ phức tạp."
tu_khoa: "hàm DCOUNT Excel, ham DCOUNTA Excel, dem kieu co so du lieu, DCOUNT khac DCOUNTA"
anh_bia: "/images/bai-viet/ham-dcount-dcounta/cover.png"
thu_muc_anh: "ham-dcount-dcounta"
trang_thai: "draft"
---

Bài trước, [DSUM](/blog/ham-dsum-tinh-tong-kieu-co-so-du-lieu) tính tổng theo vùng điều kiện kiểu bảng. `DCOUNT` và `DCOUNTA` dùng chung cấu trúc đó nhưng đổi phép tính sang đếm — và khác nhau đúng một điểm quan trọng.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=DCOUNT(vung_du_lieu, [truong], vung_dieu_kien)
=DCOUNTA(vung_du_lieu, [truong], vung_dieu_kien)
```

{{anh:dc-01-cu-phap-co-ban}}

Cùng cấu trúc với `DSUM` — `vung_dieu_kien` là bảng điều kiện riêng, nhiều dòng là `HOẶC`, nhiều cột cùng dòng là `VÀ`.

## Khác biệt cốt lõi: DCOUNT chỉ đếm số, DCOUNTA đếm mọi ô có dữ liệu

```excel
=DCOUNT(A1:C10,"MaDon",E1:E2)
=DCOUNTA(A1:C10,"MaDon",E1:E2)
```

{{anh:dc-02-dcount-khac-dcounta}}

Nếu cột `MaDon` chứa mã đơn hàng dạng chữ (`"DH001"`, `"DH002"`...), `DCOUNT` trả về `0` — vì không có ô nào trong cột đó là **số**. `DCOUNTA` mới đếm đúng số đơn hàng khớp điều kiện, vì nó đếm mọi ô **không rỗng**, bất kể là số, chữ, hay ngày tháng.

## Ứng dụng: đếm số đơn hàng của nhóm khách VIP hoặc Thân thiết

```excel
=DCOUNTA(A1:D50,"MaDon",F1:F3)
```

{{anh:dc-03-dem-don-hang-vip}}

Vùng điều kiện có cột `HangKhach` với hai dòng giá trị `"VIP"` và `"Thân thiết"` — đếm được tổng số đơn hàng thuộc **bất kỳ** một trong hai nhóm khách đó.

## Có thể bỏ trống tham số truong

```excel
=DCOUNT(A1:D50,,F1:F3)
```

{{anh:dc-04-bo-trong-truong}}

Bỏ trống `truong`, `DCOUNT` đếm **toàn bộ số dòng dữ liệu** khớp điều kiện — không cần chỉ định cụ thể đếm theo cột nào, hữu ích khi chỉ cần biết "có bao nhiêu dòng khớp" mà không quan tâm đếm theo cột số nào.

## Ứng dụng: đếm nhanh xem có bao nhiêu dòng khớp trước khi tin vào DSUM/DAVERAGE

```excel
=DCOUNTA(A1:C10,"Miền",E1:E3)
```

{{anh:dc-05-kiem-tra-truoc-khi-tin}}

Trước khi tin vào kết quả của `DSUM` hay `DAVERAGE` (bài sau), chạy thử `DCOUNTA` với cùng vùng điều kiện là cách nhanh để chắc chắn có ít nhất một dòng dữ liệu khớp — tránh trường hợp vô tình gõ sai tên cột khiến điều kiện bị bỏ qua âm thầm như đã nói ở bài trước.

## Tổng kết

`DCOUNT` chỉ đếm các ô chứa số thoả điều kiện, `DCOUNTA` đếm mọi ô không rỗng — chọn sai hàm là nguyên nhân phổ biến khiến kết quả về `0` một cách khó hiểu khi cột cần đếm là văn bản. Có thể bỏ trống tham số `truong` để đếm tổng số dòng khớp điều kiện.

Đọc tiếp trong cùng cụm bài: [DAVERAGE — tính trung bình kiểu cơ sở dữ liệu](/blog/ham-daverage-trung-binh-kieu-co-so-du-lieu).
