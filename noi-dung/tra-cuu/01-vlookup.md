---
tieu_de: "VLOOKUP: dò một giá trị và kéo dữ liệu từ bảng khác về"
slug: "ham-vlookup-do-tim-theo-cot-doc"
danh_muc: "Excel"
the: ["VLOOKUP", "tra cứu", "hàm dò tìm"]
mo_ta: "VLOOKUP dò một giá trị ở cột đầu của một vùng rồi trả về dữ liệu cùng hàng ở cột bạn chỉ định. Nắm bốn tham số, hiểu vì sao tham số cuối phải là FALSE, và gỡ được lỗi #N/A là dùng thành thạo hàm tra cứu quan trọng nhất của Excel."
tu_khoa: "hàm VLOOKUP, VLOOKUP trong Excel, dò tìm theo cột dọc, VLOOKUP ra #N/A, khớp chính xác FALSE, cách dùng VLOOKUP"
anh_bia: "/images/bai-viet/vlookup/cover.png"
thu_muc_anh: "vlookup"
trang_thai: "draft"
---

Bạn có một bảng đơn hàng chỉ ghi **mã sản phẩm**, và một bảng danh mục riêng ghi mã kèm **tên** và **giá**. Việc gõ tay tên từng dòng vừa chậm vừa dễ sai. `VLOOKUP` sinh ra đúng cho tình huống này: đưa nó một giá trị cần tìm, nó dò ở cột đầu của bảng danh mục và kéo về dữ liệu cùng hàng ở cột bạn muốn.

Đây là hàm tra cứu được dùng nhiều nhất trong Excel. Nắm chắc nó — đặc biệt là hiểu vì sao nó hay trả `#N/A` — sẽ gỡ được phần lớn những lúc "công thức đúng mà không ra kết quả".

## Bốn tham số, đọc một lần là nhớ

```excel
=VLOOKUP(giá_trị_tìm, vùng_bảng, số_cột, [khớp_chính_xác])
```

- **giá_trị_tìm** — cái bạn có sẵn và muốn tra (ví dụ mã `"SP03"`).
- **vùng_bảng** — bảng chứa dữ liệu. Điều bắt buộc: cột dò **phải là cột ngoài cùng bên trái** của vùng này.
- **số_cột** — muốn lấy về dữ liệu ở cột thứ mấy, tính từ 1 tại cột đầu vùng.
- **khớp_chính_xác** — `FALSE` (chính xác) hay `TRUE` (gần đúng). Gần như luôn dùng `FALSE`.

{{anh:vl-01-bang-tra}}

Trong hình, `=VLOOKUP("SP03",A2:C5,2,FALSE)` dò `"SP03"` ở cột A (cột đầu của vùng), tìm thấy ở hàng thứ ba, rồi trả về giá trị cột thứ **2** cùng hàng — `Tai nghe Bluetooth`. Đổi số cột thành `3` là ra giá — `620.000`.

## Tham số cuối: bỏ trống là tự chuốc lỗi

Đây là chỗ khiến người mới sai âm thầm nhiều nhất. Tham số thứ tư quyết định VLOOKUP khớp kiểu gì:

{{anh:vl-02-gan-dung-chinh-xac}}

- **`FALSE` (hoặc `0`) — khớp chính xác.** Chỉ trả kết quả khi tìm đúng y hệt. Không thấy thì trả `#N/A`. Đây là cái bạn cần trong 95% trường hợp: tra mã, tra tên, tra khách hàng.
- **`TRUE` (hoặc `1`) — khớp gần đúng.** Trả về giá trị lớn nhất mà *không vượt quá* giá trị tìm. Chỉ đúng khi cột đầu **đã sắp xếp tăng dần** — hợp cho bảng bậc thang (thuế, chiết khấu theo mức).

Cạm bẫy: nếu **bỏ trống** tham số này, Excel mặc định là `TRUE`. Trên một bảng chưa sắp xếp, nó vẫn trả về *một* giá trị trông có vẻ hợp lý mà không báo lỗi gì — nên cái sai lọt qua rất êm. Thói quen tốt: luôn gõ `FALSE` (hoặc `0`) trừ khi bạn thật sự cần bậc thang.

## Vì sao VLOOKUP trả #N/A

`#N/A` nghĩa là "không tìm thấy" — nó là một [giá trị lỗi thật sự nằm trong ô](/blog/cac-ma-loi-thuong-gap-trong-excel), không phải thông báo. Bốn nguyên nhân hay gặp:

{{anh:vl-03-loi-na}}

