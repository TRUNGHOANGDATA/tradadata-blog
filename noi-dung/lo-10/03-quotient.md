---
tieu_de: "QUOTIENT: lấy phần nguyên phép chia, phần còn lại của câu chuyện MOD"
slug: "ham-quotient-phan-nguyen-phep-chia"
danh_muc: "Excel"
the: ["QUOTIENT", "hàm toán học"]
mo_ta: "QUOTIENT trả về phần nguyên của một phép chia, bỏ qua số dư — ghép cùng MOD là giải trọn bài toán chia đều còn dư. Với số âm, QUOTIENT cắt về phía 0 chứ không làm tròn xuống như INT, một khác biệt dễ bị bỏ qua."
tu_khoa: "hàm QUOTIENT Excel, phần nguyên phép chia Excel, QUOTIENT và MOD, QUOTIENT khác INT, chia hàng vào thùng Excel"
anh_bia: "/images/bai-viet/ham-quotient/cover.png"
thu_muc_anh: "ham-quotient"
trang_thai: "draft"
---

Bài [MOD](/blog/ham-mod-phan-du-phep-chia) lấy phần **dư** của một phép chia. `QUOTIENT` lấy đúng phần còn lại của câu chuyện: phần **nguyên**, bỏ qua số dư. Hai hàm này thường đi cùng nhau để giải trọn một bài toán chia đều.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=QUOTIENT(tu_so, mau_so)
```

{{anh:qt-01-cu-phap-co-ban}}

`QUOTIENT(17,5)` trả về `3` — chia được `3` lần trọn vẹn, phần dư `2` bị bỏ qua hoàn toàn (không làm tròn theo phần dư đó).

## Ứng dụng: tách một bài toán chia thành "đủ" và "lẻ"

Có `137` sản phẩm, mỗi thùng đóng gói vừa đúng `20`. Cần biết đóng được bao nhiêu thùng đầy, và còn dư bao nhiêu sản phẩm lẻ chưa đủ một thùng:

```excel
=QUOTIENT(137,20)
=MOD(137,20)
```

{{anh:qt-02-chia-hang-vao-thung}}

`QUOTIENT(137,20)` cho `6` thùng đầy. `MOD(137,20)` cho `17` sản phẩm còn lẻ. Hai kết quả này khớp với nhau: `6×20+17 = 137`, đúng bằng số sản phẩm ban đầu — đây chính là cách `QUOTIENT` và `MOD` bổ sung cho nhau khi làm việc với số dương.

## QUOTIENT khác gì so với chia rồi bọc INT

Nhiều người dùng `INT(tu_so/mau_so)` thay cho `QUOTIENT` vì nghĩ hai cách cho cùng kết quả — đúng với số dương, nhưng sai khi có số âm:

```excel
=QUOTIENT(-17,5)
=INT(-17/5)
```

{{anh:qt-03-khac-int-voi-so-am}}

`QUOTIENT(-17,5)` trả về `-3` — cắt bỏ phần thập phân, tiến **về phía 0**. `INT(-17/5)` trả về `-4` — làm tròn **xuống**, tiến về phía âm vô cực. Cùng một phép chia, hai cách tính phần nguyên lại cho hai kết quả khác nhau khi tử số âm.

Hệ quả là quan hệ `tu_so = QUOTIENT×mau_so + MOD` chỉ đúng gọn gàng khi làm việc với số dương như ví dụ đóng thùng ở trên — với số âm, `QUOTIENT` (cắt về `0`) và `MOD` (dùng `INT`, làm tròn xuống, xem lại bài trước) không còn khớp theo cùng một quy tắc làm tròn, nên đừng trộn hai hàm này để suy luận ngược lại tử số ban đầu khi dữ liệu có thể âm.

## Tổng kết

`QUOTIENT` trả về phần nguyên của một phép chia, bỏ hẳn phần dư — ghép cùng `MOD` là cách tách gọn một phép chia thành "số lần trọn vẹn" và "phần còn lẻ". Với số dương hai hàm khớp nhau hoàn hảo; với số âm, `QUOTIENT` cắt về phía `0` trong khi `MOD` dựa trên `INT` làm tròn xuống, nên không thể trộn lẫn để suy ngược kết quả.

Đọc tiếp trong cùng cụm bài: [ODD, EVEN — làm tròn lên tới số lẻ hoặc số chẵn gần nhất](/blog/ham-odd-even-lam-tron-len-so-le-chan).
