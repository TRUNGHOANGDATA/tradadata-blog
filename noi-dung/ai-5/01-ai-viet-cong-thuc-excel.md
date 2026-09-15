---
tieu_de: "Dùng AI viết công thức Excel và Google Sheets: hết cảnh Google mò cả buổi"
slug: "dung-ai-viet-cong-thuc-excel-google-sheets"
danh_muc: "AI"
the: ["AI", "Excel", "Google Sheets", "Công thức", "Năng suất"]
mo_ta: "Thay vì Google mò công thức cả buổi, bạn mô tả bằng lời cho AI và nhận lại công thức Excel/Google Sheets chạy được. Bài này chỉ cách hỏi cho trúng, cách sửa khi công thức sai, và ba cái bẫy phải biết trước khi tin AI: sai địa chỉ ô, dùng hàm máy bạn không có, và 'ảo giác' ra hàm không tồn tại."
tu_khoa: "AI viet cong thuc Excel, AI Excel, ChatGPT Excel, cong thuc Google Sheets, prompt Excel"
anh_bia: "/images/bai-viet/ai-cong-thuc-excel/cover.png"
thu_muc_anh: "ai-cong-thuc-excel"
trang_thai: "draft"
---

Ai làm Excel cũng từng rơi vào cảnh này: biết *muốn gì* nhưng không nhớ *hàm nào*, thế là mở trình duyệt gõ "excel tính tổng theo nhiều điều kiện", lọc qua chục bài viết, thử `SUMIF` rồi `SUMIFS`, sai dấu phẩy chỗ nào đó, và nửa buổi trôi qua. Trợ lý AI như Claude hay ChatGPT xoá gần hết đoạn khổ sở đó: bạn **mô tả bằng lời thường**, nó trả về công thức chạy được kèm giải thích.

Nhưng "AI viết hộ công thức" không phải phép màu bấm nút. Hỏi hời hợt thì nhận công thức sai địa chỉ ô, hoặc tệ hơn là một hàm *nghe rất thật mà Excel của bạn không có*. Bài này chỉ cách hỏi cho trúng ngay lần đầu, cách sửa khi sai, và những cái bẫy phải cảnh giác.

## Vì sao AI viết công thức tốt đến vậy

Công thức Excel bản chất là **ngôn ngữ** — có cú pháp, có quy tắc, có hàng nghìn ví dụ trên mạng mà AI đã học qua. Với một mô hình ngôn ngữ, "dịch" từ câu tiếng Việt *"tính tổng doanh thu của các đơn ở miền Bắc trong tháng 1"* sang `=SUMIFS(...)` là đúng thứ nó giỏi nhất: chuyển ý định thành cú pháp.

Điểm mạnh thật sự không nằm ở việc nhớ tên hàm — cái đó tra Google cũng ra. Nó nằm ở chỗ AI **ghép nhiều hàm lồng nhau** và **giải thích từng mảnh**, thứ mà một bài blog rời rạc khó làm được. Bạn hỏi tiếp "sao phải bọc `IFERROR` ở ngoài?" là nó giảng ngay, ngay trong mạch câu hỏi của bạn.

## Cách hỏi cho ra công thức đúng ngay lần đầu

Khác biệt giữa một câu hỏi cho ra công thức dùng được luôn và một câu hỏi cho ra công thức phải sửa ba lần nằm ở **lượng thông tin bạn đưa**. AI không nhìn thấy màn hình của bạn — nó chỉ biết những gì bạn kể.

{{anh:ct-01-bon-manh}}

Một câu hỏi tốt nên có đủ bốn mảnh sau:

- **Bạn muốn ra kết quả gì** — nói bằng lời thường, càng cụ thể càng tốt. "Đếm số học viên đậu" rõ hơn "xử lý cột điểm".
- **Dữ liệu nằm ở đâu** — tên cột và địa chỉ ô thật: "tên ở cột A, điểm ở cột B, dữ liệu từ dòng 2 đến 500". Đây là mảnh hay bị bỏ nhất, và là lý do số một khiến công thức trả về sai ô.
- **Điều kiện là gì** — "đậu nghĩa là điểm >= 5", "chỉ tính đơn có trạng thái 'Đã thanh toán'".
- **Bạn đang dùng gì** — "Excel 365", "Excel 2016", hay "Google Sheets". Cái này quyết định bạn có được dùng `XLOOKUP`, `FILTER`, `TEXTJOIN` hay không (xem phần bẫy bên dưới).

So sánh nhanh hai cách hỏi cho cùng một việc:

| Hỏi hời hợt | Hỏi đủ mảnh |
|---|---|
| "Công thức đếm học viên đậu?" | "Excel 365. Cột A là tên, cột B là điểm, dữ liệu từ B2 đến B500. Đếm số học viên có điểm >= 5. Cho tôi công thức đặt ở ô D1." |
| AI phải đoán ô, đoán ngưỡng, đoán phiên bản | AI trả về `=COUNTIF(B2:B500;">=5")` dùng được ngay |

Mẹo thực dụng: nếu ngại gõ, hãy **dán vài dòng dữ liệu mẫu** (kể cả tiêu đề cột) thẳng vào ô chat. AI nhìn dữ liệu thật sẽ đoán đúng cấu trúc hơn nhiều so với bạn tả bằng lời.

## Một quy trình hỏi — thử — sửa

Đừng kỳ vọng phát một trúng luôn với việc khó. Cách làm hiệu quả là một vòng lặp ngắn:

{{anh:ct-02-quy-trinh}}

