---
tieu_de: "ARRAYTOTEXT: chuyển cả một mảng dữ liệu thành một chuỗi văn bản duy nhất"
slug: "ham-arraytotext-chuyen-mang-thanh-van-ban"
danh_muc: "Excel"
the: ["ARRAYTOTEXT", "hàm mảng động"]
mo_ta: "ARRAYTOTEXT gộp toàn bộ giá trị trong một mảng thành một chuỗi văn bản duy nhất, tiện để hiển thị nhanh kết quả một công thức mảng động hoặc ghép vào một câu thông báo, thay vì để kết quả tràn ra nhiều ô."
tu_khoa: "hàm ARRAYTOTEXT Excel, chuyen mang thanh chuoi, gop ket qua mang dong, Excel 365"
anh_bia: "/images/bai-viet/ham-arraytotext/cover.png"
thu_muc_anh: "ham-arraytotext"
trang_thai: "draft"
---

Bài trước, [IMAGE](/blog/ham-image-chen-anh-vao-o) hiển thị ảnh trong một ô. `ARRAYTOTEXT` làm ngược lại theo một nghĩa nào đó — thay vì để kết quả một mảng tràn ra nhiều ô, nó gộp tất cả lại thành **một chuỗi văn bản duy nhất** nằm gọn trong một ô.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=ARRAYTOTEXT(mang, [dinh_dang])
```

{{anh:at-01-cu-phap-co-ban}}

`dinh_dang` là `0` (mặc định, dễ đọc cho người) hoặc `1` (dạng chặt chẽ, có thể dán lại thành công thức mảng literal).

## Ứng dụng: hiển thị nhanh kết quả một danh sách lọc trong một câu

```excel
="Sản phẩm còn hàng: "&ARRAYTOTEXT(FILTER(TenHang,TonKho>0))
```

{{anh:at-02-hien-thi-trong-cau}}

Kết quả của `FILTER` là một mảng động, thường tràn ra nhiều ô. Bọc `ARRAYTOTEXT` quanh nó cho phép ghép trực tiếp vào một câu văn bản hoàn chỉnh nằm gọn trong đúng một ô, tiện khi cần một dòng tóm tắt ngắn thay vì cả một danh sách tràn dài.

## Hai định dạng: dễ đọc và dạng chặt chẽ

```excel
=ARRAYTOTEXT({1,2,3})
=ARRAYTOTEXT({1,2,3},1)
```

{{anh:at-03-hai-dinh-dang}}

Định dạng `0` (mặc định) cho ra `"1, 2, 3"` — dễ đọc, dùng để hiển thị cho người xem. Định dạng `1` cho ra `"{1,2,3}"` — đúng cú pháp một mảng literal trong Excel, có thể copy dán lại vào một ô khác để tái tạo đúng mảng ban đầu, hữu ích khi cần ghi lại kết quả tạm thời của một công thức phức tạp dưới dạng có thể dán lại được.

## Ứng dụng: gộp kết quả kiểm tra thành một dòng log dễ đọc

```excel
="Dòng lỗi: "&ARRAYTOTEXT(FILTER(ROW(A2:A20),ISERROR(B2:B20)))
```

{{anh:at-04-gop-dong-log}}

Thay vì phải nhìn một cột dài liệt kê từng số dòng bị lỗi, công thức này gộp tất cả số dòng lỗi thành một câu ngắn gọn — tiện để dán nhanh vào email báo cáo hoặc ghi chú, không cần chụp ảnh màn hình cả một cột.

## Với văn bản có chứa dấu phẩy: kết quả có thể gây hiểu lầm

```excel
=ARRAYTOTEXT({"Hà Nội, Việt Nam";"Đà Nẵng"})
```

{{anh:at-05-luu-y-dau-phay-trong-text}}

Kết quả `"Hà Nội, Việt Nam, Đà Nẵng"` — dấu phẩy nối các phần tử của mảng trông giống hệt dấu phẩy vốn có sẵn trong chính nội dung văn bản `"Hà Nội, Việt Nam"`, khiến người đọc dễ nhầm tưởng đây là `3` phần tử riêng biệt thay vì `2`. Cần cẩn thận khi dữ liệu gốc có khả năng chứa dấu phẩy trong nội dung.

## Tổng kết

`ARRAYTOTEXT` gộp toàn bộ giá trị trong một mảng thành một chuỗi văn bản duy nhất, tiện để ghép vào câu thông báo hoặc rút gọn hiển thị một danh sách dài thành một dòng. Định dạng `0` dễ đọc cho người, định dạng `1` giữ đúng cú pháp mảng literal có thể dán lại được — nhưng cần cẩn thận khi dữ liệu gốc vốn đã chứa dấu phẩy.

Đọc tiếp trong cùng cụm bài: [NUMBERVALUE — chuyển văn bản số thành số thật, bất kể định dạng vùng miền nào](/blog/ham-numbervalue-chuyen-van-ban-thanh-so).
