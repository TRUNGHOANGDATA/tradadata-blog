---
tieu_de: "Go To Special: chọn nhanh mọi ô trống, mọi công thức, hay chỉ dòng đang hiện"
slug: "go-to-special-chon-nhanh-o-trong-cong-thuc-hang-hien"
danh_muc: "Excel"
the: ["Go To Special", "chọn vùng dữ liệu"]
mo_ta: "Go To Special chọn cùng lúc mọi ô thoả một tiêu chí trên cả bảng — mọi ô trống, mọi ô có công thức, mọi hằng số, hay chỉ những dòng đang thật sự hiển thị khi đã lọc. Một thao tác thay cho việc dò từng ô bằng mắt."
tu_khoa: "Go To Special Excel, chon o trong hang loat, chon o co cong thuc, Visible Cells Only, F5 Special, chon nhanh vung du lieu"
anh_bia: "/images/bai-viet/go-to-special/cover.png"
thu_muc_anh: "go-to-special"
trang_thai: "draft"
---

Một bảng dữ liệu vài trăm dòng, rải rác vài chục ô trống cần điền `0`, hoặc cần biết chính xác dòng nào đang chứa công thức để tránh gõ đè nhầm. Dò từng ô bằng mắt trên bảng lớn vừa chậm vừa dễ sót. `Go To Special` chọn cùng lúc **mọi ô** thoả một tiêu chí trên toàn vùng, chỉ trong một thao tác.

## Mở công cụ: F5, rồi Special

Bấm `F5` (hoặc `Ctrl+G`) để mở hộp thoại `Go To`, rồi bấm nút `Special...` ở góc dưới:

{{anh:gs-01-mo-hop-thoai}}

Hộp thoại `Go To Special` liệt kê hàng loạt tiêu chí để chọn — đây là phần thật sự mạnh của công cụ này.

## Chọn mọi ô trống để điền hàng loạt

Tick `Blanks`, bấm `OK` — Excel chọn cùng lúc **mọi ô trống** trong vùng đã chọn trước đó:

{{anh:gs-02-blanks}}

Kết hợp với một mẹo nhỏ: sau khi chọn xong mọi ô trống, gõ giá trị cần điền (ví dụ `0`), rồi bấm `Ctrl+Enter` thay vì `Enter` thường — Excel điền **cùng giá trị đó vào mọi ô đang được chọn** trong một lần, không cần copy-paste hay kéo từng vùng riêng lẻ.

## Chọn mọi ô công thức, hoặc chỉ hằng số

Tick `Formulas` để chọn mọi ô đang chứa công thức, hoặc `Constants` để chọn mọi ô chỉ chứa giá trị gõ tay:

{{anh:gs-03-formulas-constants}}

Cách này trả lời nhanh câu hỏi "trong vùng này, đâu là ô người dùng nhập tay, đâu là ô do công thức tính ra" — hữu ích khi kiểm tra một file người khác gửi, tránh gõ đè nhầm lên công thức tưởng là số liệu nhập tay.

## Chọn dữ liệu tô nền đỏ để rà lại nhanh chỗ cần chú ý

Nếu bảng đã đánh dấu các ô cần chú ý bằng [Conditional Formatting](/blog/conditional-formatting-trong-excel-to-mau-du-lieu-tu-dong) (ví dụ tô đỏ số liệu bất thường), `Go To Special → Conditional Formats` chọn thẳng mọi ô đang được tô màu đó, không cần dò mắt tìm từng ô đỏ trên một bảng dài.

## Visible Cells Only: copy đúng phần đang hiển thị, bỏ qua dòng ẩn

Đây là công dụng đáng giá nhất khi làm việc với dữ liệu đã lọc hoặc đã [nhóm Outline](/blog/group-and-outline-thu-gon-du-lieu-theo-cap-bac). Copy bình thường (`Ctrl+C`) trên một vùng đã lọc/ẩn dòng vẫn copy luôn **cả những dòng đang ẩn** — dán ra chỗ khác sẽ dán ra cả dữ liệu không hề nhìn thấy trên màn hình, gây nhầm lẫn khó phát hiện. Chọn `Go To Special → Visible Cells Only` trước khi copy để chỉ lấy đúng những gì đang thực sự hiển thị:

{{anh:gs-04-visible-cells}}

Phím tắt cho thao tác này: `Alt+;` — chọn ngay các ô hiển thị mà không cần mở hộp thoại.

## Kiểm nhanh trên máy bạn

- Tạo một cột có vài ô trống rải rác, dùng `Go To Special → Blanks` rồi gõ `0` kèm `Ctrl+Enter` để điền hàng loạt.
- Lọc ẩn bớt vài dòng trong một bảng, copy bình thường rồi dán ra chỗ trống — so sánh với copy sau khi chọn `Visible Cells Only` (`Alt+;`) để thấy khác biệt.
