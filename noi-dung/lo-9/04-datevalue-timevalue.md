---
tieu_de: "DATEVALUE, TIMEVALUE: chuyển văn bản ngày giờ thành giá trị tính toán được"
slug: "ham-datevalue-timevalue-chuyen-van-ban-thanh-ngay-gio"
danh_muc: "Excel"
the: ["DATEVALUE", "TIMEVALUE", "hàm ngày tháng"]
mo_ta: "Dữ liệu ngày tháng xuất từ hệ thống khác thường trông giống ngày nhưng thực chất là văn bản — không SUMIFS, không sắp xếp đúng được. DATEVALUE và TIMEVALUE chuyển chúng thành ngày giờ thật, nhưng phụ thuộc đúng định dạng vùng miền đang cấu hình."
tu_khoa: "hàm DATEVALUE Excel, hàm TIMEVALUE Excel, chuyển text thành ngày Excel, ngày tháng dạng văn bản, lỗi VALUE ngày tháng"
anh_bia: "/images/bai-viet/ham-datevalue-timevalue/cover.png"
thu_muc_anh: "ham-datevalue-timevalue"
trang_thai: "draft"
---

Bài [YEAR, MONTH, DAY](/blog/ham-year-month-day-tach-nam-thang-ngay) có nhắc tới một lỗi: các hàm ngày tháng trả về `#VALUE!` khi ô trông giống ngày nhưng thực chất là văn bản. `DATEVALUE` và `TIMEVALUE` chính là hàm sửa đúng vấn đề đó — chuyển chuỗi văn bản thành giá trị ngày giờ thật mà Excel tính toán được.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=DATEVALUE(chuoi_ngay)
=TIMEVALUE(chuoi_gio)
```

{{anh:dv-01-cu-phap-co-ban}}

`DATEVALUE("15/03/2026")` trả về số serial của ngày đó — hiển thị ra là một con số cho tới khi định dạng lại ô thành ngày tháng. `TIMEVALUE("08:45:30")` tương tự, trả về phần thập phân đại diện cho giờ đó trong một ngày.

## Cách nhận biết một ô "trông giống ngày" nhưng là văn bản

Dữ liệu xuất từ phần mềm kế toán, hệ thống chấm công, hay file CSV thường mắc lỗi này: ô hiển thị `15/03/2026` giống hệt một ngày thật, nhưng căn lề lại nằm bên **trái** thay vì bên phải — dấu hiệu rõ nhất của một chuỗi văn bản, không phải số.

{{anh:dv-02-can-trai-la-text}}

Với ô dạng này, mọi hàm ngày tháng (`YEAR`, `MONTH`, `SUMIFS` theo điều kiện ngày, sắp xếp theo thời gian...) đều thất bại hoặc cho kết quả sai, vì Excel không coi đó là một ngày.

## Sửa bằng DATEVALUE

```excel
=DATEVALUE(A2)
```

{{anh:dv-03-sua-bang-datevalue}}

Kết quả trả về là một số serial — cần định dạng lại ô đó thành kiểu Ngày (Ctrl+1 → Date) để hiển thị đúng thành ngày tháng thay vì một dãy số. Sau bước này, cột mới đã là ngày thật, dùng được với mọi hàm ngày tháng khác.

## Điểm cần cẩn thận: DATEVALUE đọc theo định dạng vùng miền của máy

`DATEVALUE` không tự đoán "ngày/tháng/năm" theo một chuẩn cố định — nó đọc chuỗi theo đúng cách máy tính đang cấu hình vùng miền (Region settings). Với một chuỗi mập mờ như `"03/04/2026"`:

{{anh:dv-04-mo-ho-vung-mien}}

- Máy cấu hình định dạng Việt Nam/Anh (ngày/tháng/năm) hiểu đây là **3 tháng 4**.
- Máy cấu hình định dạng Mỹ (tháng/ngày/năm) hiểu đây là **4 tháng 3**.

Cả hai cách đọc đều không báo lỗi — `DATEVALUE` cứ trả về một ngày hợp lệ, chỉ là sai ngày so với ý định ban đầu. Rủi ro này chỉ lộ ra khi file được mở trên một máy cấu hình vùng miền khác với máy tạo ra dữ liệu, và không có cách nào để công thức tự phát hiện — cách an toàn nhất là kiểm tra vài dòng đầu bằng mắt sau khi chuyển đổi, đặc biệt với ngày có cả hai phần đều nhỏ hơn 13 (dễ nhầm) như ví dụ trên.

## TIMEVALUE dùng cùng cách với dữ liệu giờ giấc dạng văn bản

```excel
=TIMEVALUE(B2)
```

{{anh:dv-05-timevalue}}

Cùng vấn đề, cùng cách sửa — dữ liệu giờ chấm công xuất ra dạng văn bản `"08:45:30"` cần `TIMEVALUE` để chuyển thành giờ thật trước khi dùng được với `HOUR`, `MINUTE`, hay cộng trừ thời lượng.

## Tổng kết

`DATEVALUE` và `TIMEVALUE` chuyển chuỗi văn bản ngày giờ thành giá trị tính toán được, sửa đúng lỗi `#VALUE!` khi các hàm ngày tháng gặp phải ô trông giống ngày nhưng thực chất là văn bản. Điểm cần nhớ: `DATEVALUE` đọc chuỗi mập mờ theo định dạng vùng miền của máy đang mở file, nên luôn kiểm tra lại kết quả khi chuỗi gốc có cả phần ngày và tháng đều nhỏ hơn 13.

Đọc tiếp trong cùng cụm bài: [WORKDAY, WORKDAY.INTL — tính ngày làm việc sau N ngày, bỏ qua cuối tuần và ngày nghỉ](/blog/ham-workday-workday-intl-tinh-ngay-lam-viec).
