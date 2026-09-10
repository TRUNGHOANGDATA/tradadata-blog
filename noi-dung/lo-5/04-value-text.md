---
tieu_de: "VALUE và TEXT: chuyển đổi qua lại giữa số và văn bản có định dạng"
slug: "ham-value-text-chuyen-doi-so-van-ban"
danh_muc: "Excel"
the: ["VALUE", "TEXT", "chuyển đổi kiểu dữ liệu", "hàm cơ bản"]
mo_ta: "Cách dùng VALUE để chữa lỗi số bị lưu dạng văn bản, và TEXT để định dạng một con số thành chuỗi hiển thị tuỳ ý — hai hàm đi hai chiều ngược nhau."
tu_khoa: "hàm VALUE Excel, hàm TEXT Excel, chuyển văn bản thành số, chuyển số thành văn bản có định dạng, số lưu dạng văn bản"
anh_bia: "/images/bai-viet/ham-value-text/cover.png"
thu_muc_anh: "ham-value-text"
trang_thai: "draft"
---

Bài về lỗi `#N/A` trong `VLOOKUP` đã nói tới một nguyên nhân phổ biến: số bị lưu dưới dạng văn bản, khiến các hàm dò tìm không khớp được dù mắt nhìn thấy cùng một con số. `VALUE` chính là hàm chữa đúng lỗi đó — ép một chuỗi văn bản trông giống số trở thành số thật.

`TEXT` làm việc ngược lại: biến một con số thành chuỗi văn bản, nhưng không chỉ đơn thuần đổi kiểu — nó còn định dạng con số đó theo bất kỳ khuôn dạng nào cần hiển thị, việc mà phép ép kiểu thông thường không làm được.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## VALUE — ép văn bản trông giống số thành số thật

```excel
=VALUE(text)
```

{{anh:vt-01-value-co-ban}}

Với ô chứa `"1024"` được nhập dưới dạng văn bản (căn trái, có tam giác cảnh báo góc ô), `VALUE("1024")` trả về số `1024` thật — căn phải, tính toán được, so sánh được với các số khác.

## Ứng dụng: sửa cả cột số bị lưu sai dạng văn bản

Đây chính là kỹ thuật đã nhắc tới ở bài lỗi `#N/A` trong `VLOOKUP`, giờ nhìn theo hướng của riêng hàm `VALUE`:

{{anh:vt-02-sua-loi-vlookup}}

```excel
=VLOOKUP(VALUE(C2), $F$2:$G$4, 2, 0)
```

Bọc `VALUE` quanh giá trị dò giúp ép nó thành số trước khi so sánh với vùng dò — miễn vùng dò `$F$2:$G$4` cũng đang chứa số thật, không phải văn bản. Cách sửa tận gốc vẫn nên ưu tiên hơn: chọn cả cột, dùng **Data > Text to Columns > Finish** để Excel tự nhận diện lại kiểu dữ liệu cho toàn cột, thay vì bọc `VALUE` ở từng công thức riêng lẻ.

## Khi VALUE không chuyển đổi được

`VALUE` chỉ hoạt động khi chuỗi văn bản có **hình dạng** giống một con số — số thuần, số có dấu phần trăm, ngày tháng đúng định dạng. Với chuỗi chứa chữ cái hoặc ký tự không phải số, `VALUE` báo lỗi `#VALUE!`.

```excel
=VALUE("1024 chiếc")
```

{{anh:vt-03-value-loi}}

Trường hợp này cần dọn chuỗi trước khi ép kiểu — ví dụ cắt bỏ phần chữ bằng `SUBSTITUTE` — chứ `VALUE` không tự động bỏ qua phần không phải số.

## TEXT — biến số thành chuỗi có định dạng tuỳ ý

```excel
=TEXT(value, format_text)
```

`TEXT` nhận vào một con số và một mã định dạng, trả về đúng chuỗi hiển thị theo định dạng đó — không phải con số được làm tròn, mà là **văn bản**, dùng để ghép nối với chuỗi khác.

```excel
=TEXT(1234567, "#.##0")
```

{{anh:vt-04-text-co-ban}}

Kết quả trả về chuỗi **"1.234.567"** — có dấu chấm ngăn cách hàng nghìn, đúng định dạng số Việt Nam.

## Ứng dụng: ghép số đã định dạng vào một câu hoàn chỉnh

Đây là lý do `TEXT` cần thiết, không thể thay bằng cách nối chuỗi thông thường. Thử ghép trực tiếp một con số vào câu bằng dấu `&`:

```excel
=A2 & " đã thanh toán " & B2 & " đồng"
```

{{anh:vt-05-noi-chuoi-truc-tiep}}

Nếu `B2` chứa `1234567`, kết quả ghép ra **"Nguyễn Văn A đã thanh toán 1234567 đồng"** — con số dính liền không có dấu ngăn cách, khó đọc. Bọc `TEXT` quanh `B2` trước khi ghép:

```excel
=A2 & " đã thanh toán " & TEXT(B2, "#.##0") & " đồng"
```

{{anh:vt-06-noi-chuoi-co-text}}

Kết quả: **"Nguyễn Văn A đã thanh toán 1.234.567 đồng"** — đúng định dạng, dễ đọc, phù hợp để đưa vào email tự động, thông báo, hay nội dung xuất ra ngoài Excel.

## Vài mã định dạng thường dùng với TEXT

| Mã định dạng | Ví dụ input | Kết quả |
|---|---|---|
| `"#.##0"` | `1234567` | `1.234.567` |
| `"0%"` | `0,7` | `70%` |
| `"dd/mm/yyyy"` | ngày 15/09/2026 | `15/09/2026` |
| `"0,00"` | `5` | `5,00` |

{{anh:vt-07-bang-ma-dinh-dang}}

Mã định dạng dùng trong `TEXT` giống hệt cú pháp định dạng số tuỳ chỉnh của Excel (mở bằng **Ctrl + 1 > Number > Custom**) — học một lần dùng được cho cả hai chỗ.

## VALUE và TEXT đi hai chiều ngược nhau

Nhìn cả hai hàm cạnh nhau để thấy rõ chúng bổ sung cho nhau: `VALUE` đi từ văn bản **tới** số, để tính toán được. `TEXT` đi từ số **tới** văn bản, để hiển thị hoặc ghép chuỗi được. Dùng nhầm chiều — ví dụ cố `TEXT` một giá trị rồi đưa vào `VLOOKUP` để dò theo số — sẽ gây lỗi kiểu dữ liệu giống hệt lỗi số lưu dạng văn bản đã nói ở đầu bài.

## Tổng kết

`VALUE` ép một chuỗi trông giống số trở thành số thật, hữu ích nhất để chữa lỗi số bị lưu dạng văn bản trước khi dùng trong các hàm dò tìm hay tính toán. `TEXT` làm ngược lại, biến số thành chuỗi hiển thị theo bất kỳ định dạng nào — cần thiết khi ghép số vào câu văn, vì phép nối chuỗi thông thường không tự động thêm dấu ngăn cách hay định dạng.

Đọc tiếp trong cùng cụm bài: [CHAR và CODE — ký tự đặc biệt và ngắt dòng trong ô](/blog/ham-char-code-ky-tu-dac-biet-ngat-dong). Quay lại [FIND và SEARCH](/blog/ham-find-search-tim-vi-tri-ky-tu-trong-chuoi).
