// Ảnh minh hoạ cho bài 4 — RANK.EQ, RANK.AVG
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'ra-01-cu-phap-co-ban',
        tieuDe: 'RANK.EQ và RANK.AVG cùng cú pháp với RANK',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: 'RANK.EQ(số, ref, [thứ_tự])  /  RANK.AVG(số, ref, [thứ_tự])', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'ra-02-khong-trung-nhau',
        tieuDe: 'Không có giá trị trùng — hai hàm cho cùng kết quả',
        cot: [{ rong: 60 }, { rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Điểm'), dauXanh('RANK.EQ'), dauXanh('RANK.AVG')],
            ['95', { v: '1', nen: 'xanh', canLe: 'giua' }, { v: '1', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'ra-03-rank-eq-trung-hang',
        tieuDe: 'RANK.EQ: đồng hạng 1, bỏ qua hạng 2',
        cot: [{ rong: 60 }, { rong: 90 }],
        hang: [
            [dauXanh('Điểm'), dauXanh('RANK.EQ')],
            ['90', { v: '1', nen: 'xanh', canLe: 'giua' }],
            ['90', { v: '1', nen: 'xanh', canLe: 'giua' }],
            ['80', { v: '3', canLe: 'giua' }],
        ],
    },
    {
        ten: 'ra-04-rank-avg-trung-binh',
        tieuDe: 'RANK.AVG: chia đều hạng trung bình 1,5',
        cot: [{ rong: 60 }, { rong: 90 }],
        hang: [
            [dauXanh('Điểm'), dauXanh('RANK.AVG')],
            ['90', { v: '1,5', nen: 'xanh', canLe: 'giua' }],
            ['90', { v: '1,5', nen: 'xanh', canLe: 'giua' }],
            ['80', { v: '3', canLe: 'giua' }],
        ],
    },
    {
        ten: 'ra-05-so-sanh-hai-cach',
        tieuDe: 'So sánh trực tiếp hai cách xếp hạng',
        cot: [{ rong: 60 }, { rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Điểm'), dauXanh('RANK.EQ'), dauXanh('RANK.AVG')],
            ['90', '1', '1,5'],
            ['90', '1', '1,5'],
            ['80', '3', '3'],
            ['70', '4', '4'],
        ],
    },
];

const LO = [{ slug: 'ham-rank-eq-avg', anh: bai }];

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
