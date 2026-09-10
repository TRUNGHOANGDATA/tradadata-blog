---
tieu_de: "IMAGE: chèn ảnh thẳng vào một ô, di chuyển và co giãn theo đúng ô đó"
slug: "ham-image-chen-anh-vao-o"
danh_muc: "Excel"
the: ["IMAGE", "hàm mới Excel 365"]
mo_ta: "IMAGE chèn một tấm ảnh từ URL thẳng vào bên trong một ô — ảnh di chuyển, lọc, sắp xếp theo đúng ô đó, khác hẳn ảnh chèn kiểu nổi (floating) qua Insert Picture vốn không dính gì tới ô bên dưới."
tu_khoa: "hàm IMAGE Excel, chèn ảnh vào ô Excel, IMAGE Excel 365, ảnh trong bảng danh mục sản phẩm"
anh_bia: "/images/bai-viet/ham-image/cover.png"
thu_muc_anh: "ham-image"
trang_thai: "draft"
---

Chèn ảnh vào Excel kiểu truyền thống (`Insert → Picture`) tạo ra một đối tượng nổi (floating) trên bề mặt bảng tính — không dính gì tới ô bên dưới, lọc hay sắp xếp dữ liệu không kéo ảnh theo. `IMAGE` là hàm mới giải quyết đúng vấn đề đó: chèn ảnh thẳng **vào bên trong** một ô.

## Cú pháp

```excel
=IMAGE(url, [van_ban_thay_the], [kich_co], [chieu_cao], [chieu_rong])
```

{{anh:im-01-cu-phap-co-ban}}

`url` là đường dẫn công khai tới tấm ảnh (phải truy cập được không cần đăng nhập). `kich_co` nhận `0` (vừa khít ô, giữ tỷ lệ — mặc định), `1` (kéo giãn lấp đầy ô, có thể méo ảnh), `2` (giữ kích thước gốc), `3` (tự khai `chieu_cao`/`chieu_rong` theo điểm ảnh).

## Ứng dụng: bảng danh mục sản phẩm có ảnh đi kèm

```excel
=IMAGE(B2)
```

{{anh:im-02-danh-muc-san-pham}}

Mỗi dòng sản phẩm có một cột chứa URL ảnh, cột bên cạnh dùng `IMAGE` để hiển thị trực tiếp — lọc theo `NhomHang` hay sắp xếp theo `Gia`, ảnh vẫn đi đúng theo dòng sản phẩm của nó, vì ảnh giờ là **nội dung của ô**, không phải một lớp nổi bên trên.

## Khác biệt cốt lõi so với ảnh chèn kiểu nổi

{{anh:im-03-khac-biet-anh-noi}}

- Ảnh nổi (`Insert Picture`): tồn tại độc lập trên bề mặt trang tính, không thuộc về ô nào — lọc, sắp xếp, xoá dòng đều không ảnh hưởng gì tới vị trí ảnh, dễ gây lệch giữa ảnh và dữ liệu sau khi chỉnh sửa bảng.
- Ảnh qua `IMAGE`: là giá trị của một ô — copy, dán, lọc, sắp xếp, xoá dòng đều kéo theo đúng ảnh tương ứng, giống bất kỳ giá trị nào khác trong ô.

## Kiểm soát cách ảnh vừa với ô

```excel
=IMAGE(B2,"Ảnh sản phẩm",1)
```

{{anh:im-04-kiem-soat-kich-co}}

Tham số `kich_co=1` kéo ảnh lấp đầy toàn bộ ô, kể cả khi tỷ lệ khung hình ảnh gốc không khớp với tỷ lệ ô — cần cân nhắc giữa lấp đầy đẹp mắt và nguy cơ ảnh bị méo, tuỳ ảnh gốc gần vuông hay chữ nhật dài.

## Lỗi thường gặp: URL không truy cập công khai được

```excel
=IMAGE("https://noi-bo.congty.local/anh.png")
```

{{anh:im-05-loi-url-khong-truy-cap}}

Nếu URL trỏ tới một máy chủ nội bộ, yêu cầu đăng nhập, hoặc đường dẫn sai, `IMAGE` không hiển thị được ảnh và trả về lỗi (thường là `#VALUE!` hoặc hình ảnh báo lỗi tuỳ phiên bản). Ảnh phải là URL công khai, load được trực tiếp trên trình duyệt không cần xác thực — ảnh lưu trên Google Drive hay OneDrive riêng tư (chưa chia sẻ public) là nguyên nhân phổ biến nhất gây lỗi này.

## Tổng kết

`IMAGE` chèn ảnh từ URL thẳng vào bên trong một ô, khiến ảnh trở thành một phần dữ liệu thực sự của ô đó — di chuyển, lọc, sắp xếp đều kéo theo đúng ảnh, khác hẳn ảnh nổi truyền thống. Yêu cầu bắt buộc: URL phải công khai, truy cập được không cần đăng nhập.

Đọc tiếp trong cùng cụm bài: [ARRAYTOTEXT — chuyển cả một mảng dữ liệu thành một chuỗi văn bản duy nhất](/blog/ham-arraytotext-chuyen-mang-thanh-van-ban).
