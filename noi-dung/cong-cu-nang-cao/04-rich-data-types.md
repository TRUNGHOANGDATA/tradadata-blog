---
tieu_de: "Rich Data Types: khi một ô Excel chứa nhiều dữ liệu ẩn bên trong, không chỉ một con số"
slug: "rich-data-types-trong-excel-stock-va-geography"
danh_muc: "Excel"
the: ["Rich Data Types", "Excel 365"]
mo_ta: "Data Type Stock và Geography biến một ô từ chỗ chỉ chứa một con số/tên thành một thẻ dữ liệu sống, mang theo hàng chục thuộc tính liên quan — giá cổ phiếu, vốn hoá, dân số, diện tích — lấy trực tiếp qua công thức mà không cần tra cứu ở đâu khác."
tu_khoa: "Rich Data Types Excel, Stock data type Excel, Geography data type Excel, lay gia co phieu vao Excel, du lieu tu dong cap nhat Excel"
anh_bia: "/images/bai-viet/rich-data-types/cover.png"
thu_muc_anh: "rich-data-types"
trang_thai: "draft"
---

Gõ tên một mã cổ phiếu hoặc tên một quốc gia vào ô, Excel 365 có thể nhận ra đó không chỉ là văn bản — nó là một **thực thể** mang theo hàng loạt dữ liệu liên quan, sẵn sàng để kéo ra bằng công thức. Đây là `Rich Data Types`, đôi khi gọi là "Linked Data Types".

## Biến một ô văn bản thành một thẻ dữ liệu

Gõ tên một mã cổ phiếu (ví dụ `MSFT`) hoặc tên một quốc gia vào một ô, chọn ô đó, vào `Data → Stock` (hoặc `Data → Geography`):

{{anh:rd-01-chuyen-doi}}

Ô đổi từ văn bản thuần sang có biểu tượng nhỏ ở góc — dấu hiệu cho biết nó giờ là một **Rich Data Type**, mang theo bên trong một tập hợp thuộc tính chứ không chỉ một chuỗi ký tự.

## Bấm vào biểu tượng thẻ để xem toàn bộ thuộc tính

Bấm vào biểu tượng thẻ nhỏ trên ô, một bảng thông tin hiện ra với hàng chục thuộc tính khác nhau:

{{anh:rd-02-xem-the}}

Với `Stock`: giá hiện tại, mức thay đổi trong ngày, vốn hoá thị trường, khối lượng giao dịch, tên công ty đầy đủ. Với `Geography`: dân số, diện tích, thủ đô, múi giờ, cờ quốc gia.

## Trích một thuộc tính cụ thể ra ô riêng bằng công thức

Đây là phần biến Rich Data Type từ "xem cho biết" thành "dùng được trong tính toán". Gõ dấu `=`, chọn ô chứa Data Type, gõ tiếp dấu `.`, Excel sẽ gợi ý danh sách thuộc tính để chọn:

```excel
=A2.Price
=A2.Population
```

{{anh:rd-03-trich-thuoc-tinh}}

Kéo công thức này xuống cho cả cột mã cổ phiếu, bạn có ngay một bảng giá cập nhật cho toàn bộ danh mục — không cần tra từng mã một trên một trang web riêng.

## Refresh để cập nhật dữ liệu mới nhất

Rich Data Type không tự động cập nhật liên tục theo thời gian thực. Vào `Data → Refresh All` để Excel tải lại dữ liệu mới nhất cho mọi ô Data Type trong file — tương tự cách [Power Query](/blog/power-query-cho-nguoi-moi) làm mới dữ liệu ngoài khi bạn bấm Refresh.

## Cần kết nối mạng, và không phải quốc gia nào cũng có dữ liệu

Hai giới hạn cần biết trước khi phụ thuộc vào tính năng này:

{{anh:rd-04-gioi-han}}

- **Cần kết nối Internet** để tra cứu và làm mới dữ liệu — mở file ở nơi không có mạng, các ô Data Type vẫn hiển thị giá trị đã lưu lần cuối, nhưng không cập nhật được.
- **Dữ liệu Stock giới hạn ở các sàn giao dịch lớn** (chủ yếu Mỹ và một số thị trường quốc tế) — mã cổ phiếu trên sàn Việt Nam (HOSE, HNX) thường **không** được nhận diện.

## Kiểm nhanh trên máy bạn

- Gõ tên vài quốc gia vào một cột, chuyển sang `Geography` Data Type, rồi dùng công thức `=A2.Population` để kéo ra dân số từng nước.
- Nếu có mã cổ phiếu Mỹ quen thuộc (ví dụ `MSFT`, `AAPL`), thử chuyển sang `Stock` và trích giá hiện tại bằng `=A2.Price`.
