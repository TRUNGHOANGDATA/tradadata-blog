---
tieu_de: "DEC2BIN, BIN2DEC: chuyển đổi nhị phân, và cách Excel biểu diễn số âm bằng bù hai"
slug: "ham-dec2bin-bin2dec-chuyen-doi-nhi-phan"
danh_muc: "Excel"
the: ["DEC2BIN", "BIN2DEC", "hàm kỹ thuật"]
mo_ta: "DEC2BIN và BIN2DEC chuyển đổi giữa số thập phân và nhị phân, khác BASE/DECIMAL ở đúng một điểm quan trọng: hỗ trợ số âm bằng cách biểu diễn bù hai 10-bit, thay vì báo lỗi như BASE."
tu_khoa: "hàm DEC2BIN Excel, ham BIN2DEC Excel, chuyen doi nhi phan, so bu hai Excel, DEC2BIN so am"
anh_bia: "/images/bai-viet/ham-dec2bin-bin2dec/cover.png"
thu_muc_anh: "ham-dec2bin-bin2dec"
trang_thai: "draft"
---

Bài [BASE, DECIMAL](/blog/ham-base-chuyen-so-sang-he-dem-khac) đã chuyển đổi số sang bất kỳ hệ đếm nào từ `2` đến `36`, nhưng chỉ nhận số nguyên **không âm**. `DEC2BIN` và `BIN2DEC` là cặp hàm chuyên biệt hơn — chỉ làm việc với hệ nhị phân — nhưng bù lại có một khả năng `BASE` không có: xử lý được số âm.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=DEC2BIN(so, [do_dai])
=BIN2DEC(so_nhi_phan)
```

{{anh:db-01-cu-phap-co-ban}}

`DEC2BIN(9)` cho `"1001"`. `BIN2DEC("1001")` cho lại `9` — hai hàm ngược nhau, giống cặp `BASE`/`DECIMAL` nhưng chuyên cho nhị phân.

## Khả năng BASE không có: biểu diễn số âm bằng bù hai

```excel
=DEC2BIN(-9)
```

{{anh:db-02-so-am-bu-hai}}

Kết quả là `"1111110111"` — không phải lỗi. Excel biểu diễn số âm theo quy tắc **bù hai** (two's complement) trên đúng `10` bit: bit đầu tiên là `1` báo hiệu số âm, phần còn lại là giá trị đã được "cuộn" theo modulo `2^10 = 1024`. Đây chính là cách máy tính thật sự lưu số âm trong bộ nhớ — khác hẳn `BASE(-9,2)` sẽ báo lỗi `#NUM!` ngay lập tức vì `BASE` không có khái niệm số âm.

## Giới hạn: chỉ từ -512 đến 511

```excel
=DEC2BIN(600)
```

{{anh:db-03-gioi-han-pham-vi}}

Vì biểu diễn bù hai dùng đúng `10` bit, phạm vi số hợp lệ chỉ từ `-512` đến `511` — vượt quá khoảng này (dù là số dương như `600`) sẽ báo lỗi `#NUM!`, khác hẳn `BASE` không giới hạn phạm vi số dương.

## Đệm số 0 chỉ áp dụng cho số không âm

```excel
=DEC2BIN(9,8)
=DEC2BIN(-9,8)
```

{{anh:db-04-dem-so-0}}

`DEC2BIN(9,8)` cho `"00001001"` — đệm đủ `8` ký tự theo tham số `do_dai`. Nhưng `DEC2BIN(-9,8)` vẫn cho `"1111110111"` (đủ `10` ký tự) — tham số `do_dai` bị **bỏ qua** với số âm, vì biểu diễn bù hai luôn cần đúng `10` bit để giữ đúng dấu, không thể rút ngắn hơn.

## BIN2DEC tự nhận diện dấu qua bit đầu tiên

```excel
=BIN2DEC("1111110111")
```

{{anh:db-05-bin2dec-nhan-dien-dau}}

Kết quả là `-9` — `BIN2DEC` tự động nhận ra đây là số âm vì chuỗi có đúng `10` ký tự và bắt đầu bằng `1`, rồi giải mã ngược lại theo đúng quy tắc bù hai đã dùng ở `DEC2BIN`.

## Tổng kết

`DEC2BIN` và `BIN2DEC` chuyển đổi giữa thập phân và nhị phân, khác `BASE`/`DECIMAL` ở khả năng biểu diễn số âm bằng bù hai `10`-bit — đúng cách máy tính thật lưu trữ số âm trong bộ nhớ. Phạm vi hợp lệ chỉ từ `-512` đến `511`, và tham số đệm số `0` không có tác dụng với số âm.

Đọc tiếp trong cùng cụm bài: [DEC2HEX, HEX2DEC — cùng nguyên lý bù hai nhưng cho hệ thập lục phân, phạm vi rộng hơn nhiều](/blog/ham-dec2hex-hex2dec-chuyen-doi-thap-luc-phan).
