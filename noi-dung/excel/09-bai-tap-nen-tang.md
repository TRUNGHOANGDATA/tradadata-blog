---
tieu_de: "20 bài tập Excel nền tảng có đáp án: tự luyện trước khi học PivotTable"
slug: "20-bai-tap-excel-nen-tang-co-dap-an"
danh_muc: "Excel"
the: ["bài tập", "nền tảng Excel", "thực hành"]
mo_ta: "Hai mươi bài tập tự luyện trên một bảng bán hàng mẫu, phủ đủ SUM, COUNTIF, AVERAGEIF, SUMIFS, LARGE, MEDIAN, xử lý ngày tháng và bắt lỗi số-dạng-văn-bản. Có đáp án kèm công thức nên gõ và giải thích ngắn vì sao viết như vậy."
tu_khoa: "bài tập Excel có đáp án, luyện hàm Excel, bài tập SUMIF COUNTIF, thực hành Excel cơ bản, bài tập Excel nền tảng"
anh_bia: "/images/bai-viet/bai-tap-nen-tang/cover.png"
thu_muc_anh: "bai-tap-nen-tang"
trang_thai: "draft"
---

Cách chắc nhất để biết mình đã nắm phần nền tảng chưa là tự làm rồi đối chiếu. Hai mươi bài dưới đây chạy trên một bảng bán hàng mẫu và phủ đủ những gì cần trước khi bước sang PivotTable hay Power Query: các hàm thống kê cơ bản, cộng/đếm có điều kiện, xử lý ngày tháng, và cả mấy cái bẫy về kiểu dữ liệu.

**Cách dùng đúng:** tự làm hết phần đề trước, chỉ mở đáp án sau. Nhập **công thức**, đừng gõ số bằng tay — mục tiêu là viết được công thức tự cập nhật khi dữ liệu đổi.

Công thức dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Bảng dữ liệu mẫu

Tất cả bài tập dùng một Table tên `BanHang` — bảng bán hàng 2025, mỗi dòng một đơn hàng. Nếu chưa quen tham chiếu theo tên cột, xem trước [bài về Excel Table](/blog/excel-table-va-tham-chieu-theo-ten-cot).

{{anh:bt-01-bang-mau}}

Các cột: `Mã đơn hàng`, `Ngày bán`, `Khu vực`, `Nhân viên`, `Nhóm sản phẩm`, `Số lượng`, `Đơn giá (VNĐ)`, `Doanh thu (VNĐ)`, `Điểm hài lòng`. Riêng cột Điểm hài lòng cố tình để vài ô trống và một ô lưu dạng văn bản — để bạn có cái mà bắt lỗi.

Mẹo: gõ `BanHang[` rồi Excel tự gợi ý tên cột.

## Đề bài (20 câu)

Nhóm cơ bản:

1. Tổng doanh thu cả bảng?
2. Nhân viên "Đức Huy" có bao nhiêu đơn hàng?
3. Doanh thu trung bình của nhóm "Điện thoại"?
4. Doanh thu lớn thứ 3 trong bảng?
5. Tổng số lượng bán tại Miền Bắc?
6. Cột Điểm hài lòng có bao nhiêu ô trống?
7. Trung vị của cột Đơn giá?
8. Bao nhiêu đơn có doanh thu trên 100 triệu?
9. Doanh thu nhóm Laptop tại Miền Nam?
10. Điểm hài lòng trung bình (chỉ tính ô là số)?

Nhóm bẫy kiểu dữ liệu và ngày tháng:

11. Cột Điểm hài lòng còn bao nhiêu ô lưu số dạng văn bản?
12. Đơn hàng gần nhất bán vào ngày nào?
13. Có bao nhiêu đơn bán trong tháng 3/2025?
14. Đơn hàng đầu tiên bán vào ngày nào?
15. Từ đơn đầu tiên đến đơn gần nhất cách nhau bao nhiêu ngày?
16. Doanh thu của riêng tháng 3/2025?
17. Nhân viên "Đức Huy" bán được tổng bao nhiêu tiền?
18. Đơn giá cao nhất trong bảng?
19. Trung bình mỗi đơn bán được bao nhiêu sản phẩm?
20. Gõ `25.12.2025` vào một ô trống: Excel hiểu là số hay văn bản?

