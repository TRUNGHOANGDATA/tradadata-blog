---
tieu_de: "SUM: hàm cơ bản nhất, nhưng vẫn có vài điều đáng biết"
slug: "ham-sum-cong-tong-va-nhung-dieu-de-bi-bo-qua"
danh_muc: "Excel"
the: ["SUM", "hàm toán học"]
mo_ta: "SUM là hàm đầu tiên ai học Excel cũng biết, nhưng ít người để ý SUM tự động bỏ qua ô văn bản (khác hẳn dấu +), cộng được xuyên nhiều sheet cùng lúc, và không tự loại trừ các dòng đang bị lọc hay ẩn."
tu_khoa: "hàm SUM Excel, SUM khac dau cong, tong nhieu sheet Excel, SUM va du lieu loc"
anh_bia: "/images/bai-viet/ham-sum/cover.png"
thu_muc_anh: "ham-sum"
trang_thai: "draft"
---

`SUM` gần như là hàm đầu tiên ai học Excel cũng biết — cộng một dãy số lại với nhau. Chính vì quá cơ bản nên ít bài viết nào dừng lại phân tích kỹ, nhưng `SUM` vẫn có vài điểm đáng biết mà không phải ai cũng để ý.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=SUM(so1, [so2], ...)
```

{{anh:sm-01-cu-phap-co-ban}}

Nhận tối đa `255` đối số, mỗi đối số có thể là một số, một ô, hoặc cả một vùng.

## Điểm khác biệt quan trọng: SUM bỏ qua văn bản, dấu + thì không

```excel
=A1+A2+A3
=SUM(A1:A3)
```

{{anh:sm-02-sum-khac-dau-cong}}

Nếu `A2` chứa chữ `"Chưa có"` thay vì một con số, công thức `=A1+A2+A3` báo lỗi `#VALUE!` ngay lập tức — dấu `+` đòi hỏi mọi toán hạng đều phải là số. Nhưng `=SUM(A1:A3)` thì không báo lỗi gì — `SUM` tự động **bỏ qua** các ô chứa văn bản, chỉ cộng đúng những ô là số, coi như ô văn bản đó không tồn tại.

## Ứng dụng: cộng xuyên nhiều sheet cùng lúc

Một sổ tính có `12` sheet, mỗi sheet một tháng, cùng cấu trúc bảng — cần tính tổng doanh thu cả năm tại đúng vị trí ô `B2` trên mỗi sheet:

```excel
=SUM(Thang1:Thang12!B2)
```

{{anh:sm-03-sum-xuyen-nhieu-sheet}}

Cách viết này (gọi là tham chiếu `3D`) cộng đúng ô `B2` trên toàn bộ các sheet nằm giữa `Thang1` và `Thang12` theo thứ tự tab hiện có, không cần mở từng sheet cộng tay hay dựng một sheet tổng hợp riêng.

## Cẩn thận: cộng cả cột dễ vô tình gộp luôn dòng tổng

```excel
=SUM(A:A)
```

{{anh:sm-04-can-than-dong-tong}}

`SUM(A:A)` cộng toàn bộ cột `A`, kể cả nếu phía dưới bảng dữ liệu đã có sẵn một dòng "Tổng cộng" — vô tình cộng luôn dòng tổng đó vào kết quả, làm tổng bị nhân đôi một cách âm thầm. An toàn hơn là luôn giới hạn đúng vùng dữ liệu thật (`SUM(A2:A50)`) thay vì cộng nguyên cột khi bảng có dòng tổng hợp xen vào.

## SUM không tự loại trừ dòng đang bị lọc hay ẩn

```excel
=SUM(B2:B20)
```

{{anh:sm-05-sum-khong-loai-tru-loc}}

Dù đã dùng `AutoFilter` để chỉ hiển thị một phần dữ liệu, hay ẩn tay một số dòng, `SUM` vẫn cộng **toàn bộ** các ô trong vùng tham chiếu, kể cả những dòng đang bị ẩn hoặc bị lọc ra khỏi màn hình. Muốn tổng chỉ tính trên các dòng **đang hiển thị**, cần dùng `SUBTOTAL` hoặc `AGGREGATE` (đã có [bài riêng](/blog/ham-aggregate-19-phep-tinh-bo-qua-loi-an-excel)) thay vì `SUM` — đây là lý do vì sao báo cáo có bộ lọc luôn dùng `SUBTOTAL(109,...)` ở dòng tổng, không dùng `SUM` thường.

## Tổng kết

`SUM` cộng một dãy số, nhưng có ba điểm dễ bị bỏ qua: tự động bỏ qua ô văn bản (khác hẳn dấu `+`), cộng được xuyên nhiều sheet cùng lúc bằng tham chiếu `3D`, và không tự loại trừ các dòng đang bị lọc hay ẩn — cần `SUBTOTAL`/`AGGREGATE` cho việc đó.

Đọc tiếp trong cùng cụm bài: [AVERAGEIF — tính trung bình có điều kiện, và thứ tự tham số ngược với AVERAGEIFS](/blog/ham-averageif-trung-binh-co-mot-dieu-kien).
