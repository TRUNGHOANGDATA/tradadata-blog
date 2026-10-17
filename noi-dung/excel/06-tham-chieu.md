---
tieu_de: "Tham chiếu tương đối và tuyệt đối trong Excel: A1, $A$1, $A1, A$1 và phím F4"
slug: "tham-chieu-tuong-doi-va-tuyet-doi-trong-excel"
danh_muc: "Excel"
the: ["tham chiếu", "nền tảng Excel", "F4"]
mo_ta: "Dấu đô la khoá tham chiếu để copy công thức không bị lệch. Bài này giải thích bốn kiểu tham chiếu A1, $A$1, $A1, A$1 khác nhau ra sao khi copy, phím F4 để đổi nhanh, và một ví dụ bảng nhân chỉ dùng đúng một công thức cho cả bảng."
tu_khoa: "tham chiếu tuyệt đối, tham chiếu tương đối, dấu đô la Excel, phím F4, khoá cột khoá hàng, $A$1"
anh_bia: "/images/bai-viet/tham-chieu/cover.png"
thu_muc_anh: "tham-chieu"
trang_thai: "draft"
---

Dấu `$` trong công thức Excel làm đúng một việc: **khoá** tham chiếu để khi bạn copy công thức đi chỗ khác, nó không bị lệch. Nghe đơn giản, nhưng đây là kỹ năng phân biệt người kéo được một công thức cho cả bảng với người phải gõ lại từng ô. Nó cũng là nguyên tắc số 6 trong [12 nguyên tắc dựng file](/blog/12-nguyen-tac-dung-file-excel-gon-gang).

## Vì sao tham chiếu lại "chạy" khi copy

Mặc định, tham chiếu trong Excel là **tương đối** — nó nhớ *vị trí tương đối*, không nhớ địa chỉ tuyệt đối. Nếu ô `B2` chứa `=A2` (lấy ô ngay bên trái), thì copy xuống `B3` sẽ tự thành `=A3`, copy sang `C2` thành `=B2`. Excel dịch chuyển tham chiếu theo đúng hướng bạn copy.

Đây là tính năng, không phải lỗi — nhờ nó bạn viết một công thức rồi kéo cho cả cột. Nhưng đôi khi bạn *không muốn* nó chạy, và đó là lúc cần `$`.

## Bốn kiểu tham chiếu

`$` đặt trước chữ cái thì khoá **cột**, đặt trước số thì khoá **hàng**:

{{anh:tc-01-bon-kieu}}

| Cách viết | Khi copy | Dùng lúc nào |
|---|---|---|
| `A1` | Cả cột và hàng đều chạy theo vị trí dán | Tính theo từng dòng: Số lượng × Đơn giá |
| `$A$1` | Khoá cứng cả cột và hàng, đi đâu cũng trỏ về một ô | Giả định dùng chung: thuế VAT, tỷ giá, chỉ tiêu |
| `$A1` | Khoá **cột**, hàng vẫn chạy | Copy sang phải nhưng luôn lấy cột nhãn bên trái |
| `A$1` | Khoá **hàng**, cột vẫn chạy | Copy xuống dưới nhưng luôn lấy dòng tiêu đề phía trên |

## Phím F4: đổi vòng bốn kiểu

Khi đang soạn công thức, đặt con trỏ vào một tham chiếu rồi bấm `F4` để đổi vòng: `A1` → `$A$1` → `A$1` → `$A1` → `A1`. Không cần gõ dấu `$` bằng tay.

{{anh:tc-02-phim-f4}}

## Ví dụ kinh điển: bảng nhân bằng đúng một công thức

Đây là bài tập kinh điển làm rõ sức mạnh của khoá một chiều. Bạn có cột đơn giá (nằm dọc ở cột `F`) và dòng số lượng (nằm ngang ở hàng `21`), muốn điền cả bảng thành tiền:

```excel
=$F22*G$21
```

{{anh:tc-03-bang-nhan}}

Chỉ **một** công thức này, kéo cho cả bảng:

- `$F22` khoá **cột F** (luôn lấy đơn giá ở cột F) nhưng để hàng chạy — mỗi dòng lấy đúng đơn giá của dòng đó.
- `G$21` khoá **hàng 21** (luôn lấy số lượng ở hàng tiêu đề) nhưng để cột chạy — mỗi cột lấy đúng số lượng của cột đó.

Kéo công thức đi đâu trong bảng, nó cũng tự ghép đúng đơn giá của hàng với số lượng của cột. Nếu dùng `$F$21` hay `F21` là bảng sai ngay.

## Vì sao nên tách giả định ra một ô riêng

Kết hợp với nguyên tắc "không gõ số vào giữa công thức": để thuế VAT ở một ô riêng `$H$2` rồi tham chiếu tuyệt đối tới nó:

```excel
=Đơn_giá*$H$2
```

{{anh:tc-04-gia-dinh-vat}}

Khi thuế đổi, bạn sửa đúng một ô `H2` là cả bảng tự tính lại. Nếu gõ `*0,08` rải khắp nơi, đổi thuế là phải săn từng công thức. Đặt tên cho ô đó (`Thue_VAT`) thì công thức còn tự đọc được: `=Đơn_giá*Thue_VAT`.

## Sai lầm hay gặp

- **Quên khoá giả định:** kéo công thức tính thuế xuống, tham chiếu tới ô VAT bị trôi theo thành ô trống → kết quả nhân với 0. Luôn `F4` để khoá ô giả định.
- **Khoá quá tay:** khoá cứng `$A$1` cả những tham chiếu lẽ ra phải chạy theo dòng → mọi dòng ra cùng một kết quả.
- **Nhầm chiều khoá:** trong bảng hai chiều, cần khoá cột thì lại khoá hàng. Nhớ: `$` đứng trước cái gì thì khoá cái đó — trước chữ là cột, trước số là hàng.
