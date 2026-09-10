---
tieu_de: "COUNT, COUNTA và COUNTBLANK: ba hàm đếm dễ nhầm nhất trong Excel"
slug: "ham-count-counta-countblank-dem-o-trong-excel"
danh_muc: "Excel"
the: ["COUNT", "COUNTA", "COUNTBLANK", "hàm đếm"]
mo_ta: "Phân biệt COUNT (chỉ đếm số), COUNTA (đếm mọi ô có dữ liệu) và COUNTBLANK (đếm ô trống) — ba hàm tên gần giống nhau nhưng đếm ba thứ hoàn toàn khác nhau."
tu_khoa: "hàm COUNT Excel, hàm COUNTA, hàm COUNTBLANK, đếm ô trống Excel, đếm ô có dữ liệu, phân biệt COUNT COUNTA"
anh_bia: "/images/bai-viet/ham-count-counta-countblank/cover.png"
thu_muc_anh: "ham-count-counta-countblank"
trang_thai: "draft"
---

Ba hàm `COUNT`, `COUNTA`, `COUNTBLANK` là những hàm đầu tiên hầu hết mọi người học khi mới dùng Excel — chỉ đếm số ô, tưởng chừng không có gì để nhầm. Nhưng tên gần giống nhau khiến rất nhiều người dùng lẫn lộn, đặc biệt là giữa `COUNT` và `COUNTA`, vì chúng đếm **ba loại nội dung khác nhau** trong cùng một cột dữ liệu.

Bài này dùng một ví dụ duy nhất để thấy rõ cả ba hàm cho ra ba kết quả khác nhau trên cùng một vùng dữ liệu — và vì sao sự khác nhau đó lại quan trọng.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Bộ dữ liệu dùng trong bài

Bảng điểm kiểm tra của 8 học sinh. Có ô ghi điểm số, có ô ghi chữ "Vắng thi" (không tính điểm), và có ô còn để trống (chưa chấm xong).

{{anh:cc-01-du-lieu}}

## COUNT — chỉ đếm ô chứa SỐ

```excel
=COUNT(B2:B9)
```

`COUNT` chỉ đếm những ô chứa **giá trị số** — bỏ qua hoàn toàn ô chứa chữ, ô trống, hay ô chứa giá trị luận lý (`TRUE`/`FALSE`).

{{anh:cc-02-count}}

Với bảng điểm trên, `COUNT` trả về **4** — chỉ đếm 4 ô có điểm số thật (`8`, `7`, `9`, `6`), bỏ qua cả 2 ô ghi "Vắng thi" lẫn 2 ô còn trống.

## COUNTA — đếm mọi ô KHÔNG trống

```excel
=COUNTA(B2:B9)
```

`COUNTA` đếm rộng hơn nhiều: bất kỳ ô nào **có nội dung** — số, chữ, ngày tháng, thậm chí một chuỗi ký tự trống `""` do công thức khác trả về — đều được tính, miễn ô đó không thật sự để trống.

{{anh:cc-03-counta}}

Với cùng bảng điểm, `COUNTA` trả về **6** — đếm cả 4 ô có điểm số lẫn 2 ô ghi "Vắng thi", vì cả 6 ô này đều có nội dung. Chỉ có 2 ô thật sự trống mới bị loại ra.

## COUNTBLANK — đếm ô THẬT SỰ trống

```excel
=COUNTBLANK(B2:B9)
```

Ngược lại hoàn toàn với `COUNTA`: `COUNTBLANK` chỉ đếm những ô **không có gì cả**.

{{anh:cc-04-countblank}}

Kết quả trả về **2** — đúng bằng số học sinh chưa được chấm điểm.

## Ba con số cộng lại phải khớp

Cách kiểm tra nhanh xem có dùng đúng hàm hay không: `COUNTA` cộng `COUNTBLANK` phải luôn bằng đúng **tổng số ô** trong vùng đang xét.

{{anh:cc-05-doi-chieu}}

Với ví dụ này: `COUNTA` (6) + `COUNTBLANK` (2) = 8, đúng bằng tổng 8 học sinh. Nếu phép cộng này không khớp với tổng số dòng thực tế, gần như chắc chắn vùng dữ liệu trong công thức bị chọn sai — ví dụ chọn thiếu mất vài dòng, hoặc lỡ tay chọn dư ra ngoài bảng dữ liệu thật.

## Lỗi hay gặp: dùng COUNT khi ý là COUNTA

Đây là lỗi phổ biến nhất khi mới dùng ba hàm này. Muốn biết "có bao nhiêu học sinh đã nộp bài" — kể cả bài nộp dạng chữ như "Vắng thi, xin phép" — nhưng lại dùng `COUNT`, kết quả sẽ **thiếu** những dòng có nội dung dạng chữ, vì `COUNT` chỉ nhìn thấy số.

Ngược lại, muốn đếm "có bao nhiêu bài đã **chấm điểm** xong" thì phải dùng đúng `COUNT`, vì `COUNTA` sẽ đếm nhầm cả những ô chỉ ghi chú bằng chữ, không phải điểm số thật.

**Nguyên tắc chọn hàm:** hỏi bản thân câu "tôi đang đếm số lượng **giá trị**, hay đếm số lượng **ô đã được nhập gì đó**?" — câu đầu dùng `COUNT`, câu sau dùng `COUNTA`.

## Một ô trông có vẻ trống nhưng không phải trống

Có một trường hợp gây khó hiểu: một ô **trông** trống trên màn hình nhưng `COUNTBLANK` vẫn không đếm nó là trống. Điều này xảy ra khi ô đó chứa một công thức trả về chuỗi rỗng, ví dụ `=IF(A1="","",A1)` — khi `A1` trống, công thức này trả về `""`, và về mặt hiển thị ô trông như không có gì, nhưng Excel vẫn coi ô đó là **có nội dung** (một chuỗi rỗng), nên `COUNTBLANK` không tính nó, còn `COUNTA` thì có tính.

{{anh:cc-06-trong-gia}}

Gặp trường hợp `COUNTBLANK` cho ra kết quả ít hơn hẳn số ô trống nhìn thấy bằng mắt, đây thường chính là nguyên nhân — trong bảng có công thức trả về chuỗi rỗng thay vì để ô thật sự trống.

## Tổng kết

Ba hàm cùng họ nhưng đếm ba thứ khác nhau: `COUNT` chỉ đếm ô chứa số, `COUNTA` đếm mọi ô có nội dung bất kể kiểu gì, `COUNTBLANK` đếm ô thật sự trống. Cách kiểm nhanh xem công thức có đúng vùng dữ liệu hay không: `COUNTA` cộng `COUNTBLANK` phải bằng đúng tổng số ô trong vùng đó.

Đọc tiếp trong cùng cụm bài: [MAX, MIN, LARGE và SMALL — tìm giá trị lớn nhất, nhỏ nhất và xếp hạng theo vị trí](/blog/ham-max-min-large-small-tim-gia-tri-xep-hang).
