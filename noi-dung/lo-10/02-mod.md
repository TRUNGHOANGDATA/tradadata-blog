---
tieu_de: "MOD: lấy phần dư phép chia, và vì sao số âm dễ gây bất ngờ"
slug: "ham-mod-phan-du-phep-chia"
danh_muc: "Excel"
the: ["MOD", "hàm toán học"]
mo_ta: "MOD trả về phần dư của một phép chia — nền tảng của việc tô màu xen kẽ dòng và kiểm tra bội số. Với số âm, kết quả không giống phép chia dư trong nhiều ngôn ngữ lập trình khác, dễ gây nhầm lẫn nếu không biết trước."
tu_khoa: "hàm MOD Excel, phần dư phép chia Excel, tô màu xen kẽ dòng conditional formatting, kiểm tra bội số Excel, MOD số âm"
anh_bia: "/images/bai-viet/ham-mod/cover.png"
thu_muc_anh: "ham-mod"
trang_thai: "draft"
---

Bài trước nói về [ABS](/blog/ham-abs-tri-tuyet-doi) — bỏ dấu một số. `MOD` cũng là một hàm toán học ngắn gọn, nhưng phục vụ một việc khác hẳn: lấy phần còn dư lại sau khi chia hết được bao nhiêu lần.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=MOD(so, so_chia)
```

{{anh:mod-01-cu-phap-co-ban}}

`MOD(17,5)` trả về `2` — vì `17` chia `5` được `3` lần, dư `2`.

## Ứng dụng phổ biến nhất: tô màu xen kẽ mỗi dòng khác

Kết hợp với [ROW](/blog/ham-row-column-danh-so-tu-dong) trong một quy tắc Conditional Formatting là cách dựng bảng "vằn ngựa vằn" (mỗi dòng chẵn tô nền) mà không cần định dạng tay từng dòng:

```excel
=MOD(ROW(),2)=0
```

{{anh:mod-02-to-mau-xen-ke}}

`ROW()` trả về số thứ tự dòng hiện tại, `MOD(...,2)` cho kết quả `0` với dòng chẵn và `1` với dòng lẻ — quy tắc định dạng chỉ tô nền cho dòng thoả điều kiện `=0`, tự động chạy đúng khi chèn thêm hay xoá bớt dòng vì `ROW()` luôn tính lại theo vị trí thật.

## Ứng dụng: kiểm tra một số có là bội số của số khác không

```excel
=IF(MOD(SoLuong,5)=0,"Đủ thùng","Còn lẻ")
```

{{anh:mod-03-kiem-tra-boi-so}}

Mỗi thùng đóng gói vừa đúng `5` sản phẩm — `MOD(SoLuong,5)=0` cho biết số lượng hiện có có chia hết cho `5` hay không, tức có đóng vừa đủ thùng hay còn dư lẻ. Đây chính là cách `ISEVEN`/`ISODD` được dựng bên trong: về bản chất chỉ là `MOD(so,2)=0` hoặc `=1`.

## Điểm dễ gây bất ngờ: MOD với số âm

Với số dương, `MOD` hoạt động đúng như trực giác. Nhưng với số âm, kết quả không giống phép chia dư (`%`) trong nhiều ngôn ngữ lập trình như Python hay JavaScript:

```excel
=MOD(-17,5)
```

{{anh:mod-04-mod-so-am}}

Kết quả là `3`, không phải `-2` như nhiều người quen với ngôn ngữ lập trình khác kỳ vọng. Lý do: Excel định nghĩa `MOD(n,d) = n - d×INT(n/d)`, mà `INT` luôn làm tròn **xuống** (về phía âm vô cực) chứ không cắt về phía `0`. Với `n=-17, d=5`: `INT(-17/5) = INT(-3.4) = -4`, nên `MOD = -17 - 5×(-4) = -17+20 = 3`. Kết quả `MOD` luôn cùng dấu với `so_chia` (`5`, dương), bất kể `so` âm hay dương.

{{anh:mod-05-cong-thuc-ben-trong}}

Điều này hiếm khi gây vấn đề với dữ liệu thực tế (số lượng, ngày tháng đều dương), nhưng nếu công thức có khả năng nhận số âm — ví dụ chênh lệch có thể âm — cần nhớ quy tắc dấu này để không suy luận nhầm theo thói quen từ ngôn ngữ lập trình khác.

## Tổng kết

`MOD` trả về phần dư của một phép chia, ứng dụng phổ biến nhất là tô màu xen kẽ dòng và kiểm tra bội số. Với số âm, kết quả `MOD` luôn cùng dấu với số chia — khác với phép chia dư kiểu cắt-về-0 quen thuộc trong nhiều ngôn ngữ lập trình.

Đọc tiếp trong cùng cụm bài: [QUOTIENT — lấy phần nguyên phép chia, phần còn lại của câu chuyện MOD](/blog/ham-quotient-phan-nguyen-phep-chia).
