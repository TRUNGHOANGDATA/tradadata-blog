---
tieu_de: "DOLLAR và FIXED: định dạng số thành chuỗi tiền tệ và số cố định thập phân"
slug: "ham-dollar-fixed-dinh-dang-tien-te-so-thap-phan"
danh_muc: "Excel"
the: ["DOLLAR", "FIXED", "định dạng số", "hàm cơ bản"]
mo_ta: "DOLLAR và FIXED là hai phiên bản rút gọn của TEXT, chuyên biệt cho hai nhu cầu định dạng số cực kỳ phổ biến: tiền tệ và số cố định chữ số thập phân."
tu_khoa: "hàm DOLLAR Excel, hàm FIXED Excel, định dạng tiền tệ Excel, số cố định thập phân, DOLLAR khác TEXT"
anh_bia: "/images/bai-viet/ham-dollar-fixed/cover.png"
thu_muc_anh: "ham-dollar-fixed"
trang_thai: "draft"
---

Bài về [`VALUE` và `TEXT`](/blog/ham-value-text-chuyen-doi-so-van-ban) đã nói `TEXT` là hàm định dạng số thành chuỗi theo bất kỳ mã định dạng nào. `DOLLAR` và `FIXED` là hai người anh em của `TEXT`, ra đời trước cả khi `TEXT` linh hoạt như ngày nay — chúng làm ít việc hơn hẳn, nhưng đúng vào hai nhu cầu định dạng phổ biến nhất: tiền tệ và số cố định chữ số thập phân, mà không cần nhớ mã định dạng.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## DOLLAR — định dạng số thành chuỗi tiền tệ

```excel
=DOLLAR(number, [decimals])
```

```excel
=DOLLAR(1234567, 0)
```

{{anh:df-01-dollar-co-ban}}

Kết quả trả về chuỗi **"$1,234,567"** — có ký hiệu tiền tệ và dấu ngăn cách hàng nghìn, tham số `decimals` bằng `0` nghĩa là không lấy số lẻ thập phân.

Tên hàm gợi tới đô la Mỹ, và mặc định `DOLLAR` dùng đúng ký hiệu `$` cùng cách ngăn cách kiểu Mỹ (dấu phẩy ngăn nghìn, dấu chấm ngăn thập phân) — **không tự đổi theo cài đặt vùng miền của máy**. Muốn ra định dạng tiền Việt Nam với ký hiệu `đ` và cách ngăn cách ngược lại, `DOLLAR` không làm được — đây chính là lý do `TEXT` linh hoạt hơn cho nhu cầu định dạng tiền tệ Việt Nam:

```excel
=TEXT(1234567, "#.##0") & " đ"
```

{{anh:df-02-so-sanh-text}}

Nên hiểu `DOLLAR` như một lối tắt tiện lợi cho báo cáo dùng chuẩn tiền tệ Mỹ, còn với báo cáo tiếng Việt, `TEXT` ghép thêm ký hiệu `đ` bằng tay vẫn là lựa chọn thực tế hơn.

## FIXED — số cố định chữ số thập phân dạng văn bản

```excel
=FIXED(number, [decimals], [no_commas])
```

```excel
=FIXED(1234.5678, 2)
```

{{anh:df-03-fixed-co-ban}}

Kết quả trả về chuỗi **"1,234.57"** — làm tròn về đúng 2 chữ số thập phân, có dấu ngăn cách hàng nghìn theo mặc định. Muốn bỏ dấu ngăn cách hàng nghìn, đặt tham số thứ ba `no_commas` thành `TRUE`:

```excel
=FIXED(1234.5678, 2, TRUE)
```

{{anh:df-04-fixed-khong-phay}}

Kết quả trả về **"1234.57"** — không còn dấu phẩy ngăn nghìn.

## Điểm chung dễ gây nhầm: kết quả là VĂN BẢN, không phải số

Cả `DOLLAR` và `FIXED` đều trả về **chuỗi văn bản**, giống hệt `TEXT` — không phải một con số đã được làm tròn hay định dạng lại. Đây là điều dễ gây lỗi nhất khi mới dùng hai hàm này: kết quả trông giống số, căn phải trên màn hình như số, nhưng thực chất là văn bản.

{{anh:df-05-ket-qua-la-van-ban}}

Dùng kết quả của `DOLLAR` hoặc `FIXED` để tính toán tiếp — cộng, trừ, đưa vào `SUM` — sẽ gây lỗi kiểu dữ liệu giống hệt bài toán "số lưu dạng văn bản" đã nói ở bài [ISNUMBER, ISTEXT, ISBLANK và ISERROR](/blog/ham-isnumber-istext-isblank-iserror-kiem-tra-kieu-du-lieu). Cả `DOLLAR` và `FIXED` chỉ nên dùng ở **bước cuối cùng** — khi con số đã tính toán xong, chỉ còn việc hiển thị hoặc ghép vào một câu văn — không dùng ở giữa chuỗi tính toán.

## Khi nào chọn DOLLAR/FIXED thay vì TEXT

Với sự linh hoạt của `TEXT`, hai hàm này có vẻ thừa — thực chất `TEXT(number, "$#,##0")` làm được đúng việc `DOLLAR` làm, và `TEXT(number, "#,##0.00")` làm được đúng việc `FIXED` làm. Lý do vẫn đáng dùng `DOLLAR`/`FIXED`:

- **Cú pháp ngắn hơn, không cần nhớ mã định dạng** — hữu ích khi chỉ cần đúng hai kiểu định dạng phổ biến này và không muốn tra lại cú pháp `TEXT`.
- **`FIXED` có sẵn tham số bỏ dấu ngăn cách** (`no_commas`) mà không cần đổi cả mã định dạng, tiện khi cần chuyển đổi qua lại giữa hai kiểu hiển thị.

Ngược lại, cần định dạng phần trăm, ngày tháng, hay bất kỳ khuôn dạng nào khác ngoài tiền tệ và số thập phân cố định, `TEXT` vẫn là lựa chọn duy nhất.

## Tổng kết

`DOLLAR` và `FIXED` là hai phiên bản chuyên biệt của `TEXT`, dùng đúng cho tiền tệ kiểu Mỹ và số cố định chữ số thập phân — ngắn gọn hơn khi chỉ cần đúng hai việc đó, nhưng kém linh hoạt hơn `TEXT` cho mọi định dạng khác. Cả hai đều trả về văn bản, không phải số, nên chỉ nên dùng ở bước hiển thị cuối cùng, không dùng giữa chuỗi công thức tính toán.

Đọc tiếp trong cùng cụm bài: [ISEVEN và ISODD — kiểm tra số chẵn, số lẻ](/blog/ham-iseven-isodd-kiem-tra-so-chan-le).
