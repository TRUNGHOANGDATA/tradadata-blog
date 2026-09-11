---
tieu_de: "Projects và Memory trong Claude: quản lý ngữ cảnh dài cho công việc"
slug: "claude-projects-va-memory"
danh_muc: "AI"
the: ["Claude", "Projects", "Memory"]
mo_ta: "Projects cho bạn một không gian riêng gom tài liệu, chỉ dẫn và các cuộc trò chuyện cho một mảng việc; Memory giúp Claude nhớ chi tiết về bạn xuyên nhiều hội thoại. Bài này giải thích hai tính năng, khác nhau ra sao, và dùng thế nào cho công việc lặp lại."
tu_khoa: "Claude Projects, Claude Memory, khong gian lam viec Claude, chi dan tuy chinh Claude, quan ly ngu canh AI"
anh_bia: "/images/bai-viet/claude-projects-memory/cover.png"
thu_muc_anh: "claude-projects-memory"
trang_thai: "draft"
---

Khi dùng Claude cho một công việc kéo dài — ví dụ viết nội dung cho một dự án suốt vài tuần — bạn sẽ thấy phiền vì mỗi cuộc trò chuyện mới đều bắt đầu từ con số 0: phải dán lại tài liệu nền, nhắc lại bối cảnh, giải thích lại yêu cầu. **Projects** và **Memory** là hai tính năng giải quyết đúng nỗi phiền này, theo hai cách khác nhau.

## Hai tính năng, hai vai trò

{{anh:pj-01-projects-vs-memory}}

- **Projects** là một **không gian riêng** cho một mảng việc: bạn gom vào đó các tài liệu nền, một bộ chỉ dẫn tuỳ chỉnh, và mọi cuộc trò chuyện thuộc mảng đó. Bạn *chủ động* tạo và sắp xếp.
- **Memory** là khả năng Claude **tự nhớ** những chi tiết về bạn và cách bạn làm việc, rồi mang sang các cuộc trò chuyện sau — kể cả ngoài Projects.

Nói ngắn: **Projects là cái tủ hồ sơ bạn tự sắp; Memory là trí nhớ Claude tự giữ.**

## Projects: không gian riêng cho từng mảng việc

Một Project gom ba thứ lại một chỗ:

{{anh:pj-02-thanh-phan}}

- **Chỉ dẫn riêng (custom instructions)** — bạn khai một lần: vai trò của Claude, giọng văn, ràng buộc. Mọi trò chuyện trong project đều tuân theo, khỏi nhắc lại.
- **Tài liệu nền (knowledge)** — tải lên tài liệu, mẫu, dữ liệu để Claude tham chiếu trong suốt project.
- **Các cuộc trò chuyện** — mọi hội thoại thuộc project nằm gọn một nơi, cùng chung bối cảnh.

Cách dùng rất đơn giản:

{{anh:pj-03-cach-dung}}

1. Tạo một **Project** mới và đặt tên theo mảng việc (ví dụ "Nội dung blog tháng 9").
2. **Thêm tài liệu nền** và **viết chỉ dẫn** cho Claude.
3. **Trò chuyện ngay trong project** — Claude đã có sẵn bối cảnh, bạn vào việc luôn.

Projects đặc biệt hợp khi nhiều người cùng làm một mảng, hoặc khi bạn quay lại một việc nhiều lần trong thời gian dài. Tính năng này nằm ở các gói trả phí (Pro trở lên).

## Memory: Claude nhớ cách bạn làm việc

Với Memory bật lên, Claude có thể **ghi nhớ** những điều đáng nhớ giữa các lần trò chuyện: bạn làm nghề gì, thích trình bày ra sao, những ràng buộc quen thuộc của bạn. Lần sau bạn không phải giới thiệu lại từ đầu.

Vài điều nên biết để dùng Memory yên tâm:

- Bạn **xem và chỉnh được** những gì Claude đã nhớ, và **xoá** thứ không muốn giữ.
- Có thể **tắt** hoàn toàn nếu bạn thích mỗi cuộc trò chuyện là một tờ giấy trắng.
- Đây là trí nhớ *về bạn để phục vụ bạn* — nên hãy để ý đừng để Claude nhớ những thông tin nhạy cảm mà bạn không muốn lưu.

## Chọn cái nào cho việc gì

- Một mảng việc có **tài liệu nền và yêu cầu cố định**, làm đi làm lại → dùng **Projects**.
- Muốn Claude **nhớ chung về bạn** để trả lời hợp gu hơn ở mọi nơi → bật **Memory**.
- Hai thứ này **dùng chung được**: bạn có thể vừa làm trong một Project (bối cảnh riêng) vừa để Memory giữ những thói quen chung.

## Tóm lại

Projects và Memory là hai cách cắt giảm việc "kể lại từ đầu" — thứ tốn thời gian nhất khi dùng AI cho công việc dài hơi. Sắp xếp tốt bối cảnh rồi, bước còn lại là hỏi cho khéo: đó là nội dung bài kế, [cách viết prompt hiệu quả cho Claude](/blog/viet-prompt-hieu-qua-cho-claude).
