// Ảnh minh hoạ cho bài 4 — SUMSQ, PRODUCT
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'sp-01-du-lieu',
        tieuDe: 'Dãy số dùng để tính SUMSQ',
        cot: [{ rong: 100 }],
        hang: [
            [dauXanh('Số')],
            ['3'], ['4'], ['5'], ['6'], ['7'],
        ],
    },
    {
        ten: 'sp-02-sumsq',
        tieuDe: 'SUMSQ — tổng bình phương của cả dãy',
        congThuc: { o: 'C1', ct: '=SUMSQ(B2:B6)' },
        cot: [{ rong: 100 }, { rong: 30 }, { rong: 130 }],
        hang: [
            [dauXanh('Số'), '', dauXanh('SUMSQ')],
            ['3', '', { v: '135', nen: 'xanh' }],
            ['4', '', ''], ['5', '', ''], ['6', '', ''], ['7', '', ''],
        ],
        chon: 'C1',
    },
    {
        ten: 'sp-03-cach-thay-the',
        tieuDe: 'SUMPRODUCT nhân dãy với chính nó — cùng kết quả, dài hơn',
        cot: [{ rong: 250 }, { rong: 130 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=SUMSQ(B2:B6)', mono: true }, { v: '135', nen: 'xanh' }],
            [{ v: '=SUMPRODUCT(B2:B6,B2:B6)', mono: true }, { v: '135', nen: 'xanh' }],
        ],
    },
    {
        ten: 'sp-04-product-du-lieu',
        tieuDe: 'Dãy số dùng để tính PRODUCT',
        cot: [{ rong: 100 }],
        hang: [
            [dauXanh('Số')],
            ['2'], ['3'], ['4'], ['5'],
        ],
    },
    {
        ten: 'sp-05-product',
        tieuDe: 'PRODUCT — nhân tất cả số trong vùng',
        congThuc: { o: 'C1', ct: '=PRODUCT(B2:B5)' },
        cot: [{ rong: 100 }, { rong: 30 }, { rong: 130 }],
        hang: [
            [dauXanh('Số'), '', dauXanh('PRODUCT')],
            ['2', '', { v: '120', nen: 'xanh' }],
            ['3', '', ''], ['4', '', ''], ['5', '', ''],
        ],
        chon: 'C1',
    },
    {
        ten: 'sp-06-bo-qua-o-chu',
        tieuDe: 'PRODUCT tự bỏ qua ô chữ và ô trống, dấu * thì báo lỗi',
        cot: [{ rong: 130 }, { rong: 200 }],
        hang: [
            [dauXanh('Vùng có "N/A"'), dauXanh('Kết quả')],
            [{ v: '=PRODUCT(B2:B5)', mono: true }, { v: 'Bỏ qua, vẫn tính', nen: 'xanh' }],
            [{ v: '=B2*B3*B4*B5', mono: true }, { v: '#VALUE!', nen: 'do' }],
        ],
    },
    {
        ten: 'sp-07-du-lieu-tang-truong',
        tieuDe: 'Tỷ lệ tăng trưởng doanh thu qua 4 quý',
        cot: [{ rong: 80 }, { rong: 100 }],
        hang: [
            [dauXanh('Quý'), dauXanh('Tăng trưởng')],
            ['Q1', '10%'], ['Q2', '5%'], ['Q3', '8%'], ['Q4', '3%'],
        ],
    },
    {
        ten: 'sp-08-tang-truong-luy-ke',
        tieuDe: 'PRODUCT(1+...) - 1: tỷ lệ tăng trưởng gộp cả năm',
        congThuc: { o: 'C1', ct: '=PRODUCT(1+B2:B5)-1' },
        cot: [{ rong: 80 }, { rong: 100 }, { rong: 30 }, { rong: 150 }],
        hang: [
            [dauXanh('Quý'), dauXanh('Tăng trưởng'), '', dauXanh('Tăng trưởng gộp')],
            ['Q1', '10%', '', { v: '≈ 28,5%', nen: 'xanh' }],
            ['Q2', '5%', '', ''],
            ['Q3', '8%', '', ''],
            ['Q4', '3%', '', ''],
        ],
        chon: 'C1',
    },
];

const LO = [{ slug: 'ham-sumsq-product', anh: bai }];

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
