// Ảnh minh hoạ cho bài Merge & Center
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'mc-01-loi-sort',
        tieuDe: 'Ô gộp lệch kích thước — Sort từ chối chạy',
        cot: [{ rong: 280 }],
        hang: [
            [{ v: '"This operation requires the merged cells', canLe: 'giua', mau: '#c0392b' }],
            [{ v: 'to be identically sized."', canLe: 'giua', mau: '#c0392b', dam: true, nen: 'do' }],
        ],
    },
    {
        ten: 'mc-02-cong-thuc-lech',
        tieuDe: 'Ô gộp làm hàng lệch — công thức kéo xuống sai chỗ',
        cot: [{ rong: 100 }, { rong: 100 }],
        hang: [
            [dauXanh('Có ô gộp'), dauXanh('Hàng thường')],
            [{ v: '(gộp 2 hàng)', canLe: 'giua', nen: 'do' }, '1'],
            ['', '2'],
            [{ v: 'Lệch từ đây', mau: '#c0392b' }, '3'],
        ],
    },
    {
        ten: 'mc-03-center-across-selection',
        tieuDe: 'Center Across Selection: giống hệt hiệu ứng, KHÔNG gộp ô',
        cot: [{ rong: 190 }, { rong: 210 }],
        hang: [
            [dauXanh('Merge & Center'), dauXanh('Center Across Selection')],
            [{ v: 'Gộp thật, phá Sort/Filter', mau: '#c0392b', nen: 'do' }, { v: 'Vẫn là ô riêng, an toàn', nen: 'xanh', dam: true }],
        ],
    },
];

const LO = [{ slug: 'merge-and-center', anh: bai }];

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
