---
tieu_de: "ERROR.TYPE: trả về mã số cho biết chính xác loại lỗi nào đang xảy ra"
slug: "ham-error-type-ma-so-loai-loi"
danh_muc: "Excel"
the: ["ERROR.TYPE", "xử lý lỗi", "ISERROR", "hàm cơ bản"]
mo_ta: "ISERROR chỉ trả lời có/không có lỗi. ERROR.TYPE đi xa hơn: trả về một mã số riêng cho từng loại lỗi cụ thể, đủ để công thức phản ứng khác nhau tuỳ loại lỗi gặp phải."
tu_khoa: "hàm ERROR.TYPE Excel, mã số loại lỗi Excel, phân biệt các loại lỗi, ERROR.TYPE khác ISERROR"
anh_bia: "/images/bai-viet/ham-error-type/cover.png"
thu_muc_anh: "ham-error-type"
trang_thai: "draft"
---

Bài về [`ISNUMBER`, `ISTEXT`, `ISBLANK` và `ISERROR`](/blog/ham-isnumber-istext-isblank-iserror-kiem-tra-kieu-du-lieu) đã nói `ISERROR` bắt được **mọi** loại lỗi nhưng chỉ trả lời có/không — không phân biệt được đó là `#N/A`, `#VALUE!`, hay `#REF!`. `ERROR.TYPE` lấp đúng khoảng trống đó: trả về một mã số riêng biệt cho từng loại lỗi cụ thể.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Bảng mã số của ERROR.TYPE

```excel
=ERROR.TYPE(value)
```

| Mã số | Loại lỗi |
|---|---|
| `1` | `#NULL!` |
| `2` | `#DIV/0!` |
| `3` | `#VALUE!` |
| `4` | `#REF!` |
| `5` | `#NAME?` |
| `6` | `#NUM!` |
| `7` | `#N/A` |
| `8` | `#GETTING_DATA` |

{{anh:et-01-bang-ma-so}}

Nếu ô đưa vào **không** chứa lỗi, `ERROR.TYPE` trả về chính lỗi `#N/A` — nghe nghịch lý, nhưng đây là hành vi thiết kế có chủ đích, giúp phân biệt rõ "không có lỗi gì để phân loại" khỏi bất kỳ mã số 1-8 nào ở trên.

## Ví dụ với từng loại lỗi

{{anh:et-02-du-lieu-cac-loi}}

```excel
=ERROR.TYPE(A2)   ' A2 chứa #DIV/0!   -> 2
=ERROR.TYPE(A3)   ' A3 chứa #VALUE!   -> 3
=ERROR.TYPE(A4)   ' A4 chứa #N/A      -> 7
```

{{anh:et-03-ket-qua-tung-loi}}

## Ứng dụng: phản ứng khác nhau tuỳ loại lỗi

Đây là lý do thực tế cần `ERROR.TYPE` thay vì chỉ dùng `ISERROR`: một số tình huống cần xử lý khác nhau tuỳ **loại** lỗi, không phải chỉ đơn giản thay thế mọi lỗi bằng cùng một giá trị.

```excel
=IF(ERROR.TYPE(A2)=7, "Chưa có dữ liệu", IF(ERROR.TYPE(A2)=2, "Lỗi chia cho 0", "Lỗi khác"))
```

{{anh:et-04-phan-ung-theo-loai}}

Với `A2` chứa `#N/A` (mã `7`), thông báo trả về "Chưa có dữ liệu" — phù hợp với ý nghĩa thật của lỗi này, thường đến từ một hàm dò tìm không thấy kết quả, đúng như đã nói ở bài [NA](/blog/ham-na-tao-loi-co-chu-dich). Với `#DIV/0!` (mã `2`), thông báo khác hẳn: "Lỗi chia cho 0" — chỉ đúng nguyên nhân kỹ thuật hoàn toàn khác, đáng để người xem báo cáo hiểu đúng vấn đề đang xảy ra là gì thay vì một thông báo chung chung "Có lỗi" không nói lên được gì.

## So sánh với cách viết dùng ISERROR đơn thuần

Không có `ERROR.TYPE`, muốn phân loại lỗi cụ thể phải lồng nhiều hàm `IF` kết hợp so sánh trực tiếp với từng loại lỗi bằng `ISNA`, `ISERR` (loại trừ riêng `#N/A`), hoặc kiểm tra chuỗi văn bản của lỗi — cách nào cũng dài dòng hơn `ERROR.TYPE` khi cần phân biệt từ ba loại lỗi trở lên.

{{anh:et-05-so-sanh-cach-cu}}

Với nhu cầu đơn giản chỉ cần biết "có lỗi `#N/A` hay không", `ISNA(A2)` vẫn là cách viết ngắn gọn nhất — dùng `ERROR.TYPE` chỉ thật sự đáng giá khi công thức cần phân nhánh theo nhiều hơn hai loại lỗi khác nhau cùng lúc.

## Tổng kết

`ERROR.TYPE` trả về mã số từ `1` đến `8` tương ứng với từng loại lỗi cụ thể trong Excel, hoặc `#N/A` nếu ô không có lỗi gì — cho phép công thức phản ứng khác nhau tuỳ đúng loại lỗi gặp phải, thay vì chỉ biết "có lỗi hay không" như `ISERROR`. Hữu ích nhất khi cần phân biệt từ ba loại lỗi trở lên trong cùng một logic xử lý.

Đọc tiếp trong cùng cụm bài: [ISLOGICAL — phân biệt giá trị TRUE/FALSE thật với chuỗi chữ "TRUE"](/blog/ham-islogical-phan-biet-luan-ly-that-va-chu). Xem lại từ đầu: [ISFORMULA và FORMULATEXT](/blog/ham-isformula-formulatext-kiem-tra-cong-thuc), [ISREF](/blog/ham-isref-kiem-tra-tham-chieu-hop-le), [NA](/blog/ham-na-tao-loi-co-chu-dich).
