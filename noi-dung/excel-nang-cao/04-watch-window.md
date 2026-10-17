---
tieu_de: "Watch Window: theo dõi giá trị một ô ở xa mà không cần cuộn qua lại"
slug: "watch-window-theo-doi-o-o-xa-khong-can-cuon-qua-lai"
danh_muc: "Excel"
the: ["Watch Window", "kiểm tra công thức"]
mo_ta: "Watch Window ghim một danh sách ô cần theo dõi vào một cửa sổ nổi riêng, hiện luôn giá trị và công thức của chúng dù bạn đang cuộn ở bất kỳ đâu trong file — kể cả ở một sheet khác. Không cần chia màn hình, không cần lo cuộn nhầm mất dấu."
tu_khoa: "Watch Window Excel, theo doi gia tri o Excel, Add Watch, kiem tra cong thuc tu xa, doi chieu ket qua nhieu sheet"
anh_bia: "/images/bai-viet/watch-window/cover.png"
thu_muc_anh: "watch-window"
trang_thai: "draft"
---

Đang sửa công thức ở đầu một bảng tính lớn, nhưng cần biết ngay lập tức ô "Tổng cộng" ở tận cuối trang có đổi theo không. Cuộn xuống xem, cuộn lên sửa tiếp, cuộn xuống xem lại — lặp đi lặp lại hàng chục lần. `Watch Window` giải quyết đúng việc phiền toái này.

## Ghim một ô vào cửa sổ riêng, xem được từ bất cứ đâu

Vào `Formulas → Watch Window`, bấm `Add Watch`, rồi chọn ô cần theo dõi:

{{anh:ww-01-them-watch}}

Ô đó xuất hiện trong một cửa sổ nhỏ, có thể **thả nổi hoặc ghim cạnh màn hình**, hiển thị đủ thông tin: tên sheet, tên ô, giá trị hiện tại, và cả công thức đang dùng. Cửa sổ này vẫn hiện nguyên tại chỗ dù bạn cuộn, chuyển sheet, hay thậm chí chuyển sang **file Excel khác đang mở** — khác hẳn việc phải kéo thanh cuộn qua lại liên tục.

## Theo dõi nhiều ô cùng lúc, ở nhiều sheet khác nhau

Watch Window không giới hạn một ô. Thêm bao nhiêu ô tuỳ thích, kể cả ô nằm ở **các sheet khác nhau** trong cùng workbook:

{{anh:ww-02-nhieu-o}}

Hữu ích khi cần đối chiếu nhanh vài con số tổng nằm rải rác — ví dụ tổng doanh thu ở sheet "Tháng 1", tổng chi phí ở sheet "Tháng 2", và một ô tính chênh lệch ở sheet "Tổng hợp" — tất cả hiện cùng lúc trong một cửa sổ, không cần mở từng sheet một để so.

## Khác Freeze Panes và Split ở điểm nào

Đây là câu hỏi tự nhiên khi đã quen với [Freeze Panes và Split](/blog/freeze-panes-split-va-group-trong-excel-xem-bang-lon):

- **Freeze Panes/Split** khoá một phần màn hình lại để phần còn lại cuộn riêng — nhưng vẫn giới hạn trong **cùng một sheet**, và chiếm diện tích màn hình đáng kể để chia đôi.
- **Watch Window** không chiếm chỗ trên vùng làm việc chính (có thể thu nhỏ, kéo ra ngoài màn hình phụ nếu có), và theo dõi được ô ở **bất kỳ sheet hay file nào** đang mở — không bị giới hạn trong cùng một khung nhìn.

Chọn Freeze Panes khi cần vừa xem tiêu đề vừa cuộn dữ liệu trong cùng bảng. Chọn Watch Window khi cần đối chiếu vài con số cụ thể nằm rải rác nhiều nơi.

## Xoá ô khỏi danh sách theo dõi khi không cần nữa

Chọn ô trong danh sách Watch Window, bấm `Delete Watch` để gỡ — không ảnh hưởng gì tới ô hay công thức gốc, vì Watch Window chỉ là một cửa sổ **hiển thị**, không phải một loại tham chiếu hay công thức được ghi vào file.

## Kiểm nhanh trên máy bạn

- Thêm một ô tổng ở cuối bảng vào Watch Window, kéo cửa sổ ra một góc màn hình, rồi thử cuộn lên đầu bảng sửa công thức — quan sát giá trị trong Watch Window cập nhật ngay không cần cuộn xuống kiểm tra.
- Thêm thêm một ô ở sheet khác vào cùng danh sách để thấy Watch Window không bị giới hạn trong một sheet.
