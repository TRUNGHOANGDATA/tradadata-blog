---
tieu_de: "STEYX: sai số chuẩn của mô hình hồi quy, và khoảng dao động thực tế của một dự đoán"
slug: "ham-steyx-sai-so-chuan-mo-hinh-hoi-quy"
danh_muc: "Excel"
the: ["STEYX", "sai số chuẩn", "hồi quy tuyến tính", "phân tích dữ liệu"]
mo_ta: "Cách dùng STEYX để biết một dự đoán từ mô hình hồi quy thường lệch bao nhiêu so với thực tế, tính theo đúng đơn vị gốc thay vì phần trăm trừu tượng như RSQ."
tu_khoa: "hàm STEYX Excel, sai số chuẩn hồi quy, standard error of estimate, độ lệch dự đoán hồi quy tuyến tính"
anh_bia: "/images/bai-viet/ham-steyx/cover.png"
thu_muc_anh: "ham-steyx"
trang_thai: "draft"
---

Bài trước dùng `RSQ` để biết mô hình giải thích được 99,2% biến thiên của doanh thu. Con số phần trăm đó dễ so sánh giữa các mô hình, nhưng lại khó hình dung trong công việc hàng ngày: 0,8% biến thiên còn lại tương đương với bao nhiêu **triệu đồng** thực tế?

`STEYX` trả lời câu hỏi đó bằng đúng đơn vị gốc của dữ liệu, không phải phần trăm trừu tượng — nó cho biết một dự đoán từ mô hình hồi quy thường lệch bao nhiêu so với con số thực tế.

Công thức viết bằng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Bộ dữ liệu dùng trong bài

Vẫn dữ liệu chi phí quảng cáo (cột B) và doanh thu (cột C) của 6 tháng, cùng bộ số liệu xuyên suốt cụm bài.

{{anh:sy-01-du-lieu}}

## Cú pháp và ý nghĩa

```excel
=STEYX(known_ys, known_xs)
```

Cùng thứ tự tham số như các hàm trước trong cụm: `y` trước, `x` sau.

```excel
=STEYX(C2:C7, B2:B7)
```

{{anh:sy-02-cong-thuc}}

Kết quả xấp xỉ **4,41**. Đơn vị của con số này **giống hệt đơn vị của `y`** — ở đây là triệu đồng doanh thu. Ý nghĩa: một dự đoán từ phương trình hồi quy đã dựng ở bài trước thường lệch khoảng **4,41 triệu đồng** so với doanh thu thực tế, tính theo kiểu sai lệch trung bình có trọng số (căn bậc hai trung bình bình phương sai lệch, không phải trung bình cộng đơn giản).

## So sánh với từng sai lệch thực tế

Nhìn lại bảng dữ liệu gốc, đem giá trị doanh thu thực tế so với giá trị phương trình dự đoán cho từng tháng:

{{anh:sy-03-sai-lech-tung-thang}}

Một vài tháng lệch nhiều hơn `4,41`, một vài tháng lệch ít hơn — `STEYX` là một cách tổng hợp mức lệch của **toàn bộ** các tháng thành một con số đại diện duy nhất, không phải mức lệch của riêng tháng nào. Cách tính này phạt nặng những sai lệch lớn hơn không cân xứng (vì có bước bình phương trước khi lấy căn), nên một tháng lệch rất xa sẽ kéo `STEYX` lên cao hơn nhiều so với việc chỉ đơn giản lấy trung bình cộng các mức lệch.

## Dùng STEYX để ước lượng khoảng dao động của một dự đoán

Ứng dụng thực tế nhất của `STEYX`: thay vì chỉ đưa ra một con số dự đoán duy nhất, có thể đưa ra một **khoảng** dao động hợp lý xung quanh con số đó.

Với dự đoán doanh thu ở chi phí quảng cáo 22 triệu đồng đã tính ở bài `SLOPE`/`INTERCEPT` (khoảng 214,1 triệu đồng), cộng trừ một lần `STEYX` cho ra một khoảng ước lượng thô:

```
214,1 ± 4,41  →  khoảng 209,7 đến 218,5 triệu đồng
```

{{anh:sy-04-khoang-du-doan}}

Đây là cách ước lượng đơn giản, không phải khoảng tin cậy thống kê chính xác theo đúng nghĩa (khoảng tin cậy chuẩn còn cần tính thêm hệ số phân phối Student dựa trên số bậc tự do, phức tạp hơn phạm vi bài này), nhưng đủ dùng cho mục đích thực tế: thay vì nói "doanh thu dự kiến đúng 214,1 triệu", nói "doanh thu dự kiến khoảng 210 đến 218 triệu" trung thực hơn nhiều với bản chất không chắc chắn của một dự đoán.

## Vì sao nên báo cáo STEYX cùng với con số dự đoán

Một sai lầm phổ biến khi trình bày kết quả dự đoán từ hồi quy tuyến tính là chỉ đưa ra đúng một con số, khiến người đọc — đặc biệt là người không rành thống kê — hiểu nhầm rằng con số đó chính xác tuyệt đối. Đưa kèm `STEYX` (hoặc khoảng dao động tính từ nó) giúp truyền tải đúng mức độ tin cậy thực sự của dự đoán, tránh những quyết định dựa trên một con số tưởng chắc chắn nhưng thực ra có sai số đáng kể.

`STEYX` cũng là chỉ số nên dùng để **so sánh độ chính xác dự đoán** giữa hai mô hình khác nhau khi cả hai cùng dự đoán một biến `y` giống nhau — mô hình nào có `STEYX` nhỏ hơn thì dự đoán ra giá trị gần thực tế hơn, tính theo đúng đơn vị gốc, dễ hiểu hơn nhiều so với so sánh bằng R².

## Tổng kết

`STEYX` đo mức sai lệch điển hình giữa giá trị dự đoán từ mô hình hồi quy và giá trị thực tế, tính theo đúng đơn vị của biến phụ thuộc — bổ sung cho `RSQ` ở góc nhìn cụ thể hơn nhiều so với con số phần trăm trừu tượng. Cộng trừ một lần `STEYX` quanh một dự đoán cho ra một khoảng ước lượng thô, trung thực hơn việc chỉ đưa ra đúng một con số.

Đây là bài thứ tư trong cụm 5 bài về hồi quy tuyến tính. Bài cuối cùng mở rộng sang trường hợp có nhiều hơn một biến ảnh hưởng cùng lúc — xem [LINEST: hồi quy tuyến tính đa biến bằng một công thức mảng](/blog/ham-linest-hoi-quy-da-bien). Xem lại từ đầu: [CORREL](/blog/ham-correl-do-tuong-quan-giua-hai-bien), [SLOPE và INTERCEPT](/blog/ham-slope-intercept-phuong-trinh-hoi-quy-tuyen-tinh), [RSQ](/blog/ham-rsq-r-binh-phuong-do-do-khop-mo-hinh).
