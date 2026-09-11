---
tieu_de: "Cách viết prompt hiệu quả cho Claude: từ mơ hồ đến chính xác"
slug: "viet-prompt-hieu-qua-cho-claude"
danh_muc: "AI"
the: ["Claude", "prompt", "mẹo AI"]
mo_ta: "Câu trả lời của AI chỉ tốt bằng câu hỏi bạn đặt ra. Bài này chỉ bốn thành phần của một prompt tốt (bối cảnh, nhiệm vụ rõ, định dạng, ví dụ), quy trình chỉnh dần, và ví dụ trước-sau để bạn thấy khác biệt tức thì."
tu_khoa: "viet prompt cho Claude, prompt hieu qua, cach hoi AI, meo prompt, prompt engineering co ban"
anh_bia: "/images/bai-viet/viet-prompt-claude/cover.png"
thu_muc_anh: "viet-prompt-claude"
trang_thai: "draft"
---

Cùng một Claude, hai người hỏi có thể nhận kết quả chênh nhau một trời một vực. Khác biệt hiếm khi nằm ở "câu thần chú" bí ẩn nào đó — nó nằm ở chỗ bạn **cung cấp đủ thông tin** để Claude hiểu đúng ý. Bài này gói lại những nguyên tắc thực dụng nhất, dùng được ngay cho công việc hằng ngày.

## Bốn thành phần của một prompt tốt

Một prompt rõ ràng thường có đủ bốn phần sau. Không phải lúc nào cũng cần cả bốn, nhưng càng đủ thì kết quả càng sát ý:

{{anh:pr-01-bon-thanh-phan}}

- **Bối cảnh** — bạn là ai, đang làm gì, cho đối tượng nào. *"Mình là kế toán, cần giải thích báo cáo cho sếp không rành số liệu."*
- **Nhiệm vụ rõ ràng** — nói thẳng việc cần làm, tránh chung chung. Không phải *"viết gì đó về Excel"* mà *"viết đoạn mở đầu 3 câu giới thiệu hàm VLOOKUP cho người mới."*
- **Định dạng mong muốn** — bạn muốn kết quả dạng gì: gạch đầu dòng, bảng, đoạn văn, độ dài bao nhiêu.
- **Ví dụ mẫu** — nếu có phong cách cụ thể, đưa một ví dụ để Claude bắt chước. Đây là mẹo nâng chất lượng nhanh nhất.

## Ví dụ: trước và sau

Hãy xem cùng một nhu cầu, diễn đạt hai kiểu:

{{anh:pr-02-truoc-sau}}

Prompt mơ hồ cho ra câu trả lời chung chung, phải hỏi lại nhiều lần. Prompt cụ thể cho ra thứ dùng được gần như ngay lập tức. Thời gian bạn bỏ thêm để viết rõ luôn ít hơn thời gian sửa tới sửa lui một câu trả lời lệch hướng.

## Quy trình chỉnh dần

Đừng kỳ vọng prompt đầu tiên đã hoàn hảo. Cách làm việc hiệu quả là **lặp**:

{{anh:pr-03-quy-trinh}}

1. **Viết** prompt đầu tiên, đủ bối cảnh và nhiệm vụ.
2. **Xem kết quả** — nó lệch chỗ nào so với ý bạn?
3. **Chỉnh** — bổ sung điều còn thiếu, hoặc nói rõ điều chưa vừa ý ("ngắn hơn", "bớt trang trọng", "thêm ví dụ").
4. **Lặp lại** cho tới khi ưng.

Vì Claude giữ được mạch cả cuộc trò chuyện, bạn cứ nói tiếp *"đoạn 2 dài quá, rút còn một câu"* mà không cần viết lại từ đầu.

## Vài mẹo nhỏ tạo khác biệt lớn

- **Giao vai trò**: *"Đóng vai một biên tập viên khó tính, soát lại đoạn này."* giúp Claude tập trung đúng góc nhìn.
- **Cho phép hỏi lại**: thêm *"Nếu thiếu thông tin, cứ hỏi mình trước khi viết."* để tránh Claude đoán mò.
- **Chia nhỏ việc lớn**: việc phức tạp thì tách thành các bước, làm từng bước thay vì nhồi tất cả vào một prompt.
- **Nói bằng tiếng Việt tự nhiên**: không cần gò theo cú pháp máy móc — càng rõ ràng như đang giao việc cho một đồng nghiệp thì càng tốt.

## Tóm lại

Viết prompt tốt không phải kỹ thuật cao siêu, chỉ là **giao việc cho rõ**: đủ bối cảnh, nói thẳng nhiệm vụ, nêu định dạng, kèm ví dụ nếu cần — rồi chỉnh dần. Nắm được điều này, bạn đã khai thác được phần lớn sức mạnh của Claude.

Đến đây là hết phần Claude. Nếu bạn cũng muốn thử "phe còn lại", series tiếp tục với [hướng dẫn cài đặt ChatGPT](/blog/huong-dan-cai-dat-va-bat-dau-voi-chatgpt) và một bài [so sánh Claude với ChatGPT](/blog/so-sanh-claude-va-chatgpt).
