---
tieu_de: "ISEVEN và ISODD: kiểm tra số chẵn, số lẻ chỉ trong một hàm"
slug: "ham-iseven-isodd-kiem-tra-so-chan-le"
danh_muc: "Excel"
the: ["ISEVEN", "ISODD", "kiểm tra dữ liệu", "hàm cơ bản"]
mo_ta: "ISEVEN và ISODD kiểm tra một số là chẵn hay lẻ chỉ bằng một hàm, thay cho công thức MOD dài dòng — ứng dụng thực tế: tô màu xen kẽ dòng, chia ca làm việc theo ngày chẵn lẻ."
tu_khoa: "hàm ISEVEN Excel, hàm ISODD Excel, kiểm tra số chẵn lẻ, tô màu xen kẽ dòng Excel, MOD kiểm tra chẵn lẻ"
anh_bia: "/images/bai-viet/ham-iseven-isodd/cover.png"
thu_muc_anh: "ham-iseven-isodd"
trang_thai: "draft"
---

Cùng họ với [`ISNUMBER`, `ISTEXT`, `ISBLANK` và `ISERROR`](/blog/ham-isnumber-istext-isblank-iserror-kiem-tra-kieu-du-lieu) đã nói ở cụm bài trước — cùng trả về `TRUE`/`FALSE`, cùng mục đích kiểm tra một điều kiện cụ thể về giá trị trong ô — `ISEVEN` và `ISODD` kiểm tra đúng một việc: số đó là chẵn hay lẻ.

Nghe đơn giản tới mức thừa thãi, nhưng trước khi có hai hàm này, kiểm tra chẵn lẻ trong Excel phải viết một công thức dài hơn hẳn bằng `MOD`. Bài này đi qua cả hai cách, và vài ứng dụng thực tế hay bị bỏ qua.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## ISEVEN và ISODD — kiểm tra trực tiếp

```excel
=ISEVEN(number)
=ISODD(number)
```

{{anh:eo-01-co-ban}}

```excel
=ISEVEN(4)    ' TRUE
=ISODD(4)     ' FALSE
=ISEVEN(7)    ' FALSE
=ISODD(7)     ' TRUE
```

Cả hai hàm chỉ nhận số nguyên. Với số thập phân, Excel tự động cắt bỏ phần lẻ trước khi kiểm tra — `ISEVEN(4.9)` vẫn trả về `TRUE` vì Excel xét phần nguyên `4`, không làm tròn.

## Cách làm cũ: dùng MOD

Trước khi `ISEVEN`/`ISODD` có mặt (hai hàm này thuộc nhóm hàm kỹ thuật, cần bật gói Analysis ToolPak ở các bản Excel rất cũ, nhưng đã có sẵn mặc định từ lâu trong các bản hiện hành), cách kiểm tra chẵn lẻ duy nhất là dùng phần dư của phép chia cho `2`:

```excel
=MOD(A2, 2) = 0
```

{{anh:eo-02-cach-mod}}

`MOD(A2, 2)` trả về phần dư khi chia `A2` cho `2` — bằng `0` nếu chẵn, bằng `1` nếu lẻ. So sánh với `0` cho ra đúng kết quả `TRUE`/`FALSE` giống `ISEVEN`. Công thức này vẫn hoạt động, và vẫn đáng biết vì `MOD` linh hoạt hơn — kiểm tra được cả "chia hết cho 3", "chia hết cho 5" bằng cách đổi số `2` thành số khác, việc `ISEVEN`/`ISODD` không làm được vì chúng chỉ cố định kiểm tra chia hết cho `2`.

## Ứng dụng: tô màu xen kẽ dòng bằng công thức

Định dạng có điều kiện (Conditional Formatting) trong Excel có sẵn kiểu tô màu xen kẽ dòng dựng sẵn, nhưng khi cần **tự viết công thức** cho một quy tắc tô màu tuỳ chỉnh — ví dụ chỉ tô những dòng chẵn nằm trong một điều kiện khác nữa — `ISEVEN` kết hợp với `ROW` là cách ngắn gọn nhất:

```excel
=ISEVEN(ROW())
```

{{anh:eo-03-to-mau-xen-ke}}

Đặt công thức này làm điều kiện trong một quy tắc Conditional Formatting mới (Home > Conditional Formatting > New Rule > Use a formula), áp dụng cho cả vùng dữ liệu — `ROW()` trả về số thứ tự dòng hiện tại của Excel, `ISEVEN` kiểm tra dòng đó chẵn hay lẻ, và Excel tự tô màu đúng những dòng thoả điều kiện khi rê công thức xuống từng dòng.

## Ứng dụng: chia ca làm việc theo ngày chẵn lẻ

Một bài toán thực tế khác: lịch trực xen kẽ theo nguyên tắc "ngày chẵn ca A, ngày lẻ ca B".

{{anh:eo-04-du-lieu-lich-truc}}

```excel
=IF(ISEVEN(DAY(A2)), "Ca A", "Ca B")
```

{{anh:eo-05-chia-ca-truc}}

`DAY(A2)` lấy ra số ngày trong tháng của ngày ở ô `A2` (ví dụ ngày 14/09 trả về `14`). `ISEVEN` kiểm tra số ngày đó chẵn hay lẻ, và `IF` gán ca trực tương ứng. Cách này tự động hoá hoàn toàn việc lên lịch trực xen kẽ, không cần gõ tay từng dòng.

## Tổng kết

`ISEVEN` và `ISODD` kiểm tra một số là chẵn hay lẻ chỉ bằng một hàm, thay cho công thức `MOD(number, 2) = 0` dài hơn — dùng `MOD` khi cần kiểm tra chia hết cho một số khác `2`, dùng `ISEVEN`/`ISODD` khi chỉ cần đúng chẵn lẻ vì cú pháp ngắn gọn, dễ đọc hơn. Ứng dụng thực tế phổ biến nhất là tô màu xen kẽ dòng bằng công thức tuỳ chỉnh và chia lịch làm việc theo ngày chẵn lẻ.

Đọc tiếp trong cùng cụm bài: [SUMSQ và PRODUCT — tổng bình phương và tích của một dãy số](/blog/ham-sumsq-product-tong-binh-phuong-va-tich).
