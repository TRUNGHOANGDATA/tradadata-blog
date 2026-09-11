// Sơ đồ minh hoạ cho bài 1 — "Claude là gì"
const path = require('path');
const { sinhSoDo } = require('../../tao-so-do.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const anh = [
    {
        ten: 'cl-01-he-sinh-thai',
        tieuDe: 'Hệ sinh thái Claude: web, máy tính, điện thoại, Claude Code',
        kieu: 'flow',
        tieuDe_bang: 'Cùng một tài khoản, dùng được ở nhiều nơi',
        buoc: [
            { nhan: 'Claude web', phu: 'claude.ai trên trình duyệt, không cần cài', mau: 'luc', so: false },
            { nhan: 'App máy tính', phu: 'Windows / macOS', mau: 'lam', so: false },
            { nhan: 'App điện thoại', phu: 'iOS / Android', mau: 'cam', so: false },
            { nhan: 'Claude Code', phu: 'dòng lệnh, dành cho lập trình', mau: 'tim', so: false },
        ],
    },
    {
        ten: 'cl-02-ba-model',
        tieuDe: 'Các dòng model Claude: Haiku, Sonnet, Opus, Fable',
        kieu: 'cards',
        the: [
            { tieu: 'Haiku', mau: 'lam', phu: 'Nhẹ · Nhanh nhất', dong: ['Hỏi đáp nhanh', 'Xử lý số lượng lớn', 'Tiết kiệm nhất'] },
            { tieu: 'Sonnet', mau: 'luc', phu: 'Cân bằng · Mặc định', dong: ['Việc hằng ngày', 'Nhanh & chất lượng', 'Lựa chọn an toàn'] },
            { tieu: 'Opus', mau: 'tim', phu: 'Bản cao cấp', dong: ['Lập luận phức tạp', 'Phân tích sâu', 'Lập trình khó'] },
            { tieu: 'Fable', mau: 'hong', phu: 'Mới & mạnh nhất', dong: ['Suy luận sâu nhất', 'Tác vụ dài hơi', 'Việc khó nhất'] },
        ],
    },
    {
        ten: 'cl-03-ba-khai-niem',
        tieuDe: 'Skills, Connectors, Plugins — ba khái niệm dễ nhầm',
        kieu: 'cards',
        the: [
            { tieu: 'Skills', mau: 'luc', phu: 'Kiến thức', dong: ['Dạy Claude CÁCH làm', 'Theo quy chuẩn của bạn', 'Tự nạp khi liên quan'] },
            { tieu: 'Connectors', mau: 'lam', phu: 'Quyền truy cập', dong: ['Nối tới dữ liệu thật', 'Gmail, Drive, Notion...', 'Chạy trên chuẩn MCP'] },
            { tieu: 'Plugins', mau: 'tim', phu: 'Đóng gói', dong: ['Gói gộp nhiều thứ', 'Cài một phát là có', 'Hay dùng ở Claude Code'] },
        ],
    },
];

const LO = [{ slug: 'claude-la-gi', anh }];

async function chay() {
    let tong = 0;
    for (const b of LO) for (const spec of b.anh) {
        const r = await sinhSoDo(spec, path.join(GOC, b.slug));
        tong += r.nang;
        console.log(`  ${b.slug}/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang / 1024).toFixed(0)} KB`);
    }
    console.log(`Tổng ${(tong / 1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
