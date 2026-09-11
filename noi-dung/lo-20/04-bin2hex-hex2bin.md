---
tieu_de: "BIN2HEX, HEX2BIN: chuyển đổi trực tiếp giữa hai hệ đếm, không cần qua bước trung gian thập phân"
slug: "ham-bin2hex-hex2bin-chuyen-doi-truc-tiep"
danh_muc: "Excel"
the: ["BIN2HEX", "HEX2BIN", "hàm kỹ thuật"]
mo_ta: "BIN2HEX và HEX2BIN chuyển thẳng giữa nhị phân và thập lục phân trong một bước, không cần công thức lồng qua DEC2BIN/DEC2HEX trung gian. Excel còn có đủ 6 cặp hàm chuyển đổi trực tiếp tương tự giữa ba hệ đếm nhị-bát-thập lục phân."
tu_khoa: "hàm BIN2HEX Excel, ham HEX2BIN Excel, chuyen doi truc tiep he dem, khong qua trung gian thap phan"
anh_bia: "/images/bai-viet/ham-bin2hex-hex2bin/cover.png"
thu_muc_anh: "ham-bin2hex-hex2bin"
trang_thai: "draft"
---

Ba bài trước lần lượt chuyển đổi nhị phân, thập lục phân, bát phân — nhưng luôn đi qua thập phân làm bước trung gian. `BIN2HEX` và `HEX2BIN` bỏ hẳn bước trung gian đó, chuyển thẳng giữa hai hệ đếm trong một hàm duy nhất.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=BIN2HEX(so_nhi_phan, [do_dai])
=HEX2BIN(so_hex, [do_dai])
```

{{anh:bh-01-cu-phap-co-ban}}

`BIN2HEX("1001")` cho `"9"`. `HEX2BIN("9")` cho lại `"1001"`.

## Không cần công thức lồng hai lớp

```excel
=DEC2HEX(BIN2DEC("1001"))
=BIN2HEX("1001")
```

{{anh:bh-02-khong-can-long-cong-thuc}}

Cả hai cho cùng kết quả `"9"`, nhưng cách đầu phải lồng `BIN2DEC` bên trong `DEC2HEX` — đi qua thập phân làm bước trung gian không cần thiết. `BIN2HEX` làm gọn thành một bước duy nhất.

## Số âm vẫn giữ đúng giá trị qua bù hai

```excel
=BIN2HEX("1111110111")
```

{{anh:bh-03-so-am-giu-gia-tri}}

Kết quả là `"FFFFFFFFF7"` — đúng bằng `DEC2HEX(-9)` đã tính ở [bài trước](/blog/ham-dec2hex-hex2dec-chuyen-doi-thap-luc-phan). Chuỗi nhị phân bù hai `10`-bit được chuyển thẳng thành chuỗi hex bù hai `10`-ký-tự, giữ nguyên giá trị âm ban đầu mà không cần giải mã tay qua thập phân.

## HEX2BIN giới hạn phạm vi hẹp hơn hẳn HEX2DEC

```excel
=HEX2BIN("2000")
```

{{anh:bh-04-gioi-han-hep-hon}}

`HEX2DEC("2000")` tính được bình thường (ra `8192`), nhưng `HEX2BIN("2000")` báo lỗi `#NUM!` — vì kết quả cuối cùng luôn phải là một chuỗi nhị phân hợp lệ trong phạm vi `-512` đến `511` của `DEC2BIN`, mà `8192` đã vượt xa phạm vi đó. Đây là điểm dễ gây bất ngờ: `HEX2BIN` không lỗi vì chuỗi hex sai định dạng, mà vì giá trị nó đại diện quá lớn để "vừa" vào nhị phân `10`-bit.

## Excel còn có đủ 6 cặp chuyển đổi trực tiếp giữa 3 hệ đếm

{{anh:bh-05-du-6-cap-chuyen-doi}}

Ngoài `BIN2HEX`/`HEX2BIN`, Excel còn có `BIN2OCT`/`OCT2BIN` và `HEX2OCT`/`OCT2HEX` — đủ bộ chuyển đổi trực tiếp hai chiều giữa cả ba cặp hệ đếm nhị phân, bát phân, thập lục phân, không hàm nào trong số này cần đi qua thập phân làm trung gian.

## Tổng kết

`BIN2HEX` và `HEX2BIN` chuyển thẳng giữa nhị phân và thập lục phân, gọn hơn hẳn việc lồng `DEC2BIN`/`DEC2HEX` qua bước trung gian thập phân. Giới hạn phạm vi luôn theo hệ đếm hẹp nhất trong cặp chuyển đổi — cụ thể là phạm vi `10`-bit của nhị phân, dù đầu vào là một chuỗi hex hoàn toàn hợp lệ.

Đọc tiếp trong cùng cụm bài: [DELTA, GESTEP — hai hàm so sánh trả về đúng 0 hoặc 1, tiện làm cờ hiệu trong công thức](/blog/ham-delta-gestep-co-hieu-0-va-1).
