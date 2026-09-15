---
tieu_de: "Dùng AI trích xuất dữ liệu từ hoá đơn, PDF và ảnh chụp thành bảng"
slug: "dung-ai-trich-xuat-du-lieu-tu-hoa-don-pdf-anh"
danh_muc: "AI"
the: ["AI", "Trích xuất dữ liệu", "Hoá đơn", "OCR", "Excel"]
mo_ta: "Nhập tay số liệu từ hoá đơn, phiếu, PDF hay ảnh chụp là việc chán và dễ sai nhất văn phòng. AI đọc được ảnh và PDF, biến chúng thành bảng dán thẳng vào Excel. Bài này chỉ cách khai đúng các cột cần lấy, xử lý khi nhập theo lô, cách bắt lỗi đọc nhầm số, và vì sao với dữ liệu tiền bạc thì phần kiểm tra quan trọng ngang phần trích xuất."
tu_khoa: "AI trich xuat du lieu, doc hoa don bang AI, OCR AI, chuyen PDF sang Excel, AI nhap lieu"
anh_bia: "/images/bai-viet/ai-trich-xuat-du-lieu/cover.png"
thu_muc_anh: "ai-trich-xuat-du-lieu"
trang_thai: "draft"
---

Có một việc văn phòng vừa chán, vừa dễ sai, vừa không ai muốn làm: gõ tay số liệu từ giấy tờ vào máy. Một xấp hoá đơn cần nhập vào Excel, một file PDF bảng giá của nhà cung cấp, một tấm ảnh chụp phiếu thu — mắt nhìn, tay gõ, và cứ vài dòng lại sai một số. Đây là loại việc "cơ bắp" điển hình mà AI nên gánh thay.

Trợ lý AI đời mới **đọc được ảnh và PDF**, không chỉ chữ bạn gõ. Bạn đưa tấm hoá đơn, nói rõ cần lấy những cột nào, nó trả về một bảng dán thẳng vào Excel hay Google Sheets. Bài này là bước nối tự nhiên của batch: từ *đọc* tài liệu sang *rút dữ liệu có cấu trúc* ra khỏi tài liệu — và vì đây là số liệu, phần kiểm tra sẽ được nhấn mạnh.

## AI đọc ảnh khác máy quét (OCR) cũ thế nào

Công cụ quét chữ (OCR) truyền thống chỉ *đọc ra ký tự* — bạn vẫn phải tự sắp chúng vào đúng cột. AI làm được thêm bước quan trọng: nó *hiểu* tấm hoá đơn. Nó biết "1.500.000" nằm cạnh "Thành tiền" là số tiền, "15/09/2026" là ngày, và dãy trên cùng là tên nhà cung cấp — rồi tự xếp vào bảng đúng nghĩa.

Nói cách khác, AI gộp hai việc từng tách rời — *đọc chữ* và *hiểu cấu trúc* — vào một bước. Đó là lý do nó biến một tấm ảnh lộn xộn thành bảng gọn mà OCR thuần không làm nổi.

## Khai đúng cột bạn cần lấy

Chìa khoá của việc trích xuất là **nói trước bạn muốn bảng có những cột gì**. Bỏ qua bước này, AI tự chọn cột theo ý nó, và bạn lại phải sắp lại.

{{anh:tx-01-khai-cot}}

Một prompt trích xuất tốt gồm:

- **Các cột cần lấy, đặt tên rõ:** "Lấy: Ngày, Số hoá đơn, Nhà cung cấp, Mặt hàng, Số lượng, Đơn giá, Thành tiền."
- **Định dạng mong muốn:** "Ngày dạng dd/mm/yyyy. Số tiền để số thuần, không dấu chấm phân cách, không chữ 'đ'."
- **Cách xử lý ô thiếu:** "Ô nào không có trên hoá đơn thì để trống, đừng đoán."
- **Dạng đầu ra:** "Trả về dạng bảng để tôi dán vào Excel" (hoặc "dạng CSV").

Câu *"ô nào không có thì để trống, đừng đoán"* là dòng quan trọng nhất — nó chặn đúng thói quen nguy hiểm nhất của AI: điền cho đủ chỗ trống bằng số nghe hợp lý.

## Nhập theo lô: nhiều hoá đơn một lần

Trích một tấm thì nhanh. Nhưng sức mạnh thật là **lô nhiều tấm**:

{{anh:tx-02-theo-lo}}

