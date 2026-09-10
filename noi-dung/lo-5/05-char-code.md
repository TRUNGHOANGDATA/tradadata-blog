---
tieu_de: "CHAR và CODE: ký tự đặc biệt, và cách ngắt dòng trong ô bằng công thức"
slug: "ham-char-code-ky-tu-dac-biet-ngat-dong"
danh_muc: "Excel"
the: ["CHAR", "CODE", "ngắt dòng trong ô", "hàm cơ bản"]
mo_ta: "Cách dùng CHAR để chèn ký tự đặc biệt và tự ngắt dòng trong một ô bằng công thức, và CODE để tra ngược lại mã số của một ký tự — hai hàm ít dùng nhưng giải quyết đúng lúc cần."
tu_khoa: "hàm CHAR Excel, hàm CODE Excel, ngắt dòng trong ô Excel, CHAR(10), ký tự đặc biệt trong công thức"
anh_bia: "/images/bai-viet/ham-char-code/cover.png"
thu_muc_anh: "ham-char-code"
trang_thai: "draft"
---

Mỗi ký tự trên bàn phím — kể cả những ký tự không gõ trực tiếp được như dấu xuống dòng — đều tương ứng với một con số cố định trong bảng mã ký tự. `CHAR` và `CODE` là cặp hàm chuyển đổi qua lại giữa con số đó và ký tự thật, và ứng dụng thực tế phổ biến nhất của chúng — tự ngắt dòng bên trong một ô bằng công thức — là thứ nhiều người dùng Excel lâu năm vẫn không biết làm được.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## CODE — tra mã số của một ký tự

```excel
=CODE(text)
```

`CODE` trả về mã số của ký tự **đầu tiên** trong chuỗi.

```excel
=CODE("A")
```

{{anh:cc2-01-code-co-ban}}

Kết quả trả về **65** — mã số chuẩn của chữ "A" hoa trong bảng mã ASCII. Chữ "a" thường có mã số khác, `97`, vì bảng mã ký tự phân biệt chữ hoa và chữ thường như hai ký tự hoàn toàn riêng biệt.

## CHAR — làm ngược lại: từ mã số ra ký tự

```excel
=CHAR(number)
```

```excel
=CHAR(65)
```

{{anh:cc2-02-char-co-ban}}

Kết quả trả về chữ **"A"** — đúng ký tự tương ứng với mã số `65`. `CHAR` và `CODE` là hai hàm ngược nhau: `CHAR(CODE("A"))` luôn trả về lại đúng `"A"`.

## Ứng dụng quan trọng nhất: CHAR(10) để ngắt dòng trong công thức

Đây là lý do chính đáng để biết tới `CHAR`, ngay cả khi không bao giờ cần tới `CODE`. Ký tự xuống dòng — phím **Alt + Enter** khi gõ tay trong một ô — có mã số cố định là `10`. Dùng `CHAR(10)` để chèn đúng ký tự xuống dòng đó ngay bên trong một công thức, việc mà không cách gõ tay nào làm được vì công thức không thể "bấm phím" giữa chừng.

{{anh:cc2-03-du-lieu-dia-chi}}

```excel
=A2 & CHAR(10) & B2 & CHAR(10) & C2
```

{{anh:cc2-04-ghep-xuong-dong}}

Công thức này ghép tên, số điện thoại, địa chỉ thành một chuỗi có xuống dòng giữa mỗi phần — hữu ích khi cần gộp nhiều cột thông tin liên hệ thành một ô duy nhất để dán vào nhãn thư, danh thiếp, hay bất kỳ nơi nào cần trình bày nhiều dòng gọn trong một ô.

## Bật Wrap Text để nhìn thấy dấu xuống dòng

Chỉ ghép `CHAR(10)` vào công thức chưa đủ để **nhìn thấy** kết quả xuống dòng — mặc định Excel vẫn hiển thị mọi thứ trên một dòng, dấu xuống dòng tồn tại trong dữ liệu nhưng bị ẩn đi. Cần bật thêm chế độ **Wrap Text** (Trang chủ > Wrap Text, hoặc `Ctrl + 1` > Alignment > Wrap text) cho ô chứa công thức, khi đó Excel mới thực sự xuống dòng đúng những vị trí đã chèn `CHAR(10)`.

{{anh:cc2-05-truoc-sau-wrap-text}}

Thiếu bước bật Wrap Text là lý do phổ biến nhất khiến người mới dùng `CHAR(10)` tưởng công thức không có tác dụng gì — công thức vẫn đúng, chỉ là ô chưa được bật chế độ hiển thị phù hợp.

## Một vài mã CHAR khác thường gặp

| Mã số | Ký tự | Công dụng |
|---|---|---|
| `9` | Tab | Chèn khoảng cách kiểu tab giữa hai phần dữ liệu |
| `10` | Xuống dòng | Ngắt dòng bên trong một ô (cần bật Wrap Text) |
| `34` | Dấu ngoặc kép `"` | Chèn dấu ngoặc kép vào giữa một chuỗi ghép bằng `&` |

{{anh:cc2-06-bang-ma-thuong-dung}}

Dấu ngoặc kép (`CHAR(34)`) đáng chú ý riêng: gõ trực tiếp dấu `"` vào giữa một công thức nối chuỗi sẽ bị Excel hiểu nhầm là kết thúc chuỗi văn bản, gây lỗi cú pháp. Dùng `CHAR(34)` để chèn đúng ký tự đó mà không làm vỡ cú pháp công thức.

## Tổng kết

`CODE` tra ra mã số của một ký tự, `CHAR` làm ngược lại — chuyển mã số thành ký tự thật. Ứng dụng thực tế quan trọng nhất không phải tra cứu bảng mã, mà là dùng `CHAR(10)` để chèn dấu xuống dòng ngay trong công thức nối chuỗi, kết hợp bắt buộc với việc bật Wrap Text cho ô thì mới nhìn thấy kết quả xuống dòng thật sự.

Đây là bài cuối trong cụm 5 bài về các hàm Excel cơ bản, dùng hàng ngày. Xem lại từ đầu: [WEEKDAY và EOMONTH](/blog/ham-weekday-eomonth-thu-trong-tuan-ngay-cuoi-thang), [CEILING và FLOOR](/blog/ham-ceiling-floor-lam-tron-theo-huong-co-dinh), [FIND và SEARCH](/blog/ham-find-search-tim-vi-tri-ky-tu-trong-chuoi), [VALUE và TEXT](/blog/ham-value-text-chuyen-doi-so-van-ban).
