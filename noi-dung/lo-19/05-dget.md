---
tieu_de: "DGET: lấy đúng một giá trị duy nhất, và cách nó phát hiện dữ liệu trùng lặp giúp bạn"
slug: "ham-dget-lay-dung-mot-gia-tri-duy-nhat"
danh_muc: "Excel"
the: ["DGET", "hàm cơ sở dữ liệu"]
mo_ta: "DGET trả về đúng một giá trị khớp điều kiện — nếu có nhiều hơn một dòng khớp, nó báo lỗi thay vì âm thầm lấy dòng đầu tiên như VLOOKUP vẫn làm, biến DGET thành một cách phát hiện dữ liệu trùng lặp ngoài ý muốn."
tu_khoa: "hàm DGET Excel, lay gia tri duy nhat, DGET phat hien trung lap, DGET khac VLOOKUP"
anh_bia: "/images/bai-viet/ham-dget/cover.png"
thu_muc_anh: "ham-dget"
trang_thai: "draft"
---

Bài trước, [DMAX, DMIN](/blog/ham-dmax-dmin-gia-tri-lon-nhat-nho-nhat-co-so-du-lieu) tìm giá trị lớn nhất, nhỏ nhất. `DGET` là hàm cuối cùng và đặc biệt nhất trong nhóm hàm cơ sở dữ liệu — nó không tổng hợp nhiều dòng thành một con số, mà lấy ra **đúng một** giá trị duy nhất, và cố tình báo lỗi nếu điều đó không thể thực hiện được.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=DGET(vung_du_lieu, truong, vung_dieu_kien)
```

{{anh:dg-01-cu-phap-co-ban}}

Cùng cấu trúc vùng điều kiện với các hàm `D` khác, nhưng kết quả trả về là **một giá trị**, không phải một con số tổng hợp.

## Ứng dụng: tra cứu khi cần đối chiếu nhiều cột để xác định đúng một dòng

[`VLOOKUP`](/blog/lam-chu-ham-vlookup-trong-excel) tra theo đúng một cột khoá duy nhất. Khi cần xác định một dòng dựa trên **nhiều cột cùng lúc** — ví dụ tìm giá của đúng sản phẩm `"Bút bi"` từ nhà cung cấp `"NCC01"` (hai sản phẩm trùng tên nhưng khác nhà cung cấp có giá khác nhau):

```excel
=DGET(A1:D50,"Giá",F1:G2)
```

{{anh:dg-02-tra-cuu-nhieu-cot}}

Vùng điều kiện khai cả `SanPham="Bút bi"` và `NhaCungCap="NCC01"` trên cùng một dòng — `DGET` tìm đúng một dòng thoả cả hai điều kiện và trả về giá của dòng đó.

## Khác biệt quan trọng nhất: báo lỗi khi khớp nhiều hơn một dòng

```excel
=DGET(A1:D50,"Giá",F1:F2)
```

{{anh:dg-03-loi-nhieu-hon-mot-dong}}

Nếu điều kiện chỉ khai `SanPham="Bút bi"` (thiếu điều kiện nhà cung cấp) và có **hai** dòng cùng tên `"Bút bi"` từ hai nhà cung cấp khác nhau, `DGET` báo lỗi `#NUM!` — nó **từ chối đoán** xem nên lấy dòng nào. Đây là khác biệt quan trọng nhất so với `VLOOKUP`: `VLOOKUP` sẽ âm thầm lấy dòng khớp **đầu tiên** tìm thấy mà không hề báo hiệu gì, còn `DGET` chủ động báo lỗi ngay khi phát hiện điều kiện chưa đủ để xác định duy nhất một dòng.

## Tận dụng làm công cụ phát hiện dữ liệu trùng lặp ngoài ý muốn

```excel
=IFERROR(DGET(A1:D50,"Giá",F1:F2),"Kiểm tra lại: trùng lặp hoặc không tìm thấy")
```

{{anh:dg-04-phat-hien-trung-lap}}

Nếu một mã sản phẩm lẽ ra phải là duy nhất trong bảng dữ liệu nhưng vô tình bị nhập trùng hai lần, `DGET` sẽ báo lỗi ngay khi tra theo đúng mã đó — trở thành một cách kiểm tra tính duy nhất của dữ liệu, phát hiện lỗi nhập liệu mà `VLOOKUP` không bao giờ cảnh báo.

## Không khớp dòng nào: báo lỗi khác hẳn

```excel
=DGET(A1:D50,"Giá",F1:F2)
```

{{anh:dg-05-khong-khop-dong-nao}}

Nếu không có dòng nào khớp điều kiện, `DGET` báo lỗi `#VALUE!` — khác với lỗi `#NUM!` khi khớp quá nhiều dòng. Hai mã lỗi khác nhau giúp phân biệt rõ ràng hai tình huống: "không tìm thấy gì" và "tìm thấy nhiều hơn một".

## Tổng kết

`DGET` lấy đúng một giá trị khớp điều kiện, chủ động báo lỗi `#NUM!` nếu khớp nhiều hơn một dòng và `#VALUE!` nếu không khớp dòng nào — khác hẳn `VLOOKUP` âm thầm lấy dòng đầu tiên tìm thấy. Chính đặc tính "từ chối đoán" này biến `DGET` thành một công cụ hữu ích để phát hiện dữ liệu trùng lặp ngoài ý muốn.

Đây là bài cuối trong cụm 5 bài lô 19 về nhóm hàm cơ sở dữ liệu, bắt đầu từ [DSUM](/blog/ham-dsum-tinh-tong-kieu-co-so-du-lieu).
