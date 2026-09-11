// Ảnh bìa cho batch 1 series AI — Claude là gì & Cài đặt Claude
const path = require('path');
const { sinhAnhBia } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'claude-la-gi',
        ten: 'cover',
        eyebrow: 'AI · Claude cơ bản',
        hook: 'Claude?',
        tieuDe: 'Claude là gì? Giải thích dễ hiểu về trợ lý AI của Anthropic',
        phu: 'Ba dòng model, dùng ở đâu, và ba thứ khiến Claude hơn một hộp chat.',
    },
    {
        thuMuc: 'cai-dat-claude',
        ten: 'cover',
        eyebrow: 'AI · Hướng dẫn',
        hook: 'Cài Claude',
        tieuDe: 'Hướng dẫn cài đặt và bắt đầu với Claude',
        phu: 'Web, máy tính, điện thoại — và cách chọn gói cho khỏi trả tiền oan.',
    },
];

async function chay() {
    let tong = 0;
    for (const spec of BIA) {
        const r = await sinhAnhBia(spec, path.join(GOC, spec.thuMuc));
        tong += r.nang;
        console.log(`  ${spec.thuMuc}/cover.png  ${r.rong}x${r.cao}  ${(r.nang / 1024).toFixed(0)} KB`);
    }
    console.log(`Tổng ${(tong / 1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { BIA };
