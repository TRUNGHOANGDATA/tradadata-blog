---
tieu_de: "SORTBY: sắp xếp một danh sách theo tiêu chí nằm ở một cột khác"
slug: "ham-sortby-sap-xep-theo-cot-khac"
danh_muc: "Excel"
the: ["SORTBY", "hàm mảng động"]
mo_ta: "SORTBY sắp xếp một mảng dựa theo giá trị của một mảng khác cùng kích thước, thay vì phải sắp theo chính cột đang hiển thị như SORT. Hữu ích khi muốn hiện tên nhưng sắp theo điểm, hoặc hiện sản phẩm nhưng sắp theo doanh số."
tu_khoa: "hàm SORTBY Excel, sap xep theo cot khac, SORTBY khac SORT, mang dong Excel 365"
anh_bia: "/images/bai-viet/ham-sortby/cover.png"
thu_muc_anh: "ham-sortby"
trang_thai: "draft"
---

Bài [hàm mảng động](/blog/ham-mang-dong-excel-filter-sort-unique-lambda) đã giới thiệu `SORT` — sắp xếp một mảng theo chính giá trị của nó. `SORTBY` mở rộng thêm một bước: sắp xếp một mảng theo giá trị của một mảng **khác**, miễn hai mảng có cùng kích thước.

## Cú pháp

```excel
=SORTBY(mang, mang_sap_xep, [thu_tu])
```

{{anh:sb-01-cu-phap-co-ban}}

`mang` là dữ liệu muốn hiển thị ra kết quả, `mang_sap_xep` là dữ liệu dùng làm tiêu chí sắp xếp — hai mảng phải khớp nhau về số dòng để Excel biết dòng nào đi với dòng nào. `thu_tu` là `1` (tăng dần, mặc định) hoặc `-1` (giảm dần).

## Vì sao cần SORTBY thay vì SORT

`SORT` chỉ sắp xếp được theo đúng cột nó đang thao tác — muốn hiện tên nhân viên nhưng sắp theo điểm số, `SORT` một mình không làm được, vì kết quả trả về luôn được sắp theo chính cột đưa vào nó:

```excel
=SORTBY(TenNhanVien,DiemSo,-1)
```

{{anh:sb-02-hien-ten-sap-theo-diem}}

Công thức này hiện ra danh sách **tên**, nhưng thứ tự các tên lại theo **điểm số giảm dần** — điều `SORT(TenNhanVien)` một mình không thể làm, vì nó sẽ sắp tên theo thứ tự chữ cái chứ không theo điểm.

## Ứng dụng: sắp xếp sản phẩm theo doanh số, hiện đầy đủ nhiều cột

`SORTBY` không giới hạn ở việc trả về một cột — có thể đưa cả một bảng nhiều cột vào tham số `mang` đầu tiên, miễn `mang_sap_xep` vẫn đúng một cột làm tiêu chí:

```excel
=SORTBY(A2:C10,C2:C10,-1)
```

{{anh:sb-03-sap-xep-ca-bang}}

Toàn bộ bảng (`Tên sản phẩm`, `Nhóm hàng`, `Doanh số`) được sắp lại theo đúng thứ tự doanh số giảm dần, giữ nguyên các dòng đi cùng nhau — không bị xáo trộn lệch cột như khi sắp thủ công từng cột riêng lẻ.

## Kết hợp nhiều tiêu chí sắp xếp

```excel
=SORTBY(A2:C10,B2:B10,1,C2:C10,-1)
```

{{anh:sb-04-nhieu-tieu-chi}}

Có thể khai nhiều cặp `mang_sap_xep`/`thu_tu` liên tiếp — công thức này sắp trước theo `Nhóm hàng` tăng dần, trong cùng một nhóm hàng thì sắp tiếp theo `Doanh số` giảm dần, giống hệt cách sắp xếp nhiều cấp (`Sort` → `Add Level`) trong hộp thoại Sắp xếp thông thường của Excel, nhưng viết được thành một công thức duy nhất, tự cập nhật khi dữ liệu gốc thay đổi.

## Yêu cầu phiên bản và kết quả là mảng động

`SORTBY` chỉ có trên Excel 365 và Excel 2021 trở lên — không có ở các bản cũ hơn. Kết quả trả về là một mảng động, tự "tràn" (spill, xem [bài SPILL](/blog/ham-spill-trong-excel-tai-sao-khong-tran-cach-khac-phuc)) ra đủ số ô cần thiết, và tự động cập nhật lại thứ tự ngay khi dữ liệu nguồn thay đổi mà không cần bấm sắp xếp lại bằng tay.

{{anh:sb-05-mang-dong-tu-cap-nhat}}

## Tổng kết

`SORTBY` sắp xếp một mảng theo tiêu chí nằm ở một mảng khác, mở rộng đúng chỗ `SORT` còn thiếu — hiện một thứ nhưng sắp theo một thứ khác. Có thể sắp cả một bảng nhiều cột và kết hợp nhiều cấp tiêu chí trong cùng một công thức, tự cập nhật lại khi dữ liệu nguồn thay đổi vì đây là một mảng động.

Đây là bài cuối trong cụm 5 bài lô 13, bắt đầu từ [NETWORKDAYS.INTL](/blog/ham-networkdays-intl-cuoi-tuan-tuy-chinh).
