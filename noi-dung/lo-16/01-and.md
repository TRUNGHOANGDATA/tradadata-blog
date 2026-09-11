---
tieu_de: "AND: kiểm tra tất cả điều kiện cùng đúng, và một quy tắc tính toán dễ bị bỏ qua"
slug: "ham-and-tat-ca-dieu-kien-deu-dung"
danh_muc: "Excel"
the: ["AND", "hàm luận lý"]
mo_ta: "AND trả về TRUE khi tất cả điều kiện đưa vào đều đúng — một trong những hàm được dùng nhiều nhất bên trong IF. Excel không tính AND theo kiểu ngắn mạch như nhiều ngôn ngữ lập trình, nên mọi đối số đều được tính hết, kể cả khi không cần thiết."
tu_khoa: "hàm AND Excel, ket hop nhieu dieu kien Excel, AND trong IF, AND khong ngan mach"
anh_bia: "/images/bai-viet/ham-and/cover.png"
thu_muc_anh: "ham-and"
trang_thai: "draft"
---

`AND` là một trong những hàm luận lý được dùng nhiều nhất trong Excel — hầu như công thức `IF` nào cần kiểm tra nhiều điều kiện cùng lúc đều có `AND` nằm bên trong. Nhưng cách Excel tính `AND` có một điểm khác với trực giác lập trình thông thường, đáng để biết trước khi gặp phải.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=AND(dieu_kien1, dieu_kien2, ...)
```

{{anh:ad-01-cu-phap-co-ban}}

Trả về `TRUE` khi **tất cả** điều kiện đều đúng, `FALSE` nếu có bất kỳ điều kiện nào sai. Nhận tối đa `255` điều kiện cùng lúc.

## Ứng dụng: duyệt đơn hàng cần thoả nhiều tiêu chí cùng lúc

```excel
=IF(AND(DiemTinDung>=700,ThuNhap>=10000000),"Duyệt","Từ chối")
```

{{anh:ad-02-duyet-don-hang}}

Đơn hàng chỉ được duyệt khi **cả hai** điều kiện đều đúng — điểm tín dụng đạt ngưỡng **và** thu nhập đạt ngưỡng. Thiếu một trong hai, `AND` trả về `FALSE`, `IF` cho ra `"Từ chối"`.

## So sánh với việc lồng nhiều lớp IF

```excel
=IF(DiemTinDung>=700,IF(ThuNhap>=10000000,"Duyệt","Từ chối"),"Từ chối")
```

{{anh:ad-03-so-sanh-if-long}}

Cùng một logic, nhưng viết bằng `IF` lồng hai lớp phải lặp lại `"Từ chối"` ở cả hai nhánh — dùng `AND` gộp điều kiện lại một chỗ, công thức ngắn hơn và không lặp lại kết quả.

## Điểm dễ gây bất ngờ: AND không tính theo kiểu ngắn mạch

Nhiều ngôn ngữ lập trình dừng đánh giá ngay khi gặp điều kiện `FALSE` đầu tiên (ngắn mạch — "short-circuit"), không cần tính tiếp các điều kiện còn lại. Excel **không** làm vậy — `AND` luôn tính toán **toàn bộ** các đối số trước, bất kể đối số nào đã là `FALSE`:

```excel
=AND(B2<>0,C2/B2>10)
```

{{anh:ad-04-khong-ngan-mach}}

Nếu `B2` bằng `0`, về mặt logic điều kiện đầu `B2<>0` đã là `FALSE`, tưởng như không cần tính `C2/B2` nữa. Nhưng Excel vẫn tính `C2/B2` để đưa vào `AND`, và phép chia cho `0` này báo lỗi `#DIV/0!` — lỗi đó lan ra toàn bộ công thức `AND`, bất kể điều kiện đầu đã đủ để biết kết quả cuối cùng là `FALSE`.

{{anh:ad-05-cach-tranh-loi}}

Cách tránh: lồng `IF` để chặn phép tính có nguy cơ lỗi trước, chỉ tính nó khi điều kiện đầu đã an toàn:

```excel
=IF(B2<>0,AND(B2<>0,C2/B2>10),FALSE)
```

## Tổng kết

`AND` trả về `TRUE` khi tất cả điều kiện đều đúng, dùng phổ biến nhất để gộp nhiều tiêu chí vào một `IF` thay vì lồng nhiều lớp. Cần nhớ Excel tính hết toàn bộ đối số của `AND`, không ngắn mạch như nhiều ngôn ngữ lập trình — nếu một đối số có nguy cơ gây lỗi (chia cho `0`, tham chiếu rỗng), cần chặn bằng `IF` riêng trước khi đưa vào `AND`.

Đọc tiếp trong cùng cụm bài: [OR — chỉ cần một điều kiện đúng là đủ](/blog/ham-or-mot-dieu-kien-dung-la-du).
