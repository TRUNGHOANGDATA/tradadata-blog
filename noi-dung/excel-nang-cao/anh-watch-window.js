// Ảnh minh hoạ cho bài Watch Window
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'ww-01-them-watch',
        tieuDe: 'Add Watch — ghim một ô, xem được từ mọi nơi trong file',
        cot: [{ rong: 80 }, { rong: 60 }, { rong: 100 }],
        hang: [
            [dauXanh('Sheet'), dauXanh('Ô'), dauXanh('Giá trị')],
            ['Tổng hợp', 'B20', { v: '45.230.000', nen: 'xanh', dam: true }],
        ],
    },
    {
        ten: 'ww-02-nhieu-o',
        tieuDe: 'Theo dõi nhiều ô, ở nhiều sheet khác nhau cùng lúc',
        cot: [{ rong: 80 }, { rong: 60 }, { rong: 100 }],
        hang: [
            [dauXanh('Sheet'), dauXanh('Ô'), dauXanh('Giá trị')],
            ['Tháng 1', 'B20', { v: '32.000.000', nen: 'xanh' }],
            ['Tháng 2', 'B20', { v: '28.500.000', nen: 'xanh' }],
            ['Tổng hợp', 'D2', { v: '-3.500.000', nen: 'vang' }],
        ],
    },
];

const LO = [{ slug: 'watch-window', anh: bai }];

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
