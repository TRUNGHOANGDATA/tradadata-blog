---
tieu_de: "COMBIN: đếm số cách chọn một nhóm nhỏ, không quan tâm thứ tự"
slug: "ham-combin-so-cach-chon-khong-phan-biet-thu-tu"
danh_muc: "Excel"
the: ["COMBIN", "hàm toán học"]
mo_ta: "COMBIN đếm số cách chọn ra một nhóm nhỏ từ một tập lớn hơn, không quan tâm thứ tự chọn — dùng khi chỉ cần biết ai được chọn, không cần biết chọn ai trước ai sau."
tu_khoa: "hàm COMBIN Excel, dem so cach chon Excel, to hop khong phan biet thu tu, COMBIN khac PERMUT"
anh_bia: "/images/bai-viet/ham-combin/cover.png"
thu_muc_anh: "ham-combin"
trang_thai: "draft"
---

Bài trước, [FACT](/blog/ham-fact-giai-thua) đếm số cách sắp xếp thứ tự của **toàn bộ** một nhóm. `COMBIN` thu hẹp câu hỏi lại: chọn ra một nhóm **nhỏ hơn** từ một tập lớn, và quan trọng nhất — không quan tâm ai được chọn trước, ai được chọn sau.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=COMBIN(so_muc, so_chon)
```

{{anh:cb-01-cu-phap-co-ban}}

`so_muc` là tổng số đối tượng có sẵn, `so_chon` là số lượng cần chọn ra. `COMBIN(10,3)` trả về `120` — số cách chọn ra đúng `3` người từ tổng số `10` người, không phân biệt thứ tự chọn.

## Ứng dụng: chọn một đội nhỏ từ một nhóm lớn

Một lớp có `10` học sinh, cần chọn ra `3` em đại diện đi thi đấu — không có vai trò khác nhau giữa `3` em (không phải đội trưởng/phó), chỉ cần biết `3` em nào được chọn:

```excel
=COMBIN(10,3)
```

{{anh:cb-02-chon-doi-dai-dien}}

Kết quả `120` cách chọn khác nhau. Vì các em không có vai trò phân biệt, chọn `(An, Bình, Chi)` hay `(Chi, An, Bình)` được tính là **cùng một cách chọn** — đây chính là điểm khác biệt cốt lõi giữa `COMBIN` và `PERMUT` sẽ nói ở bài sau.

## Ứng dụng: tính số cách quay xổ số không phân biệt thứ tự trúng

Một hình thức xổ số chọn `6` số từ tập `45` số, không quan tâm thứ tự các số được quay ra trước hay sau, chỉ cần trùng đúng bộ `6` số:

```excel
=COMBIN(45,6)
```

{{anh:cb-03-xo-so-khong-thu-tu}}

Kết quả là con số rất lớn (hơn `8` triệu) — minh hoạ trực quan vì sao trúng giải đặc biệt của những hình thức xổ số kiểu này lại hiếm đến vậy: có hàng triệu tổ hợp `6` số khác nhau có thể xảy ra.

## Trường hợp biên: chọn tất cả hoặc chọn 0

```excel
=COMBIN(10,10)
=COMBIN(10,0)
```

{{anh:cb-04-truong-hop-bien}}

`COMBIN(10,10)` cho `1` — chỉ có đúng một cách để "chọn" tất cả `10` người (chọn hết thì không còn gì để phân biệt cách chọn). `COMBIN(10,0)` cũng cho `1` — chỉ có đúng một cách để không chọn ai cả (nhóm rỗng), khớp với quy ước `FACT(0)=1` đã nói ở bài trước.

## Lỗi thường gặp: chọn nhiều hơn số lượng có sẵn

```excel
=COMBIN(5,8)
```

{{anh:cb-05-loi-chon-nhieu-hon-co-san}}

Không thể chọn `8` người từ nhóm chỉ có `5` người — `COMBIN` báo lỗi `#NUM!` ngay khi `so_chon` lớn hơn `so_muc`, không cố tính ra một kết quả vô nghĩa nào.

## Tổng kết

`COMBIN` đếm số cách chọn một nhóm nhỏ từ một tập lớn hơn, không quan tâm thứ tự chọn — dùng đúng khi các đối tượng được chọn không có vai trò phân biệt với nhau. `so_chon` lớn hơn `so_muc` sẽ báo lỗi `#NUM!`.

Đọc tiếp trong cùng cụm bài: [PERMUT — cùng bài toán chọn nhóm nhỏ, nhưng lần này thứ tự lại quan trọng](/blog/ham-permut-so-cach-chon-co-phan-biet-thu-tu).
