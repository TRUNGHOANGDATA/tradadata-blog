---
tieu_de: "ISNUMBER, ISTEXT, ISBLANK và ISERROR: kiểm tra kiểu dữ liệu trong ô trước khi tính"
slug: "ham-isnumber-istext-isblank-iserror-kiem-tra-kieu-du-lieu"
danh_muc: "Excel"
the: ["ISNUMBER", "ISTEXT", "ISBLANK", "ISERROR", "kiểm tra dữ liệu"]
mo_ta: "Cách dùng nhóm hàm ISxxx để kiểm tra một ô đang chứa số, chữ, trống hay lỗi trước khi đưa vào công thức, tránh những phép tính âm thầm sai vì lẫn kiểu dữ liệu."
tu_khoa: "hàm ISNUMBER Excel, hàm ISTEXT, hàm ISBLANK, hàm ISERROR, kiểm tra kiểu dữ liệu trong ô, số lưu dạng văn bản"
anh_bia: "/images/bai-viet/ham-isnumber-istext-isblank-iserror/cover.png"
thu_muc_anh: "ham-isnumber-istext-isblank-iserror"
trang_thai: "draft"
---

Một trong những nguồn lỗi âm thầm nhất trong Excel không phải công thức sai, mà là **kiểu dữ liệu sai** — một ô trông như chứa số nhưng thực chất là văn bản, một ô trống nhưng lại chứa công thức trả về chuỗi rỗng. Những trường hợp này không báo lỗi gì, chỉ âm thầm cho ra kết quả sai.

Nhóm hàm bắt đầu bằng `IS` — `ISNUMBER`, `ISTEXT`, `ISBLANK`, `ISERROR` và một vài hàm khác cùng họ — luôn trả về đúng một trong hai giá trị `TRUE` hoặc `FALSE`, dùng để kiểm tra chính xác một ô đang chứa loại dữ liệu gì, trước khi đưa vào công thức khác.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Bộ dữ liệu dùng trong bài

Một cột dữ liệu hỗn hợp: số, văn bản, ô trống, và một công thức bị lỗi — mô phỏng đúng kiểu dữ liệu lộn xộn hay gặp khi nhập liệu thực tế hoặc xuất từ hệ thống khác sang.

{{anh:is-01-du-lieu}}

## ISNUMBER — ô này có phải là số không

```excel
=ISNUMBER(A2)
```

Trả về `TRUE` nếu ô chứa giá trị số, `FALSE` cho mọi trường hợp khác.

{{anh:is-02-isnumber}}

