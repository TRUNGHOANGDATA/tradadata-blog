---
tieu_de: "TYPE: trả về mã số kiểu dữ liệu của một ô, kiểm tra nhanh không cần nhiều hàm IS"
slug: "ham-type-ma-so-kieu-du-lieu"
danh_muc: "Excel"
the: ["TYPE", "kiểu dữ liệu", "kiểm tra dữ liệu", "hàm cơ bản"]
mo_ta: "TYPE trả về một mã số duy nhất cho biết ô đang chứa kiểu dữ liệu gì — số, chữ, luận lý, lỗi, hay mảng — thay cho việc phải gọi lần lượt nhiều hàm ISNUMBER, ISTEXT để dò từng khả năng."
tu_khoa: "hàm TYPE Excel, kiểm tra kiểu dữ liệu bằng một hàm, mã số kiểu dữ liệu Excel, TYPE khác ISNUMBER"
anh_bia: "/images/bai-viet/ham-type/cover.png"
thu_muc_anh: "ham-type"
trang_thai: "draft"
---

Bài về [`ISNUMBER`, `ISTEXT`, `ISBLANK` và `ISERROR`](/blog/ham-isnumber-istext-isblank-iserror-kiem-tra-kieu-du-lieu) đã đi qua bốn hàm kiểm tra riêng biệt, mỗi hàm trả lời đúng một câu hỏi có/không. `TYPE` gộp gọn nhu cầu đó lại: **một** hàm duy nhất, trả về một mã số cho biết chính xác ô đang chứa kiểu dữ liệu gì, thay vì phải gọi lần lượt từng hàm `IS` để dò từng khả năng.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Năm mã số của TYPE

```excel
=TYPE(value)
```

`TYPE` trả về đúng một trong năm con số sau:

| Mã số | Kiểu dữ liệu |
|---|---|
| `1` | Số (number) |
| `2` | Văn bản (text) |
| `4` | Giá trị luận lý — `TRUE`/`FALSE` (logical) |
| `16` | Giá trị lỗi (error) |
| `64` | Mảng (array) |

{{anh:ty-01-bang-ma-so}}

## Ví dụ với từng kiểu dữ liệu

{{anh:ty-02-du-lieu-hon-hop}}

```excel
=TYPE(A2)   ' A2 chứa 1024        -> 1
=TYPE(A3)   ' A3 chứa "VT005"     -> 2
=TYPE(A4)   ' A4 chứa TRUE        -> 4
=TYPE(A5)   ' A5 chứa #REF!       -> 16
```

{{anh:ty-03-ket-qua-tung-dong}}

Mỗi kiểu dữ liệu ra đúng một mã số riêng biệt, không trùng nhau — khác với việc phải gọi `ISNUMBER`, `ISTEXT`, kiểm tra `TRUE`/`FALSE` bằng cách khác, và `ISERROR` riêng rẽ để phủ hết các khả năng.

## Vì sao các mã số không liên tục: 1, 2, 4, 16, 64

Nhìn dãy số `1, 2, 4, 16, 64` có vẻ kỳ lạ — không phải `1, 2, 3, 4, 5` như trực giác thường nghĩ. Đây là các luỹ thừa của `2` (`2⁰, 2¹, 2², 2⁴, 2⁶`), một cách thiết kế thường gặp khi một giá trị có khả năng đại diện cho **nhiều kiểu cùng lúc** — ví dụ một mảng chứa cả số và lỗi, `TYPE` có thể trả về tổng của hai mã số tương ứng để biểu diễn cả hai đặc điểm đó cùng lúc, dùng kỹ thuật bit thường thấy trong lập trình. Với việc kiểm tra một ô đơn lẻ như trong bài này, chỉ cần biết mỗi kiểu dữ liệu có đúng một mã số riêng là đủ dùng, không cần đi sâu vào cơ chế cộng dồn đó.

## So sánh với dùng nhiều hàm IS

Cùng một nhu cầu — phân loại một ô thuộc kiểu nào trong bốn khả năng — viết bằng các hàm `IS` cần lồng nhiều điều kiện:

```excel
=IF(ISNUMBER(A2), "Số", IF(ISTEXT(A2), "Chữ", IF(ISLOGICAL(A2), "Luận lý", "Lỗi")))
```

{{anh:ty-04-cach-is-long-nhau}}

So với dùng `TYPE` rồi tra theo mã số:

```excel
=CHOOSE(TYPE(A2), "Số", "Chữ", "", "Luận lý")
```

{{anh:ty-05-cach-type-choose}}

Cách dùng `TYPE` kết hợp `CHOOSE` ngắn hơn, nhưng đòi hỏi nhớ đúng thứ tự mã số (`1, 2, 4`) khớp với vị trí tham số trong `CHOOSE` — `CHOOSE` chỉ nhận vị trí liên tục từ `1` trở đi, nên mã `4` (luận lý) phải để đúng ở vị trí thứ 4, bỏ trống vị trí thứ 3 bằng một chuỗi rỗng. Đánh đổi giữa hai cách: `IF` lồng nhau dễ đọc hơn với người mới, `TYPE` + `CHOOSE` ngắn hơn nhưng cần nhớ đúng bảng mã số.

## Khi nào TYPE thật sự hữu ích

`TYPE` phát huy tác dụng rõ nhất khi cần phân loại thành **nhiều hơn hai** kiểu dữ liệu cùng lúc trong một công thức duy nhất — ví dụ báo cáo chất lượng dữ liệu cần thống kê riêng số ô là số, số ô là chữ, số ô lỗi, tất cả trong cùng một logic. Với nhu cầu đơn giản chỉ cần biết "có phải số không" hay "có lỗi không", các hàm `IS` riêng lẻ vẫn là lựa chọn rõ ràng hơn.

## Tổng kết

`TYPE` gộp nhu cầu kiểm tra kiểu dữ liệu thành một hàm duy nhất, trả về mã số `1, 2, 4, 16` hoặc `64` tương ứng với số, chữ, luận lý, lỗi, hoặc mảng — thay cho việc gọi lần lượt nhiều hàm `IS` khác nhau. Hữu ích nhất khi cần phân loại nhiều hơn hai khả năng cùng lúc trong một công thức.

Đây là bài cuối trong cụm 5 bài về vị trí và cấu trúc bảng tính. Xem lại từ đầu: [ROW và COLUMN](/blog/ham-row-column-danh-so-tu-dong), [ROWS và COLUMNS](/blog/ham-rows-columns-dem-kich-thuoc-vung), [ADDRESS](/blog/ham-address-dung-dia-chi-o-dang-van-ban), [N và T](/blog/ham-n-t-ep-gia-tri-im-lang).
