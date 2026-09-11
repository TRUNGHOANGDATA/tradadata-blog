---
tieu_de: "BASE: chuyển một số sang hệ đếm khác như nhị phân hay thập lục phân"
slug: "ham-base-chuyen-so-sang-he-dem-khac"
danh_muc: "Excel"
the: ["BASE", "hàm toán học"]
mo_ta: "BASE chuyển một số thập phân thông thường sang chuỗi biểu diễn ở một hệ đếm khác — nhị phân, bát phân, thập lục phân, hoặc bất kỳ cơ số nào từ 2 đến 36 — kèm tuỳ chọn đệm số 0 phía trước cho đủ độ dài."
tu_khoa: "hàm BASE Excel, chuyen doi he dem, so nhi phan Excel, so thap luc phan Excel, ma mau hex"
anh_bia: "/images/bai-viet/ham-base/cover.png"
thu_muc_anh: "ham-base"
trang_thai: "draft"
---

Bài trước, [ARABIC](/blog/ham-arabic-doc-chu-so-la-ma-thanh-so) đọc ngược chữ số La Mã. `BASE` chuyển hẳn sang một hệ thống đếm số khác — nhị phân, bát phân, thập lục phân — những hệ đếm quen thuộc với dân kỹ thuật nhưng ít khi cần tới trong bảng tính thông thường.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=BASE(so, co_so, [do_dai_toi_thieu])
```

{{anh:bs-01-cu-phap-co-ban}}

`co_so` là hệ đếm đích, nhận giá trị từ `2` đến `36`. `do_dai_toi_thieu` là tuỳ chọn, đệm thêm số `0` phía trước nếu chuỗi kết quả ngắn hơn độ dài này.

## Ứng dụng: chuyển sang hệ nhị phân và thập lục phân

```excel
=BASE(15,2)
=BASE(255,16)
```

{{anh:bs-02-nhi-phan-va-hex}}

`BASE(15,2)` cho `"1111"` — biểu diễn nhị phân của `15`. `BASE(255,16)` cho `"FF"` — biểu diễn thập lục phân (hệ đếm cơ số `16`, dùng cả chữ `A`-`F` cho các giá trị `10`-`15`).

## Đệm số 0 phía trước cho đủ độ dài cố định

```excel
=BASE(5,2,8)
```

{{anh:bs-03-dem-so-0}}

Kết quả `"00000101"` — dù `5` ở hệ nhị phân chỉ cần `3` ký tự (`101`), tham số `do_dai_toi_thieu=8` buộc Excel đệm thêm số `0` phía trước cho đủ `8` ký tự. Hữu ích khi cần các chuỗi nhị phân cùng độ dài để so sánh hoặc xếp cột cho thẳng hàng.

## Ứng dụng: mã hoá đơn giản hoặc bài tập minh hoạ hệ đếm

```excel
=BASE(2026,36)
```

{{anh:bs-04-co-so-36}}

Với cơ số `36` (dùng cả `10` chữ số và `26` chữ cái), một số khá lớn được rút gọn thành chuỗi ngắn hơn nhiều — đây là nguyên lý đằng sau nhiều dịch vụ rút gọn URL, mã đơn hàng ngắn gọn, hay các bài tập minh hoạ cách máy tính biểu diễn số ở nhiều hệ đếm khác nhau.

## Lỗi thường gặp: cơ số ngoài phạm vi 2-36

```excel
=BASE(15,1)
```

{{anh:bs-05-loi-co-so-ngoai-pham-vi}}

`co_so` nhỏ hơn `2` hoặc lớn hơn `36` sẽ báo lỗi `#NUM!` — hệ đếm cơ số `1` không có ý nghĩa toán học (không đủ ký hiệu để phân biệt các giá trị), và cơ số lớn hơn `36` vượt quá số ký tự chữ và số có sẵn trong bảng chữ cái La-tinh để biểu diễn.

## Tổng kết

`BASE` chuyển một số thập phân sang chuỗi biểu diễn ở một hệ đếm khác, từ `2` đến `36`, kèm tuỳ chọn đệm số `0` cho đủ độ dài cố định. Ứng dụng phổ biến nhất là chuyển đổi nhị phân/thập lục phân cho công việc kỹ thuật hoặc minh hoạ nguyên lý hệ đếm.

Đọc tiếp trong cùng cụm bài: [DECIMAL — chiều ngược lại, đọc một chuỗi ở hệ đếm khác về số thập phân quen thuộc](/blog/ham-decimal-doc-so-tu-he-dem-khac-ve-thap-phan).
