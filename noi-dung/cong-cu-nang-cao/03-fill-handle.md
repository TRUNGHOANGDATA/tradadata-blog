---
tieu_de: "Fill Handle: kéo núm điền tự động, và các tuỳ chọn ít ai để ý"
slug: "fill-handle-keo-num-dien-tu-dong-va-cac-tuy-chon-it-ai-de-y"
danh_muc: "Excel"
the: ["Fill Handle", "điền dữ liệu"]
mo_ta: "Núm vuông nhỏ ở góc dưới bên phải ô là công cụ được dùng nhiều nhất nhưng ít được khai thác hết. Kéo nó điền được cả chuỗi số, ngày tháng, danh sách tuỳ chỉnh, sao chép công thức — và double-click vào nó điền cả cột dài mà không cần kéo tay."
tu_khoa: "Fill Handle Excel, keo num dien Excel, AutoFill Excel, double click fill handle, Fill Series options, dien so tang dan tu dong"
anh_bia: "/images/bai-viet/fill-handle/cover.png"
thu_muc_anh: "fill-handle"
trang_thai: "draft"
---

Chấm vuông nhỏ ở góc dưới bên phải một ô đang chọn — hầu như ai dùng Excel cũng từng kéo nó ít nhất một lần. Nhưng phần lớn chỉ dùng đúng một cách: kéo xuống để sao chép công thức. `Fill Handle` còn làm được nhiều hơn thế, và biết hết các tuỳ chọn của nó tiết kiệm được không ít thao tác thủ công.

## Kéo một ô: sao chép nguyên văn

Chọn một ô có sẵn giá trị, kéo núm điền — mặc định Excel **sao chép y nguyên** giá trị đó sang các ô lân cận:

{{anh:fh-01-keo-mot-o}}

Với công thức, việc "sao chép" này đi kèm quy tắc quen thuộc về [tham chiếu tương đối/tuyệt đối](/blog/tham-chieu-tuong-doi-va-tuyet-doi-trong-excel) — ô nào không khoá bằng `$` sẽ tự trượt theo hướng kéo.

## Kéo hai ô trở lên: Excel tự đoán quy luật tăng dần

Chọn **hai ô** đã có sẵn hai giá trị đầu của một dãy, rồi kéo — Excel nhận ra khoảng cách giữa chúng và tự tăng dần theo đúng bước nhảy đó:

{{anh:fh-02-hai-o-tang-dan}}

Chọn `1` và `3`, kéo xuống ra `5, 7, 9...` — Excel tự tính bước nhảy là `2`. Cách này áp dụng được cho cả ngày tháng: chọn `01/01/2026` và `08/01/2026`, kéo xuống sẽ ra các mốc cách nhau đúng 7 ngày.

## Double-click vào núm điền: điền hết cả cột mà không cần kéo tay

Đây là mẹo tiết kiệm thời gian nhất nhưng ít người biết: thay vì kéo núm điền dài xuống hết một cột vài trăm dòng, chỉ cần **double-click** vào đúng núm điền đó. Excel tự động điền xuống đến đúng dòng cuối cùng, dựa theo độ dài của cột dữ liệu **liền kề bên trái hoặc bên phải**:

{{anh:fh-03-double-click}}

Cách này chỉ hoạt động khi có ít nhất một cột lân cận đã có dữ liệu để Excel biết điền tới đâu thì dừng — nếu cột bên cạnh trống, double-click sẽ không có tác dụng gì.

## Chọn đúng kiểu điền: Auto Fill Options

Sau khi kéo xong, một biểu tượng nhỏ hiện ra ngay cạnh vùng vừa điền — bấm vào để đổi cách điền:

{{anh:fh-04-auto-fill-options}}

Vài lựa chọn hay dùng:
- **Copy Cells**: sao chép y nguyên, không tăng dần (dù đang kéo từ hai ô).
- **Fill Series**: ép tăng dần theo quy luật, ngay cả khi chỉ kéo từ một ô.
- **Fill Without Formatting**: điền giá trị/công thức nhưng giữ nguyên định dạng ô đích, không mang theo màu nền/viền của ô nguồn — hữu ích khi vùng đích đã có sẵn định dạng riêng không muốn bị ghi đè.
- **Flash Fill**: chuyển sang chế độ đoán quy luật của [Flash Fill](/blog/flash-fill-dien-nhanh-theo-mau-trong-excel) ngay tại đây, không cần bấm `Ctrl+E` riêng.

## Điền theo danh sách tuỳ chỉnh của riêng bạn

Nếu đã tạo một [Custom List](/blog/sap-xep-theo-danh-sach-tuy-chinh-trong-excel-custom-sort) (ví dụ cấp bậc chức vụ theo đúng thứ tự công ty), gõ giá trị đầu tiên trong danh sách vào một ô rồi kéo núm điền — Excel tự nhận diện và điền tiếp theo đúng thứ tự đã lưu, giống hệt cách nó điền tên thứ trong tuần hay tên tháng.

## Kiểm nhanh trên máy bạn

- Gõ `1` và `3` vào hai ô liền nhau, kéo núm điền xuống để xem Excel tự đoán bước nhảy `2`.
- Thử double-click vào núm điền của một công thức, với điều kiện cột bên cạnh đã có sẵn dữ liệu dài, để thấy nó tự điền hết cột mà không cần kéo tay.
