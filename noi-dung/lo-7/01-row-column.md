---
tieu_de: "ROW và COLUMN: lấy số thứ tự hàng/cột, đánh số tự động không lệ thuộc dòng thật"
slug: "ham-row-column-danh-so-tu-dong"
danh_muc: "Excel"
the: ["ROW", "COLUMN", "đánh số thứ tự", "hàm cơ bản"]
mo_ta: "ROW và COLUMN trả về số thứ tự hàng/cột của một ô, dùng để đánh số thứ tự tự động không bị lệch khi chèn hoặc xoá dòng — việc kéo số tay không làm được."
tu_khoa: "hàm ROW Excel, hàm COLUMN Excel, đánh số thứ tự tự động, đánh số không lệch khi xoá dòng, STT tự động Excel"
anh_bia: "/images/bai-viet/ham-row-column/cover.png"
thu_muc_anh: "ham-row-column"
trang_thai: "draft"
---

Cách đánh số thứ tự (STT) phổ biến nhất trong Excel là gõ `1`, `2` rồi kéo xuống — nhanh, nhưng có một nhược điểm ít ai để ý: xoá một dòng ở giữa, số thứ tự phía dưới không tự cập nhật lại, để lại một khoảng trống hoặc trùng số. `ROW` và `COLUMN` giải quyết đúng vấn đề đó bằng cách lấy số thứ tự **thật** của hàng và cột trong bảng tính, luôn tự động đúng dù bảng có bị chỉnh sửa thế nào.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## ROW — số thứ tự hàng

```excel
=ROW([reference])
```

Bỏ trống tham số, `ROW()` trả về số thứ tự hàng của chính ô chứa công thức đó.

{{anh:rc-01-row-co-ban}}

```excel
=ROW()
```

Đặt công thức này ở ô `A5`, kết quả trả về **5** — đúng số thứ tự hàng thật trên bảng tính, không phải số bất kỳ do người dùng gõ tay.

## Ứng dụng: đánh số thứ tự không lệch khi xoá dòng

Bảng danh sách bắt đầu từ hàng `2` (hàng `1` là tiêu đề). Muốn cột STT luôn bắt đầu từ `1` bất kể dữ liệu nằm ở hàng thật thứ mấy:

```excel
=ROW() - 1
```

{{anh:rc-02-danh-so-tu-dong}}

Với dữ liệu bắt đầu ở hàng `2`, `ROW()` trả về `2`, trừ đi `1` ra đúng STT `1`. Kéo công thức xuống các hàng tiếp theo, STT luôn tăng đúng theo thứ tự hàng thật — và quan trọng nhất, **xoá một dòng bất kỳ ở giữa bảng, các STT phía dưới tự động dịch lại đúng liên tục**, không để lại khoảng trống hay số trùng như cách gõ tay `1, 2, 3...` rồi kéo xuống.

{{anh:rc-03-sau-khi-xoa-dong}}

## COLUMN — số thứ tự cột

```excel
=COLUMN([reference])
```

Hoạt động tương tự `ROW`, nhưng trả về số thứ tự **cột**, không phải hàng. Cột `A` là `1`, cột `B` là `2`, cứ thế tiếp tục.

{{anh:rc-04-column-co-ban}}

```excel
=COLUMN()
```

Đặt ở ô `C1`, kết quả trả về **3** — đúng số thứ tự cột `C`.

## Ứng dụng: tạo bảng nhân đôi, nhân ba theo cả hàng và cột

Kết hợp `ROW` và `COLUMN` để tạo các mẫu số tự động lặp lại theo cả hai chiều — ví dụ một bảng cửu chương đơn giản:

```excel
=ROW() * COLUMN()
```

{{anh:rc-05-bang-nhan}}

Đặt công thức này vào một vùng và kéo ra cả hàng lẫn cột, mỗi ô tự tính đúng tích của số thứ tự hàng nhân số thứ tự cột nó đang đứng — không cần viết số cố định nào, công thức tự thích ứng theo đúng vị trí.

## Truyền tham chiếu để lấy vị trí của một ô KHÁC

Cả hai hàm đều nhận một tham chiếu tuỳ chọn, để lấy số thứ tự của một ô **khác** thay vì ô chứa công thức:

```excel
=ROW(D10)      ' Trả về 10, dù công thức đặt ở bất kỳ ô nào
=COLUMN(D10)   ' Trả về 4, vì D là cột thứ 4
```

{{anh:rc-06-tham-chieu-o-khac}}

Cách dùng này hữu ích khi cần biết vị trí của một ô cụ thể trong công thức, mà không phải đếm tay xem đó là cột chữ cái thứ mấy — ví dụ chuẩn bị tham số cho hàm [`ADDRESS`](/blog/ham-address-dung-dia-chi-o-dang-van-ban), vốn cần đúng số thứ tự hàng và cột dạng số để dựng ra địa chỉ ô.

## Tổng kết

`ROW` và `COLUMN` trả về số thứ tự thật của hàng và cột trong bảng tính — không phải số cố định do người dùng gõ tay, nên luôn tự động đúng khi bảng bị chèn thêm hoặc xoá bớt dòng, cột. Ứng dụng thực tế phổ biến nhất là đánh số thứ tự tự cập nhật, không bị lệch hay trùng số khi chỉnh sửa bảng dữ liệu.

Đọc tiếp trong cùng cụm bài: [ROWS và COLUMNS — đếm kích thước một vùng dữ liệu](/blog/ham-rows-columns-dem-kich-thuoc-vung).
