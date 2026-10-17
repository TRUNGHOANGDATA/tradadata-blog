// Ảnh minh hoạ cho bài Circular Reference
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'cr-01-vong-truc-tiep',
        tieuDe: 'Vòng trực tiếp: A1 tự tham chiếu chính nó',
        congThuc: { o: 'A1', ct: '=A1+1' },
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'Circular Reference Warning', canLe: 'giua', mau: '#c0392b', dam: true, nen: 'do' }],
        ],
    },
    {
        ten: 'cr-02-vong-gian-tiep',
        tieuDe: 'Vòng gián tiếp: A1 → B1 → C1 → quay lại A1',
        cot: [{ rong: 90 }, { rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('A1'), dauXanh('B1'), dauXanh('C1')],
            [{ v: '=B1+1', nen: 'do' }, { v: '=C1+1', nen: 'do' }, { v: '=A1+1', nen: 'do', dam: true }],
        ],
    },
    {
        ten: 'cr-03-cong-cu-trace',
        tieuDe: 'Formulas → Error Checking → Circular References',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'Trace Precedents / Trace Dependents', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'cr-04-iterative-calculation',
        tieuDe: 'Iterative Calculation — chỉ bật khi CỐ Ý cần vòng lặp',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Tham số'), dauXanh('Mặc định')],
            ['Maximum Iterations', '100'],
            ['Maximum Change', '0.001'],
        ],
    },
];

const LO = [{ slug: 'circular-reference', anh: bai }];

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
