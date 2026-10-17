---
tieu_de: "Consolidate: hợp nhất số liệu từ nhiều sheet hay nhiều file, không cần công thức"
slug: "hop-nhat-du-lieu-nhieu-sheet-bang-consolidate"
danh_muc: "Excel"
the: ["Consolidate", "công cụ dữ liệu"]
mo_ta: "Consolidate gộp số liệu từ nhiều sheet hoặc nhiều file khác nhau lại thành một bảng tổng — theo vị trí ô hoặc theo tên nhãn — mà không cần viết một công thức SUM hay tham chiếu 3D nào."
tu_khoa: "Consolidate Excel, hop nhat du lieu nhieu sheet, gop so lieu nhieu file Excel, tong hop du lieu tu nhieu sheet, consolidate by category"
anh_bia: "/images/bai-viet/consolidate/cover.png"
thu_muc_anh: "consolidate"
trang_thai: "draft"
---

Một sổ tính có 12 sheet, mỗi sheet là doanh thu một tháng, cùng cấu trúc bảng. Nếu vị trí ô giống hệt nhau trên mọi sheet, [tham chiếu 3D](/blog/ham-sum-cong-tong-va-nhung-dieu-de-bi-bo-qua) như `=SUM(Thang1:Thang12!B2)` là đủ. Nhưng nếu các sheet đến từ nhiều người khác nhau — thứ tự dòng lệch nhau, tên sản phẩm không cùng vị trí ô — công thức 3D sẽ cộng sai chỗ. `Consolidate` giải quyết đúng tình huống lộn xộn này.

## Hai cách gộp: theo vị trí, hoặc theo nhãn

Vào `Data → Consolidate`. Điểm quan trọng nhất là chọn đúng cách gộp:

{{anh:cs-01-hai-cach-gop}}

- **By position** (theo vị trí): giả định mọi sheet có cấu trúc **giống hệt nhau** — cùng số dòng, cùng thứ tự sản phẩm. Excel cộng thẳng ô này với ô kia theo toạ độ, không quan tâm nhãn dòng/cột ghi gì.
- **By category** (theo nhãn — tick ô "Top row" và/hoặc "Left column"): Excel đọc nhãn dòng/cột trước, rồi tự khớp đúng nhãn với nhau dù thứ tự trên từng sheet khác nhau hoàn toàn.

Với dữ liệu không được kiểm soát chặt (nhiều người nhập, thứ tự sản phẩm không thống nhất), **luôn chọn theo nhãn** — an toàn hơn nhiều so với theo vị trí.

## Cách gộp theo nhãn tự khớp đúng dù thứ tự khác nhau

{{anh:cs-02-theo-nhan}}

Sheet tháng 1 liệt kê `Laptop, Chuột, Bàn phím`; sheet tháng 2 lại liệt kê `Bàn phím, Laptop, Chuột` — thứ tự đảo lộn hoàn toàn. Với `By category`, Excel vẫn cộng đúng doanh thu Laptop của tháng 1 vào đúng doanh thu Laptop của tháng 2, bất kể chúng nằm ở dòng nào trên mỗi sheet. Sản phẩm nào chỉ xuất hiện ở một vài sheet (không có ở sheet khác) vẫn được liệt kê đủ trong kết quả, phần thiếu coi như `0`.

## Gộp cả từ file khác, không chỉ sheet trong cùng workbook

Consolidate không giới hạn trong một file. Nhấn nút chọn vùng (biểu tượng mũi tên đỏ) rồi mở một workbook khác đang chạy để chọn vùng từ đó — hữu ích khi mỗi chi nhánh gửi về một file Excel riêng và bạn cần gộp số liệu từ nhiều file thành một bảng tổng.

## Liên kết với nguồn để tự cập nhật

Có một tuỳ chọn dễ bị bỏ qua trong hộp thoại: **"Create links to source data"**. Bật tuỳ chọn này, kết quả gộp sẽ chứa các công thức tham chiếu ngược về từng sheet nguồn (dạng outline có thể thu gọn/mở rộng), nên khi số liệu ở sheet gốc thay đổi, bảng tổng **tự cập nhật theo**. Không bật, kết quả chỉ là **giá trị tĩnh** tại thời điểm gộp — giống Flash Fill, sửa nguồn sau đó không ảnh hưởng gì tới bảng đã gộp.

{{anh:cs-03-lien-ket-nguon}}

## Khi nào nên dùng Power Query thay vì Consolidate

Consolidate làm tốt việc **cộng/trung bình/đếm** số liệu theo nhãn khớp nhau. Nhưng nếu cần biến đổi dữ liệu phức tạp hơn trước khi gộp — đổi tên cột, lọc bỏ dòng rác, tách gộp bảng theo nhiều điều kiện — [Power Query](/blog/power-query-gop-file-xu-ly-data-automation) là công cụ mạnh hơn nhiều, và quan trọng nhất là nó **ghi nhớ các bước xử lý**, chỉ cần bấm "Refresh" khi có file mới thay vì làm lại từ đầu mỗi lần.

## Kiểm nhanh trên máy bạn

- Dựng ba sheet doanh thu theo tháng với thứ tự sản phẩm đảo lộn nhau, gộp bằng `Consolidate` chọn `By category` với "Top row" và "Left column" đều được tick.
- Thử bật "Create links to source data", sửa một số liệu ở sheet gốc, rồi xem bảng gộp tự đổi theo.