1. **Mô tả việc cần làm** kèm đủ bốn mảnh ở trên.
2. **Dán công thức vào Excel** và xem kết quả.
3. **Nếu sai, tả lại lỗi** cho AI: "nó trả về `#VALUE!`", hoặc "kết quả ra 0 trong khi đáng lẽ phải là 12", hoặc "bị tính cả những dòng trống ở dưới". Mô tả *triệu chứng*, đừng chỉ nói "sai rồi".
4. **AI sửa và giải thích** vì sao. Lặp lại cho tới khi đúng.

Bước 3 là chỗ nhiều người bỏ cuộc quá sớm. AI sửa lỗi rất tốt *nếu bạn nói cho nó biết lỗi gì* — báo đúng mã lỗi (`#N/A`, `#REF!`, `#VALUE!`) hoặc mô tả kết quả lệch, nó thường vá trúng ngay lần sau.

## Không chỉ viết mới — còn giải thích và sửa công thức có sẵn

AI hữu ích nhất không phải lúc viết từ đầu, mà lúc bạn thừa hưởng một file của người khác với công thức dài ngoằng không ai hiểu:

- **"Giải thích công thức này làm gì"** — dán nguyên cái `=IFERROR(INDEX(...MATCH(...)))` vào, nó tách từng lớp và giảng bằng tiếng Việt.
- **"Công thức này bị `#N/A`, sửa giúp"** — dán vào kèm mô tả, nó tìm nguyên nhân (thường là sai kiểu dữ liệu hoặc cột tra cứu).
- **"Viết gọn lại công thức này"** — nó thay chuỗi `IF` lồng bảy tầng bằng một `IFS` hay `XLOOKUP` sạch hơn.
- **"Đổi công thức này từ Excel sang Google Sheets"** — xử lý khác biệt dấu phân cách và tên hàm giúp bạn.

## Ba cái bẫy phải biết trước khi tin AI

Đây là phần quan trọng nhất của bài, và là chỗ khác biệt giữa "dùng AI khôn" và "dán bừa rồi lãnh hậu quả". AI viết công thức rất giỏi, nhưng nó **không chạy thử trên máy bạn**, nên có ba kiểu sai nó không tự biết:

{{anh:ct-03-ba-bay}}

- **Sai địa chỉ ô.** AI đoán vùng dữ liệu theo lời bạn kể. Kể thiếu là nó đoán, và đoán thì có thể lệch — công thức trỏ `B2:B100` trong khi dữ liệu chạy tới `B500`. **Luôn liếc lại vùng ô** trong công thức trước khi tin kết quả.
- **Dùng hàm máy bạn không có.** `XLOOKUP`, `FILTER`, `TEXTJOIN`, `LET` chỉ có trên Excel 365 và bản mới. Nếu bạn dùng Excel 2016/2019, những hàm này trả về `#NAME?`. Đây là lý do phải **nói rõ phiên bản** ngay từ đầu — kể rồi mà vẫn nhận hàm mới thì bảo "tôi dùng Excel 2016, đừng dùng hàm chỉ có ở 365".
- **"Ảo giác" ra hàm không tồn tại.** Thỉnh thoảng AI bịa ra một hàm nghe rất hợp lý mà Excel không có, hoặc gán sai thứ tự tham số. Cách bắt lỗi này đơn giản nhất: **dán vào Excel chạy thử**. Excel báo lỗi là bạn biết ngay, gửi lại cho AI sửa.

Nguyên tắc bao trùm: **AI viết bản nháp, Excel mới là trọng tài.** Đừng bao giờ nộp một báo cáo với công thức AI cho mà chưa tự chạy thử trên dữ liệu thật của mình. Với số liệu, một công thức "trông đúng" mà sai âm thầm còn nguy hơn một công thức báo lỗi đỏ lòm — vì lỗi đỏ thì bạn thấy, còn sai âm thầm thì lọt vào báo cáo.

## Vài ví dụ hỏi mẫu để bạn bắt đầu

Copy và sửa lại theo dữ liệu của bạn:

- *"Google Sheets. Cột A tên sản phẩm, cột B số lượng, cột C đơn giá, dữ liệu từ dòng 2 đến 200. Viết công thức tính tổng thành tiền (số lượng × đơn giá) của riêng sản phẩm 'Trà đào'."*
- *"Excel 365. Tôi có bảng đơn hàng, cột E là ngày đặt, cột F là số tiền. Đếm số đơn đặt trong tháng 9 năm 2026 và tính tổng tiền của chúng."*
- *"Giải thích công thức này đang làm gì rồi viết lại cho dễ hiểu hơn: [dán công thức]."*

## Nói ngắn gọn

AI biến việc viết công thức từ "nhớ hàm nào" thành "tả rõ điều mình muốn". Cho nó đủ bốn mảnh — kết quả cần, dữ liệu ở đâu, điều kiện gì, phiên bản nào — thì thường trúng ngay. Nhưng luôn nhớ nó viết nháp còn Excel mới nghiệm thu: liếc lại vùng ô, chạy thử trên dữ liệu thật, và cảnh giác với hàm máy bạn không có.

Đây mới là mức "viết một ô công thức". Khi công việc lớn hơn — cả một file cần phân tích, tổng hợp, tìm điều bất thường — bạn có thể đưa nguyên file cho AI đọc. Đó là nội dung bài kế: [Đưa file Excel và CSV cho AI đọc và phân tích dữ liệu](/blog/dua-file-excel-csv-cho-ai-phan-tich).
