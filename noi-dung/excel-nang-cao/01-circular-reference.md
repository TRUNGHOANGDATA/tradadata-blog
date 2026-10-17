---
tieu_de: "Tham chiếu vòng (Circular Reference): vì sao Excel báo lỗi, và khi nào nên bật Iterative Calculation"
slug: "tham-chieu-vong-va-tinh-lap-trong-excel-circular-reference"
danh_muc: "Excel"
the: ["Circular Reference", "Iterative Calculation"]
mo_ta: "Circular Reference xảy ra khi một công thức tham chiếu ngược lại chính ô chứa nó, trực tiếp hoặc qua một chuỗi ô trung gian. Phần lớn là lỗi cần sửa, nhưng có một số ít trường hợp cố ý cần vòng lặp — lúc đó Iterative Calculation mới là công cụ đúng, không phải sửa công thức."
tu_khoa: "Circular Reference Excel, tham chieu vong Excel, loi vong lap cong thuc, Iterative Calculation Excel, bat tinh lap trong Excel"
anh_bia: "/images/bai-viet/circular-reference/cover.png"
thu_muc_anh: "circular-reference"
trang_thai: "draft"
---

Gõ công thức xong, Excel bật ra một hộp cảnh báo "Circular Reference Warning" thay vì kết quả. Đây là một trong những lỗi khiến người mới hoang mang nhất — không phải vì nó khó sửa, mà vì thông báo không chỉ thẳng ra công thức nào đang sai.

## Tham chiếu vòng là gì

Tham chiếu vòng (circular reference) xảy ra khi một công thức, trực tiếp hoặc gián tiếp qua nhiều ô trung gian, **tham chiếu ngược lại chính ô chứa nó**:

{{anh:cr-01-vong-truc-tiep}}

Trường hợp đơn giản nhất: gõ vào ô `A1` công thức `=A1+1`. Excel không thể tính ra kết quả, vì để biết `A1` là gì, nó cần biết `A1` là gì — một vòng lặp vô tận về mặt logic.

## Vòng lặp gián tiếp qua nhiều ô — khó phát hiện hơn nhiều

Trường hợp trên dễ thấy vì chỉ có một ô. Thực tế, tham chiếu vòng thường xảy ra qua một **chuỗi** vài ô, khiến mắt thường khó lần ra:

{{anh:cr-02-vong-gian-tiep}}

`A1` tham chiếu tới `B1`, `B1` tham chiếu tới `C1`, và `C1` lại vô tình tham chiếu ngược về `A1` — khép kín thành một vòng. Bảng tính càng lớn, chuỗi tham chiếu càng dài, việc tự dò bằng mắt càng mất thời gian.

## Dùng công cụ Trace để tìm đúng chỗ vòng khép lại

Đừng dò bằng mắt trên bảng lớn. Excel có sẵn công cụ chỉ thẳng đường đi của tham chiếu vòng: chọn ô đang báo lỗi, vào `Formulas → Error Checking → Circular References` để xem danh sách các ô liên quan, rồi dùng `Trace Precedents`/`Trace Dependents` để vẽ mũi tên nối các ô trong chuỗi:

{{anh:cr-03-cong-cu-trace}}

Đi theo mũi tên là cách nhanh nhất xác định đúng ô nào cần sửa lại công thức, thay vì đoán mò.

## Phần lớn trường hợp: sửa lại công thức

Tuyệt đại đa số tham chiếu vòng là **lỗi gõ nhầm** — quên không dịch vùng khi kéo công thức, hoặc gộp nhầm một ô tổng vào chính vùng nó đang tính tổng (ví dụ `=SUM(A1:A10)` gõ vào ô `A10`). Cách xử lý đúng trong những trường hợp này là **sửa lại công thức** để không còn trỏ ngược về chính nó nữa — không phải đi tìm cách "cho phép" vòng lặp chạy.

## Trường hợp hiếm: cố ý cần một vòng lặp

Có một số ít bài toán tài chính/kỹ thuật **thật sự cần** một giá trị phụ thuộc ngược vào chính nó qua nhiều bước lặp cho tới khi hội tụ — ví dụ tính lãi vay khi phí xử lý khoản vay lại được cộng dồn vào chính khoản vay đó. Với những trường hợp hiếm này, Excel có `Iterative Calculation`:

{{anh:cr-04-iterative-calculation}}

Bật ở `File → Options → Formulas → Enable iterative calculation`, kèm hai tham số:
- **Maximum Iterations**: số lần Excel lặp lại phép tính trước khi dừng (mặc định `100`).
- **Maximum Change**: ngưỡng chênh lệch giữa hai lần lặp liên tiếp để coi là đã "hội tụ", đủ gần đúng để dừng (mặc định `0.001`).

## Vì sao không nên bật Iterative Calculation theo mặc định

Đây là điểm quan trọng nhất bài này muốn nhấn mạnh: **đừng bật `Iterative Calculation` chỉ để tắt tiếng cảnh báo.** Bật tính năng này biến một công cụ báo lỗi hữu ích thành công cụ **im lặng chấp nhận mọi vòng lặp**, kể cả những vòng lặp là lỗi thật sự — Excel sẽ cứ lặp cho tới khi đạt ngưỡng rồi trả về một con số, dù con số đó có thể hoàn toàn vô nghĩa. Chỉ bật tính năng này khi bạn **chắc chắn** vòng lặp đó là cố ý và hiểu rõ vì sao cần nó — còn lại, hộp cảnh báo Circular Reference đang làm đúng việc của nó: báo cho bạn biết công thức có vấn đề.

## Kiểm nhanh trên máy bạn

- Gõ `=A1+1` vào ô `A1` để thấy cảnh báo xuất hiện, rồi thử `Trace Precedents` để xem mũi tên chỉ về đâu.
- Dựng một vòng gián tiếp qua ba ô (`A1→B1→C1→A1`), dùng `Circular References` trong `Error Checking` để xác định đúng ô cần sửa mà không cần dò bằng mắt.
