---
tieu_de: "LCM: bội số chung nhỏ nhất, tìm thời điểm hai chu kỳ khác nhau trùng nhau"
slug: "ham-lcm-boi-chung-nho-nhat"
danh_muc: "Excel"
the: ["LCM", "hàm toán học"]
mo_ta: "LCM tìm bội số chung nhỏ nhất của một nhóm số — dùng để tính sau bao lâu hai sự kiện lặp lại theo chu kỳ khác nhau sẽ trùng nhau trở lại, ví dụ hai tuyến xe buýt quay vòng ở hai khoảng thời gian khác nhau."
tu_khoa: "hàm LCM Excel, bội số chung nhỏ nhất, tim chu ky trung nhau Excel, LCM nhieu so"
anh_bia: "/images/bai-viet/ham-lcm/cover.png"
thu_muc_anh: "ham-lcm"
trang_thai: "draft"
---

Bài trước, [GCD](/blog/ham-gcd-uoc-chung-lon-nhat) tìm ước số **chung lớn nhất**. `LCM` đi chiều ngược lại — tìm bội số **chung nhỏ nhất** — và hai hàm này thường được nhắc tới cùng nhau vì đều xoay quanh quan hệ chia hết giữa các số.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=LCM(so1, so2, ...)
```

{{anh:lc-01-cu-phap-co-ban}}

`LCM(4,6)` trả về `12` — số nhỏ nhất vừa chia hết cho `4` vừa chia hết cho `6`. Cũng như `GCD`, `LCM` nhận nhiều số cùng lúc, không giới hạn ở hai số.

## Ứng dụng: hai chu kỳ khác nhau bao lâu thì trùng nhau một lần

Hai tuyến xe buýt cùng xuất phát tại một điểm lúc `8h00` sáng — tuyến A quay vòng mỗi `12` phút, tuyến B quay vòng mỗi `18` phút. Hỏi bao lâu nữa cả hai tuyến lại cùng xuất phát một lượt như lúc `8h00`:

```excel
=LCM(12,18)
```

{{anh:lc-02-hai-chu-ky-trung-nhau}}

Kết quả `36` phút — đây chính xác là dạng bài toán `LCM` giải quyết tốt nhất: tìm mốc thời gian gần nhất mà nhiều chu kỳ lặp lại độc lập cùng "khớp" trở lại với nhau.

## Ứng dụng: lịch bảo trì thiết bị có chu kỳ khác nhau

Một dây chuyền có ba loại bảo trì định kỳ: lọc dầu mỗi `15` ngày, thay bộ lọc khí mỗi `20` ngày, kiểm tra tổng thể mỗi `30` ngày. Muốn biết sau bao lâu cả ba mốc bảo trì rơi đúng cùng một ngày để gộp lại làm một lần dừng máy duy nhất:

```excel
=LCM(15,20,30)
```

{{anh:lc-03-lich-bao-tri}}

Kết quả `60` ngày — cứ mỗi `60` ngày, cả ba lịch bảo trì lại trùng nhau đúng một ngày, là thời điểm hợp lý để gộp việc dừng máy, tránh phải dừng dây chuyền riêng lẻ nhiều lần trong cùng một khoảng thời gian ngắn.

## Quan hệ giữa LCM và GCD của cùng một cặp số

Với đúng hai số, `LCM` và `GCD` liên hệ với nhau qua một quy tắc cố định: tích của `LCM` và `GCD` luôn bằng tích của hai số gốc:

```excel
=LCM(12,18)*GCD(12,18)
=12*18
```

{{anh:lc-04-quan-he-lcm-gcd}}

Cả hai công thức đều cho ra `216` — một cách nhanh để kiểm tra chéo kết quả nếu nghi ngờ tính nhầm, chỉ áp dụng chính xác với **đúng hai số**, không mở rộng trực tiếp cho ba số trở lên.

## Cùng giới hạn với GCD: chỉ nhận số nguyên không âm

```excel
=LCM(-12,18)
```

{{anh:lc-05-loi-so-am}}

Giống `GCD`, `LCM` chỉ hoạt động đúng với số nguyên không âm — đưa vào số âm sẽ báo lỗi `#NUM!`.

## Tổng kết

`LCM` tìm bội số chung nhỏ nhất của một nhóm số, ứng dụng thực tế rõ nhất là tính thời điểm nhiều chu kỳ lặp lại độc lập cùng trùng nhau trở lại — từ lịch xe buýt tới lịch bảo trì thiết bị. Với đúng hai số, `LCM×GCD` luôn bằng tích hai số gốc, là cách kiểm tra chéo kết quả nhanh.

Đọc tiếp trong cùng cụm bài: [RANK.EQ, RANK.AVG — hai cách xử lý khác nhau khi xếp hạng gặp điểm số bằng nhau](/blog/ham-rank-eq-rank-avg-xu-ly-diem-bang-nhau).
