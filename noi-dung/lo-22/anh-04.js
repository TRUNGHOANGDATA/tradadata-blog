// Ảnh minh hoạ cho bài 4 — PERCENTILE.INC, PERCENTILE.EXC
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'pi-01-cu-phap-co-ban',
        tieuDe: 'PERCENTILE.INC (bao gồm) và PERCENTILE.EXC (loại trừ)',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'PERCENTILE.INC(mảng, k)  /  PERCENTILE.EXC(mảng, k)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'pi-02-vi-du-tinh-toan',
        tieuDe: 'Cùng dữ liệu 1-10, phân vị 25% khác nhau',
        cot: [{ rong: 220 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=PERCENTILE.INC({1..10},0.25)', mono: true }, { v: '3,25', nen: 'xanh' }],
            [{ v: '=PERCENTILE.EXC({1..10},0.25)', mono: true }, { v: '2,75', canLe: 'giua' }],
        ],
    },
    {
        ten: 'pi-03-gioi-han-pham-vi-k',
        tieuDe: 'PERCENTILE.EXC có phạm vi k hẹp hơn hẳn',
        cot: [{ rong: 220 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=PERCENTILE.EXC({1..10},0.05)', mono: true }, { v: '#NUM!', nen: 'do' }],
        ],
    },
    {
        ten: 'pi-04-vi-sao-hai-dinh-nghia',
        tieuDe: 'Hai quy ước hợp lệ, không cái nào "đúng hơn"',
        cot: [{ rong: 130 }, { rong: 140 }],
        hang: [
            [dauXanh('INC'), dauXanh('EXC')],
            ['Phổ biến, linh hoạt', 'Định nghĩa nghiêm ngặt hơn'],
        ],
    },
    {
        ten: 'pi-05-ung-dung-nguong-hoc-bong',
        tieuDe: 'Tìm ngưỡng top 10% để xét học bổng',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: '=PERCENTILE.INC(DiemToanTruong,0.9)', mono: true, canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-percentile-inc-exc', anh: bai }];

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
