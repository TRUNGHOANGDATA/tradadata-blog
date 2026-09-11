---
tieu_de: "Claude Plugins là gì? Gói skills, connectors và lệnh lại, cài một phát"
slug: "claude-plugins-la-gi"
danh_muc: "AI"
the: ["Claude", "Plugins", "Claude Code"]
mo_ta: "Plugins là cách đóng gói nhiều thứ — skills, kết nối MCP, lệnh tắt, agent, hook — thành một đơn vị để cài một lần là có tất cả. Bài này phân biệt rành mạch plugins với skills và connectors, giải thích marketplace, và chỉ cách cài plugin trong Claude Code."
tu_khoa: "Claude Plugins, plugin Claude Code, marketplace plugin, plugin vs skill, cai plugin Claude"
anh_bia: "/images/bai-viet/claude-plugins/cover.png"
thu_muc_anh: "claude-plugins"
trang_thai: "draft"
---

Ta đã có [Skills](/blog/claude-skills-la-gi) (kiến thức) và [Connectors](/blog/claude-connectors-mcp-la-gi) (quyền truy cập). Vấn đề thực tế: một quy trình hoàn chỉnh thường cần **nhiều thứ cùng lúc** — vài skill, một kết nối dữ liệu, dăm lệnh tắt. Cài từng cái một thì mệt. **Plugins** giải quyết đúng chuyện đó.

## Plugin là gì

Một **Plugin** là một **gói đóng sẵn** gộp chung nhiều thành phần để bạn **cài một lần là có tất cả**. Nếu skill là một cuốn cẩm nang và connector là một chiếc chìa khoá, thì plugin là **cả một bộ đồ nghề** đóng trong một hộp.

Một plugin có thể chứa:

{{anh:pl-01-thanh-phan}}

- **Skills** — các kỹ năng đóng gói (cách làm việc).
- **MCP servers / connectors** — kết nối tới dữ liệu và công cụ.
- **Lệnh (commands)** — lối tắt để gọi nhanh một thao tác.
- **Agents / hooks** — cấu hình tự động hoá, chạy theo sự kiện.

Không phải plugin nào cũng có đủ bốn thứ; điểm chung là chúng được **gói lại** để phân phối và cài đặt như một đơn vị duy nhất.

## Phân biệt ba khái niệm — lần cuối cho rõ

Đây là chỗ hầu hết mọi người nhầm. Ghi nhớ bằng một dòng:

{{anh:pl-02-ba-khai-niem}}

**Skills dạy Claude *cách làm* · Connectors cho Claude *chỗ để làm* · Plugins *gói cả hai lại* cho gọn.** Chúng **bổ sung** cho nhau, không thay thế nhau. Một cách dùng điển hình với sản phẩm thật: cài **plugin** của nhà cung cấp để có sẵn quy trình và lệnh, trong đó plugin thường **kèm luôn** connector MCP để nối tới tài khoản của bạn.

## Marketplace — nơi tìm plugin

Plugin được phân phối qua **marketplace**. Về bản chất, một marketplace chỉ là một kho mã nguồn (git repo) có khai báo danh sách plugin trong đó. Bạn thêm marketplace vào, rồi cài plugin bạn muốn từ nó.

Plugins đặc biệt hữu ích trong **Claude Code** — phiên bản dòng lệnh dành cho lập trình — vì đây là nơi người ta hay cần nhiều lệnh, nhiều kết nối và tự động hoá cùng lúc.

## Cài plugin trong Claude Code

Trong Claude Code, mọi thứ xoay quanh lệnh `/plugin`:

{{anh:pl-03-cai-dat}}

- Gõ **`/plugin`** để mở giao diện quản lý, với hai thẻ **Discover** (khám phá) và **Installed** (đã cài).
- **Đăng ký một marketplace** (một kho git chứa danh sách plugin) bằng lệnh dưới đây, thay `<chu-so-huu>/<ten-repo>` bằng địa chỉ kho thật:

```bash
/plugin marketplace add <chu-so-huu>/<ten-repo>
```

- **Cài plugin** từ marketplace vừa thêm:

```bash
/plugin install <ten-plugin>@<ten-marketplace>
```

Sau khi cài, mọi skill, lệnh và kết nối mà plugin mang theo sẽ sẵn sàng dùng ngay — bạn không phải lắp từng mảnh.

## Khi nào dùng cái nào

Một cách quyết định nhanh:

- Chỉ cần dạy Claude **cách làm** một việc theo chuẩn của bạn → viết một **Skill**.
- Cần Claude **chạm vào dữ liệu** một dịch vụ cụ thể → thêm một **Connector**.
- Cần **cả gói** quy trình + kết nối + lệnh cho một công cụ hay nhóm việc → cài một **Plugin**.

## Tóm lại

Plugins = **đóng gói**. Chúng lấy skills và connectors — hai thứ ta đã học — bó lại thành một đơn vị cài đặt gọn, cực hợp cho Claude Code. Đến đây bạn đã nắm trọn bộ ba mở rộng năng lực Claude.

Tiếp theo, series sẽ chuyển sang hai chủ đề giúp bạn dùng Claude "đã tay" hơn: [Projects và Memory](/blog/claude-projects-va-memory) để quản lý ngữ cảnh dài, và [cách viết prompt hiệu quả](/blog/viet-prompt-hieu-qua-cho-claude).
