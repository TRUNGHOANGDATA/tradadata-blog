---
tieu_de: "FREQUENCY: đếm số lượng rơi vào từng khoảng, dựng phân phối dữ liệu chỉ bằng một công thức"
slug: "ham-frequency-dem-phan-phoi-du-lieu"
danh_muc: "Excel"
the: ["FREQUENCY", "hàm thống kê"]
mo_ta: "FREQUENCY đếm số lượng giá trị rơi vào từng khoảng do bạn tự định nghĩa, cho ra một phân phối tần suất chỉ với một công thức mảng — thay vì phải viết COUNTIFS riêng cho từng khoảng một cách thủ công."
tu_khoa: "hàm FREQUENCY Excel, phan phoi tan suat Excel, dem so luong theo khoang, cong thuc mang FREQUENCY"
anh_bia: "/images/bai-viet/ham-frequency/cover.png"
thu_muc_anh: "ham-frequency"
trang_thai: "draft"
---

Bài trước, [UNICHAR](/blog/ham-unichar-chen-ky-tu-dac-biet) chèn ký tự đặc biệt. `FREQUENCY` chuyển hẳn sang thống kê — đếm số lượng giá trị rơi vào từng khoảng, dựng ra một bảng phân phối tần suất chỉ với một công thức duy nhất.

## Cú pháp

```excel
=FREQUENCY(mang_du_lieu, mang_khoang)
```

{{anh:fr-01-cu-phap-co-ban}}

`mang_khoang` khai các mốc trên của từng khoảng — Excel tự hiểu khoảng đầu là "nhỏ hơn hoặc bằng mốc thứ nhất", các khoảng giữa là "lớn hơn mốc trước, nhỏ hơn hoặc bằng mốc này", và luôn có thêm một khoảng cuối "lớn hơn mốc lớn nhất" mà không cần khai riêng.

## Ứng dụng: phân phối điểm thi vào các khoảng xếp loại

`10` học sinh với điểm thi cho trước, muốn biết có bao nhiêu bài rơi vào từng khoảng `≤59`, `60-69`, `70-79`, `80-89`, `>89`:

```excel
=FREQUENCY(A2:A11,{59,69,79,89})
```

{{anh:fr-02-phan-phoi-diem-thi}}

Với dữ liệu điểm `45, 67, 72, 88, 91, 55, 78, 82, 95, 60`, kết quả trả về `2, 2, 2, 2, 2` — mỗi khoảng đều có đúng `2` bài thi, cho thấy điểm số phân bố khá đều qua các mức.

## Cách nhập: công thức mảng, kết quả tràn ra nhiều ô

Trên các phiên bản Excel có mảng động, chỉ cần gõ công thức vào một ô rồi `Enter`, kết quả tự tràn xuống đúng số ô bằng số khoảng cộng thêm `1` (khoảng cuối luôn tự động có thêm). Trên bản Excel cũ hơn, cần chọn trước đúng số ô đó rồi nhấn `Ctrl+Shift+Enter`:

{{anh:fr-03-nhap-cong-thuc-mang}}

Chọn thiếu số ô sẽ làm mất phần kết quả cuối — đây là lỗi thường gặp nhất với `FREQUENCY` trên Excel bản cũ, giống lỗi từng nói ở bài [TRANSPOSE](/blog/ham-transpose-hoan-doi-hang-cot).

## Vì sao không dùng nhiều công thức COUNTIFS thay thế

Có thể đếm từng khoảng bằng `COUNTIFS` riêng lẻ, nhưng phải viết lại công thức cho mỗi khoảng và tự tay xử lý ranh giới trên dưới:

```excel
=COUNTIFS(A2:A11,"<=59")
=COUNTIFS(A2:A11,">59",A2:A11,"<=69")
```

{{anh:fr-04-so-sanh-countifs}}

`FREQUENCY` chỉ cần một công thức duy nhất cho toàn bộ các khoảng, tự động xử lý đúng ranh giới trên dưới mà không cần lặp lại điều kiện `">"`/`"<="` cho từng cặp mốc.

## Lưu ý: bỏ qua ô trống và văn bản, chỉ đếm số

```excel
=FREQUENCY(A2:A12,{59,69,79,89})
```

{{anh:fr-05-bo-qua-o-trong-va-text}}

Nếu vùng dữ liệu lẫn cả ô trống hoặc ô chứa văn bản (ví dụ ghi chú `"Vắng thi"` thay vì điểm số), `FREQUENCY` tự động bỏ qua các ô đó khi đếm, không báo lỗi và cũng không tính nhầm chúng vào bất kỳ khoảng nào — chỉ những ô thực sự chứa số mới được tính.

## Tổng kết

`FREQUENCY` đếm số lượng giá trị rơi vào từng khoảng tự định nghĩa, dựng ra một phân phối tần suất chỉ với một công thức, tự động xử lý đúng ranh giới trên dưới mà không cần lặp lại điều kiện cho từng khoảng như dùng nhiều `COUNTIFS` riêng lẻ.

Đây là bài cuối trong cụm 5 bài lô 14, bắt đầu từ [IMAGE](/blog/ham-image-chen-anh-vao-o).
