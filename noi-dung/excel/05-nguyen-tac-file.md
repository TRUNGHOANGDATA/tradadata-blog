---
tieu_de: "Mười hai nguyên tắc dựng một file Excel gọn gàng, khỏi phải làm lại"
slug: "12-nguyen-tac-dung-file-excel-gon-gang"
danh_muc: "Excel"
the: ["tư duy hệ thống", "nền tảng Excel", "Table", "best practice"]
mo_ta: "Phần lớn lỗi Excel về sau đều bắt đầu từ việc bỏ qua vài nguyên tắc dựng file cơ bản. Mười hai nguyên tắc này giúp bạn tách dữ liệu khỏi trình bày, giữ công thức truy được nguồn, và dựng file gọn từ đầu trước khi học PivotTable hay Power Query."
tu_khoa: "dựng file Excel, tư duy hệ thống Excel, flat table, tách dữ liệu và báo cáo, nguyên tắc Excel, best practice Excel"
anh_bia: "/images/bai-viet/nguyen-tac-file/cover.png"
thu_muc_anh: "nguyen-tac-file"
trang_thai: "draft"
---

Một file Excel dựng cẩu thả không sập ngay — nó sập ba tháng sau, khi bạn thêm một dòng dữ liệu và cả báo cáo lệch, hoặc khi sếp hỏi lại một con số mà bạn không truy được nó từ đâu ra. Mười hai nguyên tắc dưới đây là thứ nên nắm **trước** khi học PivotTable, Power Query hay dựng dashboard. Phần lớn lỗi về sau đều bắt đầu từ việc bỏ qua chúng.

Đây là bài trụ; nhiều mục sẽ dẫn sang bài chi tiết hơn.

## 1. Tách riêng dữ liệu, tính toán và trình bày

Mỗi phần một vùng hoặc một sheet riêng: dữ liệu thô một chỗ, công thức tổng hợp một chỗ, báo cáo đẹp một chỗ. Nhờ vậy sửa dữ liệu về sau không làm vỡ báo cáo.

*Dấu hiệu sai:* bảng tổng hợp nằm chen ngay cạnh dữ liệu thô, chèn một dòng là vỡ công thức.

## 2. Dữ liệu thô ở dạng bảng phẳng (flat table)

Đúng **một** dòng tiêu đề, mỗi dòng một bản ghi, mỗi cột một thuộc tính. Không gộp ô, không chèn dòng/cột trống, không nhét tiểu tổng vào giữa bảng.

{{anh:nt-01-flat-table}}

*Dấu hiệu sai:* có 2–3 dòng tiêu đề, ô gộp, dòng "Tổng miền Bắc" nằm chen giữa các bản ghi. Bảng như vậy PivotTable không đọc được.

## 3. Một ô = một dữ kiện

Tách `"Nam - 1990"` thành cột giới tính và cột năm sinh riêng, thì mới lọc và thống kê được.

*Dấu hiệu sai:* phải viết công thức tách chuỗi mới lọc được dữ liệu — nghĩa là dữ liệu đã bị nhồi quá nhiều vào một ô ngay từ khâu nhập.

## 4. Không gõ số vào giữa công thức

Giả định như thuế, tỷ giá, tỷ lệ chiết khấu nên để ở **một ô riêng có nhãn** rồi tham chiếu tới, đừng gõ thẳng vào công thức.

*Dấu hiệu sai:* kiểu `=B5*0,1` rải khắp file. Đến khi thuế đổi từ 10% sang 8%, bạn phải đi sửa 50 ô — và chắc chắn sót vài ô.

## 5. Không gõ tay giá trị đã có sẵn

Nếu một con số đã nằm ở đâu đó, luôn **trỏ về ô gốc** để nó tự cập nhật và sau này còn truy được nguồn.

