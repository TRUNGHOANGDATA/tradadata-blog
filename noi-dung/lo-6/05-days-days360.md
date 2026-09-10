---
tieu_de: "DAYS và DAYS360: đếm số ngày giữa hai mốc thời gian, hai cách tính khác nhau"
slug: "ham-days-days360-dem-so-ngay-giua-hai-moc"
danh_muc: "Excel"
the: ["DAYS", "DAYS360", "hàm ngày tháng", "hàm cơ bản"]
mo_ta: "DAYS đếm đúng số ngày lịch giữa hai mốc thời gian. DAYS360 đếm theo quy ước tài chính coi mỗi tháng có 30 ngày, năm có 360 ngày — hai kết quả có thể khác nhau trên cùng một cặp ngày."
tu_khoa: "hàm DAYS Excel, hàm DAYS360, đếm số ngày giữa hai ngày, quy ước 360 ngày tài chính, DAYS khác DATEDIF"
anh_bia: "/images/bai-viet/ham-days-days360/cover.png"
thu_muc_anh: "ham-days-days360"
trang_thai: "draft"
---

Bài về [`WEEKDAY` và `EOMONTH`](/blog/ham-weekday-eomonth-thu-trong-tuan-ngay-cuoi-thang) đã đi qua cách tìm ra một ngày cụ thể. `DAYS` và `DAYS360` giải một bài toán khác: đếm xem giữa hai mốc thời gian có bao nhiêu ngày — nhưng theo hai quy ước đếm hoàn toàn khác nhau, cho ra hai con số khác nhau trên cùng một cặp ngày.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## DAYS — đếm đúng số ngày lịch thật

```excel
=DAYS(end_date, start_date)
```

Chú ý thứ tự tham số: ngày **kết thúc** đứng trước, ngày **bắt đầu** đứng sau — ngược với cách viết trên giấy thường nói "từ ngày A đến ngày B".

```excel
=DAYS(A3, A2)
```

{{anh:dd-01-days-co-ban}}

Với `A2` là 15/09/2026 và `A3` là 25/12/2026, kết quả trả về **101** — đúng số ngày lịch thật giữa hai mốc, tính đủ cả các tháng có 30 và 31 ngày.

Đơn giản nhất, `DAYS(A3, A2)` cho cùng kết quả với phép trừ trực tiếp `=A3-A2`, vì Excel lưu ngày tháng dưới dạng số nên trừ hai ngày cho nhau vốn đã ra đúng số ngày chênh lệch. `DAYS` chỉ là cách viết tường minh hơn, dễ đọc hơn khi công thức nằm giữa nhiều phép tính khác.

## DAYS360 — quy ước tài chính: mỗi tháng 30 ngày, năm 360 ngày

```excel
=DAYS360(start_date, end_date, [method])
```

Chú ý: thứ tự tham số ở `DAYS360` **ngược lại** với `DAYS` — ngày bắt đầu đứng trước, ngày kết thúc đứng sau, đúng theo cách nói thông thường. Đây là điểm dễ gây nhầm lẫn nhất khi dùng cả hai hàm trong cùng một bảng tính.

```excel
=DAYS360(A2, A3)
```

{{anh:dd-02-days360}}

Cùng hai mốc thời gian 15/09/2026 và 25/12/2026, `DAYS360` trả về **100** — khác với `101` của `DAYS`. Chênh lệch này không phải sai số làm tròn — nó đến từ một quy ước tính toán hoàn toàn khác: `DAYS360` giả định mỗi tháng luôn có đúng 30 ngày và mỗi năm có đúng 360 ngày, bất kể tháng đó thực tế có 28, 30 hay 31 ngày.

{{anh:dd-03-so-sanh-hai-cach}}

## Vì sao lại có quy ước "360 ngày một năm"

Quy ước này nghe vô lý nếu chỉ nhìn từ góc độ lịch thông thường, nhưng nó có lý do lịch sử và thực tế trong tài chính: nhiều loại trái phiếu, hợp đồng vay, và công thức tính lãi truyền thống dùng quy ước 30/360 để đơn giản hoá việc tính lãi — mỗi tháng luôn tính đúng 30 ngày lãi, không cần quan tâm tháng đó thực tế dài ngắn ra sao. Việc này giúp lãi suất tính ra đều đặn giữa các tháng, thay vì tháng 31 ngày tự nhiên có lãi cao hơn tháng 28 ngày chỉ vì số ngày trong tháng khác nhau.

`DAYS360` vẫn được dùng trong một số công thức tính lãi kiểu cũ và một số chuẩn hợp đồng tài chính quốc tế theo quy ước 30/360 (thường gọi là "30E/360" hay "NASD 30/360" tuỳ biến thể) — không phải hàm bị lỗi thời hoàn toàn, chỉ là phạm vi dùng hẹp hơn nhiều so với đếm ngày thông thường.

## Tham số method: hai biến thể của quy ước 30/360

Tham số thứ ba, thường bị bỏ qua, chọn giữa hai cách xử lý khi ngày rơi vào 31:

- `FALSE` (mặc định, kiểu Mỹ — phương pháp NASD) — có vài quy tắc điều chỉnh riêng khi ngày bắt đầu hoặc kết thúc rơi đúng vào ngày 31.
- `TRUE` (kiểu châu Âu) — cả ngày 31 ở đầu và cuối đều được coi như ngày 30, đơn giản và nhất quán hơn.

Với hai mốc ngày không rơi vào 31 như ví dụ trong bài, cả hai kiểu cho cùng kết quả — sự khác biệt chỉ lộ ra khi một trong hai mốc đúng vào ngày cuối tháng có 31 ngày.

## Khi nào dùng hàm nào

Với mọi tính toán đời thường — đếm số ngày còn lại tới hạn giao hàng, tính tuổi, đếm thời gian dự án — luôn dùng `DAYS` (hoặc phép trừ trực tiếp `end - start`), vì đó là số ngày thật, khớp với lịch treo tường. Chỉ dùng `DAYS360` khi công thức tài chính hoặc hợp đồng cụ thể yêu cầu đúng quy ước 30/360 — dùng nhầm `DAYS360` cho việc đếm ngày thông thường sẽ cho ra kết quả lệch so với lịch thật, như đã thấy trong ví dụ trên: `100` so với `101` ngày thật.

Cần đếm ngày làm việc (bỏ qua cuối tuần) thay vì đếm ngày lịch, đó lại là việc của `NETWORKDAYS` — nằm ngoài phạm vi hai hàm trong bài này.

## Tổng kết

`DAYS` đếm đúng số ngày lịch thật giữa hai mốc thời gian — dùng cho hầu hết mọi nhu cầu đời thường. `DAYS360` đếm theo quy ước tài chính coi mỗi tháng có 30 ngày, năm có 360 ngày, cho ra con số khác `DAYS` dù cùng một cặp ngày — chỉ nên dùng khi công thức tài chính cụ thể yêu cầu đúng quy ước đó. Nhớ thứ tự tham số ngược nhau giữa hai hàm: `DAYS` là kết thúc trước, `DAYS360` là bắt đầu trước.

Đây là bài cuối trong cụm 5 bài. Xem lại từ đầu: [EXACT](/blog/ham-exact-so-sanh-chinh-xac-hai-chuoi), [DOLLAR và FIXED](/blog/ham-dollar-fixed-dinh-dang-tien-te-so-thap-phan), [ISEVEN và ISODD](/blog/ham-iseven-isodd-kiem-tra-so-chan-le), [SUMSQ và PRODUCT](/blog/ham-sumsq-product-tong-binh-phuong-va-tich).
