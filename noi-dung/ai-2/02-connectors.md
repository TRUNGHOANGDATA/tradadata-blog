---
tieu_de: "Claude Connectors là gì? Nối Claude với Gmail, Drive, Notion (và MCP)"
slug: "claude-connectors-mcp-la-gi"
danh_muc: "AI"
the: ["Claude", "Connectors", "MCP"]
mo_ta: "Connectors cho Claude quyền đọc và thao tác trên dữ liệu thật của bạn — Gmail, Google Drive, Notion, GitHub... — thông qua chuẩn kết nối MCP. Bài này giải thích connector là gì, MCP là gì, cách thêm một connector từ kho, connector tuỳ chỉnh, và những lưu ý về quyền và an toàn."
tu_khoa: "Claude Connectors, MCP la gi, Claude ket noi Gmail Drive, connector Claude, Model Context Protocol"
anh_bia: "/images/bai-viet/claude-connectors/cover.png"
thu_muc_anh: "claude-connectors"
trang_thai: "draft"
---

[Skills](/blog/claude-skills-la-gi) dạy Claude *cách làm*. Nhưng nhiều việc chỉ hữu ích khi Claude chạm được vào dữ liệu **thật** của bạn: "tóm tắt các email chưa đọc", "tìm file hợp đồng trong Drive", "tạo issue trên GitHub". Đây là lúc cần **Connectors**.

## Connector là gì

Một **Connector** là **cầu nối cho Claude quyền truy cập** vào một ứng dụng hoặc kho dữ liệu bên ngoài. Khi bạn kết nối Gmail chẳng hạn, Claude có thể tìm, đọc và (nếu bạn cho phép) soạn email — ngay trong cuộc trò chuyện, không cần bạn chuyển qua lại giữa các tab.

So sánh nhanh để khỏi nhầm với Skills:

{{anh:co-01-skill-vs-connector}}

- **Skill** = *kiến thức* — dạy Claude cách làm một việc.
- **Connector** = *quyền truy cập* — cho Claude chỗ để lấy dữ liệu và ra tay.

Một việc hoàn chỉnh thường cần **cả hai**: skill biết cách trình bày báo cáo, connector lấy được số liệu thật từ Google Sheets.

## MCP — chuẩn đứng sau các connector

Bạn sẽ hay gặp ba chữ **MCP** khi đọc về connector. MCP là viết tắt của **Model Context Protocol** — một *chuẩn kỹ thuật chung* để trợ lý AI như Claude nói chuyện được với các ứng dụng bên ngoài.

Hãy hình dung MCP như **cổng USB**: trước kia mỗi thiết bị một loại cổng riêng, giờ có một chuẩn chung nên cắm gì cũng vừa. Nhờ MCP, Claude không cần được lập trình riêng cho từng app; bất kỳ dịch vụ nào "nói được tiếng MCP" đều có thể kết nối. Đó là lý do kho connector lớn nhanh đến vậy.

## Claude nối được với những gì

Kho connector (Connectors Directory) có tới hàng trăm tích hợp đã được kiểm duyệt. Vài cái tên quen thuộc:

{{anh:co-02-hub}}

Gmail, Google Drive, Google Calendar, Notion, GitHub, Slack... Mỗi connector có một trang riêng ghi rõ nó **đọc** được gì, **ghi** (thay đổi) được gì, và có sẵn cho gói nào.

## Cách thêm một connector

Có hai lối vào, đều nhanh:

{{anh:co-03-cach-them}}

**Từ Cài đặt:**
1. Vào **Settings** → **Connectors**.
2. Bấm dấu **"+"** để mở kho, duyệt theo nhóm hoặc tìm tên.
3. Chọn connector → bấm **Connect** → **đăng nhập** vào tài khoản dịch vụ đó để cấp quyền.

**Từ trong cuộc trò chuyện:** bấm dấu **"+"** ở góc ô chat → di tới **Connectors** → **Manage connectors**. Cũng tại menu này, bạn có thể **bật/tắt** từng connector cho riêng cuộc trò chuyện đang mở.

Việc đăng nhập cấp quyền diễn ra trực tiếp với nhà cung cấp (ví dụ Google), Claude không thấy mật khẩu của bạn.

## Connector tuỳ chỉnh và giới hạn theo gói

Nếu dịch vụ bạn cần chưa có sẵn nhưng nó hỗ trợ MCP, bạn có thể tự thêm **custom connector**: vào **Settings → Connectors → "+" → Add custom connector**, rồi nhập tên và địa chỉ URL của máy chủ MCP (kèm thông tin đăng nhập OAuth nếu cần).

Lưu ý về gói: người dùng **Free bị giới hạn một connector tuỳ chỉnh**; các connector web có mặt trên cả Claude web, desktop và mobile. Với **Team/Enterprise**, quản trị viên phải bật connector cho tổ chức trước, và có thể đặt quyền cho từng nhóm hành động.

## Quyền và an toàn — đọc kỹ phần này

Connector cho Claude chạm vào dữ liệu thật, nên hãy cấp quyền có ý thức:

{{anh:co-04-quyen}}

- Với Team/Enterprise, mỗi nhóm hành động của connector có thể đặt: **Always allow** (luôn cho), **Needs approval** (hỏi trước khi làm), hoặc **Blocked** (chặn).
- Có tuỳ chọn **Tool access**: *Auto* (Claude tự dùng khi thấy cần) hay *On demand* (chỉ khi bạn yêu cầu).
- Nguyên tắc chung: chỉ kết nối dịch vụ bạn thật sự cần, và cân nhắc kỹ trước khi cho phép các hành động **ghi/xoá/gửi** — những thứ khó lấy lại.

## Tóm lại

Connectors = **quyền truy cập** cho Claude, chạy trên chuẩn chung MCP. Kết hợp với Skills, bạn đã có một trợ lý vừa biết cách làm vừa chạm được dữ liệu thật. Bước cuối là gói mọi thứ lại cho gọn để cài một phát — đó là [Plugins](/blog/claude-plugins-la-gi).
