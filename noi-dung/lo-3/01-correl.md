---
tieu_de: "Hàm CORREL: đo mức độ tương quan giữa hai biến, và vì sao tương quan không phải nhân quả"
slug: "ham-correl-do-tuong-quan-giua-hai-bien"
danh_muc: "Excel"
the: ["CORREL", "tương quan", "phân tích dữ liệu", "hồi quy tuyến tính"]
mo_ta: "Cách dùng CORREL để đo mức độ hai biến số di chuyển cùng nhau chặt chẽ tới đâu, đọc đúng khoảng giá trị từ -1 đến 1, và vì sao một hệ số tương quan cao không chứng minh được quan hệ nhân quả."
tu_khoa: "hàm CORREL Excel, hệ số tương quan, tương quan không phải nhân quả, đo mối quan hệ hai biến, correlation coefficient"
anh_bia: "/images/bai-viet/ham-correl/cover.png"
thu_muc_anh: "ham-correl"
trang_thai: "draft"
---

Chi tiêu quảng cáo tăng thì doanh thu có tăng theo không? Số nhân viên bán hàng nhiều hơn có kéo doanh số lên không? Đây là loại câu hỏi rất thường gặp trong công việc, và câu trả lời thường bắt đầu bằng một con số duy nhất: hệ số tương quan, tính bằng hàm `CORREL`.

`CORREL` không phải hàm phức tạp — chỉ một dòng công thức, nhận vào đúng hai vùng dữ liệu. Nhưng đọc đúng con số nó trả về, và biết giới hạn thật sự của con số đó, lại là chuyện khác. Bài này mở đầu cho một cụm 5 bài về hồi quy tuyến tính trong Excel — bắt đầu từ chỗ cơ bản nhất: đo xem hai biến có "đi cùng nhau" hay không.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Bộ dữ liệu dùng trong bài

Dữ liệu chi phí quảng cáo và doanh thu của 6 tháng, đơn vị triệu đồng. Bộ số liệu này sẽ dùng xuyên suốt cả 5 bài trong cụm.

{{anh:cr-01-du-lieu}}

## Cú pháp và cách đọc kết quả

```excel
=CORREL(B2:B7, C2:C7)
```

Hai vùng dữ liệu phải có cùng số lượng giá trị, và giá trị tương ứng phải cùng nằm trên một dòng — dòng nào là chi phí quảng cáo của tháng đó thì dòng đó cũng phải là doanh thu của đúng tháng đó, không được lệch dòng.

{{anh:cr-02-cong-thuc}}

Kết quả xấp xỉ **0,996**. `CORREL` luôn trả về một số nằm trong khoảng từ `-1` đến `1`, và cách đọc con số này cố định:

- **Gần `1`**: hai biến tăng cùng nhau rất chặt chẽ — biến này tăng thì biến kia gần như chắc chắn cũng tăng.
- **Gần `-1`**: hai biến di chuyển ngược chiều chặt chẽ — biến này tăng thì biến kia có xu hướng giảm.
- **Gần `0`**: gần như không có mối liên hệ tuyến tính nào giữa hai biến.

Với kết quả `0,996` ở ví dụ trên, chi phí quảng cáo và doanh thu của 6 tháng này gắn với nhau rất chặt — gần như đi theo một đường thẳng.

{{anh:cr-03-doc-ket-qua}}

## Không có ngưỡng "đủ mạnh" cố định

Một câu hỏi rất tự nhiên: `0,996` là mạnh, vậy `0,5` có coi là mạnh không? `0,3` thì sao?

Không có một con số ngưỡng đúng cho mọi trường hợp — mức độ "đủ mạnh" phụ thuộc vào lĩnh vực đang phân tích. Trong các ngành khoa học tự nhiên nơi phép đo chính xác, hệ số tương quan dưới `0,7` đã bị coi là yếu. Trong các bài toán liên quan tới hành vi con người — doanh số, tâm lý khách hàng, hiệu quả marketing — một hệ số `0,4` đến `0,6` nhiều khi đã được coi là đáng chú ý, vì hành vi con người vốn dĩ nhiễu và khó dự đoán tuyệt đối. Đọc con số `CORREL` luôn cần đặt trong ngữ cảnh của loại dữ liệu đang xét, không so nó với một mốc cứng nhắc.

