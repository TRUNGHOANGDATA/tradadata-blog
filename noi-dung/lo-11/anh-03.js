// Ảnh minh hoạ cho bài 3 — SQRT
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'sq-01-cu-phap-co-ban',
        tieuDe: 'SQRT tính căn bậc hai',
        cot: [{ rong: 120 }, { rong: 80 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=SQRT(16)', mono: true }, { v: '4', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'sq-02-khoang-cach-toa-do',
        tieuDe: 'Khoảng cách giữa hai điểm toạ độ (Pythagoras)',
        congThuc: { o: 'C3', ct: '=SQRT((C2-C1)^2+(D2-D1)^2)' },
        cot: [{ rong: 60 }, { rong: 60 }, { rong: 90 }],
        hang: [
            [dauXanh('X'), dauXanh('Y'), dauXanh('Khoảng cách')],
            ['0', '0', ''],
            ['3', '4', { v: '5', nen: 'xanh' }],
        ],
        chon: 'C3',
    },
    {
        ten: 'sq-03-loi-so-am',
        tieuDe: 'SQRT với số âm — luôn báo lỗi, không ra số ảo',
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=SQRT(-16)', mono: true }, { v: '#NUM!', nen: 'do' }],
        ],
    },
    {
        ten: 'sq-04-boc-abs-truoc',
        tieuDe: 'Bọc ABS khi số âm chỉ là sai số kỹ thuật',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=SQRT(ABS(-0,0000001))', mono: true }, { v: '0,000316', nen: 'xanh' }],
        ],
    },
    {
        ten: 'sq-05-do-lech-chuan-thu-cong',
        tieuDe: 'SQRT là bước cuối khi tính độ lệch chuẩn thủ công',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: 'SQRT( SUMPRODUCT((A-AVERAGE(A))^2) / (COUNT(A)-1) )', mono: true, canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-sqrt', anh: bai }];

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
