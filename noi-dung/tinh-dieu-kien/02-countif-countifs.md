---
tieu_de: "COUNTIF và COUNTIFS: đếm ô có điều kiện, không đảo thứ tự như SUMIF/SUMIFS"
slug: "ham-countif-va-countifs-dem-o-co-dieu-kien"
danh_muc: "Excel"
the: ["COUNTIF", "COUNTIFS", "hàm thống kê"]
mo_ta: "COUNTIF đếm số ô thoả một điều kiện; COUNTIFS mở rộng lên nhiều điều kiện. Khác SUMIF/SUMIFS, hai hàm này không có vùng tính riêng nên cú pháp không bị đảo thứ tự — điểm giúp phân biệt rõ với cả nhóm hàm RACON."
tu_khoa: "hàm COUNTIF, hàm COUNTIFS, COUNTIF trong Excel, đếm ô có điều kiện, COUNTIF nhiều điều kiện, COUNTIFS cú pháp, đếm không trùng lặp COUNTIF"
anh_bia: "/images/bai-viet/countif-countifs/cover.png"
thu_muc_anh: "countif-countifs"
trang_thai: "draft"
---

[SUMIF](/blog/ham-sumif-va-sumifs-trong-excel-tinh-tong-co-dieu-kien) cộng **giá trị** thoả điều kiện. `COUNTIF` thì đơn giản hơn một bậc: nó chỉ **đếm số ô** thoả điều kiện, không quan tâm giá trị bên trong là bao nhiêu. Khác với [COUNT/COUNTA/COUNTBLANK](/blog/ham-count-counta-countblank-dem-o-trong-excel) đếm *mọi* ô theo kiểu dữ liệu, `COUNTIF` đếm *có chọn lọc* theo một điều kiện bạn đặt ra.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## COUNTIF: đếm theo một điều kiện

```excel
=COUNTIF(vùng, điều_kiện)
```

{{anh:cf-01-cu-phap-countif}}

Chỉ hai tham số — không có "vùng tính riêng" như `SUMIF`, vì bản thân việc đếm không cần biết giá trị là gì, chỉ cần biết ô đó có khớp điều kiện hay không.

```excel
=COUNTIF(KhuVuc,"Miền Bắc")
```

{{anh:cf-02-vi-du-mot-dieu-kien}}

Đếm có bao nhiêu đơn hàng thuộc `"Miền Bắc"` — không cần lọc dữ liệu rồi đếm dòng bằng mắt.

## COUNTIFS: nhiều điều kiện, và một điểm khác biệt quan trọng

```excel
=COUNTIFS(vùng_dk1, dk1, [vùng_dk2, dk2], ...)
```

{{anh:cf-03-cu-phap-countifs}}

Đây là điểm khiến `COUNTIF`/`COUNTIFS` **không** thuộc nhóm hàm hay gây nhầm thứ tự tham số: vì không có "vùng tính riêng" để mà đảo vị trí, cú pháp của `COUNTIFS` chỉ đơn giản là lặp lại cặp `vùng`/`điều_kiện` nhiều lần — không có gì bị đổi chỗ so với `COUNTIF`. So sánh với cách [SUMIFS đảo hẳn vị trí vùng tính tổng lên đầu](/blog/ham-racon-sumifs-countifs-averageifs-cu-phap-dac-biet), đây là lý do nhiều người dùng `COUNTIFS` làm mốc để nhớ — nó là hàm "hiền" nhất trong cả nhóm.

```excel
=COUNTIFS(NhomSanPham,"Laptop",KhuVuc,"Miền Bắc")
```

{{anh:cf-04-vi-du-nhieu-dieu-kien}}

Đếm số đơn vừa thuộc nhóm `"Laptop"` vừa ở `"Miền Bắc"` — mọi điều kiện phải cùng đúng, quan hệ **VÀ** giống hệt `SUMIFS`.

## Đếm theo quan hệ HOẶC bằng cách cộng nhiều COUNTIF

`COUNTIFS` chỉ ghép được điều kiện theo **VÀ**. Cần đếm theo **HOẶC** — ví dụ Laptop hoặc Chuột — cộng nhiều `COUNTIF` lại:

```excel
=COUNTIF(NhomSanPham,"Laptop") + COUNTIF(NhomSanPham,"Chuột")
```

{{anh:cf-05-hoac-cong-nhieu-countif}}

Nếu điều kiện HOẶC phức tạp hơn, kéo dài trên nhiều cột, [DCOUNT/DCOUNTA](/blog/ham-dcount-dcounta-dem-kieu-co-so-du-lieu) — nhóm hàm cơ sở dữ liệu — diễn đạt được cả những trường hợp `SUMIFS`/`COUNTIFS` không làm trực tiếp.

## Mẹo hay: đếm số giá trị không trùng lặp

Kết hợp `COUNTIF` với `SUMPRODUCT` cho ra một công thức đếm số giá trị **duy nhất** (không lặp) trong một vùng — ứng dụng ít người ngờ tới của một hàm tưởng chừng chỉ để đếm đơn giản:

```excel
=SUMPRODUCT(1/COUNTIF(A2:A10,A2:A10))
```

Cách đọc: `COUNTIF(A2:A10,A2:A10)` trả về một mảng số lần xuất hiện của từng ô; nghịch đảo `1/...` rồi cộng lại triệt tiêu phần trùng lặp, chỉ còn đúng số giá trị khác nhau.

## Ký tự đại diện, giống hệt SUMIF

`COUNTIF`/`COUNTIFS` cũng hiểu `*` và `?` trong điều kiện văn bản như [SUMIF](/blog/ham-sumif-va-sumifs-trong-excel-tinh-tong-co-dieu-kien):

```excel
=COUNTIF(TenSanPham,"Laptop*")
```

Đếm mọi dòng có tên bắt đầu bằng `"Laptop"`, không cần liệt kê từng biến thể tên.

## Kiểm nhanh trên máy bạn

- Đếm số đơn theo một khu vực bằng `COUNTIF`, rồi thêm điều kiện nhóm sản phẩm và chuyển sang `COUNTIFS` — để ý cú pháp không bị đảo vị trí như khi chuyển từ `SUMIF` sang `SUMIFS`.
- Thử công thức đếm giá trị không trùng lặp trên một cột tên có vài giá trị lặp lại.

Đọc tiếp trong cùng cụm bài: [RACON — vì sao SUMIFS, COUNTIFS, AVERAGEIFS đặt tham số khác thứ tự với bản số ít](/blog/ham-racon-sumifs-countifs-averageifs-cu-phap-dac-biet).
