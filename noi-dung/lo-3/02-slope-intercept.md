---
tieu_de: "SLOPE và INTERCEPT: tự tay dựng phương trình hồi quy tuyến tính"
slug: "ham-slope-intercept-phuong-trinh-hoi-quy-tuyen-tinh"
danh_muc: "Excel"
the: ["SLOPE", "INTERCEPT", "hồi quy tuyến tính", "phân tích dữ liệu"]
mo_ta: "Cách dùng SLOPE và INTERCEPT để dựng phương trình đường thẳng y = mx + b từ dữ liệu thực tế, và cách đọc đúng ý nghĩa của độ dốc khi dự đoán một giá trị mới."
tu_khoa: "hàm SLOPE Excel, hàm INTERCEPT Excel, phương trình hồi quy tuyến tính, y = mx + b Excel, độ dốc đường thẳng"
anh_bia: "/images/bai-viet/ham-slope-intercept/cover.png"
thu_muc_anh: "ham-slope-intercept"
trang_thai: "draft"
---

Bài trước đã dùng `CORREL` để biết chi phí quảng cáo và doanh thu có quan hệ chặt chẽ với nhau. Nhưng `CORREL` chỉ trả lời "chặt tới đâu" — nó không cho biết chính xác: **chi thêm 1 triệu đồng quảng cáo thì doanh thu tăng thêm bao nhiêu?**

Câu hỏi đó cần một phương trình cụ thể, dạng đường thẳng quen thuộc từ thời phổ thông: `y = mx + b`. Trong Excel, hai hàm `SLOPE` (tính `m` — độ dốc) và `INTERCEPT` (tính `b` — điểm cắt trục tung) dựng ra chính xác phương trình đó từ dữ liệu thực tế, mà không cần vẽ biểu đồ hay tính tay.

Công thức viết bằng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Bộ dữ liệu dùng trong bài

Vẫn dùng dữ liệu chi phí quảng cáo (cột B) và doanh thu (cột C) của 6 tháng như bài trước.

{{anh:si-01-du-lieu}}

## SLOPE — độ dốc của đường thẳng khớp nhất

```excel
=SLOPE(known_ys, known_xs)
```

Chú ý thứ tự tham số: **`y` (biến phụ thuộc, kết quả cần dự đoán) đứng trước, `x` (biến độc lập, biến đưa vào để dự đoán) đứng sau.** Đây là thứ tự ngược lại so với cách người ta quen viết trên giấy (`y` phụ thuộc `x` nhưng `x` thường viết trước), và là lỗi nhập liệu phổ biến nhất khi mới dùng `SLOPE` — đảo ngược hai vùng dữ liệu vẫn ra một con số, chỉ là con số sai.

```excel
=SLOPE(C2:C7, B2:B7)
```

{{anh:si-02-slope}}

Kết quả xấp xỉ **8,11**. Đây chính là độ dốc `m` của đường thẳng khớp nhất với dữ liệu — Excel tìm ra đường thẳng sao cho tổng bình phương khoảng cách từ mọi điểm dữ liệu tới đường đó là nhỏ nhất, gọi là phương pháp bình phương tối thiểu (least squares).

## Đọc đúng ý nghĩa của độ dốc

Con số `8,11` không phải một con số trừu tượng — nó có đơn vị và ý nghĩa thực tế cụ thể: **cứ tăng thêm 1 triệu đồng chi phí quảng cáo, doanh thu dự kiến tăng thêm khoảng 8,11 triệu đồng**, dựa trên xu hướng quan sát được từ 6 tháng dữ liệu này.

Đây là ý nghĩa quan trọng nhất của `SLOPE`, và cũng là lý do nó hữu ích hơn `CORREL` khi cần đưa ra quyết định cụ thể: `CORREL` chỉ nói "có liên quan chặt", còn `SLOPE` nói "liên quan theo tỷ lệ nào" — con số dùng được ngay để ước tính, ví dụ để trả lời câu hỏi "nếu tăng ngân sách quảng cáo thêm 5 triệu, doanh thu dự kiến tăng thêm bao nhiêu".

## INTERCEPT — điểm xuất phát của đường thẳng

```excel
=INTERCEPT(known_ys, known_xs)
```

Cùng thứ tự tham số như `SLOPE`: `y` trước, `x` sau.

```excel
=INTERCEPT(C2:C7, B2:B7)
```

