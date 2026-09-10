---
tieu_de: "GETPIVOTDATA: công thức Excel tự chèn khi bấm vào một ô trong Pivot Table"
slug: "ham-getpivotdata-lay-du-lieu-tu-pivot-table"
danh_muc: "Excel"
the: ["GETPIVOTDATA", "hàm tra cứu"]
mo_ta: "GETPIVOTDATA lấy một giá trị tổng hợp từ Pivot Table theo tên trường thay vì theo địa chỉ ô — công thức dài hơn hẳn một tham chiếu $B$5 thông thường, nhưng không bị lệch khi bố cục Pivot Table thay đổi."
tu_khoa: "hàm GETPIVOTDATA Excel, lấy dữ liệu từ Pivot Table, tắt GetPivotData tự động, tham chiếu Pivot Table không bị lệch"
anh_bia: "/images/bai-viet/ham-getpivotdata/cover.png"
thu_muc_anh: "ham-getpivotdata"
trang_thai: "draft"
---

Ai từng gõ dấu `=` rồi bấm nhầm vào một ô bên trong [Pivot Table](/blog/pivot-table-trong-excel-bien-du-lieu-thanh-bao-cao) đều gặp `GETPIVOTDATA` — một công thức dài bất ngờ tự động xuất hiện thay vì một tham chiếu ô đơn giản như mong đợi. Hàm này không phải lỗi, mà là một cơ chế tra cứu có chủ đích.

## Cú pháp

```excel
=GETPIVOTDATA(truong_du_lieu, pivot_bat_ky_o, [truong1, muc1], ...)
```

{{anh:gp-01-cu-phap-co-ban}}

`pivot_bat_ky_o` là tham chiếu tới bất kỳ ô nào bên trong vùng Pivot Table (thường Excel tự điền khi bấm chọn). Các cặp `truong`/`muc` phía sau xác định chính xác ô tổng hợp nào cần lấy — ví dụ trường `"Miền"` với giá trị `"Miền Bắc"`.

## Excel tự chèn hàm này khi bấm vào ô trong Pivot Table

Gõ `=` trong một ô bất kỳ ngoài Pivot Table, rồi bấm chọn một ô tổng hợp bên trong bảng, Excel không chèn `=B5` như với ô thường mà tự tạo ra:

```excel
=GETPIVOTDATA("Doanh thu",$A$3,"Miền","Miền Bắc")
```

{{anh:gp-02-tu-dong-chen}}

Công thức dài hơn hẳn một tham chiếu ô, khiến nhiều người mới gặp lần đầu tưởng Excel bị lỗi hoặc muốn tắt ngay tính năng này.

## Vì sao dùng GETPIVOTDATA thay vì tham chiếu ô thường

```excel
=$B$5
```

{{anh:gp-03-tham-chieu-o-thuong}}

Tham chiếu ô thường trỏ chết vào đúng vị trí `$B$5` — hoạt động tốt cho tới khi Pivot Table thay đổi bố cục: thêm bộ lọc, sắp xếp lại nhóm, mở rộng thêm một dòng dữ liệu mới... Mọi thay đổi bố cục đều có thể khiến "Doanh thu Miền Bắc" không còn nằm ở `$B$5` nữa, mà tham chiếu ô thường vẫn cứ lấy đúng ô `$B$5` đó — giờ đã chứa dữ liệu khác, sai mà không hề báo lỗi.

`GETPIVOTDATA` tra theo **tên trường và tên mục**, không theo vị trí ô, nên vẫn tìm đúng "Doanh thu Miền Bắc" dù Pivot Table đã đổi bố cục ra sao, miễn trường và mục đó vẫn còn tồn tại trong bảng.

## Cách tắt tính năng tự động chèn nếu muốn tham chiếu ô thường

Không phải lúc nào cũng cần độ an toàn đó — nếu chỉ cần tham chiếu nhanh một lần và không lo bố cục Pivot Table thay đổi, có thể tắt tính năng tự động chèn tại **File → Options → Formulas**, bỏ chọn **"Use GetPivotData functions for PivotTable references"**:

{{anh:gp-04-tat-tu-dong-chen}}

Sau khi tắt, bấm chọn ô trong Pivot Table sẽ chèn tham chiếu ô thường như bình thường. Cách khác không cần vào Options: gõ tay toàn bộ công thức tham chiếu ô (`=B5`) thay vì gõ `=` rồi dùng chuột bấm chọn.

## Lỗi thường gặp: gõ sai tên trường hoặc tên mục

```excel
=GETPIVOTDATA("Doanh thu",$A$3,"Miền","Miền Tây")
```

{{anh:gp-05-loi-sai-ten-muc}}

Nếu Pivot Table không có mục `"Miền Tây"` (do gõ sai chính tả hoặc mục đó không tồn tại trong dữ liệu gốc), kết quả trả về `#REF!` — khác với tham chiếu ô thường vốn không bao giờ báo lỗi kiểu này, nhưng đổi lại đây chính là cách `GETPIVOTDATA` báo cho biết ngay "trường hoặc mục này không có thật", thay vì âm thầm trả về dữ liệu sai từ một ô không liên quan.

## Tổng kết

`GETPIVOTDATA` lấy một giá trị tổng hợp từ Pivot Table theo tên trường và tên mục, không theo vị trí ô — nên không bị lệch khi bố cục Pivot Table thay đổi, đổi lại công thức dài hơn hẳn một tham chiếu ô thường. Có thể tắt tính năng tự động chèn trong Options nếu chỉ cần tham chiếu nhanh, không cần độ an toàn đó.

Đây là bài cuối trong cụm 5 bài về các hàm tra cứu và sắp xếp dữ liệu cơ bản, bắt đầu từ [MAXIFS](/blog/ham-maxifs-tim-gia-tri-lon-nhat-co-dieu-kien).
