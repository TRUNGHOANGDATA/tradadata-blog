// Ảnh bìa batch 4 — ChatGPT (cài đặt / GPTs / so sánh)
const path = require('path');
const { sinhAnhBia } = require('../../tao-anh-bia.js');
const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'chatgpt-cai-dat', ten: 'cover',
        eyebrow: 'AI · Hướng dẫn', hook: 'ChatGPT',
        tieuDe: 'Hướng dẫn cài đặt và bắt đầu với ChatGPT',
        phu: 'Web, máy tính, điện thoại — và cách chọn giữa Free, Go, Plus, Pro.',
    },
    {
        thuMuc: 'chatgpt-gpts', ten: 'cover',
        eyebrow: 'AI · ChatGPT', hook: 'GPTs',
        tieuDe: 'GPTs, Custom Instructions và Connectors của ChatGPT',
        phu: 'Đặt sẵn cách trả lời, đóng gói trợ lý riêng, nối dữ liệu thật qua MCP.',
    },
    {
        thuMuc: 'claude-vs-chatgpt', ten: 'cover',
        eyebrow: 'AI · So sánh', hook: 'Claude / GPT',
        tieuDe: 'So sánh Claude và ChatGPT: chọn cái nào cho việc gì?',
        phu: 'Đặt hai bên cạnh nhau theo từng tiêu chí, và gợi ý chọn theo loại việc.',
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