{{anh:si-03-intercept}}

Kết quả xấp xỉ **35,74**. Đây là giá trị `b` trong phương trình `y = mx + b` — điểm mà đường thẳng cắt trục tung, tức là giá trị dự đoán của `y` khi `x` bằng `0`.

Với ví dụ này: nếu chi phí quảng cáo bằng `0`, mô hình dự đoán doanh thu vẫn ở mức khoảng 35,74 triệu đồng — phần doanh thu không đến từ quảng cáo, có thể tới từ khách hàng quen, tìm kiếm tự nhiên, hoặc các kênh khác không nằm trong dữ liệu đưa vào.

## Ghép lại thành một phương trình hoàn chỉnh

Kết hợp hai kết quả trên, phương trình hồi quy tuyến tính cho dữ liệu này là:

```
Doanh thu ≈ 8,11 × Chi phí quảng cáo + 35,74
```

{{anh:si-04-phuong-trinh}}

Dùng phương trình này để dự đoán cho một giá trị chi phí quảng cáo mới, ví dụ 22 triệu đồng:

```excel
=SLOPE(C2:C7, B2:B7) * 22 + INTERCEPT(C2:C7, B2:B7)
```

Kết quả xấp xỉ **214,1** triệu đồng doanh thu dự kiến.

Excel cũng có hàm `TREND` làm việc này gọn hơn — tính thẳng ra giá trị `y` dự đoán mà không cần ghép `SLOPE` và `INTERCEPT` bằng tay — nhưng dựng phương trình tường minh theo cách này có lợi ích riêng: nhìn thấy được cả độ dốc lẫn điểm xuất phát, dễ giải thích cho người khác, và không phụ thuộc vào việc x đưa vào có nằm trong phạm vi dữ liệu gốc hay không.

## Cảnh báo khi dự đoán ra ngoài phạm vi dữ liệu

Đây là cái bẫy dễ mắc nhất khi dùng phương trình hồi quy để dự đoán: dữ liệu gốc chỉ có chi phí quảng cáo từ 10 đến 25 triệu đồng. Phương trình khớp tốt trong khoảng đó, nhưng **không có gì đảm bảo** quan hệ tuyến tính này vẫn đúng khi đưa vào một giá trị nằm ngoài phạm vi đã quan sát, ví dụ 200 triệu đồng.

{{anh:si-05-ngoai-pham-vi}}

Thực tế, quan hệ giữa chi phí quảng cáo và doanh thu gần như luôn có điểm bão hoà — chi tiêu quá nhiều vượt một ngưỡng nào đó, doanh thu tăng thêm sẽ chậm dần chứ không tiếp tục tăng đều theo đúng độ dốc `8,11` mãi mãi. Dùng phương trình hồi quy để **nội suy** (dự đoán giá trị nằm trong phạm vi dữ liệu đã có) an toàn hơn nhiều so với **ngoại suy** (dự đoán giá trị nằm ngoài phạm vi đó). Càng đi xa khỏi phạm vi dữ liệu gốc, độ tin cậy của dự đoán càng giảm, dù công thức vẫn cho ra một con số trông có vẻ hợp lý.

## Tổng kết

`SLOPE` và `INTERCEPT` cùng dựng nên phương trình `y = mx + b` khớp nhất với dữ liệu quan sát được, theo phương pháp bình phương tối thiểu. Nhớ đúng thứ tự tham số — `y` trước, `x` sau — vì đảo ngược vẫn ra kết quả, chỉ là kết quả sai mà không báo lỗi gì.

Phương trình dựng được rất hữu ích để nội suy trong phạm vi dữ liệu đã có, nhưng cần thận trọng khi dùng để ngoại suy ra ngoài phạm vi đó — quan hệ tuyến tính quan sát được trong một khoảng giá trị không đảm bảo còn đúng khi đi xa khỏi khoảng đó.

Đọc tiếp trong cùng cụm bài: phương trình vừa dựng khớp với dữ liệu thực tế tới đâu? Xem [RSQ: R² đo được bao nhiêu phần trăm biến thiên mô hình giải thích được](/blog/ham-rsq-r-binh-phuong-do-do-khop-mo-hinh). Quay lại bước đo mức độ liên hệ ở [CORREL: đo mức độ tương quan giữa hai biến](/blog/ham-correl-do-tuong-quan-giua-hai-bien).
