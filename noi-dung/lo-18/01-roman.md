---
tieu_de: "ROMAN: chuyển một số thành chữ số La Mã, và giới hạn 3.999 ít người để ý"
slug: "ham-roman-chuyen-so-thanh-chu-so-la-ma"
danh_muc: "Excel"
the: ["ROMAN", "hàm văn bản"]
mo_ta: "ROMAN chuyển một số thành chuỗi chữ số La Mã — dùng để đánh số chương sách, số thứ tự sự kiện thường niên. Chỉ nhận số nguyên từ 1 đến 3.999, vượt quá là báo lỗi vì hệ số La Mã cổ điển không có ký hiệu chuẩn cho số lớn hơn."
tu_khoa: "hàm ROMAN Excel, chu so la ma Excel, danh so chuong sach, ROMAN gioi han 3999"
anh_bia: "/images/bai-viet/ham-roman/cover.png"
thu_muc_anh: "ham-roman"
trang_thai: "draft"
---

`ROMAN` là một trong những hàm ít dùng nhất nhưng khi cần lại không có cách nào khác thay thế: chuyển một số thông thường thành chuỗi chữ số La Mã.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=ROMAN(so, [kieu])
```

{{anh:rm-01-cu-phap-co-ban}}

`ROMAN(1994)` trả về `"MCMXCIV"`. Tham số `kieu` (từ `0` đến `4`) điều chỉnh mức độ rút gọn — `0` là cách viết cổ điển đầy đủ, các mức cao hơn dùng các quy tắc rút gọn không chính thống để chuỗi ngắn hơn.

## Ứng dụng: đánh số chương sách hoặc số thứ tự sự kiện thường niên

```excel
=ROMAN(A2)
```

{{anh:rm-02-danh-so-chuong-sach}}

Chương `4` của một cuốn sách hiển thị thành `"Chương IV"`, hay số thứ tự một giải đấu thường niên (`"Giải đấu lần thứ " & ROMAN(A2)`) — cách trình bày quen thuộc trong xuất bản và các sự kiện lặp lại hàng năm.

## Các mức rút gọn khác nhau

```excel
=ROMAN(499,0)
=ROMAN(499,4)
```

{{anh:rm-03-cac-muc-rut-gon}}

`ROMAN(499,0)` cho `"CDXCIX"` — cách viết cổ điển đầy đủ. `ROMAN(499,4)` cho `"ID"` — rút gọn tối đa theo một quy tắc phi chính thống ít được dùng trong thực tế (viết `1` trước `D` để biểu diễn `499`, một cách viết không xuất hiện trong hệ La Mã cổ điển chuẩn). Trong thực tế hầu như luôn dùng `kieu=0` hoặc bỏ trống tham số này.

## Giới hạn quan trọng nhất: chỉ từ 1 đến 3.999

```excel
=ROMAN(4000)
```

{{anh:rm-04-gioi-han-3999}}

Kết quả là lỗi `#VALUE!`. Hệ chữ số La Mã cổ điển không có ký hiệu chuẩn cho số từ `4.000` trở lên — cách viết truyền thống dùng dấu gạch ngang phía trên một ký tự để nhân giá trị đó lên `1.000` lần, nhưng đây là ký hiệu đặc biệt không thể hiện được bằng văn bản thuần, nên Excel không hỗ trợ và báo lỗi ngay khi vượt ngưỡng `3.999`.

## ROMAN(0) và số âm

```excel
=ROMAN(0)
=ROMAN(-5)
```

{{anh:rm-05-so-0-va-so-am}}

`ROMAN(0)` trả về chuỗi rỗng `""` — người La Mã cổ đại không có ký hiệu cho số `0`. `ROMAN(-5)` báo lỗi `#VALUE!` — số âm cũng không có cách biểu diễn nào trong hệ La Mã.

## Tổng kết

`ROMAN` chuyển một số thành chuỗi chữ số La Mã, dùng phổ biến nhất để đánh số chương sách hay sự kiện thường niên. Chỉ nhận số nguyên từ `1` đến `3.999` — vượt ngưỡng, bằng `0`, hoặc số âm đều báo lỗi hoặc trả về chuỗi rỗng.

Đọc tiếp trong cùng cụm bài: [ARABIC — chiều ngược lại, đọc một chuỗi La Mã thành số thường](/blog/ham-arabic-doc-chu-so-la-ma-thanh-so).
