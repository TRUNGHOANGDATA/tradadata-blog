// Ảnh minh hoạ cho bài 3 — QUOTIENT
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'qt-01-cu-phap-co-ban',
        tieuDe: 'QUOTIENT lấy phần nguyên, bỏ hẳn số dư',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=QUOTIENT(17,5)', mono: true }, { v: '3', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'qt-02-chia-hang-vao-thung',
        tieuDe: 'QUOTIENT và MOD phối hợp: thùng đầy + hàng lẻ',
        cot: [{ rong: 170 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=QUOTIENT(137,20)', mono: true }, { v: '6 thùng', nen: 'xanh' }],
            [{ v: '=MOD(137,20)', mono: true }, { v: '17 sản phẩm lẻ', nen: 'xanh' }],
            [{ v: '6×20+17 =', canLe: 'phai' }, { v: '137', canLe: 'giua' }],
        ],
    },
    {
        ten: 'qt-03-khac-int-voi-so-am',
        tieuDe: 'QUOTIENT cắt về 0 — INT làm tròn xuống',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=QUOTIENT(-17,5)', mono: true }, { v: '-3', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=INT(-17/5)', mono: true }, { v: '-4', nen: 'vang', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-quotient', anh: bai }];

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
