---
tieu_de: "SUMSQ và PRODUCT: tổng bình phương và tích của một dãy số"
slug: "ham-sumsq-product-tong-binh-phuong-va-tich"
danh_muc: "Excel"
the: ["SUMSQ", "PRODUCT", "hàm tính tổng", "hàm cơ bản"]
mo_ta: "SUMSQ cộng tổng bình phương của một dãy số, PRODUCT nhân tất cả số trong một vùng lại với nhau — hai hàm ít dùng nhưng thay cho những công thức dài dòng hơn nhiều."
tu_khoa: "hàm SUMSQ Excel, hàm PRODUCT Excel, tổng bình phương, tích các số trong Excel, PRODUCT thay cho dấu nhân"
anh_bia: "/images/bai-viet/ham-sumsq-product/cover.png"
thu_muc_anh: "ham-sumsq-product"
trang_thai: "draft"
---

`SUM` cộng, đã quá quen thuộc. Nhưng có hai phép tính tổng hợp khác cũng thường gặp mà `SUM` không làm được trực tiếp: cộng tổng các **bình phương** của một dãy số, và nhân tất cả các số trong một vùng lại với nhau. `SUMSQ` và `PRODUCT` làm đúng hai việc đó, thay cho những công thức dài dòng hơn nhiều nếu phải viết tay.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## SUMSQ — tổng bình phương của một dãy số

```excel
=SUMSQ(number1, [number2], ...)
```

{{anh:sp-01-du-lieu}}

```excel
=SUMSQ(B2:B6)
```

{{anh:sp-02-sumsq}}

`SUMSQ` bình phương từng số trong vùng rồi cộng tất cả lại — với dãy `3, 4, 5, 6, 7`, kết quả là `3² + 4² + 5² + 6² + 7² = 9 + 16 + 25 + 36 + 49 = 135`.

Không dùng `SUMSQ`, muốn tính cùng kết quả phải viết một công thức mảng dài hơn:

```excel
=SUMPRODUCT(B2:B6, B2:B6)
```

{{anh:sp-03-cach-thay-the}}

Cách này cho ra cùng kết quả — nhân mỗi số với chính nó rồi cộng lại — nhưng `SUMSQ` ngắn gọn và dễ đọc hơn hẳn khi chỉ cần đúng phép tính này.

## Ứng dụng: liên hệ với STEYX trong cụm bài hồi quy tuyến tính

Tổng bình phương không phải một phép tính trừu tượng — nó chính là nền tảng của cách đo sai số đã nói ở bài [STEYX: sai số chuẩn của mô hình hồi quy](/blog/ham-steyx-sai-so-chuan-mo-hinh-hoi-quy). `STEYX` tính sai số dựa trên tổng bình phương của phần chênh lệch giữa giá trị thực tế và giá trị dự đoán — đúng cơ chế `SUMSQ` đang làm, chỉ khác là áp dụng lên phần dư thay vì áp dụng lên dữ liệu gốc.

## PRODUCT — nhân tất cả số trong một vùng

```excel
=PRODUCT(number1, [number2], ...)
```

{{anh:sp-04-product-du-lieu}}

```excel
=PRODUCT(B2:B5)
```

{{anh:sp-05-product}}

Với dãy `2, 3, 4, 5`, kết quả là `2 × 3 × 4 × 5 = 120`. Không dùng `PRODUCT`, cách viết tay là nối các ô lại bằng dấu `*`:

```excel
=B2*B3*B4*B5
```

Với vùng chỉ vài ô, cách viết tay này không phiền toái. Nhưng với vùng có hàng chục ô, viết tay dấu `*` giữa từng ô là không thực tế — `PRODUCT` xử lý cả một vùng chỉ bằng một tham số, không quan tâm vùng đó dài bao nhiêu ô.

## PRODUCT bỏ qua ô trống và ô chứa chữ

Một điểm hữu ích của `PRODUCT`: nó tự động **bỏ qua** những ô trống hoặc ô chứa văn bản trong vùng, chỉ nhân những ô thực sự là số — không giống phép nhân bằng dấu `*` trực tiếp giữa các ô, vốn sẽ báo lỗi `#VALUE!` ngay khi gặp một ô chứa chữ.

{{anh:sp-06-bo-qua-o-chu}}

Đây là hành vi giống với cách `SUM` bỏ qua ô chữ, khác hẳn với phép cộng bằng dấu `+` trực tiếp giữa các ô — cũng sẽ báo lỗi nếu gặp ô chứa văn bản. Tính chất "bỏ qua ô không phải số" này là điểm chung của mọi hàm tổng hợp có sẵn (`SUM`, `PRODUCT`, `SUMSQ`, `COUNT`...), khác hẳn phép tính viết tay bằng toán tử trực tiếp.

## Ứng dụng thực tế: tính tỷ lệ tăng trưởng luỹ kế qua nhiều kỳ

`PRODUCT` có một ứng dụng tài chính đáng chú ý: tính tỷ lệ tăng trưởng gộp của nhiều kỳ liên tiếp, mỗi kỳ có tỷ lệ tăng trưởng khác nhau.

{{anh:sp-07-du-lieu-tang-truong}}

```excel
=PRODUCT(1+B2:B5) - 1
```

{{anh:sp-08-tang-truong-luy-ke}}

Đây là công thức mảng — cần `Ctrl + Shift + Enter` trên bản Excel không phải Microsoft 365. `1+B2:B5` cộng thêm `1` vào từng tỷ lệ tăng trưởng của mỗi kỳ (chuyển từ dạng phần trăm sang dạng hệ số nhân), `PRODUCT` nhân tất cả các hệ số đó lại — đúng nguyên lý tăng trưởng gộp: tăng 10% rồi tăng tiếp 5% không phải cộng đơn giản `10% + 5% = 15%`, mà phải nhân hệ số `1,10 × 1,05` rồi mới trừ lại `1` để ra tỷ lệ tăng trưởng gộp thật sự.

## Tổng kết

`SUMSQ` cộng tổng bình phương của một dãy số, hữu ích cho các phép tính thống kê dựa trên tổng bình phương như sai số hồi quy. `PRODUCT` nhân tất cả số trong một vùng, ngắn gọn hơn viết tay dấu `*` khi vùng có nhiều ô, và tự động bỏ qua ô trống hay ô chứa chữ — khác hẳn phép nhân trực tiếp bằng dấu `*` sẽ báo lỗi ngay khi gặp ô không phải số.

Đọc tiếp trong cùng cụm bài: [DAYS và DAYS360 — đếm số ngày giữa hai mốc thời gian](/blog/ham-days-days360-dem-so-ngay-giua-hai-moc).
