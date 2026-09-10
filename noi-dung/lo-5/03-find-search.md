---
tieu_de: "FIND và SEARCH: tìm vị trí một ký tự trong chuỗi, khác nhau đúng một điểm"
slug: "ham-find-search-tim-vi-tri-ky-tu-trong-chuoi"
danh_muc: "Excel"
the: ["FIND", "SEARCH", "xử lý chuỗi", "hàm cơ bản"]
mo_ta: "Cách dùng FIND và SEARCH để tìm vị trí một ký tự hoặc chuỗi con trong văn bản — hai hàm gần như giống hệt nhau, chỉ khác đúng một điểm: có phân biệt chữ hoa chữ thường hay không."
tu_khoa: "hàm FIND Excel, hàm SEARCH Excel, tìm vị trí ký tự trong chuỗi, phân biệt hoa thường Excel, tách chuỗi theo ký tự"
anh_bia: "/images/bai-viet/ham-find-search/cover.png"
thu_muc_anh: "ham-find-search"
trang_thai: "draft"
---

Muốn cắt phần tên miền ra khỏi một địa chỉ email, hay lấy phần mã sau dấu gạch ngang trong một mã sản phẩm — bước đầu tiên luôn là phải biết **ký tự cần cắt nằm ở vị trí thứ mấy** trong chuỗi. `LEFT`, `RIGHT`, `MID` cắt chuỗi theo vị trí, nhưng chúng cần một con số vị trí cho trước — `FIND` và `SEARCH` chính là hai hàm tìm ra con số đó.

Hai hàm này gần như làm y hệt nhau, và đó cũng là điều dễ gây nhầm lẫn nhất: chỉ khác nhau đúng **một** điểm, nhưng điểm đó lại quan trọng.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp chung của cả hai hàm

```excel
=FIND(find_text, within_text, [start_num])
=SEARCH(find_text, within_text, [start_num])
```

Cả hai đều trả về **vị trí** (một con số) mà `find_text` xuất hiện lần đầu tiên bên trong `within_text`, tính từ ký tự đầu tiên là vị trí `1`.

## Ví dụ với FIND

```excel
=FIND("@", A2)
```

{{anh:fs-01-find-co-ban}}

Với email `"nguyenvana@gmail.com"`, `FIND` trả về **11** — vị trí của ký tự `@`, đếm từ đầu chuỗi. Ghép thêm `MID` hoặc `RIGHT` dựa vào con số này để cắt ra phần tên miền:

```excel
=RIGHT(A2, LEN(A2) - FIND("@", A2))
```

{{anh:fs-02-cat-ten-mien}}

Kết quả trả về **"gmail.com"** — lấy toàn bộ ký tự sau vị trí dấu `@`.

## Điểm khác biệt duy nhất: phân biệt chữ hoa chữ thường

Đây là điều quan trọng nhất cần nhớ để chọn đúng hàm: **`FIND` phân biệt chữ hoa chữ thường, `SEARCH` thì không.**

```excel
=FIND("a", "Nguyễn Văn A")     ' Không tìm thấy chữ "a" thường -> #VALUE!
=SEARCH("a", "Nguyễn Văn A")   ' Tìm thấy chữ "A" hoa, coi như khớp -> trả về vị trí
```

{{anh:fs-03-phan-biet-hoa-thuong}}

`FIND` chỉ khớp đúng "a" viết thường — chuỗi `"Nguyễn Văn A"` không chứa chữ "a" thường nào (chỉ có "A" hoa), nên `FIND` báo lỗi `#VALUE!` vì không tìm thấy. `SEARCH` thì coi "a" và "A" là như nhau, tìm thấy ngay và trả về vị trí.

**Cách chọn hàm dựa trên nhu cầu thực tế:** cần tìm chính xác cả kiểu chữ hoa/thường (ví dụ phân biệt mã hàng `VT001` khác `vt001`) thì dùng `FIND`. Cần tìm bất kể chữ hoa hay thường (ví dụ tìm tên khách hàng mà không chắc người nhập viết hoa kiểu gì) thì dùng `SEARCH`.

## SEARCH còn hỗ trợ ký tự đại diện, FIND thì không

Một khác biệt thứ hai, ít được biết tới hơn: `SEARCH` chấp nhận ký tự đại diện `*` (thay cho một chuỗi bất kỳ) và `?` (thay cho đúng một ký tự), còn `FIND` thì không hỗ trợ.

```excel
=SEARCH("v?n", "Nguyễn Văn A")
```

{{anh:fs-04-ky-tu-dai-dien}}

Dấu `?` khớp với đúng một ký tự bất kỳ nằm giữa "v" và "n" — tìm thấy "văn" (không phân biệt hoa thường, vì đây là `SEARCH`) và trả về vị trí bắt đầu của cụm đó. Viết cùng công thức này bằng `FIND` sẽ báo lỗi, vì `FIND` hiểu `?` là một ký tự thật cần tìm, không phải ký tự đại diện.

## Xử lý khi không tìm thấy: IFERROR

Cả hai hàm đều trả về lỗi `#VALUE!` khi không tìm thấy `find_text` trong `within_text`. Khi không chắc chắn ký tự cần tìm có tồn tại hay không, nên bọc thêm `IFERROR` để tránh lỗi lan ra công thức khác:

```excel
=IFERROR(FIND("@", A2), 0)
```

{{anh:fs-05-xu-ly-khong-tim-thay}}

Công thức này trả về `0` thay vì báo lỗi khi ô không chứa ký tự `@` — hữu ích khi cần lọc ra những dòng dữ liệu bị thiếu định dạng đúng, ví dụ email nhập thiếu ký tự `@`.

## Tham số start_num: tìm từ vị trí nào trở đi

Tham số thứ ba, thường bị bỏ qua, cho phép bắt đầu tìm từ một vị trí nhất định thay vì luôn từ đầu chuỗi — hữu ích khi chuỗi có nhiều hơn một lần xuất hiện của ký tự cần tìm và cần lấy lần xuất hiện thứ hai trở đi.

```excel
=FIND("-", "SP-2026-001", FIND("-", "SP-2026-001") + 1)
```

{{anh:fs-06-tim-lan-thu-hai}}

Công thức bên trong `FIND("-", "SP-2026-001")` tìm vị trí dấu gạch ngang **đầu tiên**. Cộng thêm `1` để bắt đầu tìm từ ngay sau vị trí đó, và `FIND` bên ngoài tìm ra dấu gạch ngang **thứ hai** — kỹ thuật lồng hàm này áp dụng được cho cả `SEARCH`.

## Tổng kết

`FIND` và `SEARCH` cùng tìm vị trí của một chuỗi con bên trong chuỗi lớn hơn, khác nhau ở đúng hai điểm: `FIND` phân biệt chữ hoa chữ thường và không hỗ trợ ký tự đại diện, `SEARCH` thì ngược lại ở cả hai điểm đó. Chọn hàm nào tuỳ vào việc có cần phân biệt hoa thường hay cần dùng ký tự đại diện hay không.

Đọc tiếp trong cùng cụm bài: [VALUE và TEXT — chuyển đổi qua lại giữa số và văn bản có định dạng](/blog/ham-value-text-chuyen-doi-so-van-ban). Quay lại [CEILING và FLOOR](/blog/ham-ceiling-floor-lam-tron-theo-huong-co-dinh).
