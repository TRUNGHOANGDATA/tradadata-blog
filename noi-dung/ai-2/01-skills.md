---
tieu_de: "Claude Skills là gì? Dạy AI làm việc theo cách của bạn"
slug: "claude-skills-la-gi"
danh_muc: "AI"
the: ["Claude", "Skills", "Agent Skills"]
mo_ta: "Skills là những gói hướng dẫn dạy Claude cách làm một loại việc theo đúng quy chuẩn của bạn. Bài này giải thích Skill gồm những gì, cơ chế nạp thông minh (progressive disclosure), các skill dựng sẵn như Excel/PowerPoint, cách bật trong Settings và cách tự tạo một skill."
tu_khoa: "Claude Skills, Agent Skills, SKILL.md, skill Claude la gi, tao skill Claude"
anh_bia: "/images/bai-viet/claude-skills/cover.png"
thu_muc_anh: "claude-skills"
trang_thai: "draft"
---

Bạn có để ý là khi nhờ Claude làm một việc quen thuộc — ví dụ "soạn báo cáo tuần" — lần nào bạn cũng phải nhắc lại cùng một mớ yêu cầu: bố cục thế nào, giọng văn ra sao, phần nào để đầu? **Skills** sinh ra để bạn khỏi phải nhắc lại. Đây là khái niệm đầu tiên trong ba thứ mở rộng năng lực Claude (cùng với [Connectors](/blog/claude-connectors-mcp-la-gi) và [Plugins](/blog/claude-plugins-la-gi)).

## Skill là gì

Một **Skill** (tên đầy đủ: Agent Skill) là một **gói hướng dẫn** dạy Claude *cách làm* một loại việc cụ thể theo đúng quy chuẩn của bạn. Hãy hình dung nó như một tờ "quy trình chuẩn" mà bạn đưa cho một nhân viên mới: trong đó ghi rõ các bước, mẫu trình bày, những điều nên và không nên.

Về mặt kỹ thuật, một skill chỉ là một **thư mục** gồm:

{{anh:sk-01-thanh-phan}}

- Một file **`SKILL.md`** — trái tim của skill: viết bằng ngôn ngữ tự nhiên, mô tả skill này làm gì và Claude nên làm theo các bước nào.
- (Tuỳ chọn) **Scripts** — đoạn mã Claude có thể chạy để làm việc chính xác, đáng tin (ví dụ tạo file Excel đúng định dạng).
- (Tuỳ chọn) **Tài nguyên** — mẫu, tài liệu tham chiếu, ví dụ mẫu để Claude bám theo.

Điểm mấu chốt cần nhớ: **Skill dạy Claude *cách làm*, chứ không cho Claude *quyền truy cập* vào dữ liệu của bạn** — phần quyền truy cập là việc của Connectors. Đừng nhầm hai thứ này.

## Cơ chế thông minh: chỉ nạp khi cần

Điều khiến Skills gọn gàng là cách chúng được nạp, gọi là **progressive disclosure** (tạm dịch: "hé lộ dần"). Claude không nhồi hết mọi skill vào đầu ngay từ đầu — làm vậy sẽ rối và tốn. Thay vào đó:

{{anh:sk-02-cach-hoat-dong}}

1. Claude **quét lướt** tên và mô tả ngắn của các skill đang có.
2. Khi bạn giao một việc, nó **so khớp** xem có skill nào liên quan không.
3. Nếu có, nó mới **nạp đầy đủ** nội dung skill đó vào để làm theo.
4. Làm xong, phần chi tiết đó không còn choán chỗ cho việc khác.

Kết quả: bạn có thể trang bị cho Claude rất nhiều skill mà nó vẫn không bị "loạn" — mỗi lúc chỉ dùng đúng cái cần.

Skills còn có ba tính chất đáng giá: **ghép được** (nhiều skill phối hợp trong một việc), **mang đi được** (cùng một định dạng dùng chung cho Claude web, app, Claude Code và cả API), và **hiệu quả** (chỉ tải phần cần thiết).

## Vài skill dựng sẵn

Anthropic cung cấp sẵn một số skill cho các việc văn phòng phổ biến, đặc biệt là tạo tài liệu đúng chuẩn:

{{anh:sk-03-vi-du}}

- **Excel** — tạo bảng tính có công thức thật, không phải ảnh chụp.
- **PowerPoint** — dựng slide trình bày.
- **Word** — soạn văn bản định dạng chỉn chu.
- **PDF** — tạo cả file PDF điền được (fillable).

Với dân văn phòng, riêng nhóm skill tài liệu này đã đủ để Claude xuất ra file bạn mở lên dùng được ngay, thay vì phải copy thủ công.

## Cách bật Skills

Trên Claude web và app, Skills được bật trong phần cài đặt:

{{anh:sk-04-bat-skills}}

1. Vào **Settings** (Cài đặt) → **Features** (Tính năng).
2. Bật **Skills**. Tính năng này chạy dựa trên công cụ thực thi mã (Code Execution) nên bạn cũng cần bật công cụ đó.
3. Nếu bạn dùng tài khoản của tổ chức (Team/Enterprise), **quản trị viên phải cho phép Skills ở cấp tổ chức trước** thì thành viên mới thấy.

Sau khi bật, Claude sẽ tự dùng skill phù hợp khi bạn giao việc liên quan — bạn không phải "gọi" skill bằng lệnh đặc biệt.

## Tự tạo một skill

Bạn hoàn toàn có thể viết skill riêng cho quy trình của mình — ví dụ "cách viết email chăm sóc khách theo mẫu công ty". Cách dễ nhất là dùng chính skill có tên **skill-creator**: nó hỏi bạn vài câu về công việc, rồi tự dựng cấu trúc thư mục và file `SKILL.md` — bạn không cần biết lập trình hay tự tay tạo file.

Nguyên tắc khi viết một `SKILL.md` tốt:

- **Mô tả rõ khi nào dùng** để Claude biết lúc nào nên nạp skill.
- **Viết các bước cụ thể**, như hướng dẫn cho người mới.
- **Kèm ví dụ mẫu** để Claude bắt chước đúng phong cách.

## Tóm lại

Skills = **kiến thức đóng gói**: bạn dạy Claude cách làm một lần, nó áp dụng mãi về sau, và tự nạp đúng lúc cần. Nhưng dạy cách làm thôi chưa đủ — nhiều việc còn cần Claude *chạm được vào dữ liệu thật* của bạn. Đó là phần của bài kế: [Claude Connectors là gì](/blog/claude-connectors-mcp-la-gi).
