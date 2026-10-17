---
tieu_de: "Đọc sáu mã lỗi thường gặp trong Excel và cách xử lý từng loại"
slug: "cac-ma-loi-thuong-gap-trong-excel"
danh_muc: "Excel"
the: ["sửa lỗi", "nền tảng Excel", "IFERROR", "ERROR.TYPE"]
mo_ta: "#DIV/0!, #N/A, #VALUE!, #REF!, #NAME?, #NUM! — mỗi mã lỗi nói cho bạn biết chính xác chuyện gì đang sai. Bài này giải nghĩa từng mã, nguyên nhân hay gặp và cách xử lý, kèm khi nào nên bọc IFERROR và khi nào không."
tu_khoa: "lỗi Excel, #DIV/0, #N/A, #VALUE, #REF, #NAME, #NUM, IFERROR, IFNA, cách sửa lỗi công thức Excel"
anh_bia: "/images/bai-viet/loi-excel/cover.png"
thu_muc_anh: "loi-excel"
trang_thai: "draft"
---

Mã lỗi trong Excel không phải để làm bạn nản — mỗi mã nói cho bạn biết *chính xác* chuyện gì đang sai. Đọc được chúng thì việc sửa công thức nhanh hơn hẳn so với dò mò từng ô. Và nhớ một điều từ bài [kiểu dữ liệu](/blog/kieu-du-lieu-trong-excel): lỗi là một *giá trị*, nên nó lan sang mọi ô tham chiếu tới ô lỗi.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Sáu mã lỗi hay gặp

{{anh:le-01-sau-loi}}

### `#DIV/0!` — chia cho 0 hoặc cho ô trống

```excel
=10/0
```

Mẫu số bằng `0` hoặc là một ô trống (ô trống được coi như `0`). Kiểm tra lại mẫu số. Đây là lỗi *nên* bọc `IFERROR` khi trình bày, vì một bảng đang nhập liệu dở thường có mẫu số tạm bằng 0.

### `#N/A` — không tìm thấy giá trị cần tra

```excel
=VLOOKUP("DH-9999", vùng, 2, 0)
```

Hàm tra cứu (`VLOOKUP`, `MATCH`, `XLOOKUP`) không tìm thấy giá trị. Nguyên nhân hay gặp: sai chính tả, khoảng trắng thừa, hoặc **lệch kiểu dữ liệu** — tra một số trong khi bảng lưu số đó dưới dạng văn bản. Với riêng lỗi tra cứu, dùng `IFNA` gọn hơn `IFERROR` vì nó chỉ bắt `#N/A`, không nuốt luôn các lỗi thật khác.

### `#VALUE!` — đưa văn bản vào phép tính

```excel
="abc"+1
```

Bạn đang cộng/nhân một thứ không phải số. Quay lại kiểm tra Excel đang hiểu ô đó là gì — thường là một ô lẽ ra là số nhưng đang là văn bản.

### `#REF!` — tham chiếu không còn tồn tại

```excel
=OFFSET(C24,-100,0)
```

Công thức trỏ tới một ô/vùng đã biến mất, thường vì bạn vừa **xoá dòng hoặc cột** mà công thức đang dựa vào. Đây là lỗi cần sửa ngay: dựng lại tham chiếu, đừng chỉ bọc `IFERROR` cho khuất mắt.

### `#NAME?` — Excel không nhận ra tên

```excel
=ABCXYZ(1)
```

Sai tên hàm, thiếu dấu ngoặc kép cho chuỗi (`=IF(A1=Nam,...)` thay vì `="Nam"`), hoặc gọi một tên vùng chưa đặt. Kiểm tra chính tả tên hàm trước tiên.

### `#NUM!` — phép tính không có nghĩa

```excel
=SQRT(-1)
```

Con số đầu vào khiến phép toán vô nghĩa — căn bậc hai của số âm, hoặc một phép tính lặp không hội tụ. Xem lại giá trị đầu vào.

## Hỏi thẳng: lỗi này là loại nào?

Khi cần xử lý lỗi bằng công thức, `ERROR.TYPE` trả về một mã số cho biết chính xác loại lỗi:

```excel
=ERROR.TYPE(A1)
```

{{anh:le-02-error-type}}

`2` là `#DIV/0!`, `3` là `#VALUE!`, `4` là `#REF!`, `5` là `#NAME?`, `6` là `#NUM!`, `7` là `#N/A`. Có [bài riêng về ERROR.TYPE](/blog/ham-error-type-tra-ve-ma-so-loai-loi) nếu bạn muốn dùng nó để rẽ nhánh xử lý.

## IFERROR và IFNA: bọc lỗi cho gọn — nhưng đúng chỗ

`IFERROR` thay mọi lỗi bằng giá trị bạn chỉ định; `IFNA` chỉ thay riêng `#N/A`:

```excel
=IFERROR(VLOOKUP("DH-1001", vùng, 2, 0), "Không tìm thấy")
```

{{anh:le-03-iferror}}

Nguyên tắc quan trọng: **chỉ bọc `IFERROR` ở lớp trình bày, đừng bọc ở lớp tính toán.** Nếu bọc quá sớm, bạn che mất một lỗi thật đang cần sửa — công thức "trông đẹp" nhưng con số bên dưới đã sai. Và ưu tiên `IFNA` khi bạn chỉ muốn bắt trường hợp "không tìm thấy": nó không âm thầm nuốt luôn `#REF!` hay `#VALUE!` — những lỗi mà bạn *muốn* thấy để đi sửa.

## Mẹo đọc lỗi hàng loạt

Một công thức bị `#REF!` hay `#DIV/0!` thường kéo theo cả dây ô lỗi phía sau. Muốn tìm *nguồn* thật sự thay vì ô lỗi cuối chuỗi:

- Bấm `Ctrl + [` để nhảy tới ô mà công thức đang tham chiếu, truy ngược về gốc.
- Dùng **Formulas › Error Checking › Trace Error** để Excel vẽ mũi tên chỉ tới ô gây lỗi đầu tiên.

Sửa ô gốc là cả dây lỗi phía sau tự hết.
