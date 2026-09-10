---
tieu_de: "ODD, EVEN: làm tròn lên tới số lẻ hoặc số chẵn gần nhất"
slug: "ham-odd-even-lam-tron-len-so-le-chan"
danh_muc: "Excel"
the: ["ODD", "EVEN", "hàm toán học"]
mo_ta: "ODD và EVEN làm tròn một số lên tới số lẻ hoặc số chẵn nguyên gần nhất, luôn đi ra xa số 0 — hữu ích khi cần một số lượng chẵn để chia cặp, nhưng dễ gây bất ngờ vì cách làm tròn khác hẳn ROUND."
tu_khoa: "hàm ODD Excel, hàm EVEN Excel, làm tròn số chẵn số lẻ Excel, khác ISEVEN ISODD, chia cặp số ghế Excel"
anh_bia: "/images/bai-viet/ham-odd-even/cover.png"
thu_muc_anh: "ham-odd-even"
trang_thai: "draft"
---

`ODD` và `EVEN` dễ nhầm với [ISEVEN, ISODD](/blog/ham-iseven-isodd-kiem-tra-so-chan-le) — nhưng hai cặp hàm này làm hai việc hoàn toàn khác nhau. `ISEVEN`/`ISODD` chỉ **kiểm tra** một số có chẵn/lẻ hay không, trả về `TRUE`/`FALSE`. `ODD`/`EVEN` thì **làm tròn** một số bất kỳ lên tới số nguyên lẻ hoặc chẵn gần nhất.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=ODD(so)
=EVEN(so)
```

{{anh:oe-01-cu-phap-co-ban}}

`ODD(4)` trả về `5` — số lẻ nguyên gần nhất tính từ `4` trở lên. `EVEN(3)` trả về `4` — số chẵn nguyên gần nhất tính từ `3` trở lên. Nếu số đưa vào đã đúng là lẻ (với `ODD`) hoặc chẵn (với `EVEN`) thì giữ nguyên: `ODD(3)=3`, `EVEN(4)=4`.

## Cả hai luôn làm tròn ra xa số 0, không làm tròn gần nhất

Điểm khác biệt lớn nhất so với `ROUND` là hướng làm tròn: `ODD`/`EVEN` luôn đẩy giá trị ra **xa số 0** — với số dương là làm tròn lên, với số âm là làm tròn xuống (theo giá trị tuyệt đối) — chứ không chọn kết quả **gần nhất** như `ROUND` vẫn làm:

```excel
=ODD(3.0001)
```

{{anh:oe-02-luon-ra-xa-khong}}

Dù `3.0001` chỉ nhỉnh hơn `3` một chút xíu, `ODD` vẫn nhảy thẳng lên `5` — vì `3.0001` không phải số lẻ nguyên, phải làm tròn lên tới số lẻ nguyên tiếp theo là `5`, bỏ qua hẳn `4` (số chẵn, không thoả điều kiện "lẻ"). Nếu mong đợi kết quả gần với `3` hơn, đây là chỗ dễ bị bất ngờ nhất khi mới dùng hàm này.

## Ứng dụng: làm tròn số ghế lên số chẵn để chia cặp

Một buổi tiệc dự kiến `7` khách, nhưng bàn tiệc cần số ghế **chẵn** để xếp theo cặp:

```excel
=EVEN(7)
```

{{anh:oe-03-lam-tron-so-ghe}}

Kết quả `8` — đã tự làm tròn lên số chẵn gần nhất, đảm bảo luôn xếp được thành các cặp ghế mà không cần kiểm tra tay xem số khách là chẵn hay lẻ trước khi tính.

## Với số âm: vẫn đẩy ra xa số 0

```excel
=ODD(-3)
=ODD(-4)
```

{{anh:oe-04-so-am}}

`ODD(-3)` giữ nguyên `-3` (đã là số lẻ). `ODD(-4)` cho ra `-5`, không phải `-3` — vẫn theo đúng nguyên tắc "ra xa số 0", chỉ là bây giờ phía xa số 0 với số âm là phía càng âm hơn.

## Trường hợp đặc biệt: ODD(0)

```excel
=ODD(0)
```

{{anh:oe-05-odd-cua-0}}

Kết quả là `1`, không phải `0` — vì `0` là số chẵn, không thoả điều kiện lẻ, nên phải làm tròn lên tới số lẻ gần nhất theo đúng quy tắc "ra xa số 0", và số lẻ gần `0` nhất theo hướng dương là `1`. `EVEN(0)` thì đơn giản hơn, giữ nguyên `0` vì `0` vốn đã là số chẵn.

## Tổng kết

`ODD` và `EVEN` làm tròn một số lên tới số nguyên lẻ hoặc chẵn gần nhất, luôn đẩy ra xa số `0` chứ không chọn giá trị gần nhất như `ROUND`. Đừng nhầm với `ISEVEN`/`ISODD` — hai hàm đó chỉ trả lời có/không, không làm tròn gì cả.

Đọc tiếp trong cùng cụm bài: [MROUND — làm tròn tới bội số bất kỳ, không chỉ chẵn lẻ](/blog/ham-mround-lam-tron-toi-boi-so).
