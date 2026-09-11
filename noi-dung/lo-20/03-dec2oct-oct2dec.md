---
tieu_de: "DEC2OCT, OCT2DEC: hệ bát phân, và ý nghĩa thật của quyền file Unix dạng 755"
slug: "ham-dec2oct-oct2dec-he-bat-phan"
danh_muc: "Excel"
the: ["DEC2OCT", "OCT2DEC", "hàm kỹ thuật"]
mo_ta: "DEC2OCT và OCT2DEC chuyển đổi giữa thập phân và bát phân — hệ đếm ít gặp trong đời sống hàng ngày nhưng vẫn còn dùng để biểu diễn quyền truy cập file kiểu Unix, như con số 755 quen thuộc khi chạy lệnh chmod."
tu_khoa: "hàm DEC2OCT Excel, ham OCT2DEC Excel, he bat phan, quyen file Unix chmod 755"
anh_bia: "/images/bai-viet/ham-dec2oct-oct2dec/cover.png"
thu_muc_anh: "ham-dec2oct-oct2dec"
trang_thai: "draft"
---

Bài trước, [DEC2HEX, HEX2DEC](/blog/ham-dec2hex-hex2dec-chuyen-doi-thap-luc-phan) làm việc với hệ thập lục phân. `DEC2OCT` và `OCT2DEC` chuyển sang hệ bát phân — hệ đếm cơ số `8`, ít gặp trong đời sống hàng ngày nhưng vẫn còn xuất hiện ở một nơi quen thuộc với dân kỹ thuật: quyền truy cập file kiểu Unix.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=DEC2OCT(so, [do_dai])
=OCT2DEC(so_bat_phan)
```

{{anh:do-01-cu-phap-co-ban}}

Cùng nguyên lý với `DEC2BIN`/`DEC2HEX` — số âm dùng bù hai, lần này trên `10` ký tự bát phân (`2^30`).

## Ý nghĩa thật của quyền file Unix "755"

Lệnh `chmod 755 file.sh` quen thuộc với ai từng dùng dòng lệnh Linux/macOS — con số `755` thực chất là một số **bát phân**, mỗi chữ số đại diện cho một nhóm quyền:

```excel
=OCT2DEC(755)
```

{{anh:do-02-y-nghia-chmod}}

`OCT2DEC(755)` cho `493` — nhưng ý nghĩa thật không nằm ở con số thập phân này, mà ở cách đọc **từng chữ số bát phân riêng lẻ**: chữ số `7` (chủ sở hữu) = `4+2+1` = đọc-ghi-thực thi; chữ số `5` thứ nhất (nhóm) = `4+0+1` = đọc-thực thi (không ghi); chữ số `5` thứ hai (người khác) = `4+0+1` = đọc-thực thi. Hệ bát phân được chọn cho việc này chính vì mỗi chữ số bát phân (`0`-`7`) vừa khít biểu diễn `3` bit quyền (đọc/ghi/thực thi) độc lập cho từng nhóm.

## Chuyển từ thập phân sang bát phân

```excel
=DEC2OCT(493)
```

{{anh:do-03-dec2oct-co-ban}}

Kết quả là `"755"` — đúng chiều ngược lại, tái tạo lại chuỗi bát phân từ giá trị thập phân `493`.

## Số âm dùng bù hai trên 10 chữ số bát phân

```excel
=DEC2OCT(-9)
```

{{anh:do-04-so-am-bu-hai}}

Kết quả là `"7777777767"` — đủ `10` chữ số bát phân, dùng bù hai theo modulo `2^30`, cùng nguyên lý với `DEC2BIN`/`DEC2HEX` nhưng khác cơ số nền và độ dài biểu diễn.

## Phạm vi hợp lệ

```excel
=DEC2OCT(600000000)
```

{{anh:do-05-gioi-han-pham-vi}}

Phạm vi số hợp lệ từ `-536.870.912` đến `536.870.911` (giới hạn bởi `2^30`) — vượt quá sẽ báo lỗi `#NUM!`, rộng hơn hẳn `DEC2BIN` nhưng hẹp hơn `DEC2HEX`.

## Tổng kết

`DEC2OCT` và `OCT2DEC` chuyển đổi giữa thập phân và bát phân, cùng nguyên lý bù hai với `DEC2BIN`/`DEC2HEX` nhưng dùng `10` chữ số bát phân (`2^30`). Ứng dụng thực tế rõ nhất ngoài đời là giải mã ý nghĩa các con số quyền file kiểu Unix (`755`, `644`...) mà dân lập trình/quản trị hệ thống gặp hàng ngày.

Đọc tiếp trong cùng cụm bài: [BIN2HEX, HEX2BIN — chuyển đổi trực tiếp giữa hai hệ đếm, không cần qua bước trung gian thập phân](/blog/ham-bin2hex-hex2bin-chuyen-doi-truc-tiep).