Hai nguyên nhân đầu dễ đoán. Hai cái sau mới là thủ phạm ẩn:

- **Số một bên, văn bản một bên.** Mã `1024` gõ trong bảng đơn hàng là *số*, nhưng trong danh mục lại bị [lưu thành văn bản](/blog/so-bi-luu-thanh-van-ban-trong-excel) (hoặc ngược lại). Nhìn thì giống hệt, VLOOKUP thì coi là khác nhau. Mẹo nhìn nhanh: số căn phải, văn bản căn trái — chi tiết ở bài [Excel hiểu dữ liệu của bạn là gì](/blog/kieu-du-lieu-trong-excel).
- **Khoảng trắng thừa.** `"SP03 "` có dấu cách ở cuối trông y như `"SP03"`. Bọc giá trị tìm trong `TRIM()` để cắt bỏ.

## Số cột đếm từ vùng, không theo tên cột Excel

Một hiểu lầm phổ biến: nghĩ "số cột 3" là cột C của sheet. Không — nó đếm **từ 1 tại cột đầu của vùng bạn chọn**.

{{anh:vl-04-cot-index}}

Nếu vùng bắt đầu ở cột A thì số 3 là cột C; nhưng nếu vùng bắt đầu ở cột B thì số 3 lại là cột D. Hệ quả thực tế đáng lo hơn: khi bạn **chèn thêm một cột vào giữa vùng**, con số này không tự cập nhật, nên công thức âm thầm trỏ sang cột sai. Đây chính là điểm yếu khiến nhiều người chuyển sang INDEX/MATCH hoặc `XLOOKUP` — nơi bạn chỉ cột trả về bằng *vùng* chứ không phải bằng *số đếm*.

## Khoá vùng để kéo công thức không lệch

Khi copy VLOOKUP xuống cả cột, giá trị tìm nên trượt theo từng hàng, nhưng **vùng bảng phải đứng yên**. Dùng [tham chiếu tuyệt đối](/blog/tham-chieu-tuong-doi-va-tuyet-doi-trong-excel) cho vùng:

```excel
=VLOOKUP(A2,$F$2:$H$100,2,FALSE)
```

Dấu `$` khoá vùng `F2:H100` lại; ô `A2` không khoá nên khi kéo xuống thành `A3`, `A4`... Muốn khỏi phải nhớ khoá và không lo vùng thiếu dòng khi dữ liệu dài thêm, hãy đặt bảng danh mục thành một [Excel Table và tham chiếu theo tên](/blog/excel-table-va-tham-chieu-theo-ten-cot) — vùng sẽ tự giãn.

## Thay #N/A bằng một câu dễ đọc

Nếu bạn muốn ô hiện chữ thay vì mã lỗi khi không tìm thấy, bọc trong `IFERROR`:

```excel
=IFERROR(VLOOKUP(A2,$F$2:$H$100,2,FALSE),"Chưa có mã này")
```

Chỉ lưu ý: `IFERROR` che *mọi* lỗi, nên đừng dùng nó để giấu một công thức đang sai — chỉ dùng khi "không tìm thấy" là tình huống bình thường bạn đã lường trước.

## VLOOKUP so với các hàm họ hàng

- Cần dò **theo hàng ngang** thay vì cột dọc? Đó là việc của [HLOOKUP](/blog/ham-hlookup-tra-cuu-theo-hang-ngang) — cùng ý tưởng, đổi trục.
- Chỉ cần biết giá trị nằm ở **vị trí thứ mấy** chứ không kéo dữ liệu về? Dùng [XMATCH](/blog/ham-xmatch-tim-vi-tri-hien-dai), hàm tìm vị trí hiện đại, dò được cả hai chiều và không kén cột đầu.
- Cần dò sang **trái**, hoặc muốn hàm không gãy khi chèn cột? `XLOOKUP` (Excel 365) là bản kế nhiệm trực tiếp, nhưng VLOOKUP vẫn là hàm bạn gặp nhiều nhất ở file của người khác — nên hiểu nó vẫn cần thiết.

## Kiểm nhanh trên máy bạn

- Dựng một bảng danh mục nhỏ, gõ `=VLOOKUP(...)` với `FALSE`, rồi thử sửa một mã ở bảng tra cho lệch một dấu cách — quan sát nó chuyển sang `#N/A`.
- Bọc lại bằng `TRIM()` ở giá trị tìm và xem lỗi biến mất. Đó là 90% số lần VLOOKUP "dở chứng" trong thực tế.
