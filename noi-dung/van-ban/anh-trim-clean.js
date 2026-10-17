// Ảnh minh hoạ cho bài TRIM/CLEAN
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'tc-01-trim',
        tieuDe: 'TRIM: cắt dư đầu/cuối, ép về một dấu cách giữa từ',
        congThuc: { o: 'B2', ct: '=TRIM(A2)' },
        cot: [{ rong: 200 }, { rong: 150 }],
        hang: [
            [dauXanh('Ô nguồn (LEN)'), dauXanh('Sau TRIM')],
            [{ v: '"  Hà   Nội  "  · 11', canLe: 'trai', nen: 'do' }, { v: '"Hà Nội"  · 6', nen: 'xanh', dam: true }],
        ],
        chon: 'B2',
    },
    {
        ten: 'tc-02-vlookup-loi',
        tieuDe: 'Một dấu cách cuối làm VLOOKUP không khớp',
        cot: [{ rong: 170 }, { rong: 130 }, { rong: 170 }],
        hang: [
            [dauXanh('Giá trị dò'), dauXanh('Trong bảng'), dauXanh('VLOOKUP')],
            [{ v: '"SP03 "', canLe: 'trai', nen: 'do' }, '"SP03"', { v: '#N/A', dam: true }],
            [{ v: 'TRIM("SP03 ")', canLe: 'trai' }, '"SP03"', { v: 'Khớp!', nen: 'xanh', dam: true }],
        ],
    },
    {
        ten: 'tc-03-char160',
        tieuDe: 'TRIM KHÔNG dọn được CHAR(160) — khoảng trắng dán từ web',
        cot: [{ rong: 330 }, { rong: 130 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            ['=TRIM(A2)', { v: 'Vẫn còn dính', mau: '#c0392b', nen: 'do' }],
            ['=TRIM(SUBSTITUTE(A2,CHAR(160)," "))', { v: 'Sạch hẳn', nen: 'xanh', dam: true }],
        ],
    },
];

const LO = [{ slug: 'trim-clean', anh: bai }];

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
