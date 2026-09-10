---
tieu_de: "WEEKDAY và EOMONTH: biết một ngày rơi vào thứ mấy, và tìm ngày cuối tháng"
slug: "ham-weekday-eomonth-thu-trong-tuan-ngay-cuoi-thang"
danh_muc: "Excel"
the: ["WEEKDAY", "EOMONTH", "hàm ngày tháng", "hàm cơ bản"]
mo_ta: "Cách dùng WEEKDAY để biết một ngày rơi vào thứ mấy trong tuần, tránh lên lịch giao hàng vào cuối tuần, và EOMONTH để tính hạn thanh toán luôn đúng ngày cuối cùng của tháng."
tu_khoa: "hàm WEEKDAY Excel, hàm EOMONTH, tính thứ trong tuần Excel, tìm ngày cuối tháng, hạn thanh toán cuối tháng"
anh_bia: "/images/bai-viet/ham-weekday-eomonth/cover.png"
thu_muc_anh: "ham-weekday-eomonth"
trang_thai: "draft"
---

Excel lưu ngày tháng dưới dạng một con số, nên biết một ngày cụ thể rơi vào **thứ mấy** trong tuần không thể nhìn ra bằng mắt từ con số đó — cần một hàm chuyển đổi riêng. Tương tự, tìm ra ngày cuối cùng của một tháng nghe đơn giản nhưng tháng nào 28, 30 hay 31 ngày lại không cố định, dễ tính sai nếu làm thủ công.

`WEEKDAY` và `EOMONTH` giải quyết đúng hai bài toán đó — hai hàm nhỏ nhưng dùng liên tục trong công việc lên lịch, tính hạn thanh toán, và báo cáo theo tuần.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## WEEKDAY — ngày này rơi vào thứ mấy

```excel
=WEEKDAY(serial_number, [return_type])
```

Tham số `return_type` quyết định cách đánh số thứ trong tuần, và đây là chỗ dễ gây nhầm lẫn nhất khi mới dùng hàm này:

- `1` (mặc định) — Chủ Nhật là `1`, Thứ Bảy là `7`.
- `2` — Thứ Hai là `1`, Chủ Nhật là `7`. Phù hợp hơn với cách tính tuần làm việc quen thuộc ở Việt Nam.
- `3` — Thứ Hai là `0`, Chủ Nhật là `6`.

Ví dụ: đơn hàng lập ngày 15/09/2026 (một ngày thứ Ba).

```excel
=WEEKDAY(A2, 2)
```

{{anh:we-01-weekday-co-ban}}

Kết quả trả về **2** — đúng vị trí thứ Ba khi đếm theo kiểu `return_type=2` (Thứ Hai là 1, Thứ Ba là 2). Bỏ tham số `return_type`, dùng mặc định `1`, cùng ngày đó sẽ cho ra **3** — dễ gây nhầm lẫn nếu không để ý đang dùng kiểu đếm nào. **Luôn khai rõ `return_type`**, đừng dựa vào mặc định, để công thức không phụ thuộc vào việc người đọc có nhớ đúng quy ước hay không.

## Ứng dụng thực tế: tránh lên lịch giao hàng vào cuối tuần

```excel
=IF(WEEKDAY(A2, 2) >= 6, "Cuối tuần — dời lịch", "Ngày làm việc")
```

{{anh:we-02-kiem-tra-cuoi-tuan}}

Với `return_type=2`, thứ Bảy là `6` và Chủ Nhật là `7` — điều kiện `>= 6` bắt đúng cả hai ngày cuối tuần. Công thức này dùng để lọc nhanh những ngày giao hàng dự kiến rơi vào cuối tuần, cần dời sang ngày làm việc gần nhất.

## EOMONTH — tìm ngày cuối cùng của một tháng

```excel
=EOMONTH(start_date, months)
```

`EOMONTH` trả về ngày cuối cùng của tháng, tính từ `start_date` và dịch thêm `months` tháng. Excel tự biết tháng đó có 28, 29, 30 hay 31 ngày — không cần tra thủ công hay nhớ quy tắc năm nhuận.

- `months = 0` — cuối tháng hiện tại (cùng tháng với `start_date`).
- `months = 1` — cuối tháng **sau**.
- `months = -1` — cuối tháng **trước**.

Ví dụ: đơn hàng lập ngày 15/09/2026, hạn thanh toán quy định là "cuối tháng sau".

```excel
=EOMONTH(A2, 1)
```

{{anh:we-03-eomonth}}

Kết quả trả về **31/10/2026** — đúng ngày cuối cùng của tháng 10, tháng liền sau tháng lập đơn. Excel tự biết tháng 10 có 31 ngày, không phải nhập tay con số đó.

## Khác với EDATE ở điểm nào

Một hàm cùng họ khác, `EDATE`, cũng dịch chuyển ngày theo tháng nhưng theo cách khác hẳn: `EDATE` giữ nguyên **số ngày** trong tháng, chỉ đổi tháng.

```excel
=EDATE(A2, 1)     ' Kết quả: 15/10/2026 — giữ nguyên ngày 15
=EOMONTH(A2, 1)   ' Kết quả: 31/10/2026 — luôn là ngày cuối tháng
```

{{anh:we-04-so-sanh-edate}}

Chọn hàm nào tuỳ vào bản chất ngày cần tính: hạn hợp đồng "sau đúng 1 tháng kể từ ngày ký" dùng `EDATE`; hạn thanh toán "cuối tháng sau" dùng `EOMONTH`. Nhầm lẫn giữa hai hàm này thường không gây lỗi công thức, chỉ ra sai ngày — dễ bị bỏ sót nếu không kiểm tra kỹ.

## Kết hợp cả hai: tìm ngày làm việc cuối cùng của tháng

Ghép `EOMONTH` và `WEEKDAY` để giải một bài toán thực tế hay gặp trong kế toán: nhiều báo cáo cần chốt vào ngày làm việc cuối cùng của tháng, nhưng ngày cuối tháng theo lịch đôi khi lại rơi đúng vào cuối tuần.

{{anh:we-05-ngay-cuoi-thang-lam-viec}}

```excel
=IF(WEEKDAY(EOMONTH(A2,0),2)=6, EOMONTH(A2,0)-1,
   IF(WEEKDAY(EOMONTH(A2,0),2)=7, EOMONTH(A2,0)-2, EOMONTH(A2,0)))
```

Đọc theo từng lớp: `EOMONTH(A2,0)` tìm ngày cuối tháng theo lịch. `WEEKDAY(...,2)` kiểm tra ngày đó là thứ mấy. Nếu rơi vào thứ Bảy (`6`), lùi lại 1 ngày để về thứ Sáu. Nếu rơi vào Chủ Nhật (`7`), lùi lại 2 ngày để cũng về thứ Sáu. Các trường hợp còn lại giữ nguyên ngày cuối tháng theo lịch.

## Tổng kết

`WEEKDAY` cho biết một ngày rơi vào thứ mấy, nhưng luôn phải khai rõ `return_type` để tránh nhầm quy ước đánh số. `EOMONTH` tìm ngày cuối cùng của một tháng bất kỳ, tự động xử lý đúng số ngày của từng tháng mà không cần tra thủ công, và khác hẳn `EDATE` ở chỗ luôn trả về ngày cuối tháng thay vì giữ nguyên số ngày gốc.

Đọc tiếp trong cùng cụm bài: [CEILING và FLOOR — làm tròn theo hướng cố định, khác ROUND thông thường](/blog/ham-ceiling-floor-lam-tron-theo-huong-co-dinh).
