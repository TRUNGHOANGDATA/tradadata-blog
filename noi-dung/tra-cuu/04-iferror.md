---
tieu_de: "IFERROR: thay lỗi bằng một giá trị dễ đọc — và khi nào KHÔNG nên dùng"
slug: "ham-iferror-thay-loi-bang-gia-tri-khac"
danh_muc: "Excel"
the: ["IFERROR", "IFNA", "xử lý lỗi"]
mo_ta: "IFERROR trả về một giá trị thay thế khi công thức bên trong bị lỗi, thường dùng để biến #N/A của VLOOKUP thành một câu dễ đọc. Nhưng nó bắt mọi loại lỗi nên rất dễ che mất bug thật — bài này chỉ rõ ranh giới nên và không nên dùng."
tu_khoa: "hàm IFERROR, IFERROR trong Excel, thay thế lỗi Excel, IFERROR và IFNA, xử lý #N/A, bọc VLOOKUP IFERROR"
anh_bia: "/images/bai-viet/iferror/cover.png"
thu_muc_anh: "iferror"
trang_thai: "draft"
---

Một công thức [VLOOKUP](/blog/ham-vlookup-do-tim-theo-cot-doc) không tìm thấy giá trị sẽ trả `#N/A`. Trên một báo cáo gửi sếp, cả cột lấm tấm `#N/A` trông rất mất chuyên nghiệp. `IFERROR` sinh ra để xử lý đúng chuyện đó: khi công thức bên trong lỗi, nó trả về một giá trị thay thế do bạn chọn.

Nhưng đây cũng là một trong những hàm dễ bị lạm dụng nhất Excel — vì nó che *mọi* lỗi, kể cả lỗi bạn đáng lẽ phải biết. Hiểu ranh giới đó mới là phần quan trọng.

## Cú pháp: thử cái này, hỏng thì lấy cái kia

```excel
=IFERROR(công_thức, giá_trị_nếu_lỗi)
```

Excel chạy `công_thức` trước. Nếu nó ra kết quả bình thường, bạn nhận kết quả đó. Nếu nó trả về *bất kỳ* [mã lỗi nào](/blog/cac-ma-loi-thuong-gap-trong-excel) — `#N/A`, `#DIV/0!`, `#VALUE!`, `#REF!`... — bạn nhận `giá_trị_nếu_lỗi` thay thế.

{{anh:ie-01-truoc-sau}}

Ví dụ kinh điển là bọc quanh VLOOKUP:

```excel
=IFERROR(VLOOKUP(A2,DanhMuc,2,FALSE),"Chưa có mã này")
```

Mã nào tra được thì hiện tên; mã nào chưa có thì ô hiện `Chưa có mã này` thay vì `#N/A`.

## Cạm bẫy: IFERROR che cả bug thật

Đây là chỗ nhiều người vấp. IFERROR không phân biệt "không tìm thấy" (chuyện bình thường) với "công thức của tôi đang sai" (chuyện cần sửa). Nó nuốt hết.

Giả sử bạn gõ nhầm tên vùng, hay trỏ vào một ô đã bị xoá khiến công thức trả `#REF!`. Nếu công thức được bọc IFERROR, ô sẽ lặng lẽ hiện `"Chưa có mã này"` — và bạn tưởng chỉ là chưa có mã, trong khi thật ra **cả công thức đã hỏng**. Lỗi bị giấu đi thay vì được sửa.

Quy tắc gọn: **chỉ bọc IFERROR khi bạn đã biết chắc loại lỗi duy nhất có thể xảy ra là loại vô hại bạn lường trước.** Nếu chưa chắc, hãy để lỗi hiện ra để còn biết đường sửa.

## IFNA: bắt đúng #N/A, tha cho các lỗi khác

Với riêng tra cứu, có một hàm chính xác hơn: `IFNA`. Nó chỉ bắt `#N/A`, còn mọi lỗi khác vẫn cho hiện ra bình thường.

{{anh:ie-02-iferror-ifna}}

```excel
=IFNA(VLOOKUP(A2,DanhMuc,2,FALSE),"Chưa có mã này")
```

Sự khác biệt rất thực tế: nếu công thức bị `#REF!` vì bạn lỡ xoá cột, `IFNA` sẽ *để cho `#REF!` hiện ra* — bạn thấy ngay có gì đó hỏng. `IFERROR` thì giấu luôn. Với công thức tra cứu, `IFNA` gần như luôn là lựa chọn đúng hơn.

## Đừng dùng IFERROR để "dọn" #DIV/0!

Một cách dùng phổ biến khác là giấu lỗi chia cho 0:

```excel
=IFERROR(DoanhThu/SoDon, 0)
```

Nó chạy, nhưng hãy tự hỏi: `0` có thật sự là câu trả lời đúng khi `SoDon` bằng rỗng không? Đôi khi ô trống mới đúng, đôi khi cần một dấu gạch. Điểm mấu chốt: IFERROR chỉ *đổi cách hiển thị lỗi*, nó không *sửa* nguyên nhân. Hiểu vì sao ô bị `#DIV/0!` — thường là mẫu số bằng 0 hoặc rỗng — vẫn quan trọng hơn là dán một số 0 lên trên.

## Kiểm nhanh trên máy bạn

- Viết một VLOOKUP cho ra `#N/A`, bọc lần lượt bằng `IFERROR` rồi `IFNA`, sau đó cố ý làm hỏng vùng để tạo `#REF!` — quan sát `IFNA` để lỗi lộ ra còn `IFERROR` giấu đi.
- Nếu đang dùng Excel 365, nhớ rằng [XLOOKUP](/blog/ham-xlookup-ban-ke-nhiem-vlookup) có sẵn tham số "nếu không thấy", nên nhiều khi bạn không cần lớp IFERROR bên ngoài nữa.