- **Đưa nhiều ảnh/PDF cùng lúc** và bảo "gộp tất cả vào một bảng, thêm cột 'Tên file' để biết dòng nào từ hoá đơn nào."
- **Giữ nguyên bộ cột** giữa các lần để các bảng ghép được với nhau.
- **Với số lượng lớn hoặc cần tính toán chính xác**, yêu cầu AI *chạy code* để đọc và tổng hợp thay vì nhẩm — đúng như kiểu "đọc bằng chạy code" đã nói trong [bài phân tích file](/blog/dua-file-excel-csv-cho-ai-phan-tich). Cộng tổng của 50 hoá đơn nên do máy tính làm, không phải AI ước lượng.

Sau khi có bảng, mọi việc tiếp theo — lọc, tính tổng theo nhà cung cấp, tìm hoá đơn trùng — quay về đúng địa hạt Excel quen thuộc, hoặc nhờ chính AI làm tiếp.

## Bắt lỗi đọc nhầm — chỗ này không được lơ là

Đây là phần quan trọng nhất, vì trích xuất sai một chữ số tiền tệ không phải lỗi nhỏ. AI đọc ảnh giỏi nhưng **không hoàn hảo**, và ba kiểu sai sau xuất hiện đủ thường xuyên để bạn phải chủ động soát:

{{anh:tx-03-bat-loi}}

- **Đọc nhầm chữ số.** Ảnh mờ, chữ viết tay, dấu chấm phân cách hàng nghìn — `1.500.000` có thể thành `1.500` hoặc `15.000.000`. Sai một số 0 là sai gấp mười.
- **Lệch cột.** Khi hoá đơn có ô gộp hoặc bố cục lạ, AI có thể xếp giá trị sang nhầm cột — đơn giá nhảy vào ô thành tiền.
- **Bịa ô trống.** Nếu không dặn "để trống", AI điền vào chỗ thiếu một giá trị nghe hợp lý mà không hề có trên giấy.

Cách soát cho nhanh mà chắc:

- **Kiểm phép tính nội tại.** Với hoá đơn, `Số lượng × Đơn giá` phải bằng `Thành tiền`, và tổng các dòng phải khớp tổng cuối hoá đơn. Bảo AI thêm cột kiểm tra này — lệch ở đâu là lộ chỗ đọc sai ở đó.
- **Đối chiếu tổng.** So tổng bảng với con số tổng in trên chứng từ. Khớp thì yên tâm phần lớn; lệch thì có sai đâu đó.
- **Soi tay các dòng giá trị lớn.** Không cần kiểm hết — nhưng những dòng số tiền lớn nhất thì liếc lại ảnh gốc, vì đó là chỗ sai gây thiệt hại nhất.
- **Giữ lại chứng từ gốc.** Bảng chỉ là bản sao; bản gốc (ảnh/PDF) vẫn là căn cứ khi cần đối chiếu hay lưu sổ.

Và như mọi bài trong batch: hoá đơn, phiếu thu chứa dữ liệu tài chính và thông tin cá nhân — cân nhắc trước khi tải lên, theo đúng quy định nơi bạn làm.

## Nói ngắn gọn

Trích xuất dữ liệu từ hoá đơn, PDF và ảnh là một trong những ứng dụng AI "đáng đồng tiền" nhất: nó xoá đi loại việc nhập tay chán nhất và dễ sai nhất. Bí quyết là khai rõ các cột cần lấy và định dạng, dặn "thiếu thì để trống đừng đoán", và với lô lớn thì bắt AI chạy code để cộng cho chuẩn. Nhưng vì đây là số liệu — nhất là số tiền — phần kiểm phải nghiêm ngang phần trích: dùng phép tính nội tại của chứng từ để tự bắt lỗi, đối chiếu tổng, và soi tay những dòng lớn.

Ba bài của batch này — [email](/blog/dung-ai-soan-va-tra-loi-email-cong-viec), [tóm tắt tài liệu](/blog/dung-ai-tom-tat-tai-lieu-va-cuoc-hop), và trích xuất dữ liệu — đều là cùng một câu chuyện: AI gánh phần cơ bắp của việc giấy tờ, còn bạn giữ vai trò kiểm và quyết. Ghép với batch trước về công thức và phân tích dữ liệu, bạn đã có một bộ công cụ AI đủ dùng cho gần hết việc bàn giấy hằng ngày.
