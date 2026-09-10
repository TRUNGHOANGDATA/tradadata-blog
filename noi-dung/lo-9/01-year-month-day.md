---
tieu_de: "YEAR, MONTH, DAY: tách năm, tháng, ngày ra khỏi một ô ngày tháng"
slug: "ham-year-month-day-tach-nam-thang-ngay"
danh_muc: "Excel"
the: ["YEAR", "MONTH", "DAY", "hàm ngày tháng"]
mo_ta: "Ba hàm đơn giản nhất trong nhóm ngày tháng: YEAR, MONTH, DAY tách một ô ngày thành ba con số riêng — năm, tháng, ngày — để nhóm dữ liệu theo tháng, so sánh theo năm mà không cần định dạng lại cột gốc."
tu_khoa: "hàm YEAR Excel, hàm MONTH Excel, hàm DAY Excel, tách năm tháng ngày trong Excel, nhóm dữ liệu theo tháng"
anh_bia: "/images/bai-viet/ham-year-month-day/cover.png"
thu_muc_anh: "ham-year-month-day"
trang_thai: "draft"
---

Một ô ngày tháng trong Excel thực ra chỉ là một con số — số ngày tính từ 0/1/1900. `YEAR`, `MONTH`, `DAY` là ba hàm đơn giản nhất để lấy ra riêng từng phần của con số đó: năm, tháng trong năm, ngày trong tháng.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=YEAR(ngay)
=MONTH(ngay)
=DAY(ngay)
```

Cả ba chỉ nhận đúng một tham số: một ô chứa ngày tháng, hoặc chính hàm `TODAY()`/`DATE()`.

{{anh:ymd-01-cu-phap-co-ban}}

Với ô chứa ngày `15/03/1995`: `YEAR` trả về `1995`, `MONTH` trả về `3`, `DAY` trả về `15`. Không có định dạng đặc biệt gì — kết quả luôn là số nguyên thuần.

## Vì sao cần tách ra thay vì để nguyên cột ngày

Giả sử một bảng bán hàng vài nghìn dòng, mỗi dòng có ngày bán dạng đầy đủ như `12/07/2026`. Muốn biết tổng doanh thu theo từng tháng, dùng trực tiếp cột ngày đầy đủ để `SUMIF` sẽ không gộp được — mỗi ngày là một giá trị khác nhau, không có "tháng 7" nào để so khớp.

{{anh:ymd-02-du-lieu-ban-hang}}

Thêm một cột phụ `=MONTH(B2)` (và một cột `=YEAR(B2)` nếu dữ liệu trải qua nhiều năm), rồi `SUMIFS` theo hai cột phụ đó, là cách nhanh nhất để nhóm theo tháng mà không cần sửa gì ở cột ngày gốc:

```excel
=SUMIFS(DoanhThu, ThangPhu, 7, NamPhu, 2026)
```

{{anh:ymd-03-cot-phu-nhom-thang}}

Cách khác gọn hơn khi chỉ cần xem báo cáo, không cần công thức: đưa cột ngày gốc vào [Pivot Table](/blog/pivot-table-trong-excel-bien-du-lieu-thanh-bao-cao) — Excel tự đề nghị nhóm theo Tháng/Quý/Năm mà không cần tạo cột phụ nào cả. Cột phụ `MONTH`/`YEAR` vẫn hữu ích khi cần dùng kết quả trong công thức khác, ví dụ `SUMIFS` như trên.

## Kết hợp cả ba để dựng lại một ngày theo cách khác

`DAY` một mình ít khi dùng riêng, nhưng kết hợp với `DATE` thì đổi được ngày trong một ô mà không đụng tới tháng và năm:

```excel
=DATE(YEAR(A2), MONTH(A2), 1)
```

{{anh:ymd-04-ngay-dau-thang}}

Công thức này luôn trả về ngày **1** của đúng tháng và năm lấy từ `A2`, bất kể ngày gốc là ngày nào trong tháng đó — hữu ích khi cần một mốc "đầu tháng" cố định để so sánh hoặc để làm trục ngang cho biểu đồ.

## Lỗi thường gặp: ô trông giống ngày nhưng thực ra là văn bản

`YEAR`, `MONTH`, `DAY` chỉ hoạt động đúng khi ô chứa một giá trị ngày tháng thật (Excel lưu dưới dạng số). Nếu dữ liệu được dán vào từ một hệ thống khác và ô hiển thị `15/03/1995` nhưng thực chất là **văn bản** — thường nhận ra vì nó bị căn trái thay vì căn phải — cả ba hàm sẽ trả về lỗi `#VALUE!`.

{{anh:ymd-05-loi-value-voi-text}}

Trường hợp này cần chuyển văn bản thành ngày thật trước bằng `DATEVALUE`, rồi mới tách được năm/tháng/ngày như bình thường.

## Tổng kết

`YEAR`, `MONTH`, `DAY` tách một ô ngày tháng thành ba con số riêng biệt, dùng làm cột phụ để nhóm và so sánh dữ liệu theo tháng hoặc theo năm mà không cần định dạng lại cột gốc. Cả ba đều đòi hỏi ô đầu vào là ngày tháng thật, không phải văn bản trông giống ngày.

Đọc tiếp trong cùng cụm bài: [HOUR, MINUTE, SECOND — tách giờ, phút, giây từ một ô thời gian](/blog/ham-hour-minute-second-tach-gio-phut-giay).
