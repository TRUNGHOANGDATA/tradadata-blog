// Ảnh minh hoạ cho bài 4 — ODD, EVEN
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'oe-01-cu-phap-co-ban',
        tieuDe: 'ODD và EVEN làm tròn lên tới lẻ/chẵn gần nhất',
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ODD(4)', mono: true }, { v: '5', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=EVEN(3)', mono: true }, { v: '4', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=ODD(3)', mono: true }, { v: '3', canLe: 'giua' }],
        ],
    },
    {
        ten: 'oe-02-luon-ra-xa-khong',
        tieuDe: 'Chỉ nhỉnh hơn 3 một chút — vẫn nhảy thẳng lên 5',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ODD(3,0001)', mono: true }, { v: '5', nen: 'do' }],
        ],
    },
    {
        ten: 'oe-03-lam-tron-so-ghe',
        tieuDe: 'Làm tròn số khách lên số ghế chẵn để chia cặp',
        congThuc: { o: 'B1', ct: '=EVEN(7)' },
        cot: [{ rong: 100 }, { rong: 90 }],
        hang: [
            [{ v: 'Số khách dự kiến: 7' }, { v: '8 ghế', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'oe-04-so-am',
        tieuDe: 'Với số âm vẫn đẩy ra xa số 0',
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ODD(-3)', mono: true }, { v: '-3', canLe: 'giua' }],
            [{ v: '=ODD(-4)', mono: true }, { v: '-5', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'oe-05-odd-cua-0',
        tieuDe: 'Trường hợp đặc biệt: ODD(0) và EVEN(0)',
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ODD(0)', mono: true }, { v: '1', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=EVEN(0)', mono: true }, { v: '0', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-odd-even', anh: bai }];

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
