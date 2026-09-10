// Ảnh minh hoạ cho bài 3 — RSQ
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const DU_LIEU = [dauXanh('Tháng'), dauXanh('Chi phí QC (tr)'), dauXanh('Doanh thu (tr)')];
const HANG_GOC = [
    ['1', '10', '120'], ['2', '15', '150'], ['3', '12', '135'],
    ['4', '20', '200'], ['5', '18', '180'], ['6', '25', '240'],
];
const COT_DL = [{ rong: 70 }, { rong: 150 }, { rong: 150 }];

const bai = [
    {
        ten: 'rsq-01-du-lieu',
        tieuDe: 'Chi phí quảng cáo và doanh thu — 6 tháng',
        cot: COT_DL,
        hang: [DU_LIEU, ...HANG_GOC],
    },
    {
        ten: 'rsq-02-cong-thuc',
        tieuDe: 'RSQ — bao nhiêu % biến thiên doanh thu mô hình giải thích được',
        congThuc: { o: 'E2', ct: '=RSQ(C2:C7, B2:B7)' },
        cot: [...COT_DL, { rong: 30 }, { rong: 150 }],
        hang: [
            [...DU_LIEU, '', dauXanh('R² (≈99,2%)')],
            [...HANG_GOC[0], '', { v: '0,992', nen: 'xanh' }],
            HANG_GOC[1], HANG_GOC[2], HANG_GOC[3], HANG_GOC[4], HANG_GOC[5],
        ],
        chon: 'E2',
    },
    {
        ten: 'rsq-03-quan-he-correl',
        tieuDe: 'RSQ chính là CORREL bình phương (hồi quy đơn biến)',
        cot: [{ rong: 260 }, { rong: 170 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=CORREL(C2:C7, B2:B7)', mono: true }, '0,996'],
            [{ v: '=CORREL(C2:C7, B2:B7)^2', mono: true }, { v: '0,992', nen: 'xanh' }],
            [{ v: '=RSQ(C2:C7, B2:B7)', mono: true }, { v: '0,992', nen: 'xanh' }],
        ],
    },
];

const LO = [{ slug: 'ham-rsq', anh: bai }];

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
