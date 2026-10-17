---
tieu_de: "Excel Table (Ctrl+T) và tham chiếu theo tên cột: công thức tự giãn khi thêm dòng"
slug: "excel-table-va-tham-chieu-theo-ten-cot"
danh_muc: "Excel"
the: ["Table", "nền tảng Excel", "tham chiếu có cấu trúc"]
mo_ta: "Đóng vùng dữ liệu thành Table bằng Ctrl+T thì công thức viết theo tên cột như SUM(BanHang[Doanh thu]) tự giãn khi thêm dòng, khỏi lo sót vùng. Bài này chỉ cách tạo Table, đọc tham chiếu có cấu trúc, và vì sao nó an toàn hơn viết I5:I44."
tu_khoa: "Excel Table, Ctrl T, tham chiếu có cấu trúc, structured reference, tên cột Excel, bảng tự giãn"
anh_bia: "/images/bai-viet/excel-table/cover.png"
thu_muc_anh: "excel-table"
trang_thai: "draft"
---

Cách viết công thức phổ biến nhất — `=SUM(I5:I44)` — cũng là nguồn của một lỗi âm thầm hay gặp: tháng sau bạn thêm mấy dòng dữ liệu ở cuối bảng, nhưng vùng `I5:I44` không tự giãn, nên tổng thiếu mất phần vừa thêm. Không có lỗi nào báo. Đây chính là nguyên tắc số 7 trong [12 nguyên tắc dựng file](/blog/12-nguyen-tac-dung-file-excel-gon-gang), và Excel Table giải quyết nó dứt điểm.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Đóng vùng thành Table: Ctrl + T

Đặt con trỏ vào bất kỳ ô nào trong vùng dữ liệu, bấm `Ctrl + T`, xác nhận vùng và "My table has headers". Vùng dữ liệu thô của bạn giờ là một **Table**.

Nên **đặt tên** cho Table (tab Table Design › ô Table Name), ví dụ `BanHang`, thay cho tên mặc định `Table1`. Tên có nghĩa làm mọi công thức về sau đọc là hiểu.

{{anh:et-01-ctrl-t}}

Table không chỉ là "vùng có màu đẹp". Nó cho bạn bốn thứ:

- Công thức tham chiếu tới nó **tự giãn** khi thêm dòng.
- Công thức trong một cột **tự điền** cho cả cột khi bạn gõ ở một ô.
- Dòng tiêu đề **luôn dính** khi cuộn xuống.
- Có sẵn **Total Row** bật/tắt ở cuối bảng.

## Tham chiếu theo tên cột thay cho toạ độ ô

Với Table tên `BanHang`, thay vì `=SUM(I5:I44)` bạn viết theo tên cột:

```excel
=SUM(BanHang[Doanh thu (VNĐ)])
```

{{anh:et-02-tham-chieu-cau-truc}}

Đây gọi là **tham chiếu có cấu trúc** (structured reference). `BanHang` là tên Table, `[Doanh thu (VNĐ)]` là cột trong đó. Ưu điểm:

- **Tự giãn:** thêm dòng vào Table, công thức tự tính luôn phần mới — không bao giờ sót.
- **Đọc là hiểu:** `BanHang[Doanh thu (VNĐ)]` rõ nghĩa hơn hẳn `I5:I44`. Sáu tháng sau mở lại vẫn hiểu ngay.
- **Không lệch khi chèn cột:** thêm/bớt cột khác trong Table không làm công thức trỏ nhầm.

## Mẹo gõ: Excel tự gợi ý tên cột

Không cần nhớ tên cột chính xác. Gõ `BanHang[` là Excel bung ra danh sách gợi ý tất cả tên cột, chọn cái cần rồi `Tab`:

{{anh:et-03-goi-y-ten-cot}}

Cách này vừa nhanh vừa tránh gõ sai tên cột (gõ sai là ra lỗi `#NAME?` hoặc `#REF!`).

## Tham chiếu có cấu trúc dùng được ở mọi hàm

Không riêng `SUM`, mọi hàm đều nhận cú pháp này — và nó làm công thức điều kiện dễ đọc hẳn:

```excel
=SUMIFS(BanHang[Doanh thu (VNĐ)],BanHang[Nhóm sản phẩm],"Laptop",BanHang[Khu vực],"Miền Bắc")
```

{{anh:et-04-sumifs-table}}

So với bản viết bằng toạ độ ô, bản này đọc gần như một câu tiếng Việt: cộng cột Doanh thu, với điều kiện cột Nhóm sản phẩm là Laptop và cột Khu vực là Miền Bắc. (Chi tiết về SUMIFS xem [bài riêng](/blog/ham-sumif-va-sumifs-trong-excel-tinh-tong-co-dieu-kien).)

## Vài lưu ý khi dùng Table

- **Tên cột phải khớp chính xác**, kể cả phần đơn vị trong ngoặc như `[Doanh thu (VNĐ)]`. Đây cũng là lý do nên để đơn vị ở tiêu đề cột cho gọn.
- **Total Row** (`Ctrl + Shift + T` hoặc tick Total Row ở Table Design) dùng `SUBTOTAL` bên dưới, nên nó **chỉ tính dòng đang hiển thị** sau khi lọc — rất tiện, nhưng nhớ nó khác `SUM` cả bảng.
- **Đừng để dòng/cột trống trong Table.** Table cần một vùng liền mạch; một dòng trống làm nó tưởng bảng kết thúc ở đó.

Một khi dữ liệu thô đã nằm trong Table đặt tên tử tế, mọi bài về sau — thống kê, PivotTable, Power Query — đều nhẹ nhàng hơn hẳn, vì bạn luôn gọi dữ liệu bằng tên chứ không bằng toạ độ dễ lệch.
