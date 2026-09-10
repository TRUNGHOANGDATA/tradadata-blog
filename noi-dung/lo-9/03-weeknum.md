---
tieu_de: "WEEKNUM: tìm số thứ tự tuần trong năm, và vì sao nó dễ lệch với lịch quốc tế"
slug: "ham-weeknum-tim-so-thu-tu-tuan-trong-nam"
danh_muc: "Excel"
the: ["WEEKNUM", "ISOWEEKNUM", "hàm ngày tháng"]
mo_ta: "WEEKNUM trả về tuần thứ mấy trong năm của một ngày — nhưng cách đếm mặc định không theo chuẩn ISO 8601 quốc tế, dễ lệch một tuần với dữ liệu từ hệ thống khác nếu không để ý tham số kiểu."
tu_khoa: "hàm WEEKNUM Excel, số tuần trong năm Excel, ISOWEEKNUM, WEEKNUM kiểu ISO, báo cáo theo tuần Excel"
anh_bia: "/images/bai-viet/ham-weeknum/cover.png"
thu_muc_anh: "ham-weeknum"
trang_thai: "draft"
---

Liên quan tới [WEEKDAY](/blog/ham-weekday-eomonth-thu-trong-tuan-ngay-cuoi-thang) — biết một ngày rơi vào thứ mấy trong tuần — `WEEKNUM` trả lời một câu hỏi khác: ngày đó nằm ở **tuần thứ bao nhiêu** tính từ đầu năm. Hàm này đơn giản để dùng, nhưng có một điểm dễ gây sai lệch nếu ghép dữ liệu với hệ thống khác.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=WEEKNUM(ngay, [kieu_tra_ve])
```

`kieu_tra_ve` bỏ trống thì mặc định là `1`. Giá trị hay dùng:

{{anh:wn-01-bang-kieu-tra-ve}}

- `1` (mặc định): tuần bắt đầu từ **Chủ Nhật**.
- `2`: tuần bắt đầu từ **Thứ Hai**.
- `21`: theo chuẩn **ISO 8601** — tuần bắt đầu Thứ Hai, và tuần 1 là tuần chứa ngày Thứ Năm đầu tiên của năm.

## Ví dụ cơ bản

```excel
=WEEKNUM(DATE(2026,9,10))
```

{{anh:wn-02-vi-du-co-ban}}

Ngày 10/09/2026 là tuần thứ `37` của năm — với cả kiểu `1` và kiểu `21`, hai cách tính này thường trùng nhau ở giữa năm.

## Điểm dễ sai: mặc định KHÔNG phải chuẩn ISO 8601

Khác biệt lộ rõ nhất ở **những ngày cuối năm hoặc đầu năm**. Lấy ngày `31/12/2025` (một ngày Thứ Tư) làm ví dụ:

```excel
=WEEKNUM(DATE(2025,12,31),1)
=WEEKNUM(DATE(2025,12,31),21)
```

{{anh:wn-03-lech-cuoi-nam}}

Với kiểu `1` (mặc định), kết quả là tuần `53` — vẫn tính là tuần cuối của năm **2025**. Nhưng theo chuẩn ISO 8601 (kiểu `21`), cùng ngày đó lại thuộc tuần `1` của năm **2026** — vì tuần chứa ngày Thứ Năm đầu tiên của 2026 (01/01/2026 chính là Thứ Năm) đã bắt đầu từ Thứ Hai 29/12/2025.

Nếu một báo cáo doanh số tuần đối chiếu với dữ liệu xuất từ hệ thống khác (nhiều hệ thống quốc tế, lịch Google Calendar theo vùng châu Âu, hay các chuẩn báo cáo quốc tế dùng ISO week) mà không để ý tham số này, số liệu "tuần 53" của Excel và "tuần 1" của hệ thống kia thực chất đang nói về cùng một khoảng ngày — dễ bị hiểu nhầm là lệch dữ liệu.

## Excel còn có hẳn một hàm riêng cho kiểu ISO

Vì kiểu `21` hay được cần tới, Excel có sẵn `ISOWEEKNUM` — ngắn gọn hơn, không cần nhớ số `21`:

```excel
=ISOWEEKNUM(DATE(2025,12,31))
```

{{anh:wn-04-isoweeknum}}

Kết quả giống hệt `WEEKNUM(ngay, 21)` — cùng trả về `1`. Dùng hàm nào cũng được, miễn nhất quán trong cùng một bảng tính.

## Ứng dụng: nhóm dữ liệu bán hàng theo tuần

```excel
=WEEKNUM(B2)
```

{{anh:wn-05-nhom-theo-tuan}}

Thêm cột phụ này rồi `SUMIFS` theo số tuần là cách nhanh để dựng báo cáo doanh số hàng tuần mà không cần gõ tay từng khoảng ngày. Chỉ cần chọn kiểu `1`, `2` hay `21` từ đầu và giữ nguyên xuyên suốt bảng tính, tránh trộn lẫn nhiều kiểu trong cùng một báo cáo.

## Tổng kết

`WEEKNUM` trả về tuần thứ mấy trong năm, nhưng cách đếm mặc định (kiểu `1`) không theo chuẩn ISO 8601 quốc tế — khác biệt rõ nhất ở các ngày giáp ranh cuối/đầu năm. Cần đối chiếu với hệ thống theo chuẩn ISO thì dùng kiểu `21`, hoặc gọn hơn là `ISOWEEKNUM`.

Đọc tiếp trong cùng cụm bài: [DATEVALUE, TIMEVALUE — chuyển văn bản ngày giờ thành giá trị tính toán được](/blog/ham-datevalue-timevalue-chuyen-van-ban-thanh-ngay-gio).
