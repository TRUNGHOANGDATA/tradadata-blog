---
tieu_de: "VALUETOTEXT: chuyển một giá trị bất kỳ thành văn bản, kể cả giá trị lỗi"
slug: "ham-valuetotext-chuyen-mot-gia-tri-thanh-van-ban"
danh_muc: "Excel"
the: ["VALUETOTEXT", "hàm văn bản"]
mo_ta: "VALUETOTEXT chuyển một giá trị đơn — số, luận lý, hay cả giá trị lỗi — thành một chuỗi văn bản, khác với phép nối chuỗi thông thường vốn làm cả công thức báo lỗi lây lan khi gặp một giá trị lỗi."
tu_khoa: "hàm VALUETOTEXT Excel, chuyen gia tri thanh van ban, VALUETOTEXT khac noi chuoi, xu ly loi trong noi chuoi"
anh_bia: "/images/bai-viet/ham-valuetotext/cover.png"
thu_muc_anh: "ham-valuetotext"
trang_thai: "draft"
---

Bài [ARRAYTOTEXT](/blog/ham-arraytotext-chuyen-mang-thanh-van-ban) gộp cả một mảng thành văn bản. `VALUETOTEXT` là bản dành cho **một giá trị đơn** — và có một điểm khác biệt đáng chú ý so với cách nối chuỗi thông thường: xử lý giá trị lỗi một cách khác hẳn.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=VALUETOTEXT(gia_tri, [dinh_dang])
```

{{anh:vt-01-cu-phap-co-ban}}

`dinh_dang` là `0` (mặc định, dễ đọc) hoặc `1` (chặt chẽ, giữ nguyên dấu ngoặc kép quanh văn bản để có thể dán lại thành công thức).

## Chuyển đổi các kiểu giá trị khác nhau

```excel
=VALUETOTEXT(TRUE)
=VALUETOTEXT(3.14)
=VALUETOTEXT("Xin chào")
```

{{anh:vt-02-cac-kieu-gia-tri}}

`VALUETOTEXT(TRUE)` cho `"TRUE"`, `VALUETOTEXT(3.14)` cho `"3.14"` — với định dạng mặc định, văn bản đưa vào giữ nguyên không thêm dấu ngoặc kép, đúng như cách hiển thị tự nhiên cho người đọc.

## Định dạng chặt chẽ: giữ dấu ngoặc kép để dán lại được

```excel
=VALUETOTEXT("Xin chào",1)
```

{{anh:vt-03-dinh-dang-chat-che}}

Với định dạng `1`, kết quả là `"\"Xin chào\""` — giữ nguyên dấu ngoặc kép bao quanh, để nếu copy kết quả này dán vào một ô khác, Excel hiểu đúng đó là một chuỗi văn bản chứ không phải một công thức hay tham chiếu.

## Điểm khác biệt quan trọng: xử lý giá trị lỗi

Nối chuỗi thông thường bằng `&` khiến lỗi lây lan ra cả công thức:

```excel
="Kết quả: "&A2
```

{{anh:vt-04-noi-chuoi-thong-thuong-loi-lay-lan}}

Nếu `A2` đang chứa lỗi `#N/A`, toàn bộ công thức nối chuỗi này cũng báo lỗi `#N/A` theo, không hiển thị được chữ `"Kết quả: "` như mong muốn.

```excel
="Kết quả: "&VALUETOTEXT(A2)
```

{{anh:vt-05-valuetotext-giu-nguyen-chuoi}}

Bọc `VALUETOTEXT` quanh `A2` thì khác hẳn: giá trị lỗi được chuyển thành đúng **chuỗi văn bản của tên lỗi đó** (`"#N/A"`), không lây lan ra ngoài — kết quả cuối cùng là `"Kết quả: #N/A"`, một chuỗi hiển thị được bình thường, tiện khi cần hiện dòng thông báo hay log dù dữ liệu nguồn đang lỗi, thay vì để cả dòng thông báo biến mất vì lỗi lây lan.

## Tổng kết

`VALUETOTEXT` chuyển một giá trị đơn thành văn bản, với điểm khác biệt quan trọng nhất là xử lý được giá trị lỗi — chuyển nó thành chuỗi tên lỗi thay vì để lỗi lây lan như phép nối chuỗi `&` thông thường. Định dạng `1` giữ nguyên dấu ngoặc kép, tiện khi cần dán lại kết quả thành một chuỗi literal.

Đọc tiếp trong cùng cụm bài: [FACT — giai thừa, đếm số cách sắp xếp thứ tự của một nhóm](/blog/ham-fact-giai-thua).
