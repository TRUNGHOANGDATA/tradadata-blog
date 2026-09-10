---
tieu_de: "PROPER, UPPER và LOWER: chuẩn hoá cách viết hoa/thường trong dữ liệu"
slug: "ham-proper-upper-lower-chuan-hoa-chu-hoa-thuong"
danh_muc: "Excel"
the: ["PROPER", "UPPER", "LOWER", "chuẩn hoá dữ liệu"]
mo_ta: "Cách dùng PROPER, UPPER, LOWER để chuẩn hoá cách viết hoa thường trong dữ liệu nhập tay lộn xộn, và vì sao VLOOKUP vẫn tìm đúng dù chữ hoa chữ thường khác nhau."
tu_khoa: "hàm PROPER Excel, hàm UPPER, hàm LOWER, chuẩn hoá chữ hoa chữ thường, viết hoa chữ cái đầu Excel"
anh_bia: "/images/bai-viet/ham-proper-upper-lower/cover.png"
thu_muc_anh: "ham-proper-upper-lower"
trang_thai: "draft"
---

Dữ liệu nhập tay từ nhiều người gần như luôn không đồng nhất cách viết hoa thường: người thì gõ "NGUYỄN VĂN A", người thì gõ "nguyễn văn a", người lại gõ "Nguyễn văn a". Với mắt người, cả ba đều dễ nhận ra là cùng một cái tên. Với nhiều thao tác trong Excel — lọc dữ liệu trùng, gộp nhóm, trình bày báo cáo — cách viết không đồng nhất này gây rắc rối thật.

Ba hàm `PROPER`, `UPPER`, `LOWER` giải quyết đúng vấn đề đó: chuẩn hoá cách viết hoa thường về một kiểu thống nhất, chỉ trong một công thức.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Bộ dữ liệu dùng trong bài

Danh sách tên khách hàng nhập từ nhiều nguồn khác nhau, cách viết hoa thường không đồng nhất.

{{anh:pl-01-du-lieu}}

## PROPER — viết hoa chữ cái đầu mỗi từ

```excel
=PROPER(A2)
```

`PROPER` viết hoa chữ cái đầu tiên của **mỗi từ**, còn lại chuyển về chữ thường — đúng kiểu viết tên riêng thông thường.

{{anh:pl-02-proper}}

Với "NGUYỄN VĂN A", "nguyễn văn a", hay "nguyễn VĂN a" — cả ba đều cho ra cùng một kết quả: "Nguyễn Văn A". Đây là hàm hữu ích nhất trong ba hàm khi cần chuẩn hoá tên người, tên địa danh, tên sản phẩm để trình bày báo cáo cho gọn gàng, chuyên nghiệp.

## UPPER — viết hoa toàn bộ

```excel
=UPPER(A2)
```

`UPPER` chuyển toàn bộ chuỗi ký tự sang chữ hoa.

{{anh:pl-03-upper}}

Thường dùng cho mã hàng, mã nhân viên, hoặc bất kỳ trường dữ liệu nào cần đồng nhất về chữ hoa để tránh nhầm lẫn khi so sánh — ví dụ mã sản phẩm "vt001" và "VT001" nhìn khác nhau nhưng thực chất chỉ là cùng một mã viết khác kiểu.

## LOWER — viết thường toàn bộ

```excel
=LOWER(A2)
```

`LOWER` làm ngược lại `UPPER`: chuyển toàn bộ chuỗi về chữ thường.

{{anh:pl-04-lower}}

Ứng dụng phổ biến nhất của `LOWER`: chuẩn hoá địa chỉ email trước khi so sánh hoặc kiểm tra trùng lặp, vì email về nguyên tắc không phân biệt hoa thường nhưng dữ liệu nhập tay thường không đồng nhất.

## Vì sao VLOOKUP không cần các hàm này để dò đúng

Một điều đáng biết: các hàm dò tìm quen thuộc như `VLOOKUP`, `XLOOKUP`, `MATCH` **không phân biệt chữ hoa chữ thường** khi so sánh giá trị. Dò tìm "nguyễn văn a" vẫn khớp được với ô ghi "NGUYỄN VĂN A" mà không cần chuẩn hoá trước bằng `PROPER`, `UPPER`, hay `LOWER`.

{{anh:pl-05-vlookup-khong-phan-biet}}

Vậy khi nào thật sự cần ba hàm này? Không phải để **dò tìm** cho đúng — mà để **trình bày** cho đẹp và **so sánh trực tiếp bằng dấu bằng** cho chính xác. Phép so sánh `=` giữa hai ô (ví dụ trong công thức `IF`, hay điều kiện của `SUMIF`) — về bản chất phần lớn các phép so sánh dạng chuỗi trong Excel cũng không phân biệt hoa thường, nhưng nếu dữ liệu cần xuất ra báo cáo, gửi cho khách hàng, hoặc in ấn, sự thiếu nhất quán trong cách viết hoa thường vẫn trông thiếu chuyên nghiệp — đây là lúc `PROPER` phát huy tác dụng thật sự.

## Kết hợp với TRIM để dọn dữ liệu triệt để

`PROPER`, `UPPER`, `LOWER` chỉ xử lý phần chữ hoa/thường — chúng không đụng tới khoảng trắng thừa, một lỗi dữ liệu khác cũng rất phổ biến (xem thêm ở [Xử Lý Lỗi Trong Excel: #N/A, #VALUE!, #REF!, #DIV/0!](/blog/xu-ly-loi-trong-excel-na-value-ref-div0-cach-khac-phuc)). Kết hợp cả hai để dọn dữ liệu triệt để hơn:

```excel
=PROPER(TRIM(A2))
```

{{anh:pl-06-ket-hop-trim}}

Công thức này vừa cắt khoảng trắng thừa đầu, cuối và ở giữa (nhờ `TRIM`), vừa chuẩn hoá cách viết hoa (nhờ `PROPER`) — chỉ trong một dòng, xử lý được hai loại lỗi dữ liệu phổ biến nhất khi nhập tay.

## Tổng kết

`PROPER` viết hoa chữ cái đầu mỗi từ, phù hợp cho tên riêng. `UPPER` và `LOWER` chuyển toàn bộ chuỗi về một kiểu chữ đồng nhất, phù hợp cho mã dữ liệu và địa chỉ email. Cả ba không cần thiết để các hàm dò tìm như `VLOOKUP` hoạt động đúng — chúng vốn đã không phân biệt hoa thường — nhưng vẫn rất cần để dữ liệu trông nhất quán và chuyên nghiệp khi trình bày.

Đọc tiếp trong cùng cụm bài: [LEN và REPT — đếm độ dài chuỗi và lặp ký tự](/blog/ham-len-rept-dem-do-dai-chuoi-lap-ky-tu). Quay lại [MAX, MIN, LARGE và SMALL](/blog/ham-max-min-large-small-tim-gia-tri-xep-hang).
