---
tieu_de: "NUMBERVALUE: chuyển văn bản số thành số thật, bất kể định dạng vùng miền nào"
slug: "ham-numbervalue-chuyen-van-ban-thanh-so"
danh_muc: "Excel"
the: ["NUMBERVALUE", "hàm văn bản"]
mo_ta: "NUMBERVALUE chuyển một chuỗi số dạng văn bản thành số thật, cho phép tự khai rõ ký tự nào là dấu thập phân và ký tự nào là dấu phân cách hàng nghìn — giải quyết đúng vấn đề dữ liệu xuất từ hệ thống khác lệch định dạng vùng miền với máy đang mở file."
tu_khoa: "hàm NUMBERVALUE Excel, chuyen text thanh so, loi dinh dang so vung mien, VALUE khac NUMBERVALUE"
anh_bia: "/images/bai-viet/ham-numbervalue/cover.png"
thu_muc_anh: "ham-numbervalue"
trang_thai: "draft"
---

Bài [DATEVALUE, TIMEVALUE](/blog/ham-datevalue-timevalue-chuyen-van-ban-thanh-ngay-gio) đã nói về việc chuyển văn bản ngày giờ thành giá trị thật, và nhắc tới rủi ro đọc sai theo vùng miền. `NUMBERVALUE` giải quyết đúng vấn đề tương tự nhưng cho **số** — và đi xa hơn `VALUE` một bước quan trọng: cho phép tự khai rõ định dạng, không phụ thuộc vùng miền máy đang mở file.

## Cú pháp

```excel
=NUMBERVALUE(van_ban, [dau_thap_phan], [dau_phan_cach_nhom])
```

{{anh:nv-01-cu-phap-co-ban}}

Hai tham số cuối cho phép khai rõ ký tự nào đóng vai trò dấu thập phân và ký tự nào đóng vai trò phân cách hàng nghìn trong chuỗi đưa vào — không cần biết trước máy đang cấu hình vùng miền nào.

## Vấn đề: dữ liệu xuất từ hệ thống khác lệch định dạng vùng miền

Một file CSV xuất từ hệ thống nước ngoài dùng định dạng Mỹ (`.` là dấu thập phân, `,` là phân cách hàng nghìn): chuỗi `"1,234.56"`. Máy đang mở file lại cấu hình vùng miền Việt Nam (`,` là dấu thập phân, `.` là phân cách hàng nghìn):

```excel
=VALUE("1,234.56")
```

{{anh:nv-02-loi-value-thong-thuong}}

`VALUE` đọc chuỗi theo đúng cách máy đang cấu hình — hiểu `,` là dấu thập phân, nên không thể ghép đúng chuỗi này thành một số hợp lệ, kết quả là lỗi `#VALUE!`.

## NUMBERVALUE: khai rõ đúng định dạng của chuỗi gốc

```excel
=NUMBERVALUE("1,234.56",".",",")
```

{{anh:nv-03-sua-bang-numbervalue}}

Khai rõ `.` là dấu thập phân và `,` là phân cách hàng nghìn — đúng với định dạng gốc của chuỗi, bất kể máy đang mở file cấu hình vùng miền nào. Kết quả trả về đúng `1234,56`, không còn phụ thuộc vào cấu hình Region của Windows.

## So sánh với VALUE: khi nào cần NUMBERVALUE

{{anh:nv-04-so-sanh-value-numbervalue}}

- Dữ liệu chắc chắn cùng định dạng vùng miền với máy đang mở file → `VALUE` là đủ, ngắn gọn hơn.
- Dữ liệu xuất từ hệ thống khác, không chắc cùng định dạng vùng miền (file CSV từ đối tác nước ngoài, dữ liệu tải về từ một API quốc tế) → `NUMBERVALUE` an toàn hơn hẳn vì không phụ thuộc cấu hình máy, miễn biết trước định dạng gốc của chuỗi.

## Lỗi thường gặp: khai nhầm hai tham số dấu ngược nhau

```excel
=NUMBERVALUE("1,234.56",",",".")
```

{{anh:nv-05-loi-khai-nguoc-dau}}

Nếu khai ngược — nói `,` là dấu thập phân và `.` là phân cách hàng nghìn cho một chuỗi vốn dĩ theo định dạng Mỹ — kết quả sẽ ra sai hoàn toàn (ở đây thành `1,23456`, lệch hẳn so với `1234,56` đúng) mà không hề báo lỗi, vì bản thân chuỗi `"1,234.56"` với cách hiểu ngược vẫn tách ra được thành một con số hợp lệ, chỉ là sai giá trị: `,` đầu tiên bị coi là dấu thập phân nên toàn bộ phần `234.56` phía sau bị dồn thành phần lẻ, còn dấu `.` chỉ đơn thuần bị xoá đi như một dấu phân cách. Luôn kiểm tra kỹ định dạng gốc của dữ liệu trước khi khai hai tham số này.

## Tổng kết

`NUMBERVALUE` chuyển một chuỗi số dạng văn bản thành số thật, cho phép tự khai rõ dấu thập phân và dấu phân cách hàng nghìn — không phụ thuộc cấu hình vùng miền của máy đang mở file như `VALUE`. Hữu ích nhất khi làm việc với dữ liệu xuất từ hệ thống khác có định dạng số khác với máy hiện tại.

Đọc tiếp trong cùng cụm bài: [UNICHAR — chèn bất kỳ ký tự đặc biệt nào chỉ bằng đúng mã số của nó](/blog/ham-unichar-chen-ky-tu-dac-biet).
