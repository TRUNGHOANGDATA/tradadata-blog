// Ảnh minh hoạ cho bài 4 — STEYX
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
        ten: 'sy-01-du-lieu',
        tieuDe: 'Chi phí quảng cáo và doanh thu — 6 tháng',
        cot: COT_DL,
        hang: [DU_LIEU, ...HANG_GOC],
    },
    {
        ten: 'sy-02-cong-thuc',
        tieuDe: 'STEYX — sai lệch điển hình, tính theo đơn vị gốc (triệu đồng)',
        congThuc: { o: 'E2', ct: '=STEYX(C2:C7, B2:B7)' },
        cot: [...COT_DL, { rong: 30 }, { rong: 170 }],
        hang: [
            [...DU_LIEU, '', dauXanh('Sai số chuẩn')],
            [...HANG_GOC[0], '', { v: '4,41 (triệu đ)', nen: 'xanh' }],
            HANG_GOC[1], HANG_GOC[2], HANG_GOC[3], HANG_GOC[4], HANG_GOC[5],
        ],
        chon: 'E2',
    },
    {
        ten: 'sy-03-sai-lech-tung-thang',
        tieuDe: 'Doanh thu thực tế so với đường hồi quy dự đoán',
        cot: [{ rong: 70 }, { rong: 120 }, { rong: 120 }, { rong: 120 }],
        hang: [
            [dauXanh('Tháng'), dauXanh('Thực tế'), dauXanh('Dự đoán'), dauXanh('Sai lệch')],
            ['1', '120', '116,79', { v: '+3,21', nen: 'xanh' }],
            ['2', '150', '157,32', { v: '-7,32', nen: 'do' }],
            ['3', '135', '133,01', { v: '+2,00', nen: 'xanh' }],
            ['4', '200', '197,85', { v: '+2,15', nen: 'xanh' }],
            ['5', '180', '181,64', { v: '-1,64', nen: 'do' }],
            ['6', '240', '238,38', { v: '+1,62', nen: 'xanh' }],
        ],
    },
    {
        ten: 'sy-04-khoang-du-doan',
        tieuDe: 'Dùng STEYX để ước lượng khoảng dao động của một dự đoán',
        cot: [{ rong: 220 }, { rong: 170 }],
        hang: [
            [dauXanh('Thông tin'), dauXanh('Giá trị')],
            ['Dự đoán (chi 22 triệu QC)', '214,1'],
            ['± 1 lần STEYX', '4,41'],
            ['Khoảng dao động', { v: '209,7 — 218,5', nen: 'xanh' }],
        ],
    },
];

const LO = [{ slug: 'ham-steyx', anh: bai }];

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
