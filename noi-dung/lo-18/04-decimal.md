---
tieu_de: "DECIMAL: chiều ngược lại, đọc một chuỗi ở hệ đếm khác về số thập phân quen thuộc"
slug: "ham-decimal-doc-so-tu-he-dem-khac-ve-thap-phan"
danh_muc: "Excel"
the: ["DECIMAL", "hàm toán học"]
mo_ta: "DECIMAL đọc một chuỗi biểu diễn ở một hệ đếm khác — nhị phân, thập lục phân, hay bất kỳ cơ số nào từ 2 đến 36 — và trả về đúng số thập phân quen thuộc, đúng chiều ngược lại của BASE."
tu_khoa: "hàm DECIMAL Excel, doc so tu he dem khac, DECIMAL nguoc lai BASE, chuyen hex sang so thap phan"
anh_bia: "/images/bai-viet/ham-decimal/cover.png"
thu_muc_anh: "ham-decimal"
trang_thai: "draft"
---

Bài trước, [BASE](/blog/ham-base-chuyen-so-sang-he-dem-khac) chuyển một số thập phân sang hệ đếm khác. `DECIMAL` làm đúng chiều ngược lại: đọc một chuỗi ở hệ đếm khác và trả về số thập phân quen thuộc.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=DECIMAL(van_ban, co_so)
```

{{anh:dc-01-cu-phap-co-ban}}

`van_ban` là chuỗi cần đọc, `co_so` là hệ đếm của chuỗi đó — cùng phạm vi `2` đến `36` như `BASE`.

## Ứng dụng: đọc lại mã màu hex hoặc chuỗi nhị phân

```excel
=DECIMAL("FF",16)
=DECIMAL("1111",2)
```

{{anh:dc-02-doc-hex-va-nhi-phan}}

`DECIMAL("FF",16)` trả về `255` — đọc mã màu hoặc giá trị thập lục phân quen thuộc trong lập trình và thiết kế đồ hoạ về đúng số thập phân dùng được trong các phép tính Excel thông thường. `DECIMAL("1111",2)` trả về `15`.

## Kiểm tra ngược: BASE và DECIMAL phải khớp nhau

```excel
=DECIMAL(BASE(2026,36),36)
```

{{anh:dc-03-kiem-tra-nguoc}}

Kết quả luôn là `2026` — chuyển đi rồi chuyển lại đúng bằng cách này là cách nhanh để kiểm tra hai hàm hoạt động khớp nhau, hoặc để xác nhận một chuỗi tự tay gõ vào có đúng biểu diễn của số ban đầu hay không.

## Lỗi thường gặp: ký tự không hợp lệ với cơ số đã khai

```excel
=DECIMAL("129",2)
```

{{anh:dc-04-loi-ky-tu-khong-hop-le}}

Hệ nhị phân (cơ số `2`) chỉ có hai ký tự hợp lệ: `0` và `1`. Chuỗi `"129"` chứa ký tự `2` và `9` — không tồn tại trong hệ nhị phân — nên `DECIMAL` báo lỗi `#NUM!` ngay lập tức, không cố đoán hay bỏ qua phần không hợp lệ.

## Ứng dụng: kiểm tra một chuỗi có phải số nhị phân hợp lệ hay không

```excel
=IFERROR(DECIMAL(A2,2),"Không phải nhị phân hợp lệ")
```

{{anh:dc-05-kiem-tra-hop-le}}

Bọc `IFERROR` quanh `DECIMAL` là cách gọn để kiểm tra một chuỗi nhập vào có đúng là biểu diễn hợp lệ ở hệ đếm mong muốn hay không, thay vì tự viết công thức kiểm tra ký tự phức tạp hơn.

## Tổng kết

`DECIMAL` đọc một chuỗi ở hệ đếm khác và trả về số thập phân, đúng chiều ngược lại của `BASE`. Ký tự trong chuỗi không hợp lệ với cơ số đã khai sẽ báo lỗi `#NUM!` ngay lập tức — có thể tận dụng điều này để kiểm tra tính hợp lệ của một chuỗi theo một hệ đếm cụ thể.

Đọc tiếp trong cùng cụm bài: [SHEET, SHEETS — biết vị trí và tổng số trang tính trong một workbook](/blog/ham-sheet-sheets-vi-tri-va-tong-so-trang-tinh).
