---
tieu_de: "MAXIFS: tìm giá trị lớn nhất có điều kiện, không cần cột phụ"
slug: "ham-maxifs-tim-gia-tri-lon-nhat-co-dieu-kien"
danh_muc: "Excel"
the: ["MAXIFS", "hàm tra cứu"]
mo_ta: "MAXIFS tìm giá trị lớn nhất trong một vùng, chỉ tính các dòng thoả điều kiện — như MAX kết hợp SUMIFS. Cần nhớ MAXIFS trả về 0 khi không có dòng nào khớp, không phải một lỗi, dễ gây hiểu lầm."
tu_khoa: "hàm MAXIFS Excel, tìm giá trị lớn nhất có điều kiện, MAXIFS khác MAX, MAXIFS tra ve 0"
anh_bia: "/images/bai-viet/ham-maxifs/cover.png"
thu_muc_anh: "ham-maxifs"
trang_thai: "draft"
---

`MAX` (đã nói trong bài [MAX, MIN, LARGE, SMALL](/blog/ham-max-min-large-small-tim-gia-tri-xep-hang)) tìm giá trị lớn nhất trên **toàn bộ** một vùng. `MAXIFS` làm đúng việc đó nhưng chỉ tính trên những dòng thoả điều kiện — giống cách `SUMIFS` mở rộng từ `SUM`.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=MAXIFS(vung_max, vung_dieu_kien1, dieu_kien1, [vung_dieu_kien2, dieu_kien2], ...)
```

{{anh:mx-01-cu-phap-co-ban}}

`vung_max` là nơi lấy giá trị lớn nhất; các cặp `vung_dieu_kien`/`dieu_kien` phía sau lọc dòng nào được tính, y hệt cách khai báo điều kiện của `SUMIFS`/`COUNTIFS`.

## Ứng dụng: doanh số cao nhất của một nhân viên cụ thể

```excel
=MAXIFS(DoanhSo,NhanVien,"An")
```

{{anh:mx-02-doanh-so-cao-nhat}}

Thay vì lọc dữ liệu bằng tay rồi mới xem `MAX`, công thức này quét toàn bộ bảng và chỉ lấy giá trị lớn nhất trong các dòng có tên `"An"` — tự động cập nhật nếu bảng có thêm dòng mới.

## Có thể kết hợp nhiều điều kiện cùng lúc

```excel
=MAXIFS(DoanhSo,NhanVien,"An",Thang,"T2")
```

{{anh:mx-03-nhieu-dieu-kien}}

Thêm cặp điều kiện thứ hai để thu hẹp phạm vi — ở đây là doanh số cao nhất của riêng nhân viên `"An"` **trong tháng 2**. Có thể khai báo nhiều cặp điều kiện tuỳ ý, tất cả đều phải cùng thoả mãn (quan hệ VÀ, giống `SUMIFS`).

## Điểm cần nhớ: không có dòng nào khớp thì trả về 0, không phải lỗi

```excel
=MAXIFS(DoanhSo,NhanVien,"Chưa tồn tại")
```

{{anh:mx-04-tra-ve-0-khong-loi}}

Kết quả là `0` — không phải `#N/A` hay bất kỳ lỗi nào. Đây là điểm dễ gây hiểu lầm nhất: `0` ở đây có nghĩa là "không tìm thấy dòng nào khớp điều kiện", nhưng nhìn thoáng qua dễ tưởng nhầm đó là một giá trị thật sự bằng `0` trong dữ liệu. Khi dùng `MAXIFS` để tổng hợp báo cáo, nên kiểm tra thêm bằng `COUNTIFS` cùng điều kiện để chắc chắn có dữ liệu thật trước khi tin vào kết quả `0`.

## Yêu cầu phiên bản Excel

`MAXIFS` chỉ có từ Excel 2019 và Microsoft 365 trở lên. Với bản Excel cũ hơn, cách thay thế là công thức mảng:

```excel
=MAX(IF(NhanVien="An",DoanhSo))
```

{{anh:mx-05-thay-the-ban-cu}}

nhập bằng `Ctrl+Shift+Enter` thay vì `Enter` thường, vì `IF` ở đây phải chạy trên cả một vùng thay vì một ô.

## Tổng kết

`MAXIFS` tìm giá trị lớn nhất trong một vùng, chỉ tính các dòng thoả một hoặc nhiều điều kiện — nhanh hơn hẳn việc lọc dữ liệu bằng tay. Điểm quan trọng nhất cần nhớ: kết quả `0` nghĩa là không có dòng nào khớp, không phải lỗi, nên đừng vội tin đó là một giá trị dữ liệu thật.

Đọc tiếp trong cùng cụm bài: [MINIFS — chiều ngược lại của MAXIFS, và hỗ trợ ký tự đại diện ít người để ý](/blog/ham-minifs-tim-gia-tri-nho-nhat-co-dieu-kien).
