---
tieu_de: "VAR.P, VAR.S: cùng khái niệm tổng thể và mẫu, áp dụng cho phương sai"
slug: "ham-var-p-var-s-tong-the-va-mau"
danh_muc: "Excel"
the: ["VAR.P", "VAR.S", "hàm thống kê"]
mo_ta: "VAR.P và VAR.S tính phương sai theo đúng khái niệm tổng thể và mẫu như STDEV.P/STDEV.S — thực chất VAR chính là STDEV trước khi khai căn, nên chọn sai loại cũng dẫn tới cùng một sai lệch khái niệm."
tu_khoa: "hàm VAR.P Excel, ham VAR.S Excel, phuong sai tong the va mau, quan he VAR STDEV"
anh_bia: "/images/bai-viet/ham-var-p-var-s/cover.png"
thu_muc_anh: "ham-var-p-var-s"
trang_thai: "draft"
---

Bài trước, [STDEV.P, STDEV.S](/blog/ham-stdev-p-stdev-s-tong-the-va-mau) chọn công thức độ lệch chuẩn theo khái niệm tổng thể/mẫu. `VAR.P` và `VAR.S` áp dụng đúng khái niệm đó cho phương sai — và giống hệt quan hệ giữa `VARA`/`STDEVA` [đã nói ở lô trước](/blog/ham-vara-phuong-sai-tinh-ca-van-ban-va-luan-ly), phương sai chính là độ lệch chuẩn trước khi khai căn.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=VAR.S(so1, [so2], ...)
=VAR.P(so1, [so2], ...)
```

{{anh:vp-01-cu-phap-co-ban}}

`VAR.S` (mẫu) là tên mới của `VAR` cũ. `VAR.P` (tổng thể) là tên mới của `VARP` cũ — cùng cặp tên gọi `.S`/`.P` như `STDEV.S`/`STDEV.P`.

## Quan hệ trực tiếp: VAR chính là STDEV bình phương

```excel
=VAR.P(80,85,90,95,100)
=STDEV.P(80,85,90,95,100)^2
```

{{anh:vp-02-quan-he-var-stdev}}

Cả hai công thức đều cho `50,00` — `VAR.P` luôn bằng bình phương của `STDEV.P` trên cùng dữ liệu, đúng bản chất toán học của hai đại lượng này. Quan hệ tương tự cũng đúng giữa `VAR.S` và `STDEV.S`.

## Cùng câu hỏi cốt lõi: tổng thể hay mẫu

{{anh:vp-03-cung-cau-hoi-cot-loi}}

Áp dụng đúng quy tắc đã nói ở bài `STDEV.P`/`STDEV.S`: dữ liệu là toàn bộ đối tượng cần khảo sát → `VAR.P`; dữ liệu chỉ là một mẫu đại diện → `VAR.S`. Không có quy tắc nào khác biệt thêm khi chuyển từ độ lệch chuẩn sang phương sai.

## Ví dụ: cùng dữ liệu, hai kết quả khác nhau

```excel
=VAR.P(80,85,90,95,100)
=VAR.S(80,85,90,95,100)
```

{{anh:vp-04-vi-du-tinh-toan}}

`VAR.P` cho `50,00`. `VAR.S` cho `62,50` — chênh lệch giữa hai kết quả này (`62,5/50=1,25` lần) tương ứng đúng bằng bình phương của tỷ lệ chênh lệch giữa `STDEV.S` và `STDEV.P` (`7,91/7,07≈1,12`, và `1,12²≈1,25`) — vì phương sai luôn khuếch đại chênh lệch tương đối mạnh hơn độ lệch chuẩn, đúng bản chất phép bình phương.

## Khi nào nên dùng VAR trực tiếp thay vì bình phương STDEV

```excel
=VAR.S(A2:A50)
```

{{anh:vp-05-khi-nao-dung-var-truc-tiep}}

Nếu công thức tiếp theo cần dùng trực tiếp phương sai (ví dụ trong phân tích ANOVA hay các phép kiểm định thống kê ghép nối nhiều bước), dùng thẳng `VAR.S`/`VAR.P` chính xác hơn và tránh sai số làm tròn nhỏ có thể phát sinh khi tự bình phương một kết quả `STDEV` đã làm tròn hiển thị.

## Tổng kết

`VAR.P` và `VAR.S` tính phương sai theo đúng khái niệm tổng thể/mẫu như `STDEV.P`/`STDEV.S` — về bản chất là bình phương của cặp hàm đó. Không có quy tắc chọn lựa nào khác biệt thêm ngoài câu hỏi cốt lõi: dữ liệu đang có là toàn bộ hay chỉ một phần.

Đọc tiếp trong cùng cụm bài: [PERCENTILE.INC, PERCENTILE.EXC — hai cách định nghĩa phân vị, khác nhau ở việc có tính luôn giá trị nhỏ nhất và lớn nhất hay không](/blog/ham-percentile-inc-exc-hai-cach-dinh-nghia-phan-vi).
