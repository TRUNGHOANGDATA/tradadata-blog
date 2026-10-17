---
tieu_de: "Remove Duplicates: xoá dữ liệu trùng lặp, và vì sao nên kiểm trước khi xoá"
slug: "xoa-du-lieu-trung-lap-trong-excel-remove-duplicates"
danh_muc: "Excel"
the: ["Remove Duplicates", "công cụ dữ liệu"]
mo_ta: "Remove Duplicates xoá vĩnh viễn các dòng trùng lặp chỉ trong một cú nhấp — nhưng 'trùng' được tính theo đúng những cột bạn chọn, không phải toàn bộ dòng. Nên đếm và xem trước bằng COUNTIF hoặc Conditional Formatting trước khi xoá thật."
tu_khoa: "Remove Duplicates Excel, xoa du lieu trung lap, xoa dong trung Excel, dem so lan trung COUNTIF, kiem tra trung lap truoc khi xoa"
anh_bia: "/images/bai-viet/remove-duplicates/cover.png"
thu_muc_anh: "remove-duplicates"
trang_thai: "draft"
---

Một danh sách khách hàng bị nhập trùng vài dòng do dán dữ liệu nhiều lần, hay một cột mã đơn hàng lặp vì lỗi đồng bộ. `Remove Duplicates` là công cụ có sẵn để dọn việc này — nhưng nó xoá **vĩnh viễn** và dễ hiểu sai "trùng" nghĩa là gì nếu không đọc kỹ hộp thoại.

## Cách dùng: chọn đúng những cột cần so khớp

Vào `Data → Remove Duplicates`. Excel hiện hộp thoại liệt kê tất cả các cột, mỗi cột có một ô tick:

{{anh:rd-01-hop-thoai}}

Đây là bước quan trọng nhất: **chỉ những cột được tick mới được dùng để xét trùng.** Nếu bạn chỉ tick cột "Email" mà bỏ tick "Tên", "Số điện thoại", Excel sẽ coi hai dòng là trùng chỉ vì email giống nhau — dù họ tên và số điện thoại ở hai dòng đó khác hẳn.

## "Trùng" theo cột đã chọn, không phải toàn dòng

Đây là điểm dễ hiểu lầm nhất, vì trực giác của nhiều người là "trùng nghĩa là y hệt nhau toàn bộ":

{{anh:rd-02-tick-cot-nao}}

Ba dòng có tên khác nhau nhưng cùng email → nếu chỉ tick cột Email, Excel giữ lại **đúng một dòng** trong số ba, xoá hai dòng còn lại — kể cả khi tên trên hai dòng bị xoá đó có thể là thông tin đúng cần giữ. Luôn tick đủ mọi cột cần đối chiếu, không chỉ tick cột "trông có vẻ đại diện".

## Excel giữ lại dòng nào khi xoá trùng

Khi nhiều dòng trùng nhau, `Remove Duplicates` **giữ lại dòng xuất hiện đầu tiên** (tính từ trên xuống) và xoá các dòng trùng phía sau. Nếu dữ liệu của bạn cần giữ bản **mới nhất** thay vì bản đầu tiên (ví dụ giữ đơn hàng cập nhật gần nhất), cần sắp xếp dữ liệu theo ngày trước, rồi mới chạy Remove Duplicates.

## Đếm trước khi xoá: đừng để công cụ "âm thầm" xoá mất dữ liệu

Vì thao tác này **không thể hoàn tác dễ dàng** sau khi lưu file, nên kiểm tra trước là bước không nên bỏ qua. Cách nhanh nhất: dùng [COUNTIF](/blog/ham-countif-va-countifs-dem-du-lieu-co-dieu-kien-trong-excel) để đếm xem mỗi giá trị xuất hiện bao nhiêu lần:

```excel
=COUNTIF(A:A,A2)
```

{{anh:rd-03-dem-truoc-khi-xoa}}

Cột kết quả lớn hơn `1` nghĩa là dòng đó có bản sao ở đâu đó trong cột. Xem qua danh sách này trước, chắc chắn hiểu rõ **cái gì sẽ bị xoá**, rồi mới chạy `Remove Duplicates` thật.

Muốn nhìn trực quan hơn bằng màu sắc thay vì đọc số, đánh dấu trùng lặp bằng [Conditional Formatting](/blog/conditional-formatting-trong-excel-to-mau-du-lieu-tu-dong) với công thức tương tự trước khi xoá.

## Đếm số giá trị không trùng lặp mà không cần xoá gì

Nếu mục đích chỉ là **biết có bao nhiêu giá trị khác nhau**, không cần xoá dòng nào cả, có một công thức gọn hơn nhiều so với việc xoá rồi đếm lại:

```excel
=SUMPRODUCT(1/COUNTIF(A2:A10,A2:A10))
```

Công thức này giữ nguyên dữ liệu gốc, chỉ trả về một con số — an toàn hơn hẳn khi bạn chưa chắc có nên xoá hay không.

## Excel Table tự cảnh báo trùng lặp

Nếu dữ liệu đã nằm trong một [Excel Table](/blog/excel-table-va-tham-chieu-theo-ten-cot), nút `Remove Duplicates` cũng có sẵn ngay trên tab `Table Design` — không cần chuyển qua tab `Data`, và vùng dữ liệu luôn được nhận diện đúng, không sợ chọn thiếu vài dòng cuối.

## Kiểm nhanh trên máy bạn

- Tạo một cột có vài giá trị lặp lại, đếm bằng `COUNTIF` trước, ghi nhớ dòng nào sẽ bị xoá, rồi mới chạy `Remove Duplicates` để đối chiếu kết quả có đúng như dự đoán không.
- Thử tick thiếu một cột quan trọng khi xoá trùng, xem hậu quả — rồi `Ctrl+Z` ngay để hoàn tác lại (chỉ hoàn tác được nếu chưa đóng file hoặc thao tác gì khác sau đó).
