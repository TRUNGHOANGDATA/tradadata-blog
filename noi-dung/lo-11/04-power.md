---
tieu_de: "POWER: tính luỹ thừa rõ ràng hơn dấu mũ, và một số mũ không nguyên gây lỗi bất ngờ"
slug: "ham-power-luy-thua-ro-rang"
danh_muc: "Excel"
the: ["POWER", "hàm toán học"]
mo_ta: "POWER tính luỹ thừa giống hệt dấu ^ nhưng viết rõ ràng hơn khi công thức đã phức tạp. Với số mũ không nguyên và cơ số âm, POWER báo lỗi #NUM! dù kết quả toán học thực sự tồn tại — vì Excel tính qua logarit, không định nghĩa được cho cơ số âm."
tu_khoa: "hàm POWER Excel, luỹ thừa Excel, POWER khác dấu mũ, lỗi NUM POWER cơ số âm, tính lãi kép bằng POWER"
anh_bia: "/images/bai-viet/ham-power/cover.png"
thu_muc_anh: "ham-power"
trang_thai: "draft"
---

Bài trước, [SQRT](/blog/ham-sqrt-can-bac-hai) tính căn bậc hai. `POWER` đi chiều ngược lại — tính luỹ thừa — và có cùng kiểu quy tắc về dấu đáng chú ý khi số mũ không phải số nguyên.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=POWER(so, so_mu)
```

{{anh:pw-01-cu-phap-co-ban}}

`POWER(2,10)` trả về `1024`, giống hệt kết quả của `2^10` dùng dấu mũ. Hai cách viết cho ra cùng một kết quả — khác biệt chỉ nằm ở cách trình bày công thức.

## Vì sao dùng POWER thay vì dấu ^

Với công thức đơn giản, dấu `^` ngắn gọn hơn hẳn. Nhưng khi số mũ tự nó đã là một biểu thức phức tạp, `POWER` tách rõ hai phần rõ ràng hơn, đặc biệt khi đọc lại công thức của người khác hay công thức xuất từ hệ thống khác vốn quen dùng dạng hàm thay vì toán tử:

```excel
=POWER(1+LaiSuat, SoNam)
```

{{anh:pw-02-so-sanh-power-mu}}

## Ứng dụng: tính lãi kép mà không cần hàm FV

Số tiền gốc `10.000.000` với lãi suất `8%`/năm sau `5` năm:

```excel
=SoTien*POWER(1+LaiSuat,SoNam)
```

{{anh:pw-03-lai-kep}}

Kết quả xấp xỉ `14.693.281` — cách tính này tương đương với dùng hàm `FV` (xem [bài FV, PV](/blog/ham-fv-pv-gia-tri-tuong-lai-va-hien-tai)) nhưng viết trực tiếp theo công thức lãi kép gốc, hữu ích khi cần tuỳ biến thêm các điều kiện mà `FV` không hỗ trợ sẵn.

## Lỗi thường gặp: số mũ không nguyên với cơ số âm

Về mặt toán học, căn bậc ba của `-8` là `-2` (vì `(-2)³=-8`), tương đương `POWER(-8, 1/3)`. Nhưng thử trong Excel:

```excel
=POWER(-8,1/3)
```

{{anh:pw-04-loi-num-co-so-am}}

Kết quả là `#NUM!`, không phải `-2`. Lý do: với số mũ không nguyên, Excel tính `POWER` theo công thức `e^(so_mu×ln(so))`, mà `ln` (logarit tự nhiên) không xác định được với số âm. Excel không kiểm tra xem kết quả cuối cùng có "thực ra vẫn là một số thực hợp lệ" như `-2` hay không — cứ hễ cơ số âm và số mũ không nguyên là báo lỗi ngay ở bước tính logarit, bất kể đáp án toán học có tồn tại hay không.

{{anh:pw-05-luu-y-so-mu-nguyen}}

Điều này chỉ xảy ra khi số mũ **không nguyên**. Với số mũ nguyên (`POWER(-8,3)`), Excel tính bình thường không lỗi, vì phép nhân lặp lại không cần đi qua logarit.

## Tổng kết

`POWER` tính luỹ thừa, cho kết quả giống hệt dấu `^` nhưng đọc rõ ràng hơn trong công thức phức tạp. Cần nhớ: số mũ không nguyên kết hợp với cơ số âm luôn báo lỗi `#NUM!`, dù đáp án toán học có tồn tại hay không, vì Excel tính qua logarit tự nhiên — không định nghĩa được với số âm.

Đọc tiếp trong cùng cụm bài: [TRUE, FALSE — hai hàm không đối số, và vì sao gõ trong ngoặc kép lại thành một thứ khác hẳn](/blog/ham-true-false-hang-luan-ly).
