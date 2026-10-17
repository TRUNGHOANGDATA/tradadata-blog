---
tieu_de: "INDEX và MATCH: cặp đôi tra cứu linh hoạt hơn VLOOKUP"
slug: "ham-index-match-tra-cuu-linh-hoat"
danh_muc: "Excel"
the: ["INDEX", "MATCH", "tra cứu"]
mo_ta: "MATCH trả về vị trí của một giá trị trong vùng; INDEX trả về giá trị tại một vị trí. Ghép lại, chúng dò được sang trái và không gãy khi chèn cột — đó là lý do INDEX/MATCH được ưa dùng khi VLOOKUP tỏ ra cứng nhắc."
tu_khoa: "hàm INDEX MATCH, INDEX MATCH trong Excel, tra cứu hai chiều, dò trái, INDEX MATCH so với VLOOKUP, kết hợp INDEX và MATCH"
anh_bia: "/images/bai-viet/index-match/cover.png"
thu_muc_anh: "index-match"
trang_thai: "draft"
---

Trước khi [XLOOKUP](/blog/ham-xlookup-ban-ke-nhiem-vlookup) ra đời, đây là cách dân Excel lâu năm dò tìm khi [VLOOKUP](/blog/ham-vlookup-do-tim-theo-cot-doc) tỏ ra cứng nhắc: ghép hai hàm `INDEX` và `MATCH`. Cặp này vẫn rất đáng học vì nó chạy trên *mọi* phiên bản Excel, dò được sang trái, và không gãy khi bạn chèn thêm cột.

Ý tưởng gọn trong một câu: **MATCH tìm ra *vị trí*, INDEX lấy *giá trị* ở vị trí đó.** Học từng hàm riêng trước, ghép lại sau.

## MATCH: giá trị này nằm ở dòng thứ mấy

```excel
=MATCH(giá_trị_tìm, vùng_dò, 0)
```

`MATCH` không trả về dữ liệu — nó trả về **thứ tự** của giá trị trong vùng. Số `0` ở cuối nghĩa là khớp chính xác (giống vai trò `FALSE` của VLOOKUP).

{{anh:im-01-match}}

`=MATCH("SP03",A2:A5,0)` cho kết quả `3`, vì `"SP03"` là phần tử thứ ba trong vùng `A2:A5`. Nếu bạn cần một phiên bản mạnh hơn — dò hai chiều, tìm theo ký tự đại diện — hãy xem [XMATCH](/blog/ham-xmatch-tim-vi-tri-hien-dai), bản kế nhiệm của MATCH.

## INDEX: lấy giá trị ở dòng thứ N

```excel
=INDEX(vùng, số_dòng)
```

`INDEX` làm việc ngược lại: cho nó một vùng và một số thứ tự, nó trả về giá trị ở đúng ô đó.

{{anh:im-02-index}}

`=INDEX(B2:B5,3)` trả về `Tai nghe Bluetooth` — phần tử thứ ba của vùng `B2:B5`. Bản thân INDEX chưa biết "thứ ba" là dòng nào; nó cần ai đó nói cho biết con số ấy.

## Ghép lại: MATCH nuôi số cho INDEX

Đây là lúc phép màu xảy ra. Thay vì gõ tay số `3`, ta để MATCH tính nó:

```excel
=INDEX(B2:B5, MATCH("SP03",A2:A5,0))
```

{{anh:im-03-ghep}}

Đọc từ trong ra ngoài: `MATCH` tìm `"SP03"` ở cột mã và trả `3`; `INDEX` lấy phần tử thứ `3` của cột tên. Kết quả là `Tai nghe Bluetooth` — đúng như VLOOKUP, nhưng linh hoạt hơn hẳn.

## Vì sao nhiều người thích hơn VLOOKUP

- **Dò được sang trái.** Vùng của INDEX (cột trả về) và vùng của MATCH (cột dò) là hai vùng độc lập, nên cột trả về nằm bên trái cột dò cũng không sao. VLOOKUP thì luôn bắt cột dò phải ở ngoài cùng bên trái.
- **Không gãy khi chèn cột.** INDEX/MATCH trỏ vào *vùng*, không đếm số cột như VLOOKUP, nên chèn thêm cột vào giữa bảng không làm lệch kết quả.
- **Nhẹ hơn trên bảng lớn.** Nó chỉ đọc đúng hai cột liên quan thay vì cả khối bảng.

## Tra cứu hai chiều: MATCH cho cả dòng lẫn cột

Sức mạnh thật sự lộ ra khi bạn cần dò *đồng thời theo dòng và cột* — ví dụ tra doanh thu của một nhân viên trong một tháng cụ thể. Lồng hai MATCH vào INDEX:

```excel
=INDEX(vùng_dữ_liệu, MATCH(tên_dòng, cột_tên, 0), MATCH(tên_cột, hàng_tiêu_đề, 0))
```

Một MATCH tìm số dòng, một MATCH tìm số cột, INDEX lấy ô giao nhau. VLOOKUP không làm được việc này một cách gọn gàng.

## Vẫn cần khoá vùng khi kéo công thức

Giống mọi công thức tra cứu, khi copy xuống cả cột thì các vùng cố định phải được [khoá bằng dấu $](/blog/tham-chieu-tuong-doi-va-tuyet-doi-trong-excel), chỉ để ô chứa giá trị tìm trượt theo hàng. Muốn khỏi khoá và không lo vùng thiếu dòng, đặt dữ liệu thành một [Excel Table](/blog/excel-table-va-tham-chieu-theo-ten-cot) rồi tham chiếu theo tên cột.

## Kiểm nhanh trên máy bạn

- Gõ `=MATCH(...)` riêng để thấy nó ra một *con số*, rồi `=INDEX(...)` với con số đó — hiểu từng nửa trước khi ghép.
- Dựng bảng có cột tên nằm *bên trái* cột mã, rồi dùng INDEX/MATCH dò tên ra mã — việc VLOOKUP không làm được.
