---
tieu_de: "SUMIF và SUMIFS: cộng tổng có điều kiện, một hay nhiều điều kiện cùng lúc"
slug: "ham-sumif-va-sumifs-trong-excel-tinh-tong-co-dieu-kien"
danh_muc: "Excel"
the: ["SUMIF", "SUMIFS", "hàm toán học"]
mo_ta: "SUMIF cộng tổng chỉ trên các dòng thoả một điều kiện; SUMIFS mở rộng lên nhiều điều kiện cùng lúc. Hai hàm đặt vùng tính tổng ở hai vị trí ngược nhau trong cú pháp — điểm dễ gây nhầm lẫn nhất khi chuyển qua lại giữa chúng."
tu_khoa: "hàm SUMIF, hàm SUMIFS, SUMIF trong Excel, cộng tổng có điều kiện, SUMIF nhiều điều kiện, SUMIFS cú pháp, SUMIF và SUMIFS khác nhau"
anh_bia: "/images/bai-viet/sumif-sumifs/cover.png"
thu_muc_anh: "sumif-sumifs"
trang_thai: "draft"
---

[SUM](/blog/ham-sum-cong-tong-va-nhung-dieu-de-bi-bo-qua) cộng tất cả mọi thứ trong vùng, không chọn lọc. Thực tế công việc hiếm khi đơn giản vậy — bạn thường cần "tổng doanh thu **của riêng** nhóm Laptop", hay "tổng **chỉ tính** đơn ở Miền Bắc". Đó là việc của `SUMIF` (một điều kiện) và `SUMIFS` (nhiều điều kiện cùng lúc).

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## SUMIF: cộng tổng theo một điều kiện

```excel
=SUMIF(vùng_điều_kiện, điều_kiện, [vùng_tính_tổng])
```

{{anh:sf-01-cu-phap-sumif}}

Excel dò từng dòng trong `vùng_điều_kiện`; dòng nào khớp `điều_kiện` thì cộng giá trị tương ứng ở `vùng_tính_tổng`. Nếu bỏ trống tham số cuối, Excel tự dùng luôn `vùng_điều_kiện` để cộng — hợp khi bạn chỉ cần cộng chính cột đang lọc.

```excel
=SUMIF(NhomSanPham,"Laptop",DoanhThu)
```

{{anh:sf-02-vi-du-mot-dieu-kien}}

Cộng doanh thu chỉ trên các dòng có nhóm sản phẩm là `"Laptop"`, bỏ qua hoàn toàn dòng còn lại — không cần lọc dữ liệu rồi mới bôi đen tính `SUM` bằng tay.

## SUMIFS: nhiều điều kiện cùng lúc, nhưng đảo thứ tự tham số

Cần thêm điều kiện thứ hai — ví dụ chỉ Laptop **và** chỉ Miền Bắc — `SUMIF` không làm được (nó chỉ nhận một điều kiện). Đây là lúc dùng `SUMIFS`:

```excel
=SUMIFS(vùng_tính_tổng, vùng_dk1, dk1, [vùng_dk2, dk2], ...)
```

{{anh:sf-03-cu-phap-sumifs}}

Để ý thứ tự: `SUMIFS` đặt **vùng tính tổng lên đầu tiên**, ngược hẳn với `SUMIF` đặt vùng điều kiện lên đầu. Đây không phải điều tình cờ — nó là quy tắc chung của cả một [nhóm hàm mà bài riêng gọi là RACON](/blog/ham-racon-sumifs-countifs-averageifs-cu-phap-dac-biet), đáng đọc nếu bạn hay lẫn lộn thứ tự này.

```excel
=SUMIFS(DoanhThu,NhomSanPham,"Laptop",KhuVuc,"Miền Bắc")
```

{{anh:sf-04-vi-du-nhieu-dieu-kien}}

Mọi điều kiện phải cùng đúng (quan hệ **VÀ**) — ở đây là vừa Laptop vừa Miền Bắc. Có thể khai thêm nhiều cặp `vùng_dk`/`dk` để lọc dần, không giới hạn ở hai điều kiện.

## Ký tự đại diện trong điều kiện

Cả hai hàm đều hiểu ký tự đại diện `*` (bất kỳ chuỗi nào) và `?` (đúng một ký tự) trong điều kiện dạng văn bản:

```excel
=SUMIF(TenSanPham,"Laptop*",DoanhThu)
```

Cộng tổng mọi dòng có tên sản phẩm **bắt đầu bằng** `"Laptop"` — kể cả `"Laptop Dell"`, `"Laptop Asus"` — mà không cần liệt kê từng tên riêng lẻ.

## Lỗi #VALUE! khi các vùng lệch kích thước

```excel
=SUMIFS(DoanhThu,NhomSanPham,"Laptop",KhuVuc)
```

{{anh:sf-05-loi-value}}

Nếu vùng `DoanhThu`, `NhomSanPham`, `KhuVuc` không cùng số hàng — ví dụ một cột kéo dài đến dòng 100 còn cột kia chỉ đến dòng 90 — `SUMIFS` báo lỗi `#VALUE!`. Muốn kiểm tra trước khi lỗi xảy ra, [ROWS](/blog/ham-rows-columns-dem-kich-thuoc-vung) giúp so nhanh số hàng giữa các vùng.

## Dùng với Excel Table để hết lo lệch vùng

Cách chắc chắn tránh lỗi lệch kích thước ở trên là đặt dữ liệu vào một [Excel Table](/blog/excel-table-va-tham-chieu-theo-ten-cot) rồi tham chiếu theo tên cột:

```excel
=SUMIFS(BanHang[Doanh thu (VNĐ)],BanHang[Nhóm sản phẩm],"Laptop",BanHang[Khu vực],"Miền Bắc")
```

Đọc gần như một câu tiếng Việt, và các vùng luôn tự khớp số hàng vì chúng đều thuộc cùng một Table — thêm dòng dữ liệu mới, công thức tự tính đúng mà không cần sửa lại vùng tham chiếu.

## Kiểm nhanh trên máy bạn

- Viết `SUMIF` với một điều kiện trước, sau đó thêm điều kiện thứ hai và chuyển sang `SUMIFS` — chú ý phải dời `vùng_tính_tổng` từ cuối lên đầu.
- Thử điều kiện có `*` để cộng tổng theo nhóm tên gần giống nhau, thay vì liệt kê từng tên.

Đọc tiếp trong cùng cụm bài: [COUNTIF và COUNTIFS — đếm ô có điều kiện, cùng logic với SUMIF/SUMIFS](/blog/ham-countif-va-countifs-dem-o-co-dieu-kien).
