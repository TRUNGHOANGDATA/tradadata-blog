---
tieu_de: "AVERAGEIFS: tính trung bình khi cần thoả nhiều điều kiện cùng lúc"
slug: "ham-averageifs-trung-binh-nhieu-dieu-kien"
danh_muc: "Excel"
the: ["AVERAGEIFS", "hàm thống kê"]
mo_ta: "AVERAGEIFS mở rộng AVERAGEIF lên nhiều điều kiện cùng lúc — tất cả điều kiện phải cùng thoả mãn. Đặt vùng tính trung bình lên đầu tiên, ngược hẳn với AVERAGEIF, đúng đặc điểm cú pháp RACON."
tu_khoa: "hàm AVERAGEIFS Excel, trung binh nhieu dieu kien, AVERAGEIFS cu phap, AVERAGEIF va AVERAGEIFS"
anh_bia: "/images/bai-viet/ham-averageifs/cover.png"
thu_muc_anh: "ham-averageifs"
trang_thai: "draft"
---

Bài trước, [AVERAGEIF](/blog/ham-averageif-trung-binh-co-mot-dieu-kien) chỉ xử lý được đúng một điều kiện. `AVERAGEIFS` mở rộng lên nhiều điều kiện cùng lúc — tất cả đều phải thoả mãn đồng thời, giống cách `COUNTIFS`/`SUMIFS` mở rộng từ `COUNTIF`/`SUMIF`.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=AVERAGEIFS(vung_tinh_trung_binh, vung_dk1, dk1, [vung_dk2, dk2], ...)
```

{{anh:as-01-cu-phap-co-ban}}

Khác với `AVERAGEIF`, `AVERAGEIFS` **bắt buộc** phải khai `vung_tinh_trung_binh` — không có tuỳ chọn bỏ trống — và luôn đặt tham số này lên **đầu tiên**.

## Ứng dụng: kết hợp nhiều điều kiện cùng lúc

```excel
=AVERAGEIFS(Diem,GioiTinh,"Nam",Lop,"10A")
```

{{anh:as-02-nhieu-dieu-kien}}

Tính điểm trung bình chỉ trên các học sinh **vừa** là nam **vừa** thuộc lớp `10A` — cả hai điều kiện phải cùng đúng, quan hệ `VÀ` giống hệt `SUMIFS`/`COUNTIFS`.

## Nhắc lại: thứ tự tham số ngược hẳn với AVERAGEIF

```excel
=AVERAGEIFS(Diem,GioiTinh,"Nam")
=AVERAGEIF(GioiTinh,"Nam",Diem)
```

{{anh:as-03-nhac-lai-thu-tu-nguoc}}

Cùng kết quả, nhưng `AVERAGEIFS` đặt `Diem` lên đầu, còn `AVERAGEIF` đặt `GioiTinh` lên đầu. Đây là quy tắc chung của toàn bộ nhóm hàm `RACON` (`SUMIFS`, `COUNTIFS`, `AVERAGEIFS`, `MAXIFS`, `MINIFS`) — tất cả đều đặt vùng **tính toán** lên đầu tiên, khác hẳn với các hàm dạng số ít (`SUMIF`, `AVERAGEIF`) đặt vùng **điều kiện** lên đầu.

## Cùng gặp lỗi #DIV/0! khi không có dòng nào khớp

```excel
=AVERAGEIFS(Diem,GioiTinh,"Nam",Lop,"10Z")
```

{{anh:as-04-loi-div0-nhieu-dieu-kien}}

Nếu lớp `"10Z"` không tồn tại hoặc không có học sinh nam nào thuộc lớp đó, kết quả vẫn là `#DIV/0!` — giống hệt `AVERAGEIF` đã nói ở bài trước, càng nhiều điều kiện thì khả năng không có dòng nào khớp càng cao, nên càng cần cẩn thận với lỗi này khi thêm điều kiện.

## Ứng dụng: theo dõi điểm trung bình theo nhiều tiêu chí lọc dần

```excel
=AVERAGEIFS(Diem,Lop,"10A",MonHoc,"Toán",HocKy,"HK1")
```

{{anh:as-05-loc-dan-nhieu-tieu-chi}}

Không giới hạn ở hai điều kiện — có thể khai thêm nhiều cặp `vung_dk`/`dk` để lọc dần: điểm trung bình môn Toán, học kỳ 1, chỉ riêng lớp `10A`. Mỗi điều kiện thêm vào giúp thu hẹp phạm vi tính toán mà không cần dựng thêm cột phụ hay bảng phụ nào.

## Tổng kết

`AVERAGEIFS` tính trung bình khi cần thoả nhiều điều kiện cùng lúc, đặt vùng tính trung bình lên đầu tiên — ngược hẳn với `AVERAGEIF` đặt vùng điều kiện lên đầu. Cùng chung điểm với `AVERAGEIF`: báo lỗi `#DIV/0!` khi không có dòng nào khớp, cần cẩn thận hơn khi số điều kiện tăng lên.

Đây là bài cuối trong cụm 3 bài lô 17, bắt đầu từ [SUM](/blog/ham-sum-cong-tong-va-nhung-dieu-de-bi-bo-qua).
