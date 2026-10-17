---
tieu_de: "Advanced Filter: lọc theo điều kiện OR phức tạp mà AutoFilter không làm được"
slug: "loc-nang-cao-trong-excel-advanced-filter"
danh_muc: "Excel"
the: ["Advanced Filter", "công cụ dữ liệu"]
mo_ta: "AutoFilter chỉ lọc tốt trong một cột. Advanced Filter đọc điều kiện từ một vùng riêng trên sheet, cho phép kết hợp OR giữa nhiều cột, lọc bằng công thức, và copy thẳng kết quả sang vị trí khác mà không đụng vào dữ liệu gốc."
tu_khoa: "Advanced Filter Excel, loc nang cao trong Excel, dieu kien OR nhieu cot, criteria range Excel, loc bang cong thuc"
anh_bia: "/images/bai-viet/advanced-filter/cover.png"
thu_muc_anh: "advanced-filter"
trang_thai: "draft"
---

`AutoFilter` (mũi tên lọc quen thuộc trên đầu cột) đủ dùng cho phần lớn công việc hàng ngày, nhưng nó gặp khó khi bạn cần lọc theo quan hệ **HOẶC** vắt qua nhiều cột — ví dụ "Miền Bắc **hoặc** doanh thu trên 20 triệu". `Advanced Filter` giải quyết đúng việc AutoFilter không làm trực tiếp được.

## Điểm khác biệt cốt lõi: điều kiện nằm trên sheet, không nằm trong hộp thoại

AutoFilter cho bạn tick chọn điều kiện ngay trong menu thả xuống. `Advanced Filter` thì ngược lại — bạn phải **tự dựng một vùng điều kiện** ở đâu đó trên sheet trước, rồi trỏ Excel vào đó:

{{anh:af-01-vung-dieu-kien}}

Vùng điều kiện luôn có dòng đầu là **tên cột giống hệt bảng dữ liệu gốc**, các dòng dưới là giá trị cần lọc.

## Cùng hàng là VÀ, khác hàng là HOẶC

Đây là quy tắc quan trọng nhất của Advanced Filter, và cũng là lý do chính khiến người ta dùng nó thay vì AutoFilter:

{{anh:af-02-va-hoac}}

- Đặt hai điều kiện trên **cùng một hàng** → quan hệ **VÀ** (cả hai phải cùng đúng).
- Đặt hai điều kiện ở **hai hàng khác nhau** → quan hệ **HOẶC** (một trong hai đúng là được).

Ví dụ vùng điều kiện có `Khu vực = "Miền Bắc"` ở hàng 2 và `Doanh thu > 20000000` ở hàng 3 (khác hàng, cùng để trống ô kia) sẽ lọc ra mọi dòng thuộc Miền Bắc **hoặc** có doanh thu trên 20 triệu — bất kể khu vực. Muốn diễn đạt điều kiện HOẶC như thế này bằng AutoFilter thông thường gần như không thể, vì mỗi cột chỉ lọc độc lập.

## Chạy Advanced Filter

Vào `Data → Advanced` (trong nhóm `Sort & Filter`). Hộp thoại yêu cầu ba vùng:

{{anh:af-03-hop-thoai}}

- **List range**: vùng dữ liệu gốc cần lọc.
- **Criteria range**: vùng điều kiện bạn vừa dựng.
- **Copy to**: chỉ hiện khi chọn "Copy to another location" — nơi dán kết quả lọc, để nguyên dữ liệu gốc không bị ẩn dòng nào.

Đây là một lợi thế nữa so với AutoFilter: AutoFilter chỉ **ẩn** dòng không khớp trên đúng vị trí cũ, còn Advanced Filter có thể **trích riêng** kết quả ra một vùng mới, tiện để làm báo cáo mà không sợ động vào dữ liệu gốc.

## Lọc bằng công thức, không chỉ giá trị cố định

Vùng điều kiện của Advanced Filter chấp nhận cả công thức, miễn tiêu đề cột **khác** với tên cột trong bảng gốc (hoặc để trống) để Excel không nhầm là so khớp trực tiếp:

```excel
=B2>AVERAGE($B$2:$B$100)
```

Lọc ra mọi dòng có doanh thu **cao hơn mức trung bình chung** — một điều kiện AutoFilter không diễn đạt được vì nó không tự tính trung bình khi bạn lọc.

## Lọc và trích riêng danh sách không trùng lặp

Advanced Filter còn có một công dụng ít người để ý: tick vào ô `Unique records only`, nó sẽ trích ra danh sách **không trùng lặp** ngay trong lúc lọc, không cần chạy thêm bước [Remove Duplicates](/blog/xoa-du-lieu-trung-lap-trong-excel-remove-duplicates) riêng. Nếu bạn dùng Excel 365, cách hiện đại hơn cho việc này là hàm [`UNIQUE`](/blog/ham-mang-dong-excel-filter-sort-unique-lambda) kết hợp `FILTER` — tự động cập nhật khi dữ liệu đổi, còn Advanced Filter thì chỉ chạy một lần khi bạn bấm nút.

## Kiểm nhanh trên máy bạn

- Dựng vùng điều kiện với hai dòng chứa cùng một cột để thấy hiệu ứng HOẶC, so với đặt trên cùng một hàng để thấy hiệu ứng VÀ.
- Thử điều kiện bằng công thức so với giá trị trung bình, chọn "Copy to another location" để giữ nguyên bảng gốc.
