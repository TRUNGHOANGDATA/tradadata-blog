---
tieu_de: "DEC2HEX, HEX2DEC: cùng nguyên lý bù hai nhưng cho hệ thập lục phân, phạm vi rộng hơn nhiều"
slug: "ham-dec2hex-hex2dec-chuyen-doi-thap-luc-phan"
danh_muc: "Excel"
the: ["DEC2HEX", "HEX2DEC", "hàm kỹ thuật"]
mo_ta: "DEC2HEX và HEX2DEC chuyển đổi giữa thập phân và thập lục phân, cùng nguyên lý bù hai với DEC2BIN nhưng dùng 10 ký tự hex thay vì 10 bit, cho phạm vi số hợp lệ rộng hơn hẳn."
tu_khoa: "hàm DEC2HEX Excel, ham HEX2DEC Excel, chuyen doi thap luc phan, ma mau hex Excel"
anh_bia: "/images/bai-viet/ham-dec2hex-hex2dec/cover.png"
thu_muc_anh: "ham-dec2hex-hex2dec"
trang_thai: "draft"
---

Bài trước, [DEC2BIN, BIN2DEC](/blog/ham-dec2bin-bin2dec-chuyen-doi-nhi-phan) dùng bù hai `10`-bit cho nhị phân. `DEC2HEX` và `HEX2DEC` áp dụng đúng nguyên lý đó cho hệ thập lục phân — nhưng vì mỗi ký tự hex biểu diễn được nhiều giá trị hơn một bit, phạm vi số hợp lệ rộng hơn hẳn.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=DEC2HEX(so, [do_dai])
=HEX2DEC(so_hex)
```

{{anh:dh-01-cu-phap-co-ban}}

`DEC2HEX(255)` cho `"FF"`. `HEX2DEC("FF")` cho lại `255`.

## Số âm dùng bù hai trên 10 ký tự hex, không phải 24-bit như hay lầm tưởng

```excel
=DEC2HEX(-9)
```

{{anh:dh-02-so-am-bu-hai}}

Kết quả là `"FFFFFFFFF7"` — đủ `10` ký tự hex, tương ứng `40` bit (`2^40`), không phải `24`-bit như một số tài liệu không chính thức hay nhầm lẫn. Phạm vi số âm hợp lệ vì vậy rộng hơn nhiều so với `DEC2BIN`: từ `-549.755.813.888` đến `549.755.813.887`.

## Ứng dụng: chuyển đổi mã màu RGB qua lại

```excel
=DEC2HEX(255,2)&DEC2HEX(87,2)&DEC2HEX(51,2)
```

{{anh:dh-03-ma-mau-rgb}}

Ghép ba giá trị `R`, `G`, `B` (mỗi giá trị từ `0` đến `255`) thành một mã màu hex `6` ký tự — tham số `do_dai=2` đảm bảo mỗi thành phần luôn đủ `2` ký tự (đệm số `0` nếu cần), tránh trường hợp một thành phần nhỏ như `5` chỉ ra `"5"` một ký tự làm lệch cả chuỗi mã màu.

## HEX2DEC không phân biệt hoa thường

```excel
=HEX2DEC("ff")
=HEX2DEC("FF")
```

{{anh:dh-04-khong-phan-biet-hoa-thuong}}

Cả hai đều cho `255` — `HEX2DEC` chấp nhận chữ hex viết hoa hoặc thường như nhau, không cần chuẩn hoá chữ hoa trước khi đưa vào hàm.

## Ứng dụng: đọc lại giá trị bù hai từ một hệ thống khác xuất ra

```excel
=HEX2DEC("FFFFFFFFF7")
```

{{anh:dh-05-doc-lai-bu-hai}}

Kết quả là `-9` — khi nhận dữ liệu từ một hệ thống hay thiết bị xuất giá trị dưới dạng hex bù hai (thường gặp trong nhật ký lỗi hệ thống hoặc dữ liệu cảm biến), `HEX2DEC` giải mã ngược lại đúng số âm ban đầu mà không cần tính tay quy tắc bù hai.

## Tổng kết

`DEC2HEX` và `HEX2DEC` chuyển đổi giữa thập phân và thập lục phân, dùng bù hai trên `10` ký tự hex (`40`-bit) cho số âm — phạm vi rộng hơn hẳn `DEC2BIN`. Không phân biệt chữ hex hoa thường, và ứng dụng phổ biến nhất là ghép/đọc mã màu hoặc dữ liệu xuất từ hệ thống khác.

Đọc tiếp trong cùng cụm bài: [DEC2OCT, OCT2DEC — hệ bát phân, và ý nghĩa thật của quyền file Unix dạng 755](/blog/ham-dec2oct-oct2dec-he-bat-phan).
