// Ảnh minh hoạ cho bài Evaluate Formula
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'ef-01-mo-hop-thoai',
        tieuDe: 'Formulas → Evaluate Formula — phần gạch chân tính trước',
        cot: [{ rong: 300 }],
        hang: [
            [{ v: 'IF(VLOOKUP(A2,Bang,2,FALSE)>AVERAGE(C:C),...)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'ef-02-tung-buoc',
        tieuDe: 'Đi từ trong ra ngoài — từng bước thay bằng giá trị thật',
        cot: [{ rong: 380 }],
        hang: [
            [{ v: 'IF(VLOOKUP(...)>AVERAGE(...),"Cao","Thấp")', mono: true, canLe: 'giua' }],
            [{ v: 'IF(85>AVERAGE(...),"Cao","Thấp")', mono: true, canLe: 'giua', nen: 'vang' }],
            [{ v: 'IF(85>70,"Cao","Thấp")', mono: true, canLe: 'giua', nen: 'xanh' }],
            [{ v: '"Cao"', mono: true, canLe: 'giua', nen: 'xanh', dam: true }],
        ],
    },
    {
        ten: 'ef-03-f9-vs-evaluate',
        tieuDe: 'F9 (nhanh, nhớ Esc) so với Evaluate Formula (an toàn hơn)',
        cot: [{ rong: 100 }, { rong: 180 }],
        hang: [
            [dauXanh('Cách'), dauXanh('Rủi ro')],
            ['F9 + Esc', { v: 'Quên Esc là ghi đè công thức', mau: '#c0392b' }],
            [{ v: 'Evaluate Formula', nen: 'xanh' }, { v: 'Không rủi ro gì', dam: true }],
        ],
    },
];

const LO = [{ slug: 'evaluate-formula', anh: bai }];

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
