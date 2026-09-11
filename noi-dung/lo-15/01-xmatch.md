---
tieu_de: "XMATCH: bản thay thế hiện đại của MATCH, mặc định khớp chính xác"
slug: "ham-xmatch-tim-vi-tri-hien-dai"
danh_muc: "Excel"
the: ["XMATCH", "hàm tra cứu"]
mo_ta: "XMATCH tìm vị trí một giá trị trong một mảng, làm đúng việc của MATCH nhưng mặc định khớp chính xác — không cần nhớ khai tham số 0 như MATCH — và thêm khả năng tìm từ cuối lên hay dùng ký tự đại diện."
tu_khoa: "hàm XMATCH Excel, XMATCH khac MATCH, tim vi tri chinh xac Excel, XMATCH Excel 365"
anh_bia: "/images/bai-viet/ham-xmatch/cover.png"
thu_muc_anh: "ham-xmatch"
trang_thai: "draft"
---

`MATCH` (đã dùng nhiều trong [bài INDEX/MATCH](/blog/ham-match-index-match-match-tra-cuu-2-chieu-linh-hoat)) có một cái bẫy kinh điển: tham số thứ ba mặc định là `1` (tìm gần đúng, yêu cầu dữ liệu đã sắp xếp) — quên khai `0` là công thức âm thầm cho kết quả sai mà không báo lỗi gì. `XMATCH` là bản thay thế hiện đại, sửa đúng điểm đó làm mặc định.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=XMATCH(gia_tri_tim, mang_tim, [che_do_khop], [che_do_tim])
```

{{anh:xm-01-cu-phap-co-ban}}

Khác biệt lớn nhất: `che_do_khop` mặc định là `0` (khớp chính xác) — không khai gì cũng đã an toàn, ngược hẳn với `MATCH` mặc định là tìm gần đúng.

## Ví dụ cơ bản

```excel
=XMATCH("Bút bi",A2:A10)
```

{{anh:xm-02-vi-du-co-ban}}

Tìm đúng vị trí (số thứ tự dòng trong vùng, không phải số dòng trên bảng tính) của `"Bút bi"` trong danh sách — không cần lo dữ liệu có được sắp xếp trước hay không, vì mặc định đã là khớp chính xác.

## Khả năng thêm: tìm từ dòng cuối lên

```excel
=XMATCH("KH0042",MaKhachHang,0,-1)
```

{{anh:xm-03-tim-tu-cuoi-len}}

Tham số cuối `-1` khiến `XMATCH` quét từ **dòng cuối lên đầu**, trả về vị trí khớp **gần cuối nhất** — hữu ích khi một mã khách hàng xuất hiện nhiều lần trong bảng giao dịch và cần tìm đúng lần giao dịch **gần đây nhất**, thay vì lần đầu tiên như `MATCH`/`XMATCH` mặc định (tìm từ trên xuống) sẽ trả về.

## Khả năng thêm: khớp theo ký tự đại diện

```excel
=XMATCH("Bút*",TenHang,2)
```

{{anh:xm-04-ky-tu-dai-dien}}

`che_do_khop=2` cho phép dùng `*` và `?` trong giá trị tìm — tìm vị trí đầu tiên có tên hàng bắt đầu bằng `"Bút"`, không cần biết chính xác toàn bộ tên. `MATCH` gốc không có tuỳ chọn này.

## Không tìm thấy: cả hai đều báo #N/A giống nhau

```excel
=XMATCH("Không tồn tại",A2:A10)
```

{{anh:xm-05-khong-tim-thay}}

Giống `MATCH`, `XMATCH` báo lỗi `#N/A` khi không tìm thấy khớp nào — không có gì khác biệt ở điểm này, vẫn nên bọc `IFNA` nếu cần xử lý trường hợp không tìm thấy một cách gọn gàng hơn là để lộ lỗi ra bảng tính.

## Tổng kết

`XMATCH` làm đúng việc của `MATCH` — tìm vị trí một giá trị trong một mảng — nhưng mặc định khớp chính xác thay vì tìm gần đúng, loại bỏ hẳn cái bẫy quên khai tham số `0` của `MATCH`. Thêm hai khả năng `MATCH` không có: tìm từ cuối lên và khớp theo ký tự đại diện.

Đọc tiếp trong cùng cụm bài: [VALUETOTEXT — chuyển một giá trị bất kỳ thành văn bản, kể cả giá trị lỗi](/blog/ham-valuetotext-chuyen-mot-gia-tri-thanh-van-ban).
