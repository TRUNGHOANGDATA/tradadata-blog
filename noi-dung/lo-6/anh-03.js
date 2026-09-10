// Ảnh minh hoạ cho bài 3 — ISEVEN, ISODD
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'eo-01-co-ban',
        tieuDe: 'ISEVEN và ISODD — kiểm tra chẵn lẻ trực tiếp',
        cot: [{ rong: 80 }, { rong: 110 }, { rong: 110 }],
        hang: [
            [dauXanh('Số'), dauXanh('ISEVEN'), dauXanh('ISODD')],
            ['4', { v: 'TRUE', nen: 'xanh' }, 'FALSE'],
            ['7', 'FALSE', { v: 'TRUE', nen: 'xanh' }],
        ],
    },
    {
        ten: 'eo-02-cach-mod',
        tieuDe: 'Cách làm cũ dùng MOD — vẫn đúng, chỉ dài hơn',
        congThuc: { o: 'B2', ct: '=MOD(A2, 2) = 0' },
        cot: [{ rong: 80 }, { rong: 150 }],
        hang: [
            [dauXanh('Số'), dauXanh('MOD(...,2)=0')],
            ['4', { v: 'TRUE', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'eo-03-to-mau-xen-ke',
        tieuDe: 'ISEVEN(ROW()) làm điều kiện Conditional Formatting',
        cot: [{ rong: 150 }],
        hang: [
            [{ v: 'Dòng 1', nen: 'xanh' }],
            [{ v: 'Dòng 2', canLe: 'trai' }],
            [{ v: 'Dòng 3', nen: 'xanh' }],
            [{ v: 'Dòng 4', canLe: 'trai' }],
        ],
    },
    {
        ten: 'eo-04-du-lieu-lich-truc',
        tieuDe: 'Lịch trực theo ngày, cần chia ca chẵn lẻ',
        cot: [{ rong: 140 }],
        hang: [
            [dauXanh('Ngày trực')],
            ['14/09/2026'],
            ['15/09/2026'],
        ],
    },
    {
        ten: 'eo-05-chia-ca-truc',
        tieuDe: 'IF + ISEVEN + DAY: tự động chia ca theo ngày chẵn lẻ',
        congThuc: { o: 'B2', ct: '=IF(ISEVEN(DAY(A2)),"Ca A","Ca B")' },
        cot: [{ rong: 140 }, { rong: 100 }],
        hang: [
            [dauXanh('Ngày trực'), dauXanh('Ca')],
            ['14/09/2026', { v: 'Ca A', nen: 'xanh' }],
            ['15/09/2026', { v: 'Ca B', nen: 'do' }],
        ],
        chon: 'B2',
    },
];

const LO = [{ slug: 'ham-iseven-isodd', anh: bai }];

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
