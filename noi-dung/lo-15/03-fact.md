---
tieu_de: "FACT: giai thừa, đếm số cách sắp xếp thứ tự của một nhóm"
slug: "ham-fact-giai-thua"
danh_muc: "Excel"
the: ["FACT", "hàm toán học"]
mo_ta: "FACT tính giai thừa của một số — đúng bằng số cách sắp xếp thứ tự khác nhau của một nhóm đối tượng. Điểm hay gây bất ngờ nhất: FACT(0) bằng 1, không phải 0."
tu_khoa: "hàm FACT Excel, giai thua Excel, so cach sap xep thu tu, FACT cua 0"
anh_bia: "/images/bai-viet/ham-fact/cover.png"
thu_muc_anh: "ham-fact"
trang_thai: "draft"
---

Bài trước, [VALUETOTEXT](/blog/ham-valuetotext-chuyen-mot-gia-tri-thanh-van-ban) khép lại phần các hàm xử lý giá trị và văn bản. `FACT` chuyển sang một nhóm hàm đếm tổ hợp nhỏ nhưng khá thú vị — bắt đầu với hàm đơn giản nhất: giai thừa.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=FACT(so)
```

{{anh:fa-01-cu-phap-co-ban}}

`FACT(5)` trả về `120` — đúng bằng `5×4×3×2×1`. Giai thừa của một số là tích của tất cả số nguyên dương từ `1` đến chính nó.

## Ý nghĩa thực tế: số cách sắp xếp thứ tự

`FACT(n)` đúng bằng số cách sắp xếp `n` đối tượng khác nhau theo một thứ tự nhất định. `5` người xếp hàng chụp ảnh, có bao nhiêu cách sắp xếp thứ tự đứng khác nhau:

```excel
=FACT(5)
```

{{anh:fa-02-y-nghia-sap-xep}}

Kết quả `120` cách — người đầu tiên có `5` lựa chọn vị trí, người thứ hai còn `4` lựa chọn (vì một vị trí đã bị chiếm), cứ thế giảm dần, nhân tất cả lại đúng bằng giai thừa.

## Trường hợp gây bất ngờ nhất: FACT(0) = 1

```excel
=FACT(0)
```

{{anh:fa-03-fact-cua-0}}

Kết quả là `1`, không phải `0` như trực giác "không có gì để nhân" có thể gợi ý. Đây là quy ước toán học chuẩn: giai thừa của `0` được định nghĩa bằng `1` (tương tự khái niệm "chỉ có đúng một cách sắp xếp một nhóm rỗng — không làm gì cả"), để các công thức tổ hợp dùng `FACT` ở bài sau (`COMBIN`, `PERMUT`) vẫn cho ra kết quả đúng ngay cả ở các trường hợp biên.

## Số thập phân bị cắt phần lẻ, không báo lỗi

```excel
=FACT(4,7)
```

{{anh:fa-04-so-thap-phan-bi-cat}}

Kết quả là `24` — đúng bằng `FACT(4)`, vì Excel tự động cắt bỏ phần thập phân trước khi tính, không làm tròn và cũng không báo lỗi gì. Dễ gây nhầm lẫn nếu không để ý, vì kết quả trông vẫn hợp lệ, không có dấu hiệu cảnh báo nào cho biết số đầu vào không phải số nguyên.

## Tăng rất nhanh — cẩn thận với số lớn

```excel
=FACT(15)
=FACT(20)
```

{{anh:fa-05-tang-rat-nhanh}}

`FACT(15)` đã là `1.307.674.368.000` (hơn `1.300` tỷ), `FACT(20)` đã là `2.432.902.008.176.640.000` (hơn `2.400` triệu tỷ) — giai thừa tăng cực nhanh, nên chỉ cần đưa vào một số hơi lớn là kết quả đã vượt xa phạm vi số có ý nghĩa thực tế thông thường, và với số đủ lớn (trên `170`) Excel sẽ báo lỗi `#NUM!` vì vượt quá giới hạn số Excel biểu diễn được.

## Tổng kết

`FACT` tính giai thừa của một số, đúng bằng số cách sắp xếp thứ tự của một nhóm đối tượng có kích thước bằng số đó. Cần nhớ `FACT(0)=1` theo quy ước toán học, số thập phân bị tự động cắt phần lẻ không báo lỗi, và kết quả tăng cực nhanh nên dễ vượt phạm vi số có ý nghĩa chỉ với đầu vào không quá lớn.

Đọc tiếp trong cùng cụm bài: [COMBIN — đếm số cách chọn một nhóm nhỏ, không quan tâm thứ tự](/blog/ham-combin-so-cach-chon-khong-phan-biet-thu-tu).
