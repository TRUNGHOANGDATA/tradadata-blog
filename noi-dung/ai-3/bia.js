// Ảnh bìa batch 3 — Projects/Memory & Prompt
const path = require('path');
const { sinhAnhBia } = require('../../tao-anh-bia.js');
const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'claude-projects-memory', ten: 'cover',
        eyebrow: 'AI · Claude', hook: 'Projects',
        tieuDe: 'Projects và Memory: quản lý ngữ cảnh dài cho công việc',
        phu: 'Gom tài liệu và chỉ dẫn một chỗ, để Claude nhớ cách bạn làm — khỏi kể lại từ đầu.',
    },
    {
        thuMuc: 'viet-prompt-claude', ten: 'cover',
        eyebrow: 'AI · Mẹo dùng Claude', hook: 'Prompt',
        tieuDe: 'Cách viết prompt hiệu quả cho Claude',
        phu: 'Bốn thành phần của một prompt tốt, và cách chỉnh dần để ra kết quả dùng được ngay.',
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
