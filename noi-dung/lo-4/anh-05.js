// Ảnh minh hoạ cho bài 5 — ISNUMBER, ISTEXT, ISBLANK, ISERROR
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const DU_LIEU = [dauXanh('Dòng'), dauXanh('Giá trị')];
const HANG_GOC = [
    ['1', '1024'],
    ['2', 'VT005'],
    ['3', ''],
    ['4', { v: '#REF!', mau: '#c0392b', dam: true }],
    ['5', '890'],
];
const COT_DL = [{ rong: 60 }, { rong: 130 }];

const bai = [
    {
        ten: 'is-01-du-lieu',
        tieuDe: 'Cột dữ liệu hỗn hợp: số, chữ, ô trống, và một ô lỗi',
        cot: COT_DL,
        hang: [DU_LIEU, ...HANG_GOC],
    },
    {
        ten: 'is-02-isnumber',
        tieuDe: 'ISNUMBER — ô này có phải là số không',
        congThuc: { o: 'C2', ct: '=ISNUMBER(B2)' },
        cot: [...COT_DL, { rong: 30 }, { rong: 110 }],
        hang: [
            [...DU_LIEU, '', dauXanh('ISNUMBER')],
            [...HANG_GOC[0], '', { v: 'TRUE', nen: 'xanh' }],
            [...HANG_GOC[1].slice(0, 2), '', { v: 'FALSE', nen: 'do' }],
            HANG_GOC[2], HANG_GOC[3], HANG_GOC[4],
        ],
        chon: 'C2',
    },
    {
        ten: 'is-03-istext',
        tieuDe: 'ISTEXT — ô này có phải là văn bản không',
        congThuc: { o: 'C3', ct: '=ISTEXT(B3)' },
        cot: [...COT_DL, { rong: 30 }, { rong: 110 }],
        hang: [
            [...DU_LIEU, '', dauXanh('ISTEXT')],
            [...HANG_GOC[0], '', { v: 'FALSE', nen: 'do' }],
            [...HANG_GOC[1], '', { v: 'TRUE', nen: 'xanh' }],
            HANG_GOC[2], HANG_GOC[3], HANG_GOC[4],
        ],
        chon: 'C3',
    },
    {
        ten: 'is-04-isblank',
        tieuDe: 'ISBLANK — ô này có thật sự trống không',
        congThuc: { o: 'C4', ct: '=ISBLANK(B4)' },
        cot: [...COT_DL, { rong: 30 }, { rong: 110 }],
        hang: [
            [...DU_LIEU, '', dauXanh('ISBLANK')],
            HANG_GOC[0], HANG_GOC[1],
            [...HANG_GOC[2], '', { v: 'TRUE', nen: 'xanh' }],
            HANG_GOC[3], HANG_GOC[4],
        ],
        chon: 'C4',
    },
    {
        ten: 'is-05-iserror',
        tieuDe: 'ISERROR — ô này có đang báo lỗi không',
        congThuc: { o: 'C5', ct: '=ISERROR(B5)' },
        cot: [...COT_DL, { rong: 30 }, { rong: 110 }],
        hang: [
            [...DU_LIEU, '', dauXanh('ISERROR')],
            HANG_GOC[0], HANG_GOC[1], HANG_GOC[2],
            [...HANG_GOC[3], '', { v: 'TRUE', nen: 'xanh' }],
            HANG_GOC[4],
        ],
        chon: 'C5',
    },
    {
        ten: 'is-06-cot-phu-kiem-tra',
        tieuDe: 'Cột phụ kiểm tra trước — cộng an toàn dù dữ liệu lẫn chữ',
        congThuc: { o: 'C2', ct: '=IF(ISNUMBER(B2), B2, 0)' },
        cot: [...COT_DL, { rong: 100 }],
        hang: [
            [...DU_LIEU, dauXanh('Cột phụ')],
            [...HANG_GOC[0], { v: '1024', nen: 'xanh' }],
            [...HANG_GOC[1], { v: '0', nen: 'xanh' }],
            [...HANG_GOC[2], '0'],
            [...HANG_GOC[3], '0'],
            [...HANG_GOC[4], '890'],
        ],
        chon: 'C2',
    },
];

const LO = [{ slug: 'ham-isnumber-istext-isblank-iserror', anh: bai }];

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
