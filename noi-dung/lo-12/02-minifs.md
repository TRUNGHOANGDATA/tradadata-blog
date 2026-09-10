---
tieu_de: "MINIFS: chiều ngược lại của MAXIFS, và hỗ trợ ký tự đại diện ít người để ý"
slug: "ham-minifs-tim-gia-tri-nho-nhat-co-dieu-kien"
danh_muc: "Excel"
the: ["MINIFS", "hàm tra cứu"]
mo_ta: "MINIFS tìm giá trị nhỏ nhất trong một vùng có điều kiện, đối xứng với MAXIFS. Cả hai đều hỗ trợ ký tự đại diện * và ? trong điều kiện — một khả năng MIN/MAX gốc không hề có."
tu_khoa: "hàm MINIFS Excel, tìm giá trị nhỏ nhất có điều kiện, ký tự đại diện MINIFS, wildcard Excel"
anh_bia: "/images/bai-viet/ham-minifs/cover.png"
thu_muc_anh: "ham-minifs"
trang_thai: "draft"
---

Bài trước, [MAXIFS](/blog/ham-maxifs-tim-gia-tri-lon-nhat-co-dieu-kien) tìm giá trị lớn nhất có điều kiện. `MINIFS` là hàm song sinh, làm đúng việc ngược lại — tìm giá trị **nhỏ nhất**.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=MINIFS(vung_min, vung_dieu_kien1, dieu_kien1, [vung_dieu_kien2, dieu_kien2], ...)
```

{{anh:mn-01-cu-phap-co-ban}}

Cấu trúc y hệt `MAXIFS`, chỉ khác ở việc trả về giá trị nhỏ nhất thay vì lớn nhất trong các dòng thoả điều kiện.

## Ứng dụng: giá thấp nhất trong một nhóm sản phẩm

```excel
=MINIFS(GiaBan,NhomHang,"Văn phòng phẩm")
```

{{anh:mn-02-gia-thap-nhat}}

Tìm nhanh mức giá thấp nhất trong đúng một nhóm hàng, không cần lọc `AutoFilter` rồi mới nhìn `MIN` bằng mắt.

## Khả năng ít người để ý: hỗ trợ ký tự đại diện trong điều kiện

Cả `MAXIFS` và `MINIFS` đều nhận ký tự đại diện `*` (khớp mọi chuỗi) và `?` (khớp đúng một ký tự) trong điều kiện dạng văn bản, giống `COUNTIFS`/`SUMIFS`:

```excel
=MINIFS(GiaBan,TenHang,"Bút*")
```

{{anh:mn-03-ky-tu-dai-dien}}

Điều kiện `"Bút*"` khớp mọi tên hàng bắt đầu bằng `"Bút"` — `"Bút bi"`, `"Bút chì"`, `"Bút lông"`... — mà không cần liệt kê hết từng tên cụ thể. Đây là một khả năng mà `MIN`/`MAX` gốc hoàn toàn không có, vì bản thân `MIN`/`MAX` không nhận điều kiện nào cả.

## Kết hợp nhiều điều kiện

```excel
=MINIFS(GiaBan,NhomHang,"Văn phòng phẩm",TonKho,">0")
```

{{anh:mn-04-nhieu-dieu-kien}}

Thêm điều kiện `TonKho,">0"` để chỉ tính giá thấp nhất trong số hàng **còn tồn kho**, tránh trường hợp giá thấp nhất tìm được lại thuộc về một mặt hàng đã hết hàng từ lâu.

## Cùng yêu cầu phiên bản với MAXIFS

`MINIFS` cũng chỉ có từ Excel 2019/Microsoft 365 trở lên. Với bản cũ hơn, thay bằng công thức mảng nhấn `Ctrl+Shift+Enter`:

```excel
=MIN(IF(NhomHang="Văn phòng phẩm",GiaBan))
```

{{anh:mn-05-thay-the-ban-cu}}

Và cũng cần nhớ quy tắc đã nói ở bài trước: nếu không có dòng nào khớp điều kiện, `MINIFS` trả về `0`, không phải lỗi — dễ gây hiểu lầm y hệt `MAXIFS` nếu không kiểm tra lại bằng `COUNTIFS`.

## Tổng kết

`MINIFS` tìm giá trị nhỏ nhất có điều kiện, đối xứng hoàn toàn với `MAXIFS`. Cả hai đều hỗ trợ ký tự đại diện `*`/`?` trong điều kiện văn bản — một khả năng `MIN`/`MAX` gốc không có — và đều trả về `0` thay vì báo lỗi khi không có dòng nào khớp.

Đọc tiếp trong cùng cụm bài: [HLOOKUP — tra cứu theo hàng ngang, khi dữ liệu không nằm dọc theo cột](/blog/ham-hlookup-tra-cuu-theo-hang-ngang).
