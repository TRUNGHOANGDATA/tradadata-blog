// Ảnh minh hoạ cho bài IFERROR
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'ie-01-truoc-sau',
        tieuDe: 'IFERROR biến #N/A thành câu dễ đọc',
        cot: [{ rong: 90 }, { rong: 130 }, { rong: 180 }],
        hang: [
            [dauXanh('Mã dò'), dauXanh('VLOOKUP trần'), dauXanh('Bọc IFERROR')],
            ['SP02', 'Bàn phím cơ', 'Bàn phím cơ'],
            [{ v: 'SP99', nen: 'do' }, { v: '#N/A' }, { v: 'Chưa có mã này' }],
        ],
    },
    {
        ten: 'ie-02-iferror-ifna',
        tieuDe: 'IFERROR bắt MỌI lỗi — IFNA chỉ bắt #N/A',
        cot: [{ rong: 130 }, { rong: 130 }, { rong: 130 }],
        hang: [
            [dauXanh('Lỗi xảy ra'), dauXanh('IFERROR'), dauXanh('IFNA')],
            ['#N/A (không thấy)', { v: 'Thay thế', nen: 'xanh' }, { v: 'Thay thế', nen: 'xanh' }],
            ['#REF! (xoá cột)', { v: 'Bị che!', nen: 'do', mau: '#c0392b', dam: true }, { v: '#REF! hiện ra', dam: true }],
            ['#DIV/0!', { v: 'Bị che!', nen: 'do', mau: '#c0392b', dam: true }, { v: '#DIV/0! hiện ra', dam: true }],
        ],
    },
];

const LO = [{ slug: 'iferror', anh: bai }];

async function chay() {
    let tong = 0;
    for (const b of LO) for (const spec of b.anh) {
        const r = await sinhAnh(spec, path.join(GOC, b.slug));
        tong += r.nang;
        console.log(`  ${b.slug}/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang / 1024).toFixed(0)} KB`);
    }
    console.log(`Tổng ${(tong / 1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
