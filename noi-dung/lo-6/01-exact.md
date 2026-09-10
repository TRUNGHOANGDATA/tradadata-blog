---
tieu_de: "EXACT: so sánh chính xác tuyệt đối hai chuỗi, khác hẳn dấu ="
slug: "ham-exact-so-sanh-chinh-xac-hai-chuoi"
danh_muc: "Excel"
the: ["EXACT", "so sánh chuỗi", "kiểm tra dữ liệu", "hàm cơ bản"]
mo_ta: "Dấu = trong Excel không phân biệt chữ hoa chữ thường khi so hai chuỗi. Hàm EXACT làm đúng việc dấu = không làm được: so khớp tuyệt đối, kể cả kiểu chữ."
tu_khoa: "hàm EXACT Excel, so sánh chuỗi phân biệt hoa thường, EXACT khác dấu bằng, kiểm tra trùng khớp chính xác"
anh_bia: "/images/bai-viet/ham-exact/cover.png"
thu_muc_anh: "ham-exact"
trang_thai: "draft"
---

Bài về [`FIND` và `SEARCH`](/blog/ham-find-search-tim-vi-tri-ky-tu-trong-chuoi) đã nói `FIND` phân biệt chữ hoa chữ thường còn `SEARCH` thì không. Nhưng nếu chỉ cần so sánh **toàn bộ** hai chuỗi có giống hệt nhau hay không — không phải tìm một ký tự bên trong — dùng dấu `=` thông thường vẫn có một điều bất ngờ nhiều người không biết: **dấu `=` trong Excel không phân biệt chữ hoa chữ thường.**

`EXACT` là hàm được thiết kế đúng để làm việc dấu `=` không làm được: so khớp tuyệt đối, tính cả kiểu chữ.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Điều bất ngờ: dấu = không phân biệt hoa thường

```excel
="Excel" = "excel"
```

{{anh:ex-01-dau-bang-khong-phan-biet}}

Kết quả trả về **`TRUE`** — Excel coi hai chuỗi này bằng nhau, dù một chuỗi viết hoa chữ đầu, chuỗi kia viết thường toàn bộ. Với phần lớn công việc, đây là hành vi phù hợp — dò tìm tên khách hàng không cần quan tâm ai gõ hoa hay thường. Nhưng có những tình huống thật sự cần phân biệt, và đó là lúc dấu `=` gây ra một kết quả sai mà không hề báo lỗi gì.

## EXACT — so khớp tuyệt đối, tính cả kiểu chữ

```excel
=EXACT(text1, text2)
```

```excel
=EXACT("Excel", "excel")
```

{{anh:ex-02-exact-phan-biet}}

Kết quả trả về **`FALSE`** — đúng bản chất, vì hai chuỗi khác nhau ở kiểu chữ. `EXACT` là hàm duy nhất trong Excel so sánh chuỗi theo đúng nghĩa "giống hệt từng ký tự", không bỏ qua bất kỳ khác biệt nào.

## Ứng dụng thực tế: kiểm tra mã sản phẩm phân biệt hoa thường

Một số hệ thống mã hoá coi `VT001` và `vt001` là hai mã **khác nhau** hoàn toàn, dù nhìn qua tưởng cùng một mã. Dùng dấu `=` để đối chiếu hai danh sách mã trong trường hợp này sẽ báo "khớp" nhầm.

{{anh:ex-03-du-lieu-ma-hang}}

```excel
=IF(EXACT(A2, B2), "Khớp chính xác", "Khác kiểu chữ hoặc khác mã")
```

{{anh:ex-04-kiem-tra-ma-hang}}

Với `A2` là `"VT001"` và `B2` là `"vt001"`, công thức trả về **"Khác kiểu chữ hoặc khác mã"** — đúng như hệ thống mã hoá phân biệt hoa thường yêu cầu, điều mà một phép so sánh `A2=B2` thông thường sẽ bỏ lỡ vì luôn trả về `TRUE` trong trường hợp này.

## Vì sao VLOOKUP cũng không phân biệt hoa thường

Đúng như quy tắc chung của phép so sánh trong Excel, các hàm dò tìm quen thuộc — `VLOOKUP`, `XLOOKUP`, `MATCH` — cũng đi theo cùng logic với dấu `=`: không phân biệt hoa thường. Dò `"vt001"` vẫn khớp được với ô ghi `"VT001"`.

Muốn dò tìm có phân biệt hoa thường thật sự — trường hợp hiếm nhưng có thật, ví dụ hệ thống quản lý mã hàng coi hoa/thường là hai mã khác nhau — cần kết hợp `EXACT` vào bên trong một công thức mảng, vì bản thân `VLOOKUP` không có tham số nào bật/tắt việc này:

```excel
=INDEX(C2:C6, MATCH(TRUE, EXACT(A2:A6, "VT001"), 0))
```

{{anh:ex-05-do-tim-phan-biet-hoa-thuong}}

Công thức này thay thế cho `VLOOKUP` khi cần dò khớp tuyệt đối: `EXACT(A2:A6, "VT001")` so từng ô trong vùng với `"VT001"`, tính cả hoa thường, ra một dãy `TRUE`/`FALSE`. `MATCH(TRUE, ..., 0)` tìm vị trí đầu tiên có kết quả `TRUE`. `INDEX` lấy giá trị tương ứng — đúng kỹ thuật đã dùng ở bài [MAX, MIN, LARGE và SMALL](/blog/ham-max-min-large-small-tim-gia-tri-xep-hang), chỉ thay điều kiện so sánh từ `LARGE` sang `EXACT`.

## EXACT còn phát hiện cả khoảng trắng thừa

Một công dụng phụ ít được biết tới: `EXACT` cũng coi hai chuỗi khác nhau nếu chênh lệch dù chỉ một khoảng trắng — điều mà dấu `=` **cũng** phân biệt được, nên đây không phải điểm khác biệt riêng của `EXACT`, nhưng đáng nhắc lại vì nó hay bị nhầm là lỗi của `EXACT`.

```excel
=EXACT("Excel", "Excel ")
```

{{anh:ex-06-khoang-trang}}

Kết quả trả về **`FALSE`** — do khoảng trắng thừa ở cuối chuỗi thứ hai, đúng loại lỗi dữ liệu đã nói ở bài [Xử Lý Lỗi Trong Excel](/blog/xu-ly-loi-trong-excel-na-value-ref-div0-cach-khac-phuc). Gặp `EXACT` báo `FALSE` dù mắt nhìn hai chuỗi giống hệt nhau, nghi ngờ đầu tiên nên là khoảng trắng ẩn, kiểm bằng `LEN` hoặc bọc `TRIM` trước khi so sánh.

## Tổng kết

Dấu `=` trong Excel không phân biệt chữ hoa chữ thường khi so sánh chuỗi — một hành vi mặc định phù hợp với phần lớn công việc, nhưng gây sai lệch âm thầm khi dữ liệu thật sự cần phân biệt kiểu chữ. `EXACT` là hàm duy nhất so khớp tuyệt đối, tính cả hoa thường lẫn khoảng trắng, và có thể ghép vào công thức mảng để dò tìm phân biệt hoa thường — việc `VLOOKUP` không tự làm được.

Đọc tiếp trong cùng cụm bài: [DOLLAR và FIXED — định dạng số thành chuỗi tiền tệ và số cố định thập phân](/blog/ham-dollar-fixed-dinh-dang-tien-te-so-thap-phan).