Làm xong hãy tự chấm bằng phần đáp án dưới đây.

## Đáp án và giải thích

**Câu 1 — Tổng doanh thu cả bảng**
```excel
=SUM(BanHang[Doanh thu (VNĐ)])
```
Kết quả: `2.874.500.000`. Viết theo tên cột nên thêm dòng dữ liệu là tự cộng thêm.

**Câu 2 — Số đơn của "Đức Huy"**
```excel
=COUNTIF(BanHang[Nhân viên],"Đức Huy")
```
Kết quả: `11`. Đếm số dòng có tên đúng bằng chuỗi trong ngoặc kép.

**Câu 3 — Doanh thu trung bình nhóm "Điện thoại"**
```excel
=AVERAGEIF(BanHang[Nhóm sản phẩm],"Điện thoại",BanHang[Doanh thu (VNĐ)])
```
Kết quả: `51.854.545`. Vùng điều kiện đứng trước, vùng cần lấy trung bình đứng sau. (Xem [AVERAGEIF](/blog/ham-averageif-tinh-trung-binh-co-dieu-kien).)

**Câu 4 — Doanh thu lớn thứ 3**
```excel
=LARGE(BanHang[Doanh thu (VNĐ)],3)
```
Kết quả: `203.500.000`. Số `3` là thứ hạng. `LARGE` không loại giá trị trùng nhau.

**Câu 5 — Tổng số lượng bán tại Miền Bắc**
```excel
=SUMIF(BanHang[Khu vực],"Miền Bắc",BanHang[Số lượng])
```
Kết quả: `65`. Điều kiện xét ở cột Khu vực nhưng cộng ở cột Số lượng.

**Câu 6 — Số ô trống trong Điểm hài lòng**
```excel
=COUNTBLANK(BanHang[Điểm hài lòng])
```
Kết quả: `5`. Chỉ đếm ô trống thật; ô chứa chuỗi rỗng `""` không được tính.

**Câu 7 — Trung vị cột Đơn giá**
```excel
=MEDIAN(BanHang[Đơn giá (VNĐ)])
```
Kết quả: `9.200.000`. Giá trị nằm giữa khi sắp xếp, không bị số quá lớn kéo lệch như AVERAGE.

**Câu 8 — Số đơn doanh thu trên 100 triệu**
```excel
=COUNTIF(BanHang[Doanh thu (VNĐ)],">100000000")
```
Kết quả: `12`. Điều kiện so sánh phải viết thành chuỗi, đặt trong ngoặc kép.

**Câu 9 — Doanh thu Laptop tại Miền Nam**
```excel
=SUMIFS(BanHang[Doanh thu (VNĐ)],BanHang[Nhóm sản phẩm],"Laptop",BanHang[Khu vực],"Miền Nam")
```
Kết quả: `222.000.000`. `SUMIFS` ngược với `SUMIF`: vùng cần cộng đứng **trước**, rồi tới từng cặp vùng–điều kiện.

**Câu 10 — Điểm hài lòng trung bình**
```excel
=AVERAGE(BanHang[Điểm hài lòng])
```
Kết quả: `3,85`. `AVERAGE` tự bỏ qua ô trống và ô văn bản, nên chia cho 34 chứ không phải 40.

**Câu 11 — Số ô lưu số dạng văn bản**
```excel
=SUMPRODUCT(--ISTEXT(BanHang[Điểm hài lòng]))
```
Kết quả: `1`. `ISTEXT` cho ra TRUE/FALSE, hai dấu trừ đổi thành 1/0 rồi cộng lại. (Xem [số bị lưu thành văn bản](/blog/so-bi-luu-thanh-van-ban-trong-excel).)

