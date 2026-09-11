// Ảnh minh hoạ cho bài 5 — QUARTILE.INC, QUARTILE.EXC
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'qt-01-cu-phap-co-ban',
        tieuDe: 'QUARTILE.INC và QUARTILE.EXC — tứ phân vị',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'QUARTILE.INC(mảng, quart)  /  QUARTILE.EXC(mảng, quart)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'qt-02-y-nghia-quart',
        tieuDe: 'Ý nghĩa từng giá trị quart',
        cot: [{ rong: 70 }, { rong: 110 }, { rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('quart'), dauXanh('Ý nghĩa'), dauXanh('INC'), dauXanh('EXC')],
            ['0', 'Nhỏ nhất', 'Hợp lệ', { v: 'Lỗi', nen: 'do' }],
            ['1', '25%', 'Hợp lệ', 'Hợp lệ'],
            ['2', 'Trung vị', 'Hợp lệ', 'Hợp lệ'],
            ['3', '75%', 'Hợp lệ', 'Hợp lệ'],
            ['4', 'Lớn nhất', 'Hợp lệ', { v: 'Lỗi', nen: 'do' }],
        ],
    },
    {
        ten: 'qt-03-vi-du-tinh-toan',
        tieuDe: 'quart=1 khớp đúng PERCENTILE tại k=0.25',
        cot: [{ rong: 190 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=QUARTILE.INC({1..10},1)', mono: true }, { v: '3,25', nen: 'xanh' }],
            [{ v: '=QUARTILE.EXC({1..10},1)', mono: true }, { v: '2,75', canLe: 'giua' }],
        ],
    },
    {
        ten: 'qt-04-loi-quart-0-va-4',
        tieuDe: 'QUARTILE.EXC từ chối quart=0 và quart=4',
        cot: [{ rong: 190 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=QUARTILE.EXC({1..10},0)', mono: true }, { v: '#NUM!', nen: 'do' }],
            [{ v: '=QUARTILE.EXC({1..10},4)', mono: true }, { v: '#NUM!', nen: 'do' }],
        ],
    },
    {
        ten: 'qt-05-ung-dung-iqr',
        tieuDe: 'Khoảng tứ phân vị (IQR) phát hiện ngoại lệ',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'IQR = QUARTILE.INC(A2:A50,3) − QUARTILE.INC(A2:A50,1)', mono: true, canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-quartile-inc-exc', anh: bai }];

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
