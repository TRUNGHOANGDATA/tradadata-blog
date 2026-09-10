---
tieu_de: "GCD: ước số chung lớn nhất, dùng để rút gọn một tỷ lệ về dạng đơn giản nhất"
slug: "ham-gcd-uoc-chung-lon-nhat"
danh_muc: "Excel"
the: ["GCD", "hàm toán học"]
mo_ta: "GCD tìm ước số chung lớn nhất của một nhóm số — ứng dụng thực tế phổ biến nhất là rút gọn một tỷ lệ pha trộn hay tỷ lệ chia phần về dạng nhỏ nhất có thể, không cần tính nhẩm hay dò tay từng ước số."
tu_khoa: "hàm GCD Excel, ước số chung lớn nhất, rút gọn tỷ lệ Excel, GCD nhiều số"
anh_bia: "/images/bai-viet/ham-gcd/cover.png"
thu_muc_anh: "ham-gcd"
trang_thai: "draft"
---

Bài trước, [NETWORKDAYS.INTL](/blog/ham-networkdays-intl-cuoi-tuan-tuy-chinh) khép lại phần các hàm ngày tháng. `GCD` chuyển sang một hàm toán học nhỏ gọn nhưng bất ngờ hữu dụng: tìm ước số chung lớn nhất của một nhóm số.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=GCD(so1, so2, ...)
```

{{anh:gc-01-cu-phap-co-ban}}

`GCD(24,36)` trả về `12` — số lớn nhất chia hết cho cả `24` và `36`. Hàm nhận tối đa `255` số cùng lúc, không chỉ giới hạn ở hai số.

## Ứng dụng: rút gọn một tỷ lệ pha trộn về dạng đơn giản nhất

Một công thức pha chế cần trộn nguyên liệu theo tỷ lệ `24:36`, muốn quy đổi về tỷ lệ nhỏ nhất tương đương để dễ nhớ và dễ nhân lên khi pha mẻ lớn:

```excel
=A2/GCD(A2,B2)
=B2/GCD(A2,B2)
```

{{anh:gc-02-rut-gon-ty-le}}

Chia cả hai số cho `GCD(24,36)=12`, tỷ lệ `24:36` rút gọn thành `2:3` — cùng một tỷ lệ pha trộn, nhưng dễ hình dung và nhân lên hơn hẳn.

## Ứng dụng: quy đổi khổ giấy hoặc kích thước về tỷ lệ khung hình đơn giản

Một tấm ảnh kích thước `1920×1080` pixel — muốn biết tỷ lệ khung hình rút gọn là bao nhiêu:

```excel
=1920/GCD(1920,1080)&":"&1080/GCD(1920,1080)
```

{{anh:gc-03-ty-le-khung-hinh}}

Kết quả `16:9` — đúng tỷ lệ khung hình quen thuộc, tính ra tự động thay vì phải nhớ sẵn hoặc dò các cặp số chia hết bằng tay.

## GCD với các số không có ước chung nào ngoài 1

```excel
=GCD(7,15)
```

{{anh:gc-04-so-nguyen-to-cung-nhau}}

Kết quả là `1` — hai số `7` và `15` không có ước số chung nào lớn hơn `1` (gọi là hai số nguyên tố cùng nhau). Tỷ lệ `7:15` đã ở dạng đơn giản nhất, không rút gọn thêm được nữa.

## Lưu ý: chỉ nhận số nguyên không âm

`GCD` chỉ hoạt động đúng với số nguyên không âm. Đưa vào số âm hoặc số thập phân không nguyên sẽ báo lỗi `#NUM!`:

```excel
=GCD(-24,36)
```

{{anh:gc-05-loi-so-am}}

Nếu dữ liệu đầu vào có khả năng chứa số âm hoặc số lẻ thập phân, cần làm tròn hoặc lấy trị tuyệt đối (xem lại [`ABS`](/blog/ham-abs-tri-tuyet-doi)) trước khi đưa vào `GCD`.

## Tổng kết

`GCD` tìm ước số chung lớn nhất của một nhóm số, ứng dụng phổ biến nhất là rút gọn một tỷ lệ về dạng nhỏ nhất — từ tỷ lệ pha trộn tới tỷ lệ khung hình. Chỉ hoạt động với số nguyên không âm; số âm hoặc số thập phân sẽ báo lỗi `#NUM!`.

Đọc tiếp trong cùng cụm bài: [LCM — bội số chung nhỏ nhất, tìm thời điểm hai chu kỳ khác nhau trùng nhau](/blog/ham-lcm-boi-chung-nho-nhat).
