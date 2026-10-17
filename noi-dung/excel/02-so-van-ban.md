---
tieu_de: "Số bị lưu thành văn bản: vì sao SUM thiếu tổng và cách sửa dứt điểm"
slug: "so-bi-luu-thanh-van-ban-trong-excel"
danh_muc: "Excel"
the: ["kiểu dữ liệu", "nền tảng Excel", "SUM", "sửa lỗi"]
mo_ta: "SUM cộng đúng công thức mà tổng vẫn thiếu, thường vì vài ô số đang bị lưu dưới dạng văn bản nên bị bỏ qua. Bài này chỉ cách nhận ra, cách đếm còn bao nhiêu ô lỗi, và ba cách ép chúng về số thật."
tu_khoa: "số lưu thành văn bản, SUM thiếu tổng, tam giác xanh Excel, ép văn bản về số, SUMPRODUCT dấu trừ trừ"
anh_bia: "/images/bai-viet/so-van-ban/cover.png"
thu_muc_anh: "so-van-ban"
trang_thai: "draft"
---

Bạn `SUM` một cột số, công thức không sai chỗ nào, mà tổng vẫn thấp hơn khi bạn cộng tay. Đây là một trong những lỗi khó chịu nhất với người mới, vì *không có mã lỗi nào báo* — chỉ có một con số sai lặng lẽ. Gần như luôn luôn, nguyên nhân là: vài ô trong cột đang bị Excel lưu dưới dạng **văn bản**, không phải **số**.

Nếu chưa rõ vì sao một con số lại có thể là "văn bản", đọc trước bài [Excel đang hiểu dữ liệu của bạn là gì](/blog/kieu-du-lieu-trong-excel).

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Vì sao SUM bỏ qua ô văn bản

`SUM` — và cả `AVERAGE`, `COUNT` — chỉ làm việc với **số**. Ô nào đang là văn bản, dù nhìn giống số y hệt, đều bị bỏ qua hoàn toàn.

Giả sử cột có năm giá trị `100, 200, 300, 400, 500`, nhưng hai ô `200` và `400` đang là văn bản:

```excel
=SUM(C1:C5)
```

{{anh:sv-01-sum-thieu}}

Kết quả ra `900`, không phải `1500`. Hai ô văn bản bị bỏ qua nên tổng thiếu đúng `600`. Không có gì báo cho bạn biết.

## Ba dấu hiệu nhận ra

1. **Ô căn trái.** Số bình thường căn phải; ô số nào căn trái là đáng ngờ.
2. **Tam giác xanh nhỏ ở góc trên bên trái ô.** Excel đang cảnh báo "số này lưu dạng văn bản". Bấm vào ô sẽ có biểu tượng cảnh báo với tuỳ chọn *Convert to Number*.
3. **`COUNT` lệch `COUNTA`.** `COUNT` chỉ đếm ô là số, `COUNTA` đếm mọi ô có nội dung. Hai con số lệch nhau nghĩa là có ô văn bản trà trộn.

{{anh:sv-02-count-lech}}

## Đếm nhanh còn bao nhiêu ô lỗi

Trước khi sửa, nên biết vùng còn bao nhiêu ô số dạng văn bản. `ISTEXT` trả về `TRUE`/`FALSE` cho từng ô; hai dấu trừ `--` ép `TRUE`/`FALSE` thành `1`/`0` để cộng lại:

```excel
=SUMPRODUCT(--ISTEXT(C1:C5))
```

{{anh:sv-03-dem-o-loi}}

Ra `2` nghĩa là còn hai ô cần sửa. (Nếu chưa quen `ISTEXT`, có [bài riêng về nhóm hàm IS](/blog/ham-isnumber-istext-isblank-iserror-kiem-tra-kieu-du-lieu).)

## Cách sửa — chọn theo tình huống

### Cách 1: cộng mà vẫn ra đủ, không cần sửa dữ liệu

Khi bạn không được phép động vào dữ liệu gốc, ép về số ngay trong công thức bằng `--`:

```excel
=SUMPRODUCT(--(C1:C5))
```

{{anh:sv-04-sumproduct-ep}}

Dấu `--` biến từng ô văn bản-số thành số thật trước khi cộng, nên ra đủ `1500`. Cách này gọn nhưng chỉ chữa triệu chứng — dữ liệu gốc vẫn là văn bản.

### Cách 2: sửa dứt điểm bằng Text to Columns

Muốn dữ liệu sạch hẳn: chọn cả cột → **Data › Text to Columns › Next › Next › Finish**. Excel sẽ phân tích lại từng ô và trả những ô số về đúng dạng số. Đây là cách nhanh nhất cho cả một cột.

### Cách 3: Paste Special nhân với 1

Gõ `1` vào một ô trống, `Ctrl+C` ô đó, chọn vùng lỗi → **Paste Special › Multiply**. Phép nhân với 1 buộc Excel tính toán, và kết quả tính toán luôn là số. Cả vùng trở thành số thật.

## Vì sao ô lại thành văn bản ngay từ đầu

Biết nguồn gốc để tránh lặp lại:

- **Dữ liệu tải từ hệ thống, phần mềm kế toán, file CSV** — hay xuất số dưới dạng văn bản.
- **Ô được định dạng Text từ trước** rồi mới gõ số vào.
- **Có ký tự lạ trộn vào**: dấu cách, dấu nháy đơn đầu ô, ký tự khoảng trắng không ngắt (non-breaking space) hay gặp khi copy từ web.

Thói quen tốt: mỗi khi nhận một file lạ, kiểm nhanh cột số quan trọng bằng `=COUNT()` so với `=COUNTA()`, hoặc bằng `SUMPRODUCT(--ISTEXT(...))`. Ba mươi giây kiểm tra trước còn hơn một báo cáo sai gửi đi rồi.
