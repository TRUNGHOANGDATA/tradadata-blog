---
tieu_de: "ARABIC: chiều ngược lại, đọc một chuỗi La Mã thành số thường"
slug: "ham-arabic-doc-chu-so-la-ma-thanh-so"
danh_muc: "Excel"
the: ["ARABIC", "hàm văn bản"]
mo_ta: "ARABIC đọc một chuỗi chữ số La Mã và trả về đúng số thường tương ứng — chiều ngược lại của ROMAN. Hỗ trợ cả dấu trừ phía trước cho số âm, nhưng ký tự không hợp lệ sẽ báo lỗi ngay."
tu_khoa: "hàm ARABIC Excel, doc chu so la ma, ARABIC nguoc lai ROMAN, chuyen la ma sang so"
anh_bia: "/images/bai-viet/ham-arabic/cover.png"
thu_muc_anh: "ham-arabic"
trang_thai: "draft"
---

Bài trước, [ROMAN](/blog/ham-roman-chuyen-so-thanh-chu-so-la-ma) chuyển một số thành chữ số La Mã. `ARABIC` làm đúng chiều ngược lại: đọc một chuỗi chữ số La Mã và trả về số thường tương ứng.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=ARABIC(van_ban)
```

{{anh:ar-01-cu-phap-co-ban}}

`ARABIC("MCMXCIV")` trả về `1994`. Chỉ nhận đúng một tham số — chuỗi La Mã cần đọc.

## Ứng dụng: chuyển ngược số chương từ file nhập liệu ghi sẵn dạng La Mã

Một số tài liệu cũ đánh số chương bằng chữ số La Mã (`"Chương IV"`), cần chuyển về số thường để sắp xếp hoặc tính toán tiếp:

```excel
=ARABIC(SUBSTITUTE(A2,"Chương ",""))
```

{{anh:ar-02-doi-nguoc-so-chuong}}

Kết hợp [`SUBSTITUTE`](/blog/lam-sach-du-lieu-trong-excel-trim-clean-substitute-va-cac-ky-thuat-data-cleaning) để bóc phần chữ `"Chương "` ra trước, chỉ giữ lại phần La Mã, rồi mới đưa vào `ARABIC` để đọc thành số.

## Kiểm tra ngược: ROMAN và ARABIC phải khớp nhau

```excel
=ARABIC(ROMAN(1994))
```

{{anh:ar-03-kiem-tra-nguoc}}

Kết quả luôn là `1994` — dùng cách này để kiểm tra nhanh xem một chuỗi La Mã tự viết tay có đúng chuẩn hay không: chuyển đi rồi chuyển lại, nếu ra đúng số ban đầu tức là chuỗi La Mã đó viết đúng quy tắc.

## Hỗ trợ dấu trừ cho số âm

```excel
=ARABIC("-XIV")
```

{{anh:ar-04-ho-tro-so-am}}

Kết quả là `-14` — khác với `ROMAN` không hề có khái niệm số âm, `ARABIC` lại chấp nhận dấu trừ đặt ngay trước chuỗi La Mã để trả về một số âm tương ứng.

## Lỗi thường gặp: ký tự không hợp lệ

```excel
=ARABIC("MCMXCIV2026")
```

{{anh:ar-05-ky-tu-khong-hop-le}}

Trộn lẫn ký tự La Mã với số thường hoặc bất kỳ ký tự nào không thuộc bảy chữ cái La Mã hợp lệ (`M, D, C, L, X, V, I`) sẽ khiến `ARABIC` báo lỗi `#VALUE!` ngay lập tức, không cố đoán hay bỏ qua phần không hợp lệ.

## Tổng kết

`ARABIC` đọc một chuỗi chữ số La Mã và trả về số thường, đúng chiều ngược lại của `ROMAN` — hai hàm có thể ghép lại để kiểm tra chéo một chuỗi La Mã viết tay có đúng chuẩn hay không. Hỗ trợ dấu trừ cho số âm, nhưng ký tự không thuộc bảy chữ cái La Mã hợp lệ sẽ báo lỗi ngay.

Đọc tiếp trong cùng cụm bài: [BASE — chuyển một số sang hệ đếm khác như nhị phân hay thập lục phân](/blog/ham-base-chuyen-so-sang-he-dem-khac).
