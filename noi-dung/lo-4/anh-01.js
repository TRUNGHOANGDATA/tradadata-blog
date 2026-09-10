// Ảnh minh hoạ cho bài 1 — COUNT, COUNTA, COUNTBLANK
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const DU_LIEU = [dauXanh('Học sinh'), dauXanh('Điểm')];
const HANG_GOC = [
    ['Nguyễn Thị Mai', '8'],
    ['Trần Văn Hải', ''],
    ['Lê Hoàng Bảo', { v: 'Vắng thi', mau: '#c0392b' }],
    ['Phạm Minh Thư', '7'],
    ['Vũ Thị Lan', ''],
    ['Đặng Văn Nam', '9'],
    ['Bùi Thị Hoa', { v: 'Vắng thi', mau: '#c0392b' }],
    ['Ngô Văn Long', '6'],
];
const COT_DL = [{ rong: 170 }, { rong: 130 }];

const bai = [
    {
        ten: 'cc-01-du-lieu',
        tieuDe: 'Bảng điểm — có số, có chữ "Vắng thi", có ô còn trống',
        cot: COT_DL,
        hang: [DU_LIEU, ...HANG_GOC],
    },
    {
        ten: 'cc-02-count',
        tieuDe: 'COUNT — chỉ đếm ô chứa SỐ',
        congThuc: { o: 'D2', ct: '=COUNT(B2:B9)' },
        cot: [...COT_DL, { rong: 30 }, { rong: 120 }],
        hang: [
            [...DU_LIEU, '', dauXanh('COUNT')],
            [...HANG_GOC[0], '', { v: '4', nen: 'xanh' }],
            HANG_GOC[1], HANG_GOC[2], HANG_GOC[3], HANG_GOC[4], HANG_GOC[5], HANG_GOC[6], HANG_GOC[7],
        ],
        chon: 'D2',
    },
    {
        ten: 'cc-03-counta',
        tieuDe: 'COUNTA — đếm mọi ô KHÔNG trống (số lẫn chữ)',
        congThuc: { o: 'D2', ct: '=COUNTA(B2:B9)' },
        cot: [...COT_DL, { rong: 30 }, { rong: 120 }],
        hang: [
            [...DU_LIEU, '', dauXanh('COUNTA')],
            [...HANG_GOC[0], '', { v: '6', nen: 'xanh' }],
            HANG_GOC[1], HANG_GOC[2], HANG_GOC[3], HANG_GOC[4], HANG_GOC[5], HANG_GOC[6], HANG_GOC[7],
        ],
        chon: 'D2',
    },
    {
        ten: 'cc-04-countblank',
        tieuDe: 'COUNTBLANK — chỉ đếm ô THẬT SỰ trống',
        congThuc: { o: 'D2', ct: '=COUNTBLANK(B2:B9)' },
        cot: [...COT_DL, { rong: 30 }, { rong: 130 }],
        hang: [
            [...DU_LIEU, '', dauXanh('COUNTBLANK')],
            [...HANG_GOC[0], '', { v: '2', nen: 'xanh' }],
            HANG_GOC[1], HANG_GOC[2], HANG_GOC[3], HANG_GOC[4], HANG_GOC[5], HANG_GOC[6], HANG_GOC[7],
        ],
        chon: 'D2',
    },
    {
        ten: 'cc-05-doi-chieu',
        tieuDe: 'COUNTA + COUNTBLANK phải bằng tổng số ô',
        cot: [{ rong: 220 }, { rong: 130 }],
        hang: [
            [dauXanh('Phép kiểm'), dauXanh('Kết quả')],
            ['COUNTA', '6'],
            ['COUNTBLANK', '2'],
            ['Tổng cộng', { v: '8', nen: 'xanh' }],
            ['Tổng số học sinh thật', { v: '8 ✓ khớp', nen: 'xanh' }],
        ],
    },
    {
        ten: 'cc-06-trong-gia',
        tieuDe: 'Ô trông trống nhưng chứa công thức trả về chuỗi rỗng',
        cot: [{ rong: 260 }, { rong: 180 }],
        hang: [
            [dauXanh('Công thức trong ô'), dauXanh('COUNTBLANK có tính?')],
            [{ v: '(ô để trống thật)', canLe: 'giua' }, { v: 'Có — TRUE', nen: 'xanh' }],
            [{ v: '=IF(A1="","",A1)', mono: true }, { v: 'Không — FALSE', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-count-counta-countblank', anh: bai }];

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