*Dấu hiệu sai:* cùng một con số xuất hiện ở 5 chỗ, mỗi chỗ một giá trị khác nhau vì ai đó sửa một chỗ mà quên bốn chỗ kia. Mẹo: bấm `Ctrl + [` để nhảy về ô nguồn mà công thức đang tham chiếu.

## 6. Hiểu tham chiếu tương đối và tuyệt đối ($)

`A1` chạy theo vị trí dán, `$A$1` đứng yên, `$A1` và `A$1` khoá một chiều. Nắm được điều này mới copy công thức đi khắp bảng mà không phải gõ lại từng ô.

Chủ đề này đủ quan trọng để có [bài riêng về tham chiếu $ và phím F4](/blog/tham-chieu-tuong-doi-va-tuyet-doi-trong-excel).

## 7. Dùng Table (Ctrl+T) và tham chiếu theo tên cột

`=SUM(BanHang[Doanh thu])` tự giãn khi bạn thêm dòng, khỏi lo sót dữ liệu.

*Dấu hiệu sai:* viết `=SUM(I5:I44)` rồi tháng sau thêm dòng và quên sửa vùng — tổng thiếu mất phần mới thêm. Xem [bài về Table và tham chiếu theo tên cột](/blog/excel-table-va-tham-chieu-theo-ten-cot).

## 8. Đặt tên cho ô giả định quan trọng

Viết `=Gia_Ban*So_Luong` thì đọc là hiểu ngay, đỡ sai khi soát lại.

*Dấu hiệu sai:* công thức toàn `$H$2`, `$K$9`; ba tháng sau chính bạn cũng không nhớ `$K$9` là cái gì.

## 9. Định dạng không phải là dữ liệu

Đơn vị (VNĐ, %, kg) ghi ở tiêu đề cột hoặc để Number Format lo, **đừng gõ vào ô**.

*Dấu hiệu sai:* ô ghi `"1.000 đ"` nên Excel coi cả ô là văn bản và không tính được — đúng cái bẫy trong bài [số bị lưu thành văn bản](/blog/so-bi-luu-thanh-van-ban-trong-excel).

## 10. Dùng màu chữ theo một quy ước

Một quy ước màu đơn giản giúp nhìn file là biết ô nào được phép sửa:

{{anh:nt-02-quy-uoc-mau}}

- **Xanh dương:** số nhập tay, được sửa.
- **Đen:** ô công thức, đừng gõ đè.
- **Xanh lá:** công thức lấy số từ sheet khác.
- **Nền vàng:** giả định quan trọng, nên soát lại định kỳ.
- **Đỏ:** ô kiểm tra đang lệch.

*Dấu hiệu sai:* nhìn file không biết ô nào là số gốc, ô nào là công thức, nên ai cũng sợ động vào.

## 11. Công thức ngắn, tách bước ra ô phụ

Mỗi ô làm một việc thì dễ dò lỗi. Chỉ bọc `IFERROR` ở phần trình bày, đừng bọc ở phần tính toán (xem [bài về mã lỗi](/blog/cac-ma-loi-thuong-gap-trong-excel)).

*Dấu hiệu sai:* một công thức lồng 7 tầng `IF`, sai mà không biết sai ở tầng nào.

## 12. Luôn có ô kiểm tra (check cell)

Ví dụ: "tổng chi tiết trừ tổng tổng hợp phải bằng 0"; lệch thì cho tô đỏ. Ô kiểm tra bắt lỗi *giùm bạn*, trước khi cấp trên bắt.

{{anh:nt-03-o-kiem-tra}}

*Dấu hiệu sai:* chỉ biết mình sai khi có người hỏi lại con số.

---

Không cần áp dụng cả 12 điều ngay hôm nay. Nhưng mỗi lần bạn thấy mình đang "gõ lại một con số đã có", "chèn dòng làm vỡ công thức", hay "không nhớ ô này là gì" — đó là một trong 12 nguyên tắc đang bị bỏ qua. Quay lại đúng mục tương ứng là gỡ được.
