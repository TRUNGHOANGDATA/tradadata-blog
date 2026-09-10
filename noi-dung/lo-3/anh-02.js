// Ảnh minh hoạ cho bài 2 — SLOPE & INTERCEPT
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
        ten: 'si-01-du-lieu',
        tieuDe: 'Chi phí quảng cáo và doanh thu — 6 tháng',
        cot: COT_DL,
        hang: [DU_LIEU, ...HANG_GOC],
    },
    {
        ten: 'si-02-slope',
        tieuDe: 'SLOPE — y (doanh thu) trước, x (chi phí QC) sau',
        congThuc: { o: 'E2', ct: '=SLOPE(C2:C7, B2:B7)' },
        cot: [...COT_DL, { rong: 30 }, { rong: 130 }],
        hang: [
            [...DU_LIEU, '', dauXanh('Độ dốc (m)')],
            [...HANG_GOC[0], '', { v: '8,11', nen: 'xanh' }],
            HANG_GOC[1], HANG_GOC[2], HANG_GOC[3], HANG_GOC[4], HANG_GOC[5],
        ],
        chon: 'E2',
    },
    {
        ten: 'si-03-intercept',
        tieuDe: 'INTERCEPT — điểm cắt trục tung khi x = 0',
        congThuc: { o: 'E2', ct: '=INTERCEPT(C2:C7, B2:B7)' },
        cot: [...COT_DL, { rong: 30 }, { rong: 150 }],
        hang: [
            [...DU_LIEU, '', dauXanh('Hệ số chặn (b)')],
            [...HANG_GOC[0], '', { v: '35,74', nen: 'xanh' }],
            HANG_GOC[1], HANG_GOC[2], HANG_GOC[3], HANG_GOC[4], HANG_GOC[5],
        ],
        chon: 'E2',
    },
    {
        ten: 'si-04-phuong-trinh',
        tieuDe: 'Dự đoán doanh thu khi chi 22 triệu cho quảng cáo',
        congThuc: { o: 'B3', ct: '=SLOPE(C2:C7,B2:B7)*22+INTERCEPT(C2:C7,B2:B7)' },
        cot: [{ rong: 220 }, { rong: 170 }],
        hang: [
            [dauXanh('Thông tin'), dauXanh('Giá trị')],
            ['Chi phí quảng cáo mới', '22'],
            ['Doanh thu dự đoán', { v: '≈ 214,1', nen: 'xanh' }],
        ],
        chon: 'B3',
    },
    {
        ten: 'si-05-ngoai-pham-vi',
        tieuDe: 'Dữ liệu gốc chỉ có x từ 10-25 — ngoại suy xa hơn rất rủi ro',
        cot: [{ rong: 200 }, { rong: 150 }, { rong: 170 }],
        hang: [
            [dauXanh('Chi phí QC'), dauXanh('Trong phạm vi?'), dauXanh('Doanh thu dự đoán')],
            ['22 (trong 10-25)', { v: 'Có', nen: 'xanh' }, '≈ 214,1'],
            ['200 (ngoài rất xa)', { v: 'Không', nen: 'do' }, '≈ 1.656,9 (đáng ngờ)'],
        ],
    },
];

const LO = [{ slug: 'ham-slope-intercept', anh: bai }];

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
