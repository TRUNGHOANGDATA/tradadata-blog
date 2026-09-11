---
tieu_de: "DSUM: tính tổng kiểu cơ sở dữ liệu, làm được điều SUMIFS không làm trực tiếp"
slug: "ham-dsum-tinh-tong-kieu-co-so-du-lieu"
danh_muc: "Excel"
the: ["DSUM", "hàm cơ sở dữ liệu"]
mo_ta: "DSUM tính tổng dựa trên một vùng điều kiện riêng biệt kiểu bảng, cho phép kết hợp cả điều kiện VÀ lẫn HOẶC phức tạp mà SUMIFS không làm trực tiếp được. Đổi lại phải dựng thêm một vùng điều kiện phụ, và tên cột phải khớp chính xác."
tu_khoa: "hàm DSUM Excel, ham co so du lieu, DSUM khac SUMIFS, dieu kien HOAC trong Excel"
anh_bia: "/images/bai-viet/ham-dsum/cover.png"
thu_muc_anh: "ham-dsum"
trang_thai: "draft"
---

`SUMIFS` (đã có [bài riêng](/blog/ham-sumif-va-sumifs-trong-excel-tinh-tong-co-dieu-kien)) chỉ ghép được các điều kiện theo quan hệ **VÀ** — mọi điều kiện phải cùng đúng. `DSUM` thuộc một nhóm hàm ít được nhắc tới hơn — nhóm hàm cơ sở dữ liệu (bắt đầu bằng chữ `D`) — cho phép diễn đạt cả quan hệ **HOẶC** phức tạp mà `SUMIFS` không làm trực tiếp được.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=DSUM(vung_du_lieu, truong, vung_dieu_kien)
```

{{anh:ds-01-cu-phap-co-ban}}

`vung_du_lieu` phải bao gồm dòng tiêu đề. `truong` là tên cột (hoặc số thứ tự cột) cần tính tổng. `vung_dieu_kien` là một bảng nhỏ riêng biệt — dòng đầu chép lại đúng tên cột, các dòng dưới là điều kiện.

## Điểm khác biệt cốt lõi: nhiều dòng trong vùng điều kiện = quan hệ HOẶC

Bảng bán hàng có cột `Miền`, `Sản phẩm`, `Doanh số`. Cần tính tổng doanh số của **Miền Bắc hoặc Miền Nam** (bỏ qua Miền Trung):

```excel
=DSUM(A1:C10,"Doanh số",E1:E3)
```

{{anh:ds-02-dieu-kien-hoac}}

Vùng điều kiện `E1:E3` chỉ có một cột `Miền`, nhưng **hai dòng** giá trị: `"Miền Bắc"` và `"Miền Nam"`. Mỗi dòng trong vùng điều kiện là một bộ điều kiện riêng, và `DSUM` cộng tất cả các dòng dữ liệu khớp với **bất kỳ** bộ điều kiện nào — đúng quan hệ `HOẶC`.

## So sánh với cách làm bằng SUMIFS

```excel
=SUMIFS(DoanhSo,Mien,"Miền Bắc")+SUMIFS(DoanhSo,Mien,"Miền Nam")
```

{{anh:ds-03-so-sanh-sumifs}}

Cùng kết quả, nhưng phải viết hai lần `SUMIFS` rồi cộng lại — với `DSUM`, chỉ cần thêm một dòng vào vùng điều kiện là mở rộng thêm một giá trị `HOẶC`, không cần sửa lại công thức chính.

## Nhiều cột cùng dòng trong vùng điều kiện = quan hệ VÀ

```excel
=DSUM(A1:C10,"Doanh số",E1:F2)
```

{{anh:ds-04-dieu-kien-va}}

Ngược lại, nếu hai điều kiện nằm **cùng một dòng** trong vùng điều kiện (ví dụ `Miền = "Miền Bắc"` và `Sản phẩm = "Bút bi"` trên cùng dòng `2`), quan hệ giữa chúng là `VÀ` — giống hệt cách `SUMIFS` ghép nhiều điều kiện. `DSUM` linh hoạt hơn ở chỗ có thể trộn cả `VÀ` lẫn `HOẶC` cùng lúc bằng cách sắp xếp các dòng và cột trong vùng điều kiện.

## Lỗi thường gặp: tên cột trong vùng điều kiện không khớp chính xác

```excel
=DSUM(A1:C10,"Doanh số",E1:E3)
```

{{anh:ds-05-loi-ten-cot-khong-khop}}

Nếu dòng đầu của vùng điều kiện gõ `"Miền "` (thừa một dấu cách) trong khi tiêu đề thật là `"Miền"`, `DSUM` không báo lỗi gì — nó âm thầm coi cột đó là "không có điều kiện", tính tổng luôn trên **toàn bộ** dữ liệu như thể điều kiện đó không tồn tại. Đây là lỗi khó phát hiện nhất khi dùng nhóm hàm `D`, vì kết quả trông vẫn hợp lý, chỉ là sai — luôn kiểm tra tên cột trong vùng điều kiện khớp tuyệt đối với dòng tiêu đề gốc.

## Tổng kết

`DSUM` tính tổng dựa trên một vùng điều kiện riêng biệt, cho phép kết hợp cả quan hệ `VÀ` (nhiều cột cùng dòng) lẫn `HOẶC` (nhiều dòng) — điều mà `SUMIFS` không làm trực tiếp được. Đổi lại phải dựng thêm một vùng điều kiện phụ, và tên cột trong đó phải khớp chính xác với tiêu đề dữ liệu gốc.

Đọc tiếp trong cùng cụm bài: [DCOUNT, DCOUNTA — đếm kiểu cơ sở dữ liệu, và khác biệt giữa đếm số với đếm mọi ô có dữ liệu](/blog/ham-dcount-dcounta-dem-kieu-co-so-du-lieu).
