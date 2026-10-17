---
tieu_de: "AutoSave và Version History: khôi phục lại phiên bản cũ khi lỡ tay"
slug: "autosave-va-version-history-trong-excel-khoi-phuc-phien-ban-cu"
danh_muc: "Excel"
the: ["AutoSave", "Version History", "công cụ dữ liệu"]
mo_ta: "AutoSave chỉ hoạt động khi file nằm trên OneDrive/SharePoint, và chính vì nó lưu liên tục nên Ctrl+Z không còn là lưới an toàn cuối cùng — Version History mới là nơi thật sự cứu bạn khi cần quay về bản trước khi sửa hỏng."
tu_khoa: "AutoSave Excel, Version History Excel, khoi phuc phien ban cu file Excel, AutoSave khac AutoRecover, luu tu dong OneDrive Excel"
anh_bia: "/images/bai-viet/autosave-version-history/cover.png"
thu_muc_anh: "autosave-version-history"
trang_thai: "draft"
---

Thanh công cụ Excel có một công tắc nhỏ tên `AutoSave` ở góc trên bên trái, nhiều người bật lên mà không để ý nó thay đổi hẳn cách file được lưu — và vì sao "lỡ sửa hỏng rồi đóng file không lưu" không còn là cách thoát hiểm nữa.

## AutoSave chỉ chạy khi file nằm trên đám mây

Đây là điều kiện tiên quyết ít người để ý: `AutoSave` **chỉ hoạt động với file lưu trên OneDrive hoặc SharePoint**. Mở một file nằm trên ổ đĩa máy tính (`C:\...`) hay USB, công tắc `AutoSave` sẽ tự động tắt và mờ đi, không bật lên được:

{{anh:as-01-dieu-kien}}

Khi đủ điều kiện và được bật, Excel lưu file lên đám mây liên tục theo từng thay đổi nhỏ — không còn khái niệm "chưa lưu" như trước, và cũng không còn phím `Ctrl+S` mang ý nghĩa "chốt lại bản này" như file cục bộ thông thường.

## Hệ quả: sửa hỏng rồi đóng file không lưu không cứu được bạn nữa

Với file cục bộ truyền thống, một mẹo quen thuộc là: sửa hỏng gì đó, đóng file **không lưu**, mở lại là về nguyên bản cũ. Với `AutoSave` bật, mẹo này **không còn tác dụng** — mọi thay đổi đã được lưu lên đám mây gần như ngay lập tức, kể cả những thay đổi bạn muốn huỷ.

{{anh:as-02-khong-con-luoi-an-toan}}

Đây chính là lý do `Version History` trở nên quan trọng hơn hẳn khi dùng AutoSave — nó là lưới an toàn thật sự thay cho thói quen cũ.

## Khôi phục phiên bản cũ bằng Version History

Vào `File → Info → Version History` (hoặc bấm mũi tên nhỏ cạnh tên file trên thanh tiêu đề):

{{anh:as-03-version-history}}

Excel liệt kê các mốc phiên bản đã lưu theo thời gian, kèm tên người chỉnh sửa nếu file được chia sẻ nhiều người dùng. Chọn một mốc để xem trước nội dung phiên bản đó ở chế độ chỉ đọc, rồi bấm `Restore` nếu muốn quay hẳn về mốc đó — hoặc `Download a copy` nếu chỉ muốn lấy riêng bản cũ ra mà không ảnh hưởng bản hiện tại.

## AutoSave khác AutoRecover ở điểm nào

Hai cái tên rất dễ nhầm, nhưng phục vụ hai mục đích khác hẳn nhau:

{{anh:as-04-autosave-vs-autorecover}}

- **AutoSave** — chỉ chạy trên file đám mây, lưu **liên tục** ngay khi có thay đổi, mục đích là đồng bộ, không phải sao lưu phòng hờ.
- **AutoRecover** — chạy trên **mọi file**, kể cả file cục bộ, lưu một bản nháp tạm theo chu kỳ (mặc định 10 phút) để phòng khi Excel bị treo hoặc mất điện đột ngột. Khi mở lại Excel sau sự cố, khung `Document Recovery` sẽ tự hiện ra đề nghị khôi phục bản nháp gần nhất.

Nói cách khác: `AutoSave` lo việc **không bao giờ mất bản mới nhất**, còn `AutoRecover` lo việc **không mất trắng khi phần mềm gặp sự cố**. Cả hai không thay thế cho thói quen tự lưu file định kỳ bằng `Ctrl+S` khi làm việc với file cục bộ.

## Kiểm nhanh trên máy bạn

- Mở một file trên OneDrive, quan sát công tắc `AutoSave` tự bật; mở một file trên ổ `C:` để thấy nó mờ đi và không bật được.
- Nếu đang có file trên OneDrive, thử `File → Info → Version History` để xem danh sách các mốc đã lưu.
