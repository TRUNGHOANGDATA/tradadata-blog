---
tieu_de: "ISFORMULA và FORMULATEXT: tìm ra ô nào chứa công thức, và hiển thị công thức đó"
slug: "ham-isformula-formulatext-kiem-tra-cong-thuc"
danh_muc: "Excel"
the: ["ISFORMULA", "FORMULATEXT", "kiểm tra công thức", "hàm cơ bản"]
mo_ta: "ISFORMULA kiểm tra một ô có đang chứa công thức hay đã bị gõ đè bằng số cứng. FORMULATEXT hiển thị nguyên văn công thức dưới dạng chữ, dùng để rà soát cả một bảng tính lớn."
tu_khoa: "hàm ISFORMULA Excel, hàm FORMULATEXT, kiểm tra ô có công thức không, hiển thị công thức dạng văn bản, rà soát bảng tính"
anh_bia: "/images/bai-viet/ham-isformula-formulatext/cover.png"
thu_muc_anh: "ham-isformula-formulatext"
trang_thai: "draft"
---

Một trong những lỗi âm thầm nguy hiểm nhất trong bảng tính: một ô từng chứa công thức, nhưng ai đó gõ đè một con số cứng vào — có thể vô tình, có thể để "chốt tạm" một giá trị rồi quên đổi lại. Ô đó vẫn hiển thị số, không báo lỗi gì, nhưng từ giờ không còn tự động cập nhật theo dữ liệu gốc nữa. `ISFORMULA` và `FORMULATEXT` là hai công cụ cơ bản nhất để rà soát và phát hiện đúng loại lỗi này.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## ISFORMULA — ô này có đang chứa công thức không

```excel
=ISFORMULA(reference)
```

{{anh:if2-01-du-lieu}}

```excel
=ISFORMULA(B2)
```

{{anh:if2-02-isformula}}

Trả về `TRUE` nếu ô đang chứa công thức, `FALSE` nếu ô chỉ chứa một giá trị tĩnh — dù giá trị đó là số, chữ, hay bất kỳ kiểu gì. Một ô hiển thị đúng con số cần thiết vẫn có thể `FALSE`, nếu con số đó được gõ tay thay vì tính ra từ công thức.

## Ứng dụng: quét cả một cột để tìm ô đã bị gõ đè công thức

Đây là ứng dụng thực tế quan trọng nhất. Giả sử một cột chứa công thức tính thành tiền (`=Số lượng × Đơn giá`), rà soát xem có dòng nào đã bị gõ đè bằng số cứng hay không:

{{anh:if2-03-quet-ca-cot}}

```excel
=IF(ISFORMULA(D2), "OK — vẫn là công thức", "CẢNH BÁO — đã bị gõ số cứng")
```

{{anh:if2-04-canh-bao}}

Kéo công thức này xuống toàn bộ cột, mọi dòng bị gõ đè công thức bằng số cứng sẽ hiện ra ngay — một cách rà soát nhanh hơn nhiều so với việc bấm vào từng ô để kiểm tra bằng mắt.

## FORMULATEXT — hiển thị nguyên văn công thức dưới dạng chữ

```excel
=FORMULATEXT(reference)
```

```excel
=FORMULATEXT(D2)
```

{{anh:if2-05-formulatext}}

Trả về đúng chuỗi công thức đang nằm trong ô đó — ví dụ `"=B2*C2"` — hiển thị dưới dạng văn bản ở một ô khác. Hữu ích để xây một cột "kiểm tra công thức" cạnh bảng dữ liệu chính, giúp người đọc hoặc người kiểm toán nhìn thấy ngay logic tính toán mà không phải bấm vào từng ô một.

## Kết hợp cả hai: tránh lỗi #N/A khi ô không có công thức

`FORMULATEXT` báo lỗi `#N/A` nếu ô tham chiếu không chứa công thức — đây chính là lý do nên kết hợp với `ISFORMULA` trước khi gọi `FORMULATEXT`:

```excel
=IF(ISFORMULA(D2), FORMULATEXT(D2), "(không có công thức — số cứng)")
```

{{anh:if2-06-ket-hop-ca-hai}}

Công thức này vừa tránh được lỗi `#N/A`, vừa cho biết rõ nguyên nhân: ô không hiện công thức vì nó **không có** công thức nào cả, không phải vì `FORMULATEXT` bị lỗi.

## Ứng dụng: tài liệu hoá một mẫu báo cáo phức tạp

Với các file mẫu dùng đi dùng lại nhiều lần — báo cáo tài chính, bảng tính lương, mô hình dự báo — dựng sẵn một cột `FORMULATEXT` song song với cột công thức thật giúp người dùng sau này hiểu ngay logic tính toán mà không cần bấm vào từng ô, đặc biệt hữu ích khi bàn giao file cho đồng nghiệp hoặc lưu trữ làm tài liệu tham khảo lâu dài.

{{anh:if2-07-tai-lieu-hoa}}

## Tổng kết

`ISFORMULA` trả lời câu hỏi có/không: ô này có đang chứa công thức hay đã bị thay bằng số cứng. `FORMULATEXT` đi xa hơn, hiển thị nguyên văn nội dung công thức dưới dạng chữ để đọc và kiểm tra mà không cần bấm vào từng ô. Kết hợp cả hai để rà soát một bảng tính lớn, phát hiện những chỗ công thức đã âm thầm bị gõ đè — một trong những lỗi khó phát hiện nhất bằng mắt thường.

Đọc tiếp trong cùng cụm bài: [ISREF — kiểm tra một tên có đang trỏ tới tham chiếu thật hay chỉ là một giá trị](/blog/ham-isref-kiem-tra-tham-chieu-hop-le).
