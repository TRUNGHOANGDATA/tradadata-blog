---
tieu_de: "Nhập ngày tháng đúng cách trong Excel: Control Panel, DATE() và Text to Columns"
slug: "nhap-ngay-thang-dung-cach-trong-excel"
danh_muc: "Excel"
the: ["ngày tháng", "nền tảng Excel", "DATE", "sửa lỗi"]
mo_ta: "Excel hiểu ngày bạn gõ theo cài đặt Short date của máy, nên cùng một chuỗi có thể ra ngày khác nhau trên hai máy. Bài này giải thích vì sao, chỉ ra kiểu nhầm nguy hiểm nhất, và cách gõ ngày để đúng trên mọi máy bằng DATE() cùng cách sửa cả cột ngày bị lỗi."
tu_khoa: "nhập ngày tháng Excel, ngày thành văn bản, hàm DATE, Text to Columns DMY, ngày kiểu Mỹ, Short date Control Panel"
anh_bia: "/images/bai-viet/ngay-thang/cover.png"
thu_muc_anh: "ngay-thang"
trang_thai: "draft"
---

Ngày tháng là chỗ Excel gài bẫy người dùng nhiều nhất, vì cùng một chuỗi bạn gõ có thể cho ra hai kết quả khác nhau trên hai máy khác nhau — mà không có lỗi nào báo. Gốc rễ nằm ở chỗ: Excel hiểu ngày bạn gõ **theo cài đặt Short date của hệ điều hành**, không phải theo ý bạn.

Nhớ lại từ bài [kiểu dữ liệu](/blog/kieu-du-lieu-trong-excel): ngày thực chất là một **số** (số ngày đếm từ 01/01/1900). Nếu Excel không diễn dịch được chuỗi bạn gõ thành số ngày, nó để nguyên thành **văn bản** — và văn bản thì không tính toán được.

## Vì sao cùng một chuỗi lại ra ngày khác nhau

Máy tính Việt Nam thường cài Short date là `dd/MM/yyyy` (Control Panel › Clock and Region › Region › Short date). Với cài đặt này, khi bạn gõ `03/04/2025`, Excel hiểu **ngày 3 tháng 4**. Nhưng cùng chuỗi đó, trên máy cài `M/d/yyyy` (kiểu Mỹ), Excel hiểu **ngày 4 tháng 3**.

{{anh:ng-01-short-date}}

Đây là lý do một file gửi qua lại giữa hai máy có thể lệch ngày mà không ai nhận ra.

## Bảng tổng hợp: bạn gõ gì, Excel hiểu thành gì

(Giả sử máy đang cài `dd/MM/yyyy`.)

| Bạn gõ | Excel hiểu | Vì sao |
|---|---|---|
| `25/12/2025` | Ngày 25/12/2025 | Đúng thứ tự Short date của máy |
| `25-12-2025` | Ngày 25/12/2025 | Dấu gạch nối cũng được, miễn đúng thứ tự |
| `2025-12-25` | Ngày 25/12/2025 | Kiểu năm-tháng-ngày, **máy nào cũng hiểu** |
| `25.12.2025` | **Văn bản** | Dấu chấm không phải dấu tách ngày |
| `ngày 25/12/2025` | **Văn bản** | Có chữ trong ô |
| `25/13/2025` | **Văn bản** | Không có tháng 13 |
| `12/25/2025` | **Văn bản** | Ngày kiểu Mỹ, máy hiểu 25 là tháng — mà không có tháng 25 |

{{anh:ng-02-go-gi-hieu-gi}}

## Kiểu nhầm nguy hiểm nhất

Tất cả các dòng "văn bản" ở trên thật ra *dễ chịu*, vì ô căn trái là bạn biết ngay có gì sai. Kiểu nhầm khó phát hiện nhất là khi cả ngày và tháng đều hợp lệ:

Bạn gõ `03/04/2025` với ý là **mùng 4 tháng 3**, nhưng máy `dd/MM/yyyy` hiểu là **ngày 3 tháng 4**. Ô vẫn là ngày hợp lệ, vẫn căn phải, vẫn tính toán được — chỉ là *sai một tháng* mà không có dấu hiệu nào. Với những ngày dễ nhầm (cả hai số đều ≤ 12), luôn gõ `2025-03-04` hoặc dùng `DATE()`.

## DATE(): cách gõ ngày đúng trên mọi máy

Khi công thức phải chạy đúng bất kể máy nào mở, dùng `DATE(năm, tháng, ngày)` — ghi rõ từng thành phần nên không lệ thuộc Control Panel:

```excel
=DATE(2025,12,25)
```

{{anh:ng-03-ham-date}}

Đây cũng là cách dùng trong điều kiện lọc theo ngày. Ví dụ đếm số đơn trong tháng 3/2025, **đừng** viết `">=01/03/2025"` (phụ thuộc vùng miền), mà chặn hai đầu bằng `DATE`:

```excel
=COUNTIFS(BanHang[Ngày bán],">="&DATE(2025,3,1),BanHang[Ngày bán],"<="&DATE(2025,3,31))
```

{{anh:ng-04-countifs-date}}

## Sửa cả một cột ngày đang bị văn bản

Tải dữ liệu từ hệ thống nước ngoài về, cả cột ngày thành văn bản (căn trái hết)? Sửa một phát:

Chọn cả cột → **Data › Text to Columns › Next › Next** → ở bước 3 chọn **Date: DMY** (day-month-year) → **Finish**. Excel sẽ đọc lại từng ô theo đúng thứ tự bạn khai và trả về ngày thật. Nếu dữ liệu gốc là kiểu Mỹ, chọn **MDY** thay vì DMY.

{{anh:ng-05-text-to-columns}}

## Vài phím tắt và nguyên tắc

- `Ctrl + ;` chèn ngày hôm nay theo đúng định dạng máy — dùng khi nhập liệu hằng ngày, khỏi gõ tay.
- **Chữ "ngày", "tháng" để ở tiêu đề cột**, trong ô chỉ để con số. Có chữ trong ô là cả ô thành văn bản.
- **File dùng chung hoặc gửi ra nước ngoài**: cứ gõ kiểu `2025-12-25` hoặc dùng `DATE()`. Đừng đổi Control Panel chỉ để mở một file — người khác mở lại sẽ lệch.
- Cứ thấy **ô ngày căn trái** là biết đang có ô sai, lọc ra sửa ngay.
