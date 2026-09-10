---
tieu_de: "CEILING và FLOOR: làm tròn theo hướng cố định, khác ROUND thông thường"
slug: "ham-ceiling-floor-lam-tron-theo-huong-co-dinh"
danh_muc: "Excel"
the: ["CEILING", "FLOOR", "làm tròn số", "hàm cơ bản"]
mo_ta: "Cách dùng CEILING để luôn làm tròn lên và FLOOR để luôn làm tròn xuống theo một bội số chỉ định — khác hẳn ROUND vốn làm tròn theo quy tắc gần nhất, không theo hướng cố định."
tu_khoa: "hàm CEILING Excel, hàm FLOOR Excel, làm tròn lên, làm tròn xuống, làm tròn theo bội số, khác biệt ROUND CEILING"
anh_bia: "/images/bai-viet/ham-ceiling-floor/cover.png"
thu_muc_anh: "ham-ceiling-floor"
trang_thai: "draft"
---

`ROUND` làm tròn theo quy tắc quen thuộc: phần lẻ từ `0,5` trở lên thì làm tròn lên, dưới `0,5` thì làm tròn xuống. Nhưng có nhiều tình huống thực tế cần làm tròn theo **một hướng cố định**, không phụ thuộc phần lẻ là bao nhiêu — ví dụ giá bán luôn làm tròn lên tới mức nghìn đồng gần nhất, hoặc số lượng đóng gói luôn làm tròn xuống theo quy cách thùng hàng.

`CEILING` và `FLOOR` sinh ra đúng cho việc đó: `CEILING` luôn làm tròn **lên**, `FLOOR` luôn làm tròn **xuống**, bất kể phần lẻ nhỏ hay lớn.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Vì sao ROUND không giải quyết được bài toán này

```excel
=ROUND(123, -2)
```

Kết quả trả về **100** — vì `123` gần `100` hơn `200`, `ROUND` làm tròn xuống theo đúng quy tắc "gần nhất". Nhưng nếu yêu cầu thực tế là "luôn làm tròn lên tới hàng trăm gần nhất, không quan tâm phần lẻ", `ROUND` sẽ cho ra kết quả sai với ví dụ này — nó làm tròn xuống vì đó mới là điểm gần nhất, không phải vì đó là hướng được yêu cầu.

{{anh:cf-01-vi-sao-round-khong-du}}

## CEILING — luôn làm tròn lên

```excel
=CEILING(number, significance)
```

`significance` là bội số mà kết quả phải làm tròn tới — Excel luôn đẩy `number` lên tới bội số gần nhất của `significance` mà **lớn hơn hoặc bằng** giá trị gốc.

Ví dụ: giá vốn sản phẩm tính ra `123.400` đồng, cần làm tròn lên tới hàng nghìn gần nhất khi niêm yết giá bán.

```excel
=CEILING(123400, 1000)
```

{{anh:cf-02-ceiling}}

Kết quả trả về **124.000** — làm tròn lên đúng tới bội số của `1000` gần nhất, dù phần lẻ `400` nhỏ hơn nửa của `1000`. Đây chính là điều `ROUND` không làm được: `ROUND(123400, -3)` sẽ cho ra `123.000` vì phần lẻ dưới mức giữa.

## FLOOR — luôn làm tròn xuống

```excel
=FLOOR(number, significance)
```

Làm ngược lại `CEILING`: luôn đẩy `number` xuống tới bội số gần nhất của `significance` mà **nhỏ hơn hoặc bằng** giá trị gốc.

Ví dụ: kho có `237` sản phẩm, đóng gói theo quy cách 12 sản phẩm một thùng, cần biết đóng được bao nhiêu thùng **nguyên** — không được làm tròn lên vì không đủ hàng cho thùng cuối.

```excel
=FLOOR(237, 12)
```

{{anh:cf-03-floor}}

Kết quả trả về **228** — bội số của `12` gần nhất mà không vượt quá `237`. Chia `228` cho `12` ra đúng `19` thùng nguyên, còn dư `9` sản phẩm lẻ không đủ đóng thêm một thùng.

## Ứng dụng thực tế: quy tắc niêm yết giá kết thúc bằng số tròn

Một ứng dụng phổ biến trong bán lẻ: giá bán luôn làm tròn lên để kết thúc bằng `000` hoặc `900`, tuỳ chiến lược định giá.

{{anh:cf-04-quy-tac-gia-ban}}

```excel
=CEILING(B2, 1000) - 100
```

Đọc theo hai bước: `CEILING(B2, 1000)` làm tròn lên tới nghìn tròn gần nhất, sau đó trừ `100` để giá kết thúc bằng `900` thay vì `000` — kỹ thuật định giá tâm lý rất thường gặp trong bán lẻ, để giá `124.900` trông "rẻ hơn" `125.000` dù chênh lệch chỉ `100` đồng.

## Cẩn thận với số âm

Cả hai hàm đều xử lý số âm theo cách có thể gây bất ngờ nếu không để ý: với số âm, "làm tròn lên" của `CEILING` nghĩa là tiến **gần về phía 0 hơn** (theo đúng nghĩa toán học của "lớn hơn"), và "làm tròn xuống" của `FLOOR` nghĩa là tiến **xa khỏi 0 hơn**.

```excel
=CEILING(-123, 10)   ' Kết quả: -120 (gần 0 hơn -130)
=FLOOR(-123, 10)     ' Kết quả: -130 (xa 0 hơn -120)
```

{{anh:cf-05-so-am}}

Với dữ liệu tài chính có số âm (ví dụ dòng tiền chi ra, chênh lệch âm), nên kiểm tra kỹ hướng làm tròn thực tế cần dùng là gì trước khi áp dụng trực tiếp — trực giác "làm tròn lên luôn là số lớn hơn về giá trị tuyệt đối" không đúng với số âm.

## Tổng kết

`ROUND` làm tròn theo quy tắc gần nhất, không quan tâm hướng. `CEILING` luôn làm tròn lên, `FLOOR` luôn làm tròn xuống, theo đúng một bội số chỉ định — dùng khi bài toán thực tế yêu cầu một hướng làm tròn cố định, như quy tắc niêm yết giá hay đóng gói theo quy cách, chứ không phải làm tròn toán học thông thường.

Đọc tiếp trong cùng cụm bài: [FIND và SEARCH — tìm vị trí một ký tự trong chuỗi](/blog/ham-find-search-tim-vi-tri-ky-tu-trong-chuoi). Quay lại [WEEKDAY và EOMONTH](/blog/ham-weekday-eomonth-thu-trong-tuan-ngay-cuoi-thang).
