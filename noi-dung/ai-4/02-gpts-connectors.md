---
tieu_de: "GPTs, Custom Instructions và Connectors của ChatGPT là gì"
slug: "chatgpt-gpts-custom-instructions-connectors"
danh_muc: "AI"
the: ["ChatGPT", "GPTs", "Custom Instructions"]
mo_ta: "ChatGPT cũng có bộ ba mở rộng năng lực riêng: Custom Instructions để đặt sẵn cách trả lời, Custom GPTs để đóng gói một trợ lý tái dùng, và Connectors/Apps để nối với dữ liệu thật qua MCP. Bài này giải thích từng thứ và cách tạo một Custom GPT."
tu_khoa: "ChatGPT GPTs, Custom Instructions, Custom GPT, GPT Store, ChatGPT Connectors, tao GPT"
anh_bia: "/images/bai-viet/chatgpt-gpts/cover.png"
thu_muc_anh: "chatgpt-gpts"
trang_thai: "draft"
---

Nếu bạn đã đọc phần Claude trong series này, bạn sẽ thấy ChatGPT có một bộ ba **tương đương** để mở rộng năng lực. Tên gọi khác, nhưng ý tưởng thì song song — nắm được điều này giúp bạn học cái thứ hai rất nhanh.

## Ba cách mở rộng ChatGPT

{{anh:gc-01-ba-khai-niem}}

- **Custom Instructions** — bạn đặt sẵn một lần: bạn là ai, muốn ChatGPT trả lời theo phong cách nào. Nó được đưa vào làm bối cảnh cho *mọi* cuộc trò chuyện, khỏi nhắc lại. (Gần với ý tưởng "chỉ dẫn" trong [Skills](/blog/claude-skills-la-gi) của Claude.)
- **Custom GPTs** — một phiên bản ChatGPT được cấu hình sẵn cho một việc, đóng gói lại để dùng đi dùng lại và chia sẻ. (Tương tự cách [Plugins](/blog/claude-plugins-la-gi) đóng gói mọi thứ lại.)
- **Connectors & Apps** — nối ChatGPT với dữ liệu và ứng dụng thật. Điều đáng chú ý: giống Claude, ChatGPT nay cũng dùng chuẩn **MCP** cho phần này. (Xem [Connectors của Claude](/blog/claude-connectors-mcp-la-gi) để hiểu MCP.)

## Custom Instructions: đặt sẵn cách trả lời

Đây là thứ dễ dùng và đáng bật nhất. Vào **Settings → Custom Instructions**, bạn khai hai điều: đôi nét về bạn (nghề nghiệp, mục tiêu), và cách bạn muốn ChatGPT trả lời (ngắn gọn hay chi tiết, trang trọng hay thân mật, tiếng Việt...). Từ đó, mọi câu trả lời đều bám theo, bạn không phải dặn lại mỗi lần.

## Custom GPTs: đóng gói một trợ lý riêng

Một **Custom GPT** gói bốn thứ vào một trợ lý tái dùng:

{{anh:gc-02-thanh-phan}}

- **Tên và mô tả** — để nhận biết và tìm lại.
- **Instructions** — bộ chỉ dẫn riêng cho trợ lý này (khác với Custom Instructions chung của tài khoản).
- **Knowledge (tài liệu nền)** — tải lên tài liệu để GPT tham chiếu (hỗ trợ PDF, DOCX, CSV, TXT...).
- **Capabilities (khả năng)** — bật các năng lực như tìm web, tạo ảnh, chạy mã, vẽ biểu đồ.

Cách tạo một Custom GPT:

{{anh:gc-03-cach-tao}}

1. Vào trang **Explore GPTs**, bấm **+ Create**.
2. Ở thẻ **Configure**, điền **Tên**, **Mô tả**, **Instructions**.
3. **Tải Knowledge** nếu cần trợ lý bám theo tài liệu của bạn.
4. **Tích các Capabilities** phù hợp.
5. Chọn **hiển thị**: chỉ mình bạn, ai có link, hoặc đăng lên **GPT Store**.

Việc tạo Custom GPT cần **gói trả phí**. Kho **GPT Store** hiện có tới hàng triệu GPT do cộng đồng tạo — bạn có thể dùng của người khác thay vì tự làm.

## Connectors & Apps: nối với dữ liệu thật

Cũng như Claude, ChatGPT cho phép nối tới các dịch vụ bên ngoài để đọc và thao tác dữ liệu thật — lịch, tài liệu, bảng tính... Phần này xây trên **MCP**, cùng chuẩn mà Claude dùng, nên tư duy hoàn toàn giống nhau: cấp quyền có ý thức, cẩn trọng với các hành động ghi/gửi.

Một điểm phân biệt của ChatGPT: bên cạnh **Custom GPTs** (thiên về chỉ dẫn + tài liệu), còn có **Apps** — các ứng dụng dựng bằng MCP có thể hiện cả giao diện (biểu mẫu, bảng, màn hình duyệt) ngay trong cuộc trò chuyện.

## Tóm lại

ChatGPT và Claude nhìn khác nhau ở tên gọi nhưng chung một tư duy: **đặt sẵn cách trả lời, đóng gói trợ lý tái dùng, và nối với dữ liệu thật qua MCP**. Hiểu một bên là bạn gần như hiểu luôn bên kia. Câu hỏi còn lại là *nên chọn ai cho việc gì* — đó là nội dung bài cuối: [so sánh Claude và ChatGPT](/blog/so-sanh-claude-va-chatgpt).
