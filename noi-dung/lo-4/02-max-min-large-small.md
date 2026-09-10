---
tieu_de: "MAX, MIN, LARGE và SMALL: tìm giá trị lớn nhất, nhỏ nhất và xếp hạng theo vị trí"
slug: "ham-max-min-large-small-tim-gia-tri-xep-hang"
danh_muc: "Excel"
the: ["MAX", "MIN", "LARGE", "SMALL", "xếp hạng dữ liệu"]
mo_ta: "Cách dùng MAX và MIN để tìm giá trị lớn nhất, nhỏ nhất, và dùng LARGE, SMALL để tìm giá trị đứng thứ 2, thứ 3 — thứ mà MAX và MIN không làm được."
tu_khoa: "hàm MAX Excel, hàm MIN Excel, hàm LARGE, hàm SMALL, tìm giá trị lớn thứ 2, xếp hạng theo vị trí Excel"
anh_bia: "/images/bai-viet/ham-max-min-large-small/cover.png"
thu_muc_anh: "ham-max-min-large-small"
trang_thai: "draft"
---

Muốn biết doanh số cao nhất trong tháng là bao nhiêu, hầu như ai cũng nghĩ ngay tới `MAX`. Nhưng nếu câu hỏi là "doanh số cao **thứ nhì**" — người đứng ngay sau người dẫn đầu — thì `MAX` bó tay. Đây chính là lúc cần tới hai hàm ít được biết tới hơn: `LARGE` và `SMALL`.

Bài này đi qua cả bốn hàm cùng nhóm — `MAX`, `MIN` cho giá trị lớn nhất, nhỏ nhất, và `LARGE`, `SMALL` cho việc tìm giá trị theo bất kỳ thứ hạng nào.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Bộ dữ liệu dùng trong bài

Doanh số bán hàng của 6 nhân viên trong tháng.

{{anh:mm-01-du-lieu}}

## MAX và MIN — giá trị lớn nhất, nhỏ nhất

```excel
=MAX(B2:B7)
=MIN(B2:B7)
```

Hai hàm này đơn giản và quen thuộc: `MAX` trả về giá trị lớn nhất trong vùng, `MIN` trả về giá trị nhỏ nhất.

{{anh:mm-02-max-min}}

Với dữ liệu trên, `MAX` trả về **95** (doanh số của Hoàng Văn E), `MIN` trả về **52** (doanh số của Trần Thị B).

## LARGE — giá trị lớn theo bất kỳ thứ hạng nào

```excel
=LARGE(array, k)
```

`LARGE` trả về giá trị lớn thứ `k` trong vùng dữ liệu. Muốn tìm giá trị lớn **nhất**, `k` bằng `1` — lúc đó `LARGE(B2:B7, 1)` cho kết quả giống hệt `MAX(B2:B7)`. Sức mạnh thật sự của `LARGE` nằm ở việc đổi `k` sang bất kỳ số nào khác:

```excel
=LARGE(B2:B7, 2)
```

{{anh:mm-03-large}}

Kết quả trả về **88** — doanh số cao thứ nhì, của Lê Văn C. Đây chính là thứ `MAX` không bao giờ làm được, vì `MAX` chỉ biết mỗi một việc: tìm hạng nhất.

## SMALL — giá trị nhỏ theo bất kỳ thứ hạng nào

```excel
=SMALL(array, k)
```

`SMALL` làm ngược lại `LARGE`: trả về giá trị nhỏ thứ `k`. `SMALL(B2:B7, 1)` cho kết quả giống `MIN(B2:B7)`.

```excel
=SMALL(B2:B7, 2)
```

{{anh:mm-04-small}}

Kết quả trả về **60** — doanh số thấp thứ nhì, của Vũ Thị F.

## Lấy đúng tên ứng với thứ hạng

Biết được con số `88` là doanh số cao thứ nhì chưa đủ hữu ích — thường cần biết luôn đó là **của ai**. Kết hợp `LARGE` với `MATCH` và `INDEX` để tra ngược lại tên tương ứng:

```excel
=INDEX(A2:A7, MATCH(LARGE(B2:B7, 2), B2:B7, 0))
```

{{anh:mm-05-lay-ten}}

Đọc theo từng lớp: `LARGE(B2:B7, 2)` tìm ra con số `88`. `MATCH` tìm vị trí của con số `88` đó trong cột doanh số. `INDEX` lấy tên tương ứng ở đúng vị trí đó trong cột tên. Kết quả trả về **"Lê Văn C"**.

Cách ghép này chính là kỹ thuật `INDEX`/`MATCH` — xem thêm ở [INDEX MATCH Trong Excel: Tra Cứu Dữ Liệu Linh Hoạt Hơn VLOOKUP](/blog/index-match-trong-excel-tra-cuu-du-lieu-linh-hoat) — chỉ khác chỗ giá trị cần tìm không phải nhập tay, mà lấy trực tiếp từ kết quả của `LARGE`.

## Cẩn thận khi có giá trị trùng nhau

Nếu hai nhân viên có cùng doanh số cao nhất, `LARGE(B2:B7, 1)` và `LARGE(B2:B7, 2)` sẽ trả về **cùng một con số** — Excel không tự động bỏ qua giá trị trùng để nhảy tới giá trị tiếp theo khác biệt. Với ví dụ đó, công thức `INDEX`/`MATCH` ở trên sẽ luôn trả về tên của người **đầu tiên** tìm thấy có giá trị đó, dù trên thực tế có nhiều hơn một người cùng đạt mức doanh số cao thứ nhì.

Muốn xếp hạng có tính đến việc bỏ qua giá trị trùng lặp (để hạng nhì luôn là một giá trị **khác biệt** với hạng nhất) cần thêm bước lọc ra danh sách giá trị duy nhất trước khi áp dụng `LARGE` — nằm ngoài phạm vi bốn hàm cơ bản trong bài này.

## Tổng kết

`MAX` và `MIN` chỉ trả lời được câu hỏi về giá trị lớn nhất hoặc nhỏ nhất tuyệt đối. `LARGE` và `SMALL` mở rộng khả năng đó ra bất kỳ thứ hạng nào bằng cách đổi tham số `k` — hạng nhì, hạng ba, hay bất kỳ vị trí nào cần biết. Kết hợp thêm `INDEX`/`MATCH` để tra ra tên tương ứng với thứ hạng đó, thay vì chỉ dừng lại ở một con số.

Đọc tiếp trong cùng cụm bài: [PROPER, UPPER và LOWER — chuẩn hoá cách viết hoa/thường trong dữ liệu](/blog/ham-proper-upper-lower-chuan-hoa-chu-hoa-thuong). Quay lại [COUNT, COUNTA và COUNTBLANK](/blog/ham-count-counta-countblank-dem-o-trong-excel).
