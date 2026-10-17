---
tieu_de: "Flash Fill: điền nhanh theo mẫu, không cần viết công thức"
slug: "flash-fill-dien-nhanh-theo-mau-trong-excel"
danh_muc: "Excel"
the: ["Flash Fill", "công cụ dữ liệu"]
mo_ta: "Flash Fill nhìn mẫu bạn gõ ở một hai dòng đầu rồi tự đoán quy luật, điền nốt cả cột — tách tên, ghép họ tên, định dạng số điện thoại mà không cần một công thức nào. Nhưng kết quả là giá trị tĩnh, không tự cập nhật khi dữ liệu gốc đổi."
tu_khoa: "Flash Fill Excel, dien nhanh trong Excel, Ctrl E Excel, tach ho ten khong dung ham, Flash Fill vs cong thuc"
anh_bia: "/images/bai-viet/flash-fill/cover.png"
thu_muc_anh: "flash-fill"
trang_thai: "draft"
---

Tách họ và tên từ một cột "Họ và tên" thường được giải quyết bằng [LEFT/RIGHT/MID cộng FIND](/blog/cac-ham-xu-ly-chuoi-trong-excel-left-right-mid-trim). Nhưng nếu bạn chỉ cần làm **một lần**, không cần công thức sống mãi trong file, Excel có cách nhanh hơn nhiều: gõ mẫu, để Excel tự đoán phần còn lại. Đó là `Flash Fill`.

## Cách dùng: gõ một ví dụ, Excel tự học quy luật

Giả sử cột A có `"Nguyễn Văn An"`, và bạn muốn tách riêng cột "Tên" (`"An"`) sang cột B. Gõ tay đúng một dòng đầu — `"An"` — rồi:

{{anh:ff-01-go-mau}}

- Cách 1: nhấn `Ctrl+E`.
- Cách 2: vào `Data → Flash Fill`.

Excel nhìn vào dòng bạn vừa gõ, so với dòng tương ứng ở cột nguồn, đoán ra quy luật ("lấy phần sau khoảng trắng cuối cùng"), rồi tự điền toàn bộ các dòng còn lại trong nháy mắt — không một ký tự công thức nào xuất hiện.

## Excel cần bao nhiêu ví dụ để đoán đúng

Với quy luật đơn giản, một dòng mẫu là đủ. Quy luật phức tạp hơn — ví dụ ghép họ tên theo thứ tự khác, hay định dạng lại số điện thoại có quy tắc không đều — thường cần gõ thêm dòng mẫu thứ hai để Excel đoán chắc hơn.

{{anh:ff-02-vi-du-nhieu-dong}}

Nếu Excel đoán sai ngay từ đầu (thường vì dữ liệu nguồn không nhất quán), nó sẽ điền ra kết quả rõ ràng vô lý. Lúc đó, sửa tay vài dòng đầu cho đúng, Excel sẽ học lại và điền tiếp.

## Việc Flash Fill làm tốt nhất

- **Tách chuỗi**: họ/tên, mã vùng/số điện thoại, phần trước/sau dấu `-`.
- **Ghép chuỗi**: gộp họ và tên thành một ô, ghép địa chỉ từ nhiều cột.
- **Định dạng lại**: đổi `"0912345678"` thành `"091-234-5678"`, viết hoa chữ cái đầu.
- **Trích một phần theo vị trí tương đối**: lấy 3 ký tự cuối, lấy phần sau ký tự thứ N — những việc mà [LEFT/RIGHT/MID](/blog/cac-ham-xu-ly-chuoi-trong-excel-left-right-mid-trim) hay [TEXTBEFORE/TEXTAFTER](/blog/textbefore-textafter-textsplit-3-ham-text-moi-cuc-manh) (Excel 365) cũng làm được, nhưng Flash Fill làm mà không cần nhớ cú pháp hàm nào.

## Điểm khác biệt quan trọng nhất: kết quả là giá trị tĩnh

Đây là điều cần hiểu trước khi dùng Flash Fill cho việc gì quan trọng:

{{anh:ff-03-tinh-vs-cong-thuc}}

Flash Fill **không** để lại công thức trong ô — nó chỉ dán vào đó đúng giá trị đã đoán được, y hệt như gõ tay. Sửa lại dữ liệu gốc ở cột A, cột kết quả của Flash Fill **không** tự cập nhật theo — khác hẳn một công thức `LEFT`/`MID` sẽ tự tính lại ngay khi nguồn đổi.

Vì vậy, chọn Flash Fill khi:
- Bạn chỉ cần làm **một lần**, dữ liệu nguồn coi như đã chốt.
- Bạn muốn dán kết quả rồi **xoá cột nguồn** đi (không giữ công thức tham chiếu lơ lửng).

Và chọn công thức khi:
- Dữ liệu nguồn còn thay đổi, cần cột kết quả **tự cập nhật** theo.
- Cần logic phức tạp hơn khả năng đoán của Flash Fill.

## Khi Flash Fill đoán sai vì dữ liệu không đều

Flash Fill học theo mẫu văn bản cụ thể, nên dữ liệu nguồn càng lộn xộn — chỗ viết hoa chỗ viết thường, chỗ có hai khoảng trắng, chỗ thiếu dấu — càng dễ khiến nó đoán sai giữa chừng. Muốn chắc chắn dữ liệu sạch trước khi dùng Flash Fill, [TRIM/CLEAN](/blog/lam-sach-du-lieu-trong-excel-trim-clean-substitute-va-cac-ky-thuat-data-cleaning) là bước nên làm trước.

## Kiểm nhanh trên máy bạn

- Gõ một cột họ tên đầy đủ, thử tách tên riêng bằng `Ctrl+E` sau khi gõ mẫu một dòng.
- Sửa lại một dòng ở cột nguồn sau khi đã Flash Fill xong, quan sát cột kết quả **không** đổi theo — để thấy rõ khác biệt với công thức.
