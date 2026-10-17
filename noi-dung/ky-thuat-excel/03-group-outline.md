---
tieu_de: "Group and Outline: thu gọn dữ liệu theo cấp bậc bằng nút cộng trừ"
slug: "group-and-outline-thu-gon-du-lieu-theo-cap-bac"
danh_muc: "Excel"
the: ["Group and Outline", "công cụ dữ liệu"]
mo_ta: "Group and Outline gắn nút cộng/trừ vào lề bảng để thu gọn hoặc mở rộng các dòng chi tiết, giữ nguyên bố cục gốc — khác PivotTable ở chỗ không tổng hợp lại dữ liệu. Auto Outline còn tự nhận diện cấu trúc nhóm sẵn có từ các dòng tổng SUBTOTAL."
tu_khoa: "Group and Outline Excel, thu gon du lieu Excel, nut cong tru Excel, auto outline, nhom du lieu theo cap bac, bao cao nhieu cap"
anh_bia: "/images/bai-viet/group-outline/cover.png"
thu_muc_anh: "group-outline"
trang_thai: "draft"
---

Một báo cáo doanh thu liệt kê chi tiết từng đơn hàng, nhưng người đọc thường chỉ cần xem tổng theo khu vực, rồi mới bấm xem chi tiết khi cần. [PivotTable](/blog/pivot-table-excel-bao-cao-dong-5-phut) giải quyết việc này bằng cách **tổng hợp lại** dữ liệu thành một bảng mới. `Group and Outline` làm một việc khác: giữ nguyên bố cục bảng gốc, chỉ thêm nút thu gọn/mở rộng vào lề.

## Nhóm dòng hoặc cột theo cấp bậc

Chọn các dòng chi tiết muốn gộp lại, vào `Data → Group` (hoặc phím tắt `Shift+Alt+Mũi tên phải`):

{{anh:go-01-nhom-dong}}

Excel thêm một dải có nút `−` ở lề trái, bấm vào để thu gọn toàn bộ các dòng chi tiết, chỉ để lại đúng một dòng tổng. Bấm lại nút `+` để mở rộng ra như cũ. Có thể nhóm theo cột (`Shift+Alt+Mũi tên phải` khi đang chọn cột) với cùng nguyên lý, hữu ích cho báo cáo có nhiều cột tháng mà chỉ cần xem tổng quý.

## Auto Outline: để Excel tự nhận diện cấu trúc nhóm

Nếu bảng đã có sẵn các dòng/cột tổng (dùng công thức `SUM` ở cuối mỗi nhóm), không cần nhóm tay từng phần — `Data → Group → Auto Outline` sẽ tự quét công thức và đoán ra cấu trúc phân cấp:

{{anh:go-02-auto-outline}}

Excel nhận ra dòng nào là "dòng tổng" (có công thức tham chiếu tới các dòng phía trên) và tự nhóm các dòng chi tiết bên dưới nó lại. Cách này nhanh hơn nhóm tay khi báo cáo đã có cấu trúc tổng-chi tiết rõ ràng từ trước — đúng kiểu bố cục thường gặp ở [báo cáo P&L, cash flow](/blog/bao-cao-quan-tri-excel-pnl-cash-flow-kpi) có nhiều dòng SUBTOTAL lồng nhau.

## Nhóm nhiều cấp lồng nhau

Outline hỗ trợ tối đa 8 cấp lồng nhau. Nhóm một cụm dòng chi tiết thành cấp 1, rồi chọn tiếp một cụm rộng hơn (bao gồm vài nhóm cấp 1 cộng dòng tổng lớn hơn) để tạo cấp 2:

{{anh:go-03-nhieu-cap}}

Các nút số `1 2 3` xuất hiện ở góc trên bên trái cho phép thu gọn/mở rộng **toàn bộ báo cáo** về đúng một cấp mong muốn chỉ bằng một cú nhấp — bấm số `1` để chỉ xem dòng tổng lớn nhất, bấm số cao nhất để xem đầy đủ mọi chi tiết.

## Khác PivotTable ở điểm nào

Đây là câu hỏi nhiều người thắc mắc khi đã quen PivotTable:

- **Group and Outline** giữ nguyên **thứ tự và bố cục dòng gốc** — dữ liệu vẫn nằm đúng chỗ như bạn đã dựng, chỉ ẩn/hiện theo cấp.
- **PivotTable** dựng lại một bảng **hoàn toàn mới** dựa trên cách bạn kéo trường vào hàng/cột/giá trị — linh hoạt hơn để đổi góc nhìn (đổi trục, đổi phép tính), nhưng không giữ nguyên bố cục ban đầu.

Chọn Outline khi bố cục báo cáo đã cố định và bạn chỉ cần ẩn bớt chi tiết để dễ đọc. Chọn PivotTable khi cần xoay chuyển góc nhìn dữ liệu linh hoạt.

## Xoá nhóm khi không cần nữa

`Data → Ungroup` (hoặc `Shift+Alt+Mũi tên trái`) gỡ từng nhóm một. Muốn xoá sạch toàn bộ outline trong một lần, vào `Data → Ungroup → Clear Outline`.

## Kiểm nhanh trên máy bạn

- Chọn vài dòng chi tiết, nhóm lại bằng `Shift+Alt+→`, bấm thử nút `−`/`+` để thấy hiệu ứng thu gọn.
- Nếu bảng đã có dòng `SUM` tổng sẵn, thử `Auto Outline` để xem Excel tự đoán cấu trúc đúng đến đâu.
