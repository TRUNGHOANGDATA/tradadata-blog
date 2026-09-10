---
tieu_de: "REPLACE: thay thế văn bản theo vị trí, không cần biết nội dung cũ là gì"
slug: "ham-replace-thay-the-theo-vi-tri"
danh_muc: "Excel"
the: ["REPLACE", "hàm văn bản"]
mo_ta: "REPLACE thay một đoạn văn bản dựa trên vị trí ký tự, khác hẳn SUBSTITUTE vốn thay theo nội dung khớp. Dùng phổ biến nhất để che một phần số điện thoại hoặc CCCD mà không cần biết trước các số đó là gì."
tu_khoa: "hàm REPLACE Excel, thay thế văn bản theo vị trí, che số điện thoại Excel, REPLACE khác SUBSTITUTE"
anh_bia: "/images/bai-viet/ham-replace/cover.png"
thu_muc_anh: "ham-replace"
trang_thai: "draft"
---

Excel có hai hàm cùng tên gọi là "thay thế" nhưng hoạt động khác hẳn nhau: `SUBSTITUTE` thay theo **nội dung khớp** (đã có bài riêng trong [Làm sạch dữ liệu](/blog/lam-sach-du-lieu-trong-excel-trim-clean-substitute-va-cac-ky-thuat-data-cleaning)), còn `REPLACE` thay theo **vị trí ký tự**, không quan tâm ký tự ở đó là gì.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=REPLACE(chuoi_cu, vi_tri_bat_dau, so_ky_tu, chuoi_moi)
```

{{anh:rp-01-cu-phap-co-ban}}

`vi_tri_bat_dau` và `so_ky_tu` xác định đoạn cần cắt bỏ; `chuoi_moi` là đoạn thay vào chỗ đó — không nhất thiết phải cùng độ dài với đoạn bị cắt.

## Ứng dụng phổ biến nhất: che một phần số điện thoại

```excel
=REPLACE(A2,4,4,"****")
```

{{anh:rp-02-che-so-dien-thoai}}

Với số điện thoại `0912345678`, công thức cắt bỏ `4` ký tự bắt đầu từ vị trí thứ `4` (tức `2345`) và thay bằng `****`, cho ra `091****678`. Không cần biết trước các chữ số đó cụ thể là gì — chỉ cần biết đúng vị trí cần che, phù hợp khi hiển thị danh sách khách hàng cho nhân viên mà không để lộ toàn bộ số liên hệ.

## So sánh với SUBSTITUTE: biết vị trí hay biết nội dung

{{anh:rp-03-so-sanh-replace-substitute}}

- Biết rõ **nội dung** cần thay (ví dụ đổi mọi chữ `"Cty"` thành `"Công ty"`) nhưng không biết nó nằm ở đâu trong chuỗi → dùng `SUBSTITUTE`.
- Biết rõ **vị trí** cần thay (ví dụ luôn là 4 ký tự tính từ vị trí thứ 4) nhưng không cần quan tâm nội dung cũ là gì → dùng `REPLACE`.

## Ứng dụng: sửa hàng loạt mã sản phẩm theo đúng vị trí cố định

Một hệ thống mã hàng cũ luôn có 2 ký tự đầu là mã kho, cần đổi hàng loạt từ `"HN"` sang `"HP"` sau khi chuyển kho, nhưng phần còn lại của mã (khác nhau ở từng dòng) phải giữ nguyên:

```excel
=REPLACE(A2,1,2,"HP")
```

{{anh:rp-04-sua-ma-hang-loat}}

Vì `REPLACE` không quan tâm nội dung cũ tại vị trí đó là `"HN"` hay bất kỳ hai ký tự nào khác, công thức vẫn chạy đúng dù không lọc trước xem dòng nào thực sự bắt đầu bằng `"HN"` — miễn cấu trúc mã đều đặt mã kho ở đúng 2 ký tự đầu.

## Lỗi thường gặp: độ dài chuỗi không đồng nhất

`REPLACE` đếm vị trí theo ký tự cố định, nên nếu dữ liệu không có độ dài đồng nhất — ví dụ số điện thoại bàn xen lẫn số di động, hoặc mã hàng cũ lẫn mã hàng mới có số ký tự khác nhau — cùng một công thức `REPLACE(A2,4,4,"****")` có thể che sai chỗ ở những dòng có độ dài khác:

{{anh:rp-05-do-dai-khong-dong-nhat}}

Với chuỗi ngắn hơn dự kiến, vị trí `4` có thể đã rơi vào phần khác của dữ liệu thay vì đúng đoạn cần che. Luôn kiểm tra độ dài dữ liệu (`LEN`) có đồng nhất trước khi áp `REPLACE` hàng loạt theo một vị trí cố định.

## Tổng kết

`REPLACE` thay một đoạn văn bản dựa theo vị trí ký tự, không cần biết nội dung cũ — khác với `SUBSTITUTE` thay theo nội dung khớp mà không cần biết vị trí. Ứng dụng phổ biến nhất là che một phần thông tin nhạy cảm như số điện thoại, nhưng cần dữ liệu có độ dài đồng nhất để tránh che sai chỗ.

Đọc tiếp trong cùng cụm bài: [SIGN — biết ngay một số dương, âm hay bằng 0 mà không cần so sánh tay](/blog/ham-sign-dau-cua-mot-so).
