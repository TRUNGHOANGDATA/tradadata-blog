---
tieu_de: "Text to Columns: tách một cột thành nhiều cột, và mẹo ép số về đúng kiểu"
slug: "tach-cot-trong-excel-text-to-columns"
danh_muc: "Excel"
the: ["Text to Columns", "công cụ dữ liệu"]
mo_ta: "Text to Columns tách một cột thành nhiều cột theo dấu phân cách hoặc theo độ rộng cố định. Ít người biết nó còn có công dụng phụ: chạy qua bước 3 mà không đổi gì cũng đủ ép một cột số bị lưu dạng văn bản trở về số thật."
tu_khoa: "Text to Columns Excel, tach cot trong Excel, tach du lieu dan tu ngoai vao, ep so ve dung kieu, sua loi so luu van ban bang text to columns"
anh_bia: "/images/bai-viet/text-to-columns/cover.png"
thu_muc_anh: "text-to-columns"
trang_thai: "draft"
---

Dán một cột dữ liệu từ hệ thống khác vào Excel, đôi khi cả một dòng thông tin — mã, tên, số điện thoại — nằm gộp chung trong một ô, ngăn cách bởi dấu phẩy hoặc khoảng trắng. `Text to Columns` tách nó ra thành từng cột riêng chỉ trong vài cú nhấp, không cần công thức nào.

## Hai chế độ tách: theo dấu phân cách, hoặc theo độ rộng cố định

Vào `Data → Text to Columns`. Bước đầu tiên của hộp thoại hỏi bạn chọn kiểu dữ liệu nguồn:

{{anh:tc-01-hai-che-do}}

- **Delimited** (theo dấu phân cách): dùng khi các phần được ngăn bởi một ký tự cố định — dấu phẩy, dấu chấm phẩy, khoảng trắng, tab. Đây là kiểu dữ liệu file CSV dán vào thường gặp nhất.
- **Fixed width** (theo độ rộng cố định): dùng khi mỗi phần luôn chiếm đúng một số ký tự nhất định, không có ký tự phân cách nào cả — ví dụ mã hàng hoá xuất từ hệ thống cũ, ký tự 1-3 là mã kho, ký tự 4-8 là mã sản phẩm.

## Chọn đúng dấu phân cách

Với `Delimited`, bước tiếp theo cho tick chọn loại dấu phân cách:

{{anh:tc-02-chon-dau-phan-cach}}

Có thể tick nhiều loại cùng lúc (ví dụ vừa dấu phẩy vừa khoảng trắng), và ô "Other" cho phép gõ một ký tự tuỳ ý làm dấu phân cách — hữu ích khi dữ liệu dùng dấu `|` hay `;` thay vì dấu phẩy thông thường. Cửa sổ xem trước bên dưới cập nhật ngay khi bạn đổi lựa chọn, nên cứ thử cho đến khi các cột tách đúng như mong muốn trước khi bấm `Finish`.

## Mẹo ít người biết: ép số về đúng kiểu mà không tách gì cả

Đây là công dụng phụ đáng giá nhất của công cụ này, và không liên quan gì đến việc "tách cột": nếu bạn có một cột [số bị lưu nhầm thành văn bản](/blog/so-bi-luu-thanh-van-ban-trong-excel) — con số căn trái, `SUM` bỏ qua nó — chạy `Text to Columns` trên đúng cột đó, giữ nguyên `Delimited`, không tick dấu phân cách nào, rồi bấm thẳng `Finish`.

{{anh:tc-03-meo-ep-so}}

Excel sẽ đọc lại toàn bộ cột và tự nhận diện: chuỗi nào trông giống số sẽ được chuyển thành số thật, căn lại sang phải. Cách này nhanh hơn hẳn việc nhân từng ô với `1` hay dùng [`VALUE`](/blog/ham-value-text-chuyen-doi-so-van-ban) rồi dán đè, vì áp dụng được cho cả một cột lớn trong một thao tác.

## Khi nào dùng Text to Columns, khi nào dùng Flash Fill

Cả hai đều tách dữ liệu và đều cho ra **giá trị tĩnh**, không phải công thức sống. Khác biệt nằm ở cách vận hành:

- **Text to Columns** phù hợp khi quy tắc tách **rõ ràng và đồng nhất** — luôn cùng một dấu phân cách, hoặc luôn cùng độ rộng cố định cho mọi dòng.
- [**Flash Fill**](/blog/flash-fill-dien-nhanh-theo-mau-trong-excel) phù hợp hơn khi quy tắc **khó diễn đạt bằng một dấu phân cách cụ thể** — ví dụ chỉ lấy tên riêng ở cuối cùng bất kể họ tên dài ngắn khác nhau, việc mà Flash Fill "đoán" giỏi hơn hẳn.

Nếu cần một công thức **sống**, tự cập nhật khi dữ liệu nguồn đổi, thì cả hai công cụ này đều không hợp — lúc đó quay lại dùng hàm [`TEXTSPLIT`](/blog/textbefore-textafter-textsplit-3-ham-text-moi-cuc-manh) (Excel 365) hoặc [LEFT/RIGHT/MID](/blog/cac-ham-xu-ly-chuoi-trong-excel-left-right-mid-trim).

## Cẩn thận: dữ liệu tách ra sẽ ghi đè cột bên phải

Nếu cột bên phải cột đang tách đã có dữ liệu sẵn, các phần tách ra sẽ **ghi đè** lên đó mà không cảnh báo trước khi bạn bấm `Finish` (chỉ có một dòng chữ nhỏ nhắc trong hộp thoại). Luôn chèn thêm vài cột trống bên phải trước khi chạy Text to Columns nếu khu vực đó chưa để trống sẵn.

## Kiểm nhanh trên máy bạn

- Dán một dòng dữ liệu dạng `"SP01,Laptop,15000000"` vào một ô, chạy `Text to Columns` với dấu phân cách là dấu phẩy.
- Thử mẹo ép số: tạo một cột số bị lưu thành văn bản (gõ `'123` có dấu nháy đơn đầu), chạy `Text to Columns` không tick gì cả, quan sát cột chuyển sang căn phải.
