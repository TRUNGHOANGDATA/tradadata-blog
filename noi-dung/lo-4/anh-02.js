// Ảnh minh hoạ cho bài 2 — MAX, MIN, LARGE, SMALL
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const DU_LIEU = [dauXanh('Nhân viên'), dauXanh('Doanh số (tr)')];
const HANG_GOC = [
    ['Nguyễn Thị Mai', '75'],
    ['Trần Văn Hải', '52'],
    ['Lê Văn Chương', '88'],
    ['Phạm Minh Thư', '70'],
    ['Hoàng Văn Em', '95'],
    ['Vũ Thị Phương', '60'],
];
const COT_DL = [{ rong: 170 }, { rong: 140 }];

const bai = [
    {
        ten: 'mm-01-du-lieu',
        tieuDe: 'Doanh số bán hàng của 6 nhân viên trong tháng',
        cot: COT_DL,
        hang: [DU_LIEU, ...HANG_GOC],
    },
    {
        ten: 'mm-02-max-min',
        tieuDe: 'MAX và MIN — giá trị lớn nhất, nhỏ nhất',
        cot: [...COT_DL, { rong: 30 }, { rong: 130 }],
        hang: [
            [...DU_LIEU, '', dauXanh('Kết quả')],
            [...HANG_GOC[0], '', { v: 'MAX = 95', nen: 'xanh' }],
            [...HANG_GOC[1], '', { v: 'MIN = 52', nen: 'do' }],
            HANG_GOC[2], HANG_GOC[3], HANG_GOC[4], HANG_GOC[5],
        ],
    },
    {
        ten: 'mm-03-large',
        tieuDe: 'LARGE — giá trị lớn thứ 2, không phải hạng nhất',
        congThuc: { o: 'D2', ct: '=LARGE(B2:B7, 2)' },
        cot: [...COT_DL, { rong: 30 }, { rong: 130 }],
        hang: [
            [...DU_LIEU, '', dauXanh('LARGE(...,2)')],
            [...HANG_GOC[0], '', { v: '88', nen: 'xanh' }],
            HANG_GOC[1], HANG_GOC[2], HANG_GOC[3], HANG_GOC[4], HANG_GOC[5],
        ],
        chon: 'D2',
    },
    {
        ten: 'mm-04-small',
        tieuDe: 'SMALL — giá trị nhỏ thứ 2',
        congThuc: { o: 'D2', ct: '=SMALL(B2:B7, 2)' },
        cot: [...COT_DL, { rong: 30 }, { rong: 130 }],
        hang: [
            [...DU_LIEU, '', dauXanh('SMALL(...,2)')],
            [...HANG_GOC[0], '', { v: '60', nen: 'xanh' }],
            HANG_GOC[1], HANG_GOC[2], HANG_GOC[3], HANG_GOC[4], HANG_GOC[5],
        ],
        chon: 'D2',
    },
    {
        ten: 'mm-05-lay-ten',
        tieuDe: 'Ghép INDEX/MATCH để lấy đúng tên ứng với hạng nhì',
        congThuc: { o: 'D2', ct: '=INDEX(A2:A7,MATCH(LARGE(B2:B7,2),B2:B7,0))' },
        cot: [...COT_DL, { rong: 30 }, { rong: 150 }],
        hang: [
            [...DU_LIEU, '', dauXanh('Tên hạng nhì')],
            [...HANG_GOC[0], '', { v: 'Lê Văn Chương', nen: 'xanh' }],
            HANG_GOC[1], HANG_GOC[2], HANG_GOC[3], HANG_GOC[4], HANG_GOC[5],
        ],
        chon: 'D2',
    },
];

const LO = [{ slug: 'ham-max-min-large-small', anh: bai }];

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
