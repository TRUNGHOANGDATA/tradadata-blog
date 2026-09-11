---
tieu_de: "VARA: phương sai, chính là STDEVA trước khi khai căn"
slug: "ham-vara-phuong-sai-tinh-ca-van-ban-va-luan-ly"
danh_muc: "Excel"
the: ["VARA", "hàm thống kê"]
mo_ta: "VARA tính phương sai theo đúng quy tắc quy đổi văn bản và luận lý như STDEVA — thực chất VARA chính là bình phương của STDEVA, chỉ khác bước khai căn cuối cùng. Cùng cái bẫy thổi phồng kết quả khi dữ liệu lẫn ô văn bản."
tu_khoa: "hàm VARA Excel, VARA khac VAR, phuong sai tinh ca van ban, quan he VARA STDEVA"
anh_bia: "/images/bai-viet/ham-vara/cover.png"
thu_muc_anh: "ham-vara"
trang_thai: "draft"
---

Bài trước, [STDEVA](/blog/ham-stdeva-do-lech-chuan-tinh-ca-van-ban-va-luan-ly) tính độ lệch chuẩn theo quy tắc quy đổi văn bản/luận lý. `VARA` là hàm cuối cùng trong họ này — tính **phương sai**, và về bản chất chỉ là `STDEVA` dừng lại một bước trước khi khai căn.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=VARA(gia_tri1, [gia_tri2], ...)
```

{{anh:va-01-cu-phap-co-ban}}

Cùng quy tắc quy đổi: `TRUE`=`1`, `FALSE`=`0`, mọi văn bản=`0`. `VARA` là phiên bản mẫu (sample), tương ứng với `VAR`.

## Quan hệ trực tiếp: VARA chính là STDEVA bình phương

```excel
=VARA(80,85,90,"Chưa chấm")
=STDEVA(80,85,90,"Chưa chấm")^2
```

{{anh:vr-02-quan-he-vara-stdeva}}

Cả hai công thức đều cho `1822,92` — `VARA` và `STDEVA` tính trên cùng một tập dữ liệu luôn thoả mãn quan hệ `VARA = STDEVA²`, đúng bản chất toán học: độ lệch chuẩn là căn bậc hai của phương sai.

## Cùng chịu chung cái bẫy thổi phồng — thậm chí còn rõ hơn

```excel
=VAR(80,85,90)
=VARA(80,85,90,"Chưa chấm")
```

{{anh:vr-03-cung-chiu-bay-thoi-phong}}

`VAR(80,85,90)` cho `25,00`. `VARA(80,85,90,"Chưa chấm")` cho `1822,92` — chênh lệch tới hơn **70 lần**, còn rõ rệt hơn cả mức chênh lệch `8` lần đã thấy ở `STDEVA` cùng bộ dữ liệu, vì bản thân phép bình phương trong phương sai vốn đã khuếch đại sai lệch, và `VARA` chưa qua bước khai căn để "thu nhỏ" con số lại như `STDEVA`.

## Khi nào nên dùng VARA thay vì tự tính STDEVA²

```excel
=VARA(B2:B20)
```

{{anh:vr-04-khi-nao-dung-vara}}

Nếu công thức tiếp theo cần dùng trực tiếp phương sai (ví dụ trong các phép tính thống kê ghép nối nhiều bước, hay công thức kiểm định), dùng thẳng `VARA` gọn hơn và tránh sai số làm tròn nhỏ có thể phát sinh khi bình phương một kết quả `STDEVA` đã làm tròn hiển thị.

## Kiểm tra dữ liệu bằng COUNTA/COUNT trước khi tin vào VARA

```excel
=IF(COUNTA(B2:B20)=COUNT(B2:B20),VARA(B2:B20),"Kiểm tra lại: có ô không phải số")
```

{{anh:vr-05-kiem-tra-truoc-khi-tin}}

Giống cách đã làm với `STDEVA` ở bài trước, so sánh `COUNTA` và `COUNT` trên cùng vùng dữ liệu là cách nhanh để biết có ô văn bản hay luận lý nào lẫn vào không, trước khi tin tưởng vào kết quả `VARA` — hai hàm bằng nhau nghĩa là toàn bộ dữ liệu đều là số thật, không có gì bị quy đổi âm thầm.

## Tổng kết

`VARA` tính phương sai theo đúng quy tắc quy đổi văn bản/luận lý như `STDEVA` — thực chất là bình phương của `STDEVA`. Vì phương sai đã ở dạng bình phương, sai lệch do một ô văn bản gây ra còn được khuếch đại rõ hơn cả `STDEVA`, nên càng cần kiểm tra kỹ dữ liệu trước khi sử dụng.

Đây là bài cuối trong cụm 5 bài lô 21 về nhóm hàm "-A" (tính cả văn bản và luận lý), bắt đầu từ [AVERAGEA](/blog/ham-averagea-trung-binh-tinh-ca-van-ban-va-luan-ly).
