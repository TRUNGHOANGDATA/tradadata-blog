---
tieu_de: "PERMUT: cùng bài toán chọn nhóm nhỏ, nhưng lần này thứ tự lại quan trọng"
slug: "ham-permut-so-cach-chon-co-phan-biet-thu-tu"
danh_muc: "Excel"
the: ["PERMUT", "hàm toán học"]
mo_ta: "PERMUT đếm số cách chọn ra một nhóm nhỏ từ một tập lớn hơn, có phân biệt thứ tự — khác COMBIN ở đúng điểm đó. Dùng khi vị trí hay vai trò của từng người được chọn có ý nghĩa khác nhau, ví dụ xếp giải Nhất-Nhì-Ba."
tu_khoa: "hàm PERMUT Excel, chinh hop Excel, dem so cach xep thu tu, PERMUT khac COMBIN"
anh_bia: "/images/bai-viet/ham-permut/cover.png"
thu_muc_anh: "ham-permut"
trang_thai: "draft"
---

Bài trước, [COMBIN](/blog/ham-combin-so-cach-chon-khong-phan-biet-thu-tu) đếm số cách chọn một nhóm nhỏ khi không quan tâm thứ tự. `PERMUT` giải đúng bài toán đó nhưng đảo ngược đúng một giả định: lần này **thứ tự lại quan trọng**.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=PERMUT(so_muc, so_chon)
```

{{anh:pm-01-cu-phap-co-ban}}

Cùng hai tham số với `COMBIN`, nhưng `PERMUT(10,3)` trả về `720` — nhiều hơn hẳn `COMBIN(10,3)=120` đã tính ở bài trước, vì giờ mỗi cách sắp xếp thứ tự khác nhau của cùng `3` người được tính là một kết quả riêng biệt.

## Ứng dụng: xếp giải Nhất-Nhì-Ba từ một nhóm thí sinh

`10` thí sinh dự thi, cần chọn ra người đạt giải Nhất, Nhì, Ba — lần này thứ tự **có ý nghĩa khác nhau**: `(An giải Nhất, Bình giải Nhì, Chi giải Ba)` là một kết quả hoàn toàn khác với `(Bình giải Nhất, An giải Nhì, Chi giải Ba)`, dù cùng là ba người đó:

```excel
=PERMUT(10,3)
```

{{anh:pm-02-xep-giai-nhat-nhi-ba}}

Kết quả `720` cách — gấp `6` lần kết quả `COMBIN(10,3)=120` ở bài trước, đúng bằng `FACT(3)=6` cách sắp xếp lại thứ tự cho mỗi bộ `3` người đã chọn.

## Quan hệ giữa PERMUT, COMBIN và FACT

```excel
=PERMUT(10,3)/COMBIN(10,3)
=FACT(3)
```

{{anh:pm-03-quan-he-ba-ham}}

Cả hai công thức đều cho `6` — không phải trùng hợp: `PERMUT` luôn gấp `COMBIN` đúng `FACT(so_chon)` lần, vì với mỗi nhóm `COMBIN` đã đếm (không phân biệt thứ tự), `PERMUT` còn nhân thêm số cách sắp xếp lại nhóm đó.

## Trường hợp đặc biệt: chọn và xếp thứ tự tất cả

```excel
=PERMUT(5,5)
=FACT(5)
```

{{anh:pm-04-permut-bang-fact}}

Khi `so_chon` bằng đúng `so_muc` — chọn và xếp thứ tự **toàn bộ** nhóm — `PERMUT(n,n)` luôn bằng đúng `FACT(n)`, vì lúc này không còn phần "chọn ra một tập con nhỏ hơn" nữa, chỉ còn thuần tuý bài toán sắp xếp thứ tự đã nói ở bài đầu cụm.

## Chọn đúng hàm theo bài toán thực tế

{{anh:pm-05-chon-dung-ham}}

- Vị trí/vai trò của người được chọn **không phân biệt** (chọn đội đại diện, chọn số trúng giải) → `COMBIN`.
- Vị trí/vai trò của người được chọn **có ý nghĩa khác nhau** (xếp hạng Nhất-Nhì-Ba, phân công vai trò Trưởng-Phó-Thư ký) → `PERMUT`.

## Tổng kết

`PERMUT` đếm số cách chọn một nhóm nhỏ từ một tập lớn hơn, có phân biệt thứ tự — luôn cho kết quả gấp `FACT(so_chon)` lần so với `COMBIN` cùng tham số. Chọn `COMBIN` hay `PERMUT` phụ thuộc đúng một câu hỏi: vị trí của người được chọn có ý nghĩa khác nhau hay không.

Đây là bài cuối trong cụm 5 bài lô 15, bắt đầu từ [XMATCH](/blog/ham-xmatch-tim-vi-tri-hien-dai).
