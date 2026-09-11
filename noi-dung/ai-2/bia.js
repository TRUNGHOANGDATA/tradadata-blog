// Ảnh bìa batch 2 — Skills / Connectors / Plugins
const path = require('path');
const { sinhAnhBia } = require('../../tao-anh-bia.js');
const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'claude-skills', ten: 'cover',
        eyebrow: 'AI · Claude', hook: 'Skills',
        tieuDe: 'Claude Skills là gì? Dạy AI làm việc theo cách của bạn',
        phu: 'Gói hướng dẫn dạy Claude cách làm, tự nạp khi cần — kèm ví dụ Excel, Word.',
    },
    {
        thuMuc: 'claude-connectors', ten: 'cover',
        eyebrow: 'AI · Claude', hook: 'Connectors',
        tieuDe: 'Claude Connectors là gì? Nối Claude với Gmail, Drive, Notion',
        phu: 'Cho Claude quyền chạm dữ liệu thật của bạn, qua chuẩn kết nối MCP.',
    },
    {
        thuMuc: 'claude-plugins', ten: 'cover',
        eyebrow: 'AI · Claude', hook: 'Plugins',
        tieuDe: 'Claude Plugins là gì? Gói mọi thứ lại, cài một phát',
        phu: 'Đóng gói skills, connectors và lệnh thành một đơn vị — mạnh nhất ở Claude Code.',
    },
];

async function chay() {
    let tong = 0;
    for (const spec of BIA) { const r = await sinhAnhBia(spec, path.join(GOC, spec.thuMuc)); tong += r.nang;
        console.log(`  ${spec.thuMuc}/cover.png  ${r.rong}x${r.cao}  ${(r.nang/1024).toFixed(0)} KB`); }
    console.log(`Tổng ${(tong/1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { BIA };
