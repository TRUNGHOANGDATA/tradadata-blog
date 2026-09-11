---
tieu_de: "NOW: ngày và giờ hiện tại, và vì sao không nên dùng để đóng dấu thời gian cố định"
slug: "ham-now-ngay-gio-hien-tai"
danh_muc: "Excel"
the: ["NOW", "hàm ngày tháng"]
mo_ta: "NOW trả về cả ngày và giờ hiện tại, khác TODAY chỉ trả về ngày. Vì là hàm biến động, NOW tự tính lại mỗi khi bảng tính tính toán lại — không phù hợp để đóng dấu thời gian cố định cho một sự kiện đã xảy ra."
tu_khoa: "hàm NOW Excel, NOW khac TODAY, dong dau thoi gian Excel, ham bien dong volatile"
anh_bia: "/images/bai-viet/ham-now/cover.png"
thu_muc_anh: "ham-now"
trang_thai: "draft"
---

Bài trước, [TIME](/blog/ham-time-dung-gio-tu-gio-phut-giay) dựng một giờ cụ thể từ ba con số. `NOW` không cần tham số nào cả — chỉ đơn giản trả về thời điểm hiện tại, cả ngày lẫn giờ, ngay lúc công thức được tính.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=NOW()
```

{{anh:nw-01-cu-phap-co-ban}}

Không nhận đối số nào. Kết quả là một giá trị vừa có ngày vừa có giờ, ví dụ `10/09/2026 14:35:22`.

## Khác biệt với TODAY

`TODAY` (đã dùng trong [bài DATE, TODAY, DATEDIF, EDATE](/blog/ham-ngay-thang-trong-excel-date-today-datedif-edate)) chỉ trả về **ngày**, không kèm giờ:

```excel
=TODAY()
=NOW()
```

{{anh:nw-02-khac-biet-today}}

`TODAY()` cho `10/09/2026` — luôn là `00:00:00` về mặt giá trị bên trong, dù không hiển thị phần giờ. `NOW()` cho `10/09/2026 14:35:22` — đầy đủ cả giờ phút giây tại đúng thời điểm tính công thức.

## Ứng dụng: tính khoảng thời gian còn lại chính xác tới từng giờ

```excel
=HanChot-NOW()
```

{{anh:nw-03-tinh-khoang-con-lai}}

Nếu chỉ cần biết còn bao nhiêu **ngày** tới hạn chót, `TODAY()` là đủ. Nhưng khi cần biết chính xác còn bao nhiêu **giờ** (ví dụ đếm ngược cho một sự kiện diễn ra trong ngày), phải dùng `NOW()` để có cả phần giờ trong phép trừ.

## Là hàm biến động: tự tính lại mỗi khi bảng tính tính toán

`NOW` (giống `TODAY`, `RAND`, `RANDBETWEEN`) là một hàm **biến động** (volatile) — tự động tính lại giá trị mới mỗi khi bảng tính tính toán lại: mở file, sửa bất kỳ ô nào, hay nhấn `F9`:

{{anh:nw-04-ham-bien-dong}}

Đây là bản chất khiến `NOW` luôn hiển thị đúng thời điểm hiện tại — nhưng cũng chính là lý do không nên dùng để ghi lại một mốc thời gian **cố định**.

## Vì sao không nên dùng NOW để đóng dấu thời gian một sự kiện

```excel
=IF(A2<>"",NOW(),"")
```

{{anh:nw-05-khong-dung-dong-dau}}

Ý định của công thức này là "ghi lại thời điểm ô `A2` được nhập" — nhưng vì `NOW()` là hàm biến động, giá trị này **tiếp tục thay đổi** mỗi lần bảng tính tính toán lại sau đó, không đứng yên tại đúng lúc `A2` được nhập như mong muốn. Mở lại file một tuần sau, cột "thời gian nhập" này đã nhảy sang đúng thời điểm mở file, không còn là thời điểm nhập liệu ban đầu nữa.

Muốn đóng dấu thời gian cố định đúng nghĩa, cần sao chép giá trị đã tính rồi dán đè bằng `Paste Special → Values` ngay sau khi nhập (biến công thức thành một con số cố định, không còn tính lại), hoặc dùng macro VBA ghi giá trị tĩnh vào ô tại đúng thời điểm sự kiện xảy ra.

## Tổng kết

`NOW` trả về cả ngày và giờ hiện tại, khác `TODAY` chỉ có ngày. Vì là hàm biến động, tự tính lại mỗi khi bảng tính tính toán, `NOW` không phù hợp để đóng dấu thời gian cố định cho một sự kiện đã xảy ra — cần chuyển thành giá trị tĩnh bằng `Paste Special → Values` nếu muốn giữ nguyên mốc thời gian đó.

Đây là bài cuối trong cụm 5 bài lô 16, bắt đầu từ [AND](/blog/ham-and-tat-ca-dieu-kien-deu-dung).