**Câu 12 — Ngày đơn gần nhất**
```excel
=MAX(BanHang[Ngày bán])
```
Kết quả: `24/06/2025`. Ngày là số nên `MAX` chạy được. Nhớ để ô kết quả ở định dạng ngày.

**Câu 13 — Số đơn trong tháng 3/2025**
```excel
=COUNTIFS(BanHang[Ngày bán],">="&DATE(2025,3,1),BanHang[Ngày bán],"<="&DATE(2025,3,31))
```
Kết quả: `7`. Đừng gõ `">=01/03/2025"` vì còn phụ thuộc Control Panel; dùng `DATE` cho chắc. (Xem [nhập ngày tháng đúng cách](/blog/nhap-ngay-thang-dung-cach-trong-excel).)

**Câu 14 — Ngày đơn đầu tiên**
```excel
=MIN(BanHang[Ngày bán])
```
Kết quả: `03/01/2025`. Cùng nguyên tắc với `MAX`.

**Câu 15 — Số ngày giữa đơn đầu và đơn cuối**
```excel
=MAX(BanHang[Ngày bán])-MIN(BanHang[Ngày bán])
```
Kết quả: `172`. Trừ hai ngày ra số ngày. Ô kết quả phải để **định dạng số**, không để định dạng ngày.

**Câu 16 — Doanh thu riêng tháng 3/2025**
```excel
=SUMIFS(BanHang[Doanh thu (VNĐ)],BanHang[Ngày bán],">="&DATE(2025,3,1),BanHang[Ngày bán],"<="&DATE(2025,3,31))
```
Kết quả: `349.800.000`. Chặn hai đầu khoảng ngày bằng hai điều kiện.

**Câu 17 — Tổng tiền "Đức Huy" bán được**
```excel
=SUMIF(BanHang[Nhân viên],"Đức Huy",BanHang[Doanh thu (VNĐ)])
```
Kết quả: `730.850.000`. Điều kiện ở cột Nhân viên, cộng ở cột Doanh thu.

**Câu 18 — Đơn giá cao nhất**
```excel
=MAX(BanHang[Đơn giá (VNĐ)])
```
Kết quả: `18.500.000`. Xem nhanh có ô nào nhập sai đơn vị hay không.

**Câu 19 — Trung bình số sản phẩm mỗi đơn**
```excel
=AVERAGE(BanHang[Số lượng])
```
Kết quả: `6,625`. Trung bình cột Số lượng.

**Câu 20 — `25.12.2025` là số hay văn bản?**
Đáp án: **văn bản**. Dấu chấm không phải dấu phân cách ngày nên Excel coi cả ô là văn bản. Kiểm bằng công thức:
```excel
=ISNUMBER(A1)
```
trả về `FALSE`. Đây đúng cái bẫy trong [bài nhập ngày tháng](/blog/nhap-ngay-thang-dung-cach-trong-excel).

## Tự chấm thế nào

Đếm số câu đúng ngay lần đầu, không cần mở đáp án:

- **18–20 câu:** bạn đã vững nền tảng, sẵn sàng sang PivotTable và Power Query.
- **12–17 câu:** ổn, nhưng nên xem lại nhóm câu bạn sai — thường rơi vào ngày tháng (13, 15, 16) hoặc bẫy kiểu dữ liệu (10, 11, 20).
- **Dưới 12 câu:** quay lại đọc kỹ [kiểu dữ liệu](/blog/kieu-du-lieu-trong-excel) và [12 nguyên tắc dựng file](/blog/12-nguyen-tac-dung-file-excel-gon-gang), rồi làm lại từ đầu.

Đừng vội qua phần nâng cao khi còn sai mấy câu về kiểu dữ liệu — chúng là gốc của gần như mọi lỗi khó chịu về sau.
