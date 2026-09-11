---
tieu_de: "DMAX, DMIN: giá trị lớn nhất và nhỏ nhất kiểu cơ sở dữ liệu"
slug: "ham-dmax-dmin-gia-tri-lon-nhat-nho-nhat-co-so-du-lieu"
danh_muc: "Excel"
the: ["DMAX", "DMIN", "hàm cơ sở dữ liệu"]
mo_ta: "DMAX và DMIN tìm giá trị lớn nhất, nhỏ nhất dựa trên vùng điều kiện kiểu bảng — đúng vị trí của MAXIFS/MINIFS trong nhóm hàm cơ sở dữ liệu, cùng trả về 0 thay vì báo lỗi khi không có dòng nào khớp."
tu_khoa: "hàm DMAX Excel, ham DMIN Excel, gia tri lon nhat kieu co so du lieu, DMAX khac MAXIFS"
anh_bia: "/images/bai-viet/ham-dmax-dmin/cover.png"
thu_muc_anh: "ham-dmax-dmin"
trang_thai: "draft"
---

Bài trước, [DAVERAGE](/blog/ham-daverage-trung-binh-kieu-co-so-du-lieu) tính trung bình theo vùng điều kiện kiểu bảng. `DMAX` và `DMIN` chuyển sang tìm giá trị lớn nhất, nhỏ nhất — đúng vị trí của [`MAXIFS`/`MINIFS`](/blog/ham-maxifs-tim-gia-tri-lon-nhat-co-dieu-kien) trong nhóm hàm cơ sở dữ liệu.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=DMAX(vung_du_lieu, truong, vung_dieu_kien)
=DMIN(vung_du_lieu, truong, vung_dieu_kien)
```

{{anh:dm-01-cu-phap-co-ban}}

Cùng cấu trúc vùng điều kiện với `DSUM`/`DAVERAGE` — chỉ đổi phép tính cuối cùng.

## Ứng dụng: giá cao nhất trong một hoặc nhiều nhóm hàng

```excel
=DMAX(A1:D50,"Giá",F1:F3)
```

{{anh:dm-02-gia-cao-nhat-nhieu-nhom}}

Vùng điều kiện có hai dòng — `"Điện tử"` và `"Gia dụng"` — tìm giá cao nhất trong **cả hai** nhóm hàng đó cùng lúc, đúng quan hệ `HOẶC` giữa các dòng điều kiện.

## Khác biệt với DAVERAGE: không có dòng khớp thì trả về 0, không báo lỗi

```excel
=DMAX(A1:D50,"Giá",F1:F2)
```

{{anh:dm-03-tra-ve-0-khong-loi}}

Nếu không có dòng nào khớp điều kiện (ví dụ gõ sai tên nhóm hàng), `DMAX` và `DMIN` trả về `0` — không báo lỗi `#DIV/0!` như `DAVERAGE`. Đây chính là điểm khác biệt tương tự đã nói ở bài `MAXIFS`/`MINIFS`: nhóm hàm tìm giá trị lớn nhất/nhỏ nhất luôn trả về `0` khi không khớp, còn nhóm hàm tính trung bình báo lỗi hẳn hoi.

## Ứng dụng: theo dõi mức tồn kho thấp nhất cần cảnh báo

```excel
=DMIN(A1:D50,"TonKho",F1:G2)
```

{{anh:dm-04-canh-bao-ton-kho-thap}}

Kết hợp điều kiện `NhomHang="Điện tử"` và `TrangThai="Đang bán"` trên cùng dòng để tìm mức tồn kho thấp nhất trong đúng nhóm hàng đang kinh doanh, bỏ qua các mặt hàng đã ngừng bán dù tồn kho của chúng có thể còn thấp hơn.

## Kết hợp DMAX và DMIN để tính khoảng chênh lệch

```excel
=DMAX(A1:D50,"Giá",F1:F2)-DMIN(A1:D50,"Giá",F1:F2)
```

{{anh:dm-05-tinh-khoang-chenh-lech}}

Trừ hai kết quả cho nhau để biết khoảng chênh lệch giá trong cùng một nhóm điều kiện — hữu ích khi cần đánh giá độ phân tán giá cả trong một danh mục sản phẩm cụ thể.

## Tổng kết

`DMAX` và `DMIN` tìm giá trị lớn nhất, nhỏ nhất theo vùng điều kiện kiểu bảng, hỗ trợ cả `VÀ` lẫn `HOẶC` như các hàm `D` khác. Khi không có dòng nào khớp, cả hai trả về `0` thay vì báo lỗi — khác với `DAVERAGE`/`DSUM` có thể báo lỗi hoặc trả về `0` tuỳ phép tính.

Đọc tiếp trong cùng cụm bài: [DGET — lấy đúng một giá trị duy nhất, và cách nó phát hiện dữ liệu trùng lặp giúp bạn](/blog/ham-dget-lay-dung-mot-gia-tri-duy-nhat).
