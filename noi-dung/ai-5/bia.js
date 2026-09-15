// Ảnh bìa cho batch 5 series AI — AI cho dân dữ liệu / văn phòng
const path = require('path');
const { sinhAnhBia } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ai-cong-thuc-excel',
        ten: 'cover',
        eyebrow: 'AI · Excel',
        hook: 'Hết mò',
        tieuDe: 'Dùng AI viết công thức Excel và Google Sheets',
        phu: 'Tả bằng lời, nhận công thức chạy được — và ba cái bẫy phải kiểm trước khi tin.',
    },
    {
        thuMuc: 'ai-phan-tich-file',
        ten: 'cover',
        eyebrow: 'AI · Phân tích dữ liệu',
        hook: 'Đưa cả file',
        tieuDe: 'Đưa file Excel và CSV cho AI đọc và phân tích dữ liệu',
        phu: 'Hai kiểu "đọc file", cách kiểm lại con số, và điều không được tải lên.',
    },
    {
        thuMuc: 'ai-agent',
        ten: 'cover',
        eyebrow: 'AI · Khái niệm',
        hook: 'Tác tử',
        tieuDe: 'AI Agent là gì? Từ trợ lý trả lời sang trợ lý làm việc',
        phu: 'Vòng lặp bên trong, nó làm được gì, và vì sao "để nó tự làm" cần ranh giới.',
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
