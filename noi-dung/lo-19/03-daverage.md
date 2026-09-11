---
tieu_de: "DAVERAGE: tính trung bình kiểu cơ sở dữ liệu"
slug: "ham-daverage-trung-binh-kieu-co-so-du-lieu"
danh_muc: "Excel"
the: ["DAVERAGE", "hàm cơ sở dữ liệu"]
mo_ta: "DAVERAGE tính trung bình dựa trên một vùng điều kiện kiểu bảng, hỗ trợ cả điều kiện HOẶC lẫn VÀ phức tạp giống DSUM. Cùng gặp lỗi #DIV/0! như AVERAGEIF/AVERAGEIFS khi không có dòng nào khớp."
tu_khoa: "hàm DAVERAGE Excel, trung binh kieu co so du lieu, DAVERAGE khac AVERAGEIFS"
anh_bia: "/images/bai-viet/ham-daverage/cover.png"
thu_muc_anh: "ham-daverage"
trang_thai: "draft"
---

Bài trước, [DCOUNT, DCOUNTA](/blog/ham-dcount-dcounta-dem-kieu-co-so-du-lieu) đếm theo vùng điều kiện kiểu bảng. `DAVERAGE` dùng chung cấu trúc đó nhưng tính trung bình — đúng vị trí của [`AVERAGEIFS`](/blog/ham-averageifs-trung-binh-nhieu-dieu-kien) trong nhóm hàm cơ sở dữ liệu.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=DAVERAGE(vung_du_lieu, truong, vung_dieu_kien)
```

{{anh:da-01-cu-phap-co-ban}}

Giống hệt cấu trúc `DSUM`/`DCOUNT` — chỉ đổi phép tính cuối cùng từ tổng hoặc đếm sang trung bình.

## Ứng dụng: kết hợp điều kiện VÀ trên cùng một dòng

```excel
=DAVERAGE(A1:D50,"Giá",F1:G2)
```

{{anh:da-02-dieu-kien-va}}

Vùng điều kiện có hai cột `NhómHàng` và `TồnKho` trên **cùng một dòng** (`"Điện tử"` và `">0"`) — tính giá trung bình chỉ trên các sản phẩm thuộc nhóm Điện tử **và** còn tồn kho, đúng quan hệ `VÀ` giữa hai điều kiện khác cột cùng dòng.

## Mở rộng thêm điều kiện HOẶC bằng cách thêm dòng

```excel
=DAVERAGE(A1:D50,"Giá",F1:G3)
```

{{anh:da-03-mo-rong-dieu-kien-hoac}}

Thêm một dòng nữa vào vùng điều kiện (`"Gia dụng"` và `">0"`) mở rộng phạm vi tính sang **cả hai** nhóm hàng Điện tử và Gia dụng, miễn còn tồn kho — kết hợp cả `VÀ` (trong cùng dòng) lẫn `HOẶC` (giữa các dòng) chỉ bằng cách sắp xếp bảng điều kiện, không cần công thức phức tạp.

## Cùng gặp lỗi #DIV/0! khi không có dòng nào khớp

```excel
=DAVERAGE(A1:D50,"Giá",F1:G2)
```

{{anh:da-04-loi-div0}}

Giống hệt [`AVERAGEIF`/`AVERAGEIFS`](/blog/ham-averageif-trung-binh-co-mot-dieu-kien) đã nói ở lô trước, nếu không có dòng dữ liệu nào khớp điều kiện, `DAVERAGE` báo lỗi `#DIV/0!` — vì bản chất vẫn là tổng chia cho số lượng khớp, và số lượng đó bằng `0`.

## Kiểm tra trước bằng DCOUNTA để tránh lỗi bất ngờ

```excel
=IF(DCOUNTA(A1:D50,"Giá",F1:G2)=0,"Không có dữ liệu",DAVERAGE(A1:D50,"Giá",F1:G2))
```

{{anh:da-05-kiem-tra-truoc-bang-dcounta}}

Dùng `DCOUNTA` (đã nói ở bài trước) kiểm tra trước xem có dòng nào khớp không, rồi mới quyết định có gọi `DAVERAGE` hay hiển thị thông báo thay thế — tránh để lộ `#DIV/0!` ra báo cáo cuối cùng.

## Tổng kết

`DAVERAGE` tính trung bình dựa trên vùng điều kiện kiểu bảng, hỗ trợ kết hợp cả `VÀ` lẫn `HOẶC` linh hoạt như `DSUM`. Cùng chung điểm với `AVERAGEIF`/`AVERAGEIFS`: báo lỗi `#DIV/0!` khi không có dòng nào khớp, nên cần kiểm tra trước bằng `DCOUNTA` nếu muốn tránh lỗi lộ ra báo cáo.

Đọc tiếp trong cùng cụm bài: [DMAX, DMIN — giá trị lớn nhất và nhỏ nhất kiểu cơ sở dữ liệu](/blog/ham-dmax-dmin-gia-tri-lon-nhat-nho-nhat-co-so-du-lieu).
