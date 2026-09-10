---
tieu_de: "LEN và REPT: đếm độ dài chuỗi và lặp ký tự, hai hàm nhỏ nhưng dùng liên tục"
slug: "ham-len-rept-dem-do-dai-chuoi-lap-ky-tu"
danh_muc: "Excel"
the: ["LEN", "REPT", "kiểm tra dữ liệu nhập", "chuỗi ký tự"]
mo_ta: "Cách dùng LEN để kiểm tra độ dài số điện thoại, mã sản phẩm nhập vào có đúng không, và REPT để tự vẽ thanh tiến độ ngay trong ô Excel mà không cần biểu đồ."
tu_khoa: "hàm LEN Excel, đếm ký tự trong ô, hàm REPT, kiểm tra độ dài số điện thoại Excel, vẽ thanh tiến độ bằng REPT"
anh_bia: "/images/bai-viet/ham-len-rept/cover.png"
thu_muc_anh: "ham-len-rept"
trang_thai: "draft"
---

`LEN` và `REPT` là hai trong số những hàm ngắn gọn nhất trong Excel, cả về tên gọi lẫn cú pháp — mỗi hàm chỉ cần đúng một hoặc hai tham số. Nhưng đơn giản không có nghĩa là ít việc: `LEN` là công cụ kiểm tra dữ liệu nhập nhanh nhất trong Excel, còn `REPT` có thể dùng để vẽ cả một thanh tiến độ ngay trong ô, không cần chèn biểu đồ.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## LEN — đếm số ký tự trong một ô

```excel
=LEN(A2)
```

`LEN` đếm tổng số ký tự trong một chuỗi — bao gồm cả khoảng trắng, dấu câu, mọi thứ nằm trong ô đó, không chỉ chữ cái.

{{anh:lr-01-len-co-ban}}

## Ứng dụng thực tế nhất: kiểm tra độ dài số điện thoại

Bài toán rất thường gặp: một cột số điện thoại khách hàng nhập tay, cần kiểm tra xem có đúng 10 chữ số hay không trước khi lưu vào hệ thống.

{{anh:lr-02-du-lieu-sdt}}

```excel
=IF(LEN(A2)=10, "Hợp lệ", "Sai định dạng")
```

{{anh:lr-03-kiem-tra-sdt}}

Công thức này không kiểm tra được số điện thoại có **đúng** hay không — chỉ kiểm tra được độ dài có đúng 10 ký tự hay không. Một số điện thoại nhập sai vẫn có thể vô tình đủ 10 ký tự và bị công thức này báo "Hợp lệ" nhầm. Đây là bước lọc thô ban đầu, hữu ích để bắt các lỗi rõ ràng như thiếu số hoặc thừa số, không phải bước xác minh cuối cùng.

## Lỗi hay gặp: LEN đếm cả khoảng trắng thừa

Đây là cái bẫy phổ biến nhất khi dùng `LEN` để kiểm tra dữ liệu. Một số điện thoại nhập là `"0912345678 "` — có một dấu cách thừa ở cuối, mắt thường nhìn không thấy gì khác biệt — sẽ có `LEN` bằng **11**, không phải 10, khiến công thức kiểm tra ở trên báo "Sai định dạng" dù số điện thoại thực chất đúng.

{{anh:lr-04-loi-khoang-trang}}

Cách phòng lỗi này: luôn bọc `TRIM` quanh dữ liệu trước khi đếm độ dài — cùng kỹ thuật đã nói ở [Xử Lý Lỗi Trong Excel: #N/A, #VALUE!, #REF!, #DIV/0!](/blog/xu-ly-loi-trong-excel-na-value-ref-div0-cach-khac-phuc):

```excel
=IF(LEN(TRIM(A2))=10, "Hợp lệ", "Sai định dạng")
```

## REPT — lặp lại một chuỗi ký tự nhiều lần

```excel
=REPT(text, số_lần)
```

`REPT` lặp lại một đoạn văn bản theo đúng số lần chỉ định, nối liền không có khoảng cách.

```excel
=REPT("★", 3)
```

{{anh:lr-05-rept-co-ban}}

Kết quả: `★★★` — lặp lại ký tự ngôi sao đúng 3 lần. Nghe đơn giản, nhưng đây chính là cơ chế đứng sau một kỹ thuật trực quan hoá dữ liệu rất gọn: thanh tiến độ vẽ ngay trong ô.

## Kết hợp LEN và REPT để vẽ thanh tiến độ trong ô

Đây là ứng dụng thú vị nhất khi ghép hai hàm này lại: dùng `REPT` để vẽ một chuỗi ký tự dài ngắn theo tỷ lệ phần trăm, biến một cột số liệu thành thanh tiến độ trực quan mà không cần chèn biểu đồ hay định dạng có điều kiện.

{{anh:lr-06-du-lieu-tien-do}}

```excel
=REPT("█", ROUND(B2*10, 0))
```

{{anh:lr-07-thanh-tien-do}}

Đọc theo từng lớp: `B2*10` đổi tỷ lệ phần trăm hoàn thành (ví dụ `0,7` cho 70%) thành một con số từ `0` đến `10`. `ROUND(..., 0)` làm tròn về số nguyên, vì `REPT` cần số lần lặp là số nguyên. `REPT("█", ...)` vẽ ra đúng số lượng khối vuông tương ứng — tiến độ càng cao, thanh càng dài.

Cách này cho ra một thanh tiến độ thô nhưng hoạt động ngay trong ô, không cần thêm biểu đồ hay công cụ định dạng phức tạp — hữu ích khi cần một cái nhìn nhanh, gọn trong bảng dữ liệu có nhiều dòng, mỗi dòng một thanh tiến độ riêng.

## Tổng kết

`LEN` đếm số ký tự trong một ô, hữu ích nhất để kiểm tra nhanh độ dài dữ liệu nhập — nhưng cần nhớ nó đếm cả khoảng trắng thừa, nên thường phải bọc thêm `TRIM` để kết quả đáng tin cậy. `REPT` lặp lại một chuỗi ký tự theo số lần chỉ định, và khi kết hợp với một phép tính tỷ lệ, có thể tự vẽ ra một thanh tiến độ ngay trong ô.

Đọc tiếp trong cùng cụm bài: [ISNUMBER, ISTEXT, ISBLANK và ISERROR — kiểm tra kiểu dữ liệu trong ô](/blog/ham-isnumber-istext-isblank-iserror-kiem-tra-kieu-du-lieu). Quay lại [PROPER, UPPER và LOWER](/blog/ham-proper-upper-lower-chuan-hoa-chu-hoa-thuong).