Đây chính là công cụ chẩn đoán nhanh nhất cho lỗi "số lưu dạng văn bản" đã nói ở bài [lỗi #N/A trong VLOOKUP](/blog/loi-na-vlookup-6-nguyen-nhan-va-cach-sua): một ô ghi `1024` nhưng thực chất được nhập dưới dạng văn bản sẽ khiến `ISNUMBER` trả về `FALSE`, dù mắt nhìn thấy toàn chữ số. Đây là cách xác nhận chắc chắn nhất, đáng tin hơn nhiều so với chỉ nhìn vị trí căn lề trái/phải của ô.

## ISTEXT — ô này có phải là văn bản không

```excel
=ISTEXT(A2)
```

Làm ngược lại `ISNUMBER`: trả về `TRUE` nếu ô chứa văn bản.

{{anh:is-03-istext}}

## ISBLANK — ô này có thật sự trống không

```excel
=ISBLANK(A2)
```

Trả về `TRUE` chỉ khi ô hoàn toàn không có gì. Đúng như đã nói ở bài [COUNT, COUNTA và COUNTBLANK](/blog/ham-count-counta-countblank-dem-o-trong-excel), một ô chứa công thức trả về chuỗi rỗng `""` trông có vẻ trống nhưng `ISBLANK` sẽ trả về `FALSE`, vì về bản chất ô đó vẫn đang chứa một công thức, chỉ là công thức đó cho ra kết quả hiển thị trống.

{{anh:is-04-isblank}}

## ISERROR — ô này có đang báo lỗi không

```excel
=ISERROR(A2)
```

Trả về `TRUE` nếu ô chứa bất kỳ loại lỗi nào — `#N/A`, `#VALUE!`, `#REF!`, `#DIV/0!`, và các loại lỗi khác đã liệt kê ở bài [xử lý lỗi trong VLOOKUP](/blog/loi-na-vlookup-6-nguyen-nhan-va-cach-sua).

{{anh:is-05-iserror}}

`ISERROR` bắt **mọi** loại lỗi, không phân biệt loại nào — đây là điểm khác với `ISNA` (chỉ bắt riêng lỗi `#N/A`), một hàm cùng họ nhưng hẹp hơn. Sự khác biệt này giống hệt logic đã nói ở bài `IFNA` so với `IFERROR`: bắt đúng loại lỗi mình đã lường trước bao giờ cũng an toàn hơn bắt tất cả một cách mù quáng.

## Ứng dụng thực tế: kiểm tra trước khi tính, tránh lỗi lan truyền

Giá trị thực sự của nhóm hàm `IS` nằm ở việc **kiểm tra trước khi tính**, thay vì tính xong rồi mới xử lý lỗi. Bài toán cụ thể: chỉ cộng những ô thực sự là số trong cột dữ liệu hỗn hợp ở đầu bài, bỏ qua văn bản và ô trống.

Cách viết tưởng hợp lý nhưng thực chất sẽ báo lỗi:

```excel
=SUMPRODUCT(ISNUMBER(A2:A8) * A2:A8)
```

`ISNUMBER(A2:A8)` cho ra một dãy `TRUE`/`FALSE` đúng như mong đợi. Nhưng phép nhân `* A2:A8` lại nhân trực tiếp dãy `TRUE`/`FALSE` đó với **chính vùng dữ liệu gốc** — tới đúng ô nào đang chứa chữ, Excel phải nhân `FALSE` với một chuỗi văn bản, và đây là phép tính không hợp lệ. Kết quả: công thức trả về `#VALUE!`, dù ý tưởng ban đầu nghe có vẻ đúng.

Cách an toàn hơn, tách bạch rõ từng bước bằng một cột phụ:

{{anh:is-06-cot-phu-kiem-tra}}

Thêm một cột phụ dùng `=IF(ISNUMBER(A2), A2, 0)` cho từng dòng — nếu là số thì giữ nguyên, không phải số thì thay bằng `0` — rồi `SUM` cột phụ đó lại. Cách này tránh được lỗi kiểu dữ liệu vì mỗi dòng đã được kiểm tra và xử lý an toàn trước khi cộng, thay vì cố nhân thẳng vào một vùng dữ liệu còn lẫn văn bản.

## So sánh với việc chỉ dựa vào IFERROR

Một thói quen phổ biến nhưng kém an toàn hơn: bọc mọi công thức bằng `IFERROR` để "cho chắc", thay vì kiểm tra kiểu dữ liệu từ trước bằng nhóm hàm `IS`. Cách làm này che giấu triệu chứng thay vì xử lý nguyên nhân — công thức vẫn chạy trên dữ liệu sai kiểu, chỉ là kết quả lỗi bị giấu đi bằng một giá trị thay thế, khiến việc phát hiện dữ liệu gốc có vấn đề trở nên khó hơn nhiều so với việc dùng `ISNUMBER`/`ISTEXT` để phát hiện đúng nguyên nhân ngay từ đầu.

## Tổng kết

Nhóm hàm `ISNUMBER`, `ISTEXT`, `ISBLANK`, `ISERROR` đều trả về `TRUE`/`FALSE`, dùng để xác nhận chính xác kiểu dữ liệu của một ô trước khi đưa vào công thức khác — thay vì đoán qua vị trí căn lề hay chờ công thức báo lỗi rồi mới xử lý. Dùng nhóm hàm này để kiểm tra trước giúp phát hiện đúng nguyên nhân của lỗi dữ liệu, thay vì chỉ che giấu triệu chứng bằng `IFERROR`.

Đây là bài cuối trong cụm 5 bài về các hàm Excel cơ bản, dùng hàng ngày. Xem lại từ đầu: [COUNT, COUNTA và COUNTBLANK](/blog/ham-count-counta-countblank-dem-o-trong-excel), [MAX, MIN, LARGE và SMALL](/blog/ham-max-min-large-small-tim-gia-tri-xep-hang), [PROPER, UPPER và LOWER](/blog/ham-proper-upper-lower-chuan-hoa-chu-hoa-thuong), [LEN và REPT](/blog/ham-len-rept-dem-do-dai-chuoi-lap-ky-tu).
