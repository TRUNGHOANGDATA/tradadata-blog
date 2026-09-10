---
tieu_de: "ISREF: kiểm tra một tên có đang trỏ tới tham chiếu thật hay chỉ là một giá trị"
slug: "ham-isref-kiem-tra-tham-chieu-hop-le"
danh_muc: "Excel"
the: ["ISREF", "Named Range", "kiểm tra tham chiếu", "hàm cơ bản"]
mo_ta: "ISREF phân biệt một tên đã đặt (Named Range) đang trỏ tới một vùng ô thật, hay chỉ đang lưu một con số cố định — hai thứ dễ lẫn khi quản lý nhiều tên trong một file lớn."
tu_khoa: "hàm ISREF Excel, kiểm tra Named Range hợp lệ, phân biệt tham chiếu và giá trị, Name Manager Excel"
anh_bia: "/images/bai-viet/ham-isref/cover.png"
thu_muc_anh: "ham-isref"
trang_thai: "draft"
---

Bài về [Named Range](/blog/named-range-trong-excel-dat-ten-vung-du-lieu-cong-thuc) đã nói tới việc đặt tên cho một vùng dữ liệu để công thức dễ đọc hơn. Điều ít được nhắc tới: Excel cho phép một cái tên trỏ tới **hai loại thứ khác nhau** — hoặc một vùng ô thật trên bảng tính (tham chiếu), hoặc chỉ đơn giản là một con số hay công thức tính sẵn (giá trị, không phải tham chiếu). `ISREF` là hàm duy nhất phân biệt được rạch ròi hai loại này.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Hai loại tên hoàn toàn khác nhau trong Name Manager

Mở **Formulas > Name Manager**, có thể thấy hai kiểu tên rất khác bản chất dù cùng nằm trong một danh sách:

{{anh:ir-01-name-manager}}

- **`VungDoanhThu`** trỏ tới `Sheet1!$B$2:$B$10` — đây là một **tham chiếu** thật, trỏ tới các ô cụ thể trên bảng tính.
- **`ThueSuat`** được đặt bằng `=10%` — đây chỉ là một **giá trị hằng số**, không trỏ tới ô nào cả, dù cách đặt tên và cách gọi ra dùng giống hệt nhau trong công thức.

## ISREF — phân biệt rạch ròi hai loại đó

```excel
=ISREF(value)
```

```excel
=ISREF(VungDoanhThu)   ' TRUE  — đây là tham chiếu tới vùng ô thật
=ISREF(ThueSuat)        ' FALSE — đây chỉ là một giá trị hằng số
```

{{anh:ir-02-isref-hai-truong-hop}}

Kết quả `TRUE`/`FALSE` cho biết ngay tên đó có đang neo vào một vùng ô cụ thể hay không — thông tin không thể nhìn thấy chỉ bằng cách gọi tên đó ra trong một ô để xem giá trị hiển thị, vì cả hai loại đều hiển thị ra một con số bình thường.

## Vì sao sự phân biệt này quan trọng trong thực tế

Nếu dùng nhầm một tên hằng số ở chỗ công thức cần một **vùng** — ví dụ đưa `ThueSuat` (giá trị hằng số) vào `SUM(ThueSuat)` khi ý định thực ra là cộng một cột số — Excel không báo lỗi cú pháp, vì `SUM` của một số đơn lẻ vẫn là một phép tính hợp lệ, chỉ là kết quả hoàn toàn không phải điều mong muốn. `ISREF` giúp phát hiện sự nhầm lẫn loại này trước khi nó gây ra kết quả sai lặng lẽ.

{{anh:ir-03-vi-du-nham-lan}}

## Ứng dụng: rà soát toàn bộ Named Range trong một file lớn

Với file có hàng chục tên đã đặt tích luỹ qua nhiều năm, một số tên có thể đã lỗi thời — trỏ tới vùng đã bị xoá, hoặc bị đổi từ tham chiếu sang hằng số do ai đó sửa nhầm trong Name Manager. Kết hợp `ISREF` với một bảng liệt kê tên để rà soát nhanh:

{{anh:ir-04-bang-ra-soat}}

```excel
=IF(ISREF(INDIRECT(A2)), "Tham chiếu hợp lệ", "Không phải tham chiếu")
```

{{anh:ir-05-ra-soat-bang-indirect}}

Đọc theo từng lớp: cột `A` liệt kê tên các Named Range dưới dạng văn bản (ví dụ `"VungDoanhThu"`). `INDIRECT(A2)` biến chuỗi văn bản đó thành tham chiếu thật tới đúng cái tên đó — đúng kỹ thuật đã nói ở bài [ADDRESS](/blog/ham-address-dung-dia-chi-o-dang-van-ban). `ISREF` sau đó kiểm tra xem kết quả có phải một tham chiếu vùng ô thật hay không.

## Tổng kết

`ISREF` phân biệt một tên đã đặt đang trỏ tới một vùng ô thật hay chỉ đang lưu một giá trị hằng số — hai khái niệm dễ lẫn vì cách gọi tên ra dùng trong công thức giống hệt nhau, dù bản chất phía sau hoàn toàn khác. Hữu ích nhất khi rà soát các Named Range trong một file lớn, tích luỹ qua nhiều năm, để phát hiện những tên đã lỗi thời hoặc bị đổi bản chất mà không ai để ý.

Đọc tiếp trong cùng cụm bài: [NA — tạo lỗi #N/A có chủ đích làm giá trị giữ chỗ](/blog/ham-na-tao-loi-co-chu-dich).
