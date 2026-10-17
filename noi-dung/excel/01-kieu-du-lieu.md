---
tieu_de: "Excel đang hiểu dữ liệu của bạn là gì? Bốn loại giá trị và mẹo nhìn căn lề"
slug: "kieu-du-lieu-trong-excel"
danh_muc: "Excel"
the: ["kiểu dữ liệu", "nền tảng Excel", "TYPE"]
mo_ta: "Excel chỉ lưu bốn loại giá trị: số, văn bản, TRUE/FALSE và lỗi. Ngày, giờ, phần trăm, tiền tệ thực chất vẫn là số. Nhìn vào cách một ô căn lề là biết ngay Excel đang hiểu nó là gì — và đó là chìa khoá để bắt lỗi trước khi tính toán sai."
tu_khoa: "kiểu dữ liệu Excel, so voi van ban trong Excel, ham TYPE, cách Excel hiểu dữ liệu, số căn phải văn bản căn trái"
anh_bia: "/images/bai-viet/kieu-du-lieu/cover.png"
thu_muc_anh: "kieu-du-lieu"
trang_thai: "draft"
---

Trước khi học bất kỳ hàm nào, có một điều đáng nắm: Excel **không** lưu dữ liệu theo cách bạn nhìn thấy nó. Cái bạn thấy là *định dạng hiển thị*; cái Excel thật sự lưu bên dưới chỉ có bốn loại giá trị — **số**, **văn bản**, **TRUE/FALSE** (luận lý) và **lỗi**. Ngày, giờ, phần trăm, tiền tệ trông rất khác nhau nhưng bên dưới đều là *số*.

Hiểu điều này giải thích gần như mọi lỗi "công thức đúng mà kết quả sai" mà người mới hay gặp.

## Bốn loại giá trị, và mẹo nhìn là biết

Excel có một dấu hiệu trực quan cực kỳ hữu ích: **số căn phải, văn bản căn trái** — theo mặc định, khi bạn chưa can thiệp căn lề. TRUE/FALSE và lỗi thì căn giữa.

{{anh:kd-01-bon-loai}}

Dấu hiệu này quan trọng vì nó cho bạn biết Excel đang *hiểu* ô đó là gì, chứ không phải bạn *muốn* nó là gì. Một con số nhưng nằm căn trái nghĩa là nó đang bị lưu dưới dạng văn bản — và mọi phép tính trên nó sẽ sai.

## Ngày, giờ, phần trăm: tất cả đều là số

Đây là phần hay gây bất ngờ nhất:

| Bạn thấy | Excel lưu bên dưới | Vì sao |
|---|---|---|
| `15/03/2025` | `45731` | Ngày là số ngày đếm từ 01/01/1900 |
| `14:30` | `0,6042` | Giờ là phần thập phân của một ngày (14:30 = 60,42% của 24 giờ) |
| `25%` | `0,25` | Phần trăm chỉ là số 0,25 hiển thị kèm dấu % |
| `18.500.000 ₫` | `18500000` | Tiền vẫn là số; ký hiệu ₫ chỉ là định dạng |

{{anh:kd-02-ngay-la-so}}

Hệ quả rất thực tế:

- **Ngày trừ ngày ra số ngày.** Vì ngày là số, `=B2-A2` giữa hai ô ngày cho ra số ngày chênh lệch. Không cần hàm đặc biệt nào.
- **Đừng nhân phần trăm với 100.** Ô đã là `0,25`, nhân thêm 100 là thành 25 — sai gấp trăm lần.
- **Đơn vị ghi ở tiêu đề cột, đừng gõ vào ô.** Gõ `18500000 đ` vào ô biến cả ô thành văn bản.

## Hàm TYPE: hỏi thẳng Excel

Khi không chắc, dùng `=TYPE(ô)` để Excel trả lời nó đang hiểu ô đó là loại nào:

```excel
=TYPE(A1)
```

{{anh:kd-03-ham-type}}

Mã trả về: `1` là số, `2` là văn bản, `4` là luận lý (TRUE/FALSE), `16` là lỗi. (`TYPE` còn trả `64` cho mảng, nhưng hiếm dùng.) Ngày và giờ đều trả `1` — đúng như đã nói, chúng là số.

Có một [bài riêng về hàm TYPE](/blog/ham-type-tra-ve-ma-so-kieu-du-lieu) nếu bạn muốn đi sâu.

## Hai kiểu văn bản "giả dạng" hay gài bẫy

Không phải văn bản nào cũng dễ thấy. Hai trường hợp sau trông như số/ngày nhưng thật ra là văn bản:

- **Số điện thoại, mã số bắt đầu bằng 0.** Gõ `0912345678` mà để Excel hiểu là số thì mất luôn số `0` đầu. Cố tình để dạng văn bản mới giữ được — và đó là điều *đúng*, vì bạn không bao giờ cộng hai số điện thoại với nhau.
- **Khoảng trắng thừa.** `"Hà Nội "` có dấu cách ở cuối nhìn giống hệt `"Hà Nội"`, nhưng `VLOOKUP` và phép so sánh `=` sẽ coi chúng là khác nhau. Dùng `TRIM` để cắt bỏ.

{{anh:kd-04-van-ban-gia-dang}}

## Lỗi cũng là một loại giá trị

Điều ít người để ý: `#DIV/0!`, `#N/A`, `#VALUE!`... không phải "thông báo", chúng là **giá trị** thật nằm trong ô. Và vì là giá trị, chúng **lan** sang mọi ô có công thức tham chiếu tới ô lỗi. Một ô `#DIV/0!` ở đầu chuỗi có thể làm hỏng cả một cột tính tổng phía sau.

Việc đọc và xử lý sáu mã lỗi hay gặp đủ nhiều để tách thành [một bài riêng](/blog/cac-ma-loi-thuong-gap-trong-excel).

## Kiểm nhanh trên máy bạn

Gõ thử vào các ô trống rồi quan sát căn lề:

- Gõ `1234.5` → căn phải → số. Gõ `'1234.5` (thêm dấu nháy đơn đầu) → căn trái → văn bản.
- Gõ `=TYPE(` rồi trỏ vào từng ô để xác nhận.

Nắm được "Excel đang hiểu ô này là gì" là nền tảng cho mọi thứ về sau: vì sao [SUM bị thiếu tổng](/blog/so-bi-luu-thanh-van-ban-trong-excel), vì sao ngày nhập vào không tính được, vì sao `VLOOKUP` trả `#N/A` dù nhìn thấy rõ giá trị. Tất cả đều quay về cùng một câu hỏi.
