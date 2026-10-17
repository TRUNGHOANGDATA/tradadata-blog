---
tieu_de: "Sắp xếp theo danh sách tuỳ chỉnh: khi A-Z không phải là thứ tự bạn cần"
slug: "sap-xep-theo-danh-sach-tuy-chinh-trong-excel-custom-sort"
danh_muc: "Excel"
the: ["Custom Sort", "sắp xếp dữ liệu"]
mo_ta: "Sắp xếp A-Z không có nghĩa với cấp bậc chức vụ, tên tháng, hay quy trình nhiều bước — những thứ có một thứ tự logic riêng không theo bảng chữ cái. Custom List cho phép dạy Excel đúng thứ tự bạn cần, dùng lại được cho mọi lần sắp xếp sau."
tu_khoa: "sap xep tuy chinh Excel, Custom List Excel, sap xep theo cap bac, sap xep khong theo bang chu cai, tao danh sach sap xep rieng"
anh_bia: "/images/bai-viet/custom-sort/cover.png"
thu_muc_anh: "custom-sort"
trang_thai: "draft"
---

Sắp xếp một cột chức vụ theo `A → Z` mặc định, kết quả là `Giám đốc`, `Nhân viên`, `Phó phòng`, `Trưởng phòng` — đúng thứ tự chữ cái nhưng sai hoàn toàn thứ tự cấp bậc thực tế. Excel không tự biết "Giám đốc" cao hơn "Trưởng phòng"; nó chỉ biết so sánh ký tự. `Custom Sort` với danh sách tự tạo là cách dạy Excel đúng thứ tự bạn cần.

## Vấn đề: A-Z không phải lúc nào cũng là thứ tự đúng

{{anh:cs-01-van-de}}

Bất kỳ dữ liệu nào có một trật tự **logic** thay vì trật tự **chữ cái** đều gặp vấn đề này: cấp bậc chức vụ, tên các bước trong quy trình (`Tiếp nhận → Xử lý → Duyệt → Hoàn tất`), quy mô áo (`S, M, L, XL`), hay đơn giản là tên tháng viết chữ (`Tháng Một, Tháng Hai...` sắp theo A-Z sẽ lộn xộn hoàn toàn).

## Dùng danh sách có sẵn: thứ Hai đến Chủ Nhật, Tháng 1 đến Tháng 12

Excel đã có sẵn hai danh sách thường dùng, không cần tự tạo. Vào `Data → Sort`, ở cột `Order` chọn `Custom List...`:

{{anh:cs-02-danh-sach-co-san}}

Chọn `Sun, Mon, Tue...` hoặc `Jan, Feb, Mar...` (Excel bản tiếng Việt vẫn hiển thị tên tiếng Anh trong danh sách này) để sắp xếp đúng thứ tự thời gian thay vì thứ tự chữ cái.

## Tạo danh sách riêng cho thứ tự của bạn

Với những thứ tự đặc thù như cấp bậc chức vụ, cần tạo danh sách mới. Trong hộp thoại `Custom Lists` (vào trực tiếp qua `File → Options → Advanced → Edit Custom Lists`, hoặc từ ngay hộp thoại Sort ở bước trên), gõ từng giá trị theo đúng thứ tự mong muốn, mỗi giá trị một dòng, rồi bấm `Add`:

{{anh:cs-03-tao-danh-sach-rieng}}

Danh sách này được **lưu vào chính máy tính** (không lưu trong file Excel), nên dùng lại được cho mọi file, mọi lần sắp xếp sau này — không cần gõ lại mỗi lần cần sắp xếp cùng loại dữ liệu.

## Sắp xếp thực tế bằng danh sách vừa tạo

Vào `Data → Sort`, chọn đúng cột chứa dữ liệu (ví dụ cột "Chức vụ"), ở `Order` chọn `Custom List...` rồi chọn đúng danh sách vừa tạo:

{{anh:cs-04-ket-qua}}

Kết quả sắp xếp đúng theo thứ tự cấp bậc thật, không còn theo bảng chữ cái. Cách này còn dùng được để sắp xếp trong [PivotTable](/blog/pivot-table-excel-bao-cao-dong-5-phut) — kéo trường chức vụ vào hàng, PivotTable sẽ tự nhận diện danh sách tuỳ chỉnh đã tạo và sắp đúng thứ tự đó thay vì A-Z mặc định.

## Danh sách tuỳ chỉnh còn dùng để điền nhanh

Một công dụng phụ ít người để ý: sau khi tạo danh sách, gõ giá trị đầu tiên vào một ô rồi kéo núm điền (fill handle) xuống, Excel sẽ tự điền tiếp theo đúng thứ tự danh sách đã lưu — giống hệt cách kéo `Thứ Hai` tự ra `Thứ Ba, Thứ Tư...`, nhưng áp dụng cho danh sách riêng của bạn.

## Kiểm nhanh trên máy bạn

- Tạo một `Custom List` với 3-4 cấp bậc theo đúng thứ tự công ty bạn, rồi sắp xếp thử một cột chức vụ bằng danh sách đó.
- Gõ giá trị đầu tiên trong danh sách vào một ô, kéo núm điền xuống để xem Excel tự điền tiếp theo đúng thứ tự đã lưu.
