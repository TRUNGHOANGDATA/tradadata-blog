---
tieu_de: "Evaluate Formula: xem Excel tính một công thức lồng nhau từng bước một"
slug: "danh-gia-cong-thuc-tung-buoc-evaluate-formula-trong-excel"
danh_muc: "Excel"
the: ["Evaluate Formula", "kiểm tra công thức"]
mo_ta: "Một công thức lồng năm sáu hàm ra kết quả sai, nhưng không biết sai ở khâu nào. Evaluate Formula tách công thức đó ra thành từng bước tính nhỏ, cho xem chính xác giá trị trung gian ở mỗi bước — không cần tự bấm máy tính tay để dò."
tu_khoa: "Evaluate Formula Excel, danh gia cong thuc tung buoc, kiem tra cong thuc long nhau, F9 xem gia tri trung gian, debug cong thuc Excel"
anh_bia: "/images/bai-viet/evaluate-formula/cover.png"
thu_muc_anh: "evaluate-formula"
trang_thai: "draft"
---

Một công thức như `=IF(VLOOKUP(A2,Bang,2,FALSE)>AVERAGE(C:C),"Cao","Thấp")` ra kết quả sai, nhưng lỗi nằm ở đâu — `VLOOKUP` tra sai, `AVERAGE` tính sai vùng, hay điều kiện so sánh sai? `Evaluate Formula` tách công thức thành từng bước tính nhỏ, cho xem đúng giá trị Excel tính ra ở mỗi bước, thay vì phải tự đoán.

## Mở công cụ và bắt đầu từng bước

Chọn ô chứa công thức cần kiểm tra, vào `Formulas → Evaluate Formula`:

{{anh:ef-01-mo-hop-thoai}}

Hộp thoại hiện nguyên văn công thức, với phần **sắp được tính tiếp theo** gạch chân. Bấm `Evaluate` để Excel thay phần gạch chân đó bằng kết quả thật của nó, rồi lộ ra phần kế tiếp cần tính — cứ thế bấm `Evaluate` liên tục cho tới khi ra kết quả cuối cùng.

## Đi từ trong ra ngoài, giống cách Excel thật sự tính

Với công thức lồng nhiều lớp, Excel luôn tính **hàm trong cùng trước**, rồi mới tính tới hàm bọc ngoài:

{{anh:ef-02-tung-buoc}}

Bước đầu, `VLOOKUP(A2,Bang,2,FALSE)` được thay bằng giá trị nó tra ra được — ví dụ `85`. Bước tiếp, `AVERAGE(C:C)` được thay bằng con số trung bình thật — ví dụ `70`. Đến đây công thức chỉ còn `IF(85>70,"Cao","Thấp")`, dễ nhìn ra ngay kết quả sẽ là `"Cao"`. Nhìn thấy từng con số trung gian như vậy giúp xác định chính xác **bước nào** đang cho ra giá trị không như mong đợi, thay vì đoán mò cả cụm công thức dài.

## So với chọn một phần công thức rồi bấm F9

Có một mẹo nhanh hơn cho việc kiểm tra đơn giản: bôi đen đúng phần công thức muốn xem (ví dụ chỉ bôi đen `VLOOKUP(A2,Bang,2,FALSE)` ngay trong thanh công thức), rồi bấm `F9` — Excel hiển thị ngay kết quả của riêng phần đó:

{{anh:ef-03-f9-vs-evaluate}}

- **F9 trên phần bôi đen**: nhanh, tiện cho kiểm tra nhanh một phần bất kỳ, nhưng phải nhớ bấm `Esc` sau đó để **không lưu nhầm** giá trị tĩnh đè lên công thức gốc.
- **Evaluate Formula**: chậm hơn một chút vì phải bấm từng bước, nhưng an toàn tuyệt đối — không có rủi ro làm hỏng công thức gốc, và đi qua đúng trình tự Excel thực sự tính.

Với công thức quan trọng không muốn lỡ tay sửa hỏng, `Evaluate Formula` là lựa chọn an toàn hơn.

## Bấm Step In để lặn sâu vào một tham chiếu

Nếu bước hiện tại tham chiếu tới một **ô khác cũng chứa công thức**, nút `Step In` cho phép lặn thẳng vào công thức của ô đó để xem nó tính ra sao, rồi `Step Out` để quay lại công thức ban đầu. Cách này hữu ích khi lỗi không nằm trong chính công thức bạn đang xem, mà nằm ở một ô nó tham chiếu tới.

## Khác Watch Window ở điểm nào

Hai công cụ dễ nhầm vì đều dùng để "xem bên trong" công thức:

- [**Watch Window**](/blog/watch-window-theo-doi-o-o-xa-khong-can-cuon-qua-lai) theo dõi **giá trị cuối cùng** của một hay nhiều ô, liên tục, dù bạn đang làm gì ở nơi khác trong file.
- **Evaluate Formula** mổ xẻ **cách một công thức cụ thể đi đến kết quả đó**, từng bước tính một, chỉ áp dụng cho đúng ô đang mở.

Dùng Watch Window để theo dõi "kết quả này có đổi không khi tôi sửa chỗ khác", dùng Evaluate Formula để tìm "chính xác công thức này đang tính sai ở đâu".

## Kiểm nhanh trên máy bạn

- Viết một công thức lồng ba hàm trở lên, mở `Evaluate Formula` và bấm `Evaluate` liên tục để xem từng giá trị trung gian hiện ra.
- Thử mẹo `F9` trên một phần bôi đen của công thức, nhớ bấm `Esc` ngay sau khi xem xong để không làm hỏng công thức gốc.
