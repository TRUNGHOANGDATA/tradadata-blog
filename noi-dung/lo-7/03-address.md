---
tieu_de: "ADDRESS: dựng địa chỉ ô dạng văn bản từ số hàng và cột"
slug: "ham-address-dung-dia-chi-o-dang-van-ban"
danh_muc: "Excel"
the: ["ADDRESS", "INDIRECT", "tham chiếu động", "hàm cơ bản"]
mo_ta: "ADDRESS dựng ra một chuỗi địa chỉ ô như A1 hay $B$5 từ hai con số hàng và cột — ghép với INDIRECT để đọc được giá trị tại địa chỉ vừa dựng, dùng cho tham chiếu hoàn toàn động."
tu_khoa: "hàm ADDRESS Excel, dựng địa chỉ ô, ADDRESS kết hợp INDIRECT, tham chiếu động Excel, tạo địa chỉ ô từ số hàng cột"
anh_bia: "/images/bai-viet/ham-address/cover.png"
thu_muc_anh: "ham-address"
trang_thai: "draft"
---

Bài trước đã dùng [`ROW` và `COLUMN`](/blog/ham-row-column-danh-so-tu-dong) để lấy ra vị trí của một ô dưới dạng **số**. `ADDRESS` làm chiều ngược lại: nhận vào hai con số hàng và cột, dựng ra một **chuỗi văn bản** đúng định dạng địa chỉ ô mà Excel hiểu — `"A1"`, `"$B$5"`, và các biến thể khác.

Một mình `ADDRESS` ít khi dùng độc lập — giá trị thật của nó lộ ra khi ghép với `INDIRECT`, tạo thành cặp bài trùng dùng để xây tham chiếu hoàn toàn động.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp và ví dụ cơ bản

```excel
=ADDRESS(row_num, column_num, [abs_num], [a1], [sheet_text])
```

```excel
=ADDRESS(5, 2)
```

{{anh:ad-01-address-co-ban}}

Kết quả trả về chuỗi **"$B$5"** — hàng `5`, cột `2` (tức cột `B`). Mặc định `ADDRESS` dựng địa chỉ tuyệt đối, có dấu `$` ở cả hàng và cột, giống hệt khái niệm đã nói ở bài về [Quy Tắc Tham Chiếu $A$1, $A1, A$1](/blog/quy-tac-tham-chieu-a1-a1-a1-hieu-dung-absolute-va-relative-reference).

## Tham số abs_num — chọn kiểu tham chiếu

Tham số thứ ba quyết định địa chỉ dựng ra có dấu `$` ở đâu:

- `1` (mặc định) — tuyệt đối cả hàng và cột: `$B$5`.
- `2` — tuyệt đối hàng, tương đối cột: `B$5`.
- `3` — tương đối hàng, tuyệt đối cột: `$B5`.
- `4` — tương đối cả hai: `B5`.

```excel
=ADDRESS(5, 2, 4)
```

{{anh:ad-02-abs-num}}

Kết quả trả về **"B5"** — không còn dấu `$` nào, đúng kiểu tương đối hoàn toàn.

## Kết quả của ADDRESS chỉ là VĂN BẢN, chưa đọc được giá trị

Đây là điều quan trọng nhất cần hiểu: chuỗi `"B5"` mà `ADDRESS` trả về chỉ là **văn bản trông giống địa chỉ ô** — bản thân nó chưa lấy ra được giá trị đang nằm trong ô `B5` thật. Đặt trực tiếp `ADDRESS(5,2)` vào một phép tính sẽ không lấy được số nào từ ô `B5`, vì Excel đang thấy một chuỗi ký tự, không phải một tham chiếu.

{{anh:ad-03-chi-la-van-ban}}

## Ghép với INDIRECT để đọc được giá trị thật

`INDIRECT` là hàm biến một chuỗi văn bản trông giống địa chỉ ô thành một **tham chiếu thật**, đọc được giá trị bên trong:

```excel
=INDIRECT(ADDRESS(5, 2))
```

{{anh:ad-04-address-indirect}}

Ghép hai hàm lại: `ADDRESS(5, 2)` dựng ra chuỗi `"$B$5"`, `INDIRECT` biến chuỗi đó thành tham chiếu tới ô `B5` thật, đọc ra đúng giá trị đang nằm trong ô đó. Cặp `ADDRESS` + `INDIRECT` này là cách xây dựng tham chiếu **hoàn toàn động** — địa chỉ ô cần đọc không cố định trong công thức, mà được tính ra từ những con số khác, ví dụ từ kết quả của `MATCH` hay từ `ROW`/`COLUMN` như bài trước.

## Ứng dụng thực tế: đọc giá trị theo toạ độ tính ra từ nơi khác

Ví dụ: có hai ô riêng chứa số hàng và số cột cần đọc, muốn công thức tự tìm tới đúng ô đó mà không viết cố định địa chỉ.

{{anh:ad-05-du-lieu-toa-do}}

```excel
=INDIRECT(ADDRESS(D2, E2))
```

{{anh:ad-06-doc-theo-toa-do}}

Với `D2` chứa `5` và `E2` chứa `2`, công thức tự dựng địa chỉ `"$B$5"` rồi đọc ra giá trị tại đó — đổi số trong `D2`/`E2`, công thức tự động trỏ tới một ô hoàn toàn khác, không cần sửa lại công thức gốc.

## Cân nhắc trước khi dùng INDIRECT

`INDIRECT` (và do đó, cách kết hợp với `ADDRESS`) có một nhược điểm đáng cân nhắc: nó là hàm **dễ bay hơi** (volatile) — tính toán lại **mỗi lần** bảng tính thay đổi bất kỳ điều gì, không chỉ khi các ô nó phụ thuộc thay đổi. Trên một bảng tính lớn có nhiều công thức `INDIRECT`, điều này có thể làm Excel chạy chậm rõ rệt. Với các nhu cầu dò tìm động đơn giản hơn, `INDEX` — đã nói ở bài [INDEX và MATCH](/blog/index-match-trong-excel-tra-cuu-du-lieu-linh-hoat) — thường là lựa chọn hiệu quả hơn, vì `INDEX` không dễ bay hơi.

## Tổng kết

`ADDRESS` dựng ra một chuỗi địa chỉ ô dạng văn bản từ hai con số hàng và cột — bản thân nó chưa đọc được giá trị, chỉ tạo ra hình dạng địa chỉ đúng chuẩn Excel. Ghép với `INDIRECT` để biến chuỗi đó thành tham chiếu thật, tạo ra công thức có thể trỏ tới bất kỳ ô nào tuỳ theo dữ liệu đầu vào — nhưng cần cân nhắc chi phí hiệu năng của `INDIRECT` trên bảng tính lớn.

Đọc tiếp trong cùng cụm bài: [N và T — ép giá trị về số hoặc văn bản một cách im lặng](/blog/ham-n-t-ep-gia-tri-im-lang).
