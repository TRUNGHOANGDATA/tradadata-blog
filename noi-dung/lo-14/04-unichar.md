---
tieu_de: "UNICHAR: chèn bất kỳ ký tự đặc biệt nào chỉ bằng đúng mã số của nó"
slug: "ham-unichar-chen-ky-tu-dac-biet"
danh_muc: "Excel"
the: ["UNICHAR", "hàm văn bản"]
mo_ta: "UNICHAR trả về ký tự Unicode ứng với một mã số — chèn được dấu tích, ngôi sao, mũi tên và hàng nghìn ký hiệu khác trực tiếp bằng công thức, không cần mở Character Map hay tìm copy-paste từ nơi khác."
tu_khoa: "hàm UNICHAR Excel, chen ky tu dac biet Excel, dau tich Excel, UNICHAR khac CHAR"
anh_bia: "/images/bai-viet/ham-unichar/cover.png"
thu_muc_anh: "ham-unichar"
trang_thai: "draft"
---

Bài [CHAR, CODE](/blog/ham-char-code-ky-tu-dac-biet-ngat-dong) đã giới thiệu `CHAR` — trả về ký tự ứng với một mã trong bảng `256` ký tự cơ bản. `UNICHAR` mở rộng đúng ý tưởng đó ra toàn bộ bảng mã Unicode, hàng chục nghìn ký hiệu, biểu tượng và chữ viết từ khắp thế giới.

## Cú pháp

```excel
=UNICHAR(so)
```

{{anh:uc-01-cu-phap-co-ban}}

`so` là mã Unicode dạng thập phân của ký tự cần lấy — ví dụ `UNICHAR(9733)` trả về ký tự ngôi sao `★`.

## Ứng dụng: chèn dấu tích, ngôi sao mà không cần Character Map

```excel
=UNICHAR(10003)
=UNICHAR(9733)
```

{{anh:uc-02-dau-tich-ngoi-sao}}

`UNICHAR(10003)` cho dấu tích `✓`, `UNICHAR(9733)` cho ngôi sao `★` — hai ký hiệu hay dùng để đánh dấu trạng thái hoàn thành hay đánh giá sao, chèn được ngay bằng công thức thay vì phải mở `Insert → Symbol` tìm từng ký tự bằng mắt.

## Ứng dụng: dựng thanh đánh giá sao động theo điểm số

```excel
=REPT(UNICHAR(9733),DiemDanhGia)&REPT(UNICHAR(9734),5-DiemDanhGia)
```

{{anh:uc-03-thanh-danh-gia-sao}}

Kết hợp với [`REPT`](/blog/ham-len-rept-dem-do-dai-chuoi-lap-ky-tu) để lặp lại ký tự: `UNICHAR(9733)` (sao đặc `★`) lặp đúng số lần bằng điểm đánh giá, phần còn lại lấp đầy bằng `UNICHAR(9734)` (sao rỗng `☆`) — dựng ra một thanh `★★★☆☆` trực quan chỉ bằng công thức văn bản, không cần chèn hình ảnh hay biểu tượng thủ công.

## Tìm mã Unicode của một ký tự có sẵn: dùng UNICODE (hàm ngược lại)

```excel
=UNICODE("★")
```

{{anh:uc-04-ham-nguoc-lai-unicode}}

Nếu đã có sẵn một ký tự đặc biệt (copy từ đâu đó) và muốn biết mã số Unicode của nó để dùng lại trong công thức, `UNICODE` làm chiều ngược lại với `UNICHAR` — đưa vào ký tự, trả về mã số `9733`, đúng như cách `CODE` là chiều ngược của `CHAR`.

## Lưu ý: không phải font chữ nào cũng hiển thị được mọi ký tự Unicode

```excel
=UNICHAR(128512)
```

{{anh:uc-05-luu-y-font-chu}}

Mã `128512` là một biểu tượng cảm xúc (emoji mặt cười 😀) — công thức vẫn trả về đúng ký tự, nhưng nó có hiển thị đẹp hay không phụ thuộc vào font chữ đang dùng trong ô đó. Một số font chữ cũ hoặc font chuyên cho văn bản không hỗ trợ hiển thị emoji, khiến ô hiện ra một ô vuông trống hoặc dấu chấm hỏi thay vì đúng ký tự mong muốn — cần đổi sang font có hỗ trợ đầy đủ Unicode nếu gặp tình huống này.

## Tổng kết

`UNICHAR` trả về ký tự Unicode ứng với một mã số, mở rộng ý tưởng của `CHAR` ra toàn bộ bảng mã Unicode — chèn được dấu tích, ngôi sao, và hàng chục nghìn ký hiệu khác chỉ bằng công thức. `UNICODE` là hàm ngược lại, tìm mã số từ một ký tự có sẵn. Ký tự hiển thị đẹp hay không còn phụ thuộc font chữ đang dùng.

Đọc tiếp trong cùng cụm bài: [FREQUENCY — đếm số lượng rơi vào từng khoảng, dựng phân phối dữ liệu chỉ bằng một công thức](/blog/ham-frequency-dem-phan-phoi-du-lieu).