## CORREL chỉ bắt được quan hệ tuyến tính

Đây là giới hạn kỹ thuật quan trọng nhất của `CORREL`, và nó khiến hàm này có thể đưa ra kết luận sai nếu dùng không đúng chỗ: `CORREL` chỉ đo được mối quan hệ dạng **đường thẳng**. Hai biến có quan hệ rất chặt chẽ nhưng theo dạng đường cong — ví dụ một đường parabol hoàn hảo — vẫn có thể cho ra `CORREL` gần `0`, vì khi trung bình cả hai nửa lên và xuống của đường cong lại, xu hướng tuyến tính tổng thể triệt tiêu lẫn nhau.

{{anh:cr-04-quan-he-phi-tuyen}}

Nói cách khác, `CORREL` trả về `0` không có nghĩa là "hai biến này không liên quan gì tới nhau" — nó chỉ có nghĩa là "không có mối quan hệ theo đường thẳng". Trước khi kết luận, luôn nên vẽ biểu đồ phân tán (scatter chart) của hai biến để nhìn bằng mắt xem dữ liệu có hình dạng đường cong hay không, thay vì chỉ tin vào một con số duy nhất.

## Tương quan không chứng minh được nhân quả

Đây là điều quan trọng nhất cần nhớ khi trình bày kết quả `CORREL` cho người khác, và cũng là lỗi suy luận phổ biến nhất khi dùng số liệu để ra quyết định.

`CORREL` cho biết hai biến di chuyển cùng nhau tới đâu — nó **không** cho biết biến này có phải là **nguyên nhân** làm biến kia thay đổi hay không. Ba khả năng luôn cần cân nhắc khi thấy một hệ số tương quan cao:

1. **A thật sự gây ra B.** Chi phí quảng cáo tăng thật sự kéo doanh thu tăng theo.
2. **B thật sự gây ra A**, chiều ngược lại với suy đoán ban đầu. Ví dụ doanh thu tháng trước cao khiến công ty có ngân sách rộng rãi hơn để chi cho quảng cáo tháng sau — tức là doanh thu ảnh hưởng ngược lại tới ngân sách quảng cáo.
3. **Một biến thứ ba** tác động lên cả hai, khiến chúng trông như liên quan trực tiếp dù không phải vậy. Ví dụ mùa cao điểm mua sắm (Tết, khuyến mãi lớn) vừa khiến công ty chi mạnh tay cho quảng cáo, vừa khiến khách hàng tự nhiên mua nhiều hơn — hai biến tăng cùng lúc không phải vì cái này gây ra cái kia, mà vì cùng chịu ảnh hưởng của mùa vụ.

Kết luận "quảng cáo làm tăng doanh thu" từ mỗi con số `CORREL` là một bước nhảy suy luận, không phải một kết quả mà công thức đã chứng minh. Muốn khẳng định quan hệ nhân quả cần tới các phương pháp thiết kế thử nghiệm chặt chẽ hơn — nằm ngoài phạm vi một hàm Excel.

## Tổng kết

`CORREL` đo mức độ hai biến di chuyển cùng nhau theo quan hệ đường thẳng, trả về một số từ `-1` đến `1`. Đọc con số này cần nhớ hai giới hạn: nó không bắt được quan hệ dạng đường cong, và một con số cao — dù cao tới đâu — không tự nó chứng minh được biến này là nguyên nhân của biến kia.

Đây mới là bước đo mức độ liên hệ. Bước tiếp theo, dựng ra chính xác phương trình mô tả mối quan hệ đó, xem tại [SLOPE và INTERCEPT: tự tay dựng phương trình hồi quy tuyến tính](/blog/ham-slope-intercept-phuong-trinh-hoi-quy-tuyen-tinh).
