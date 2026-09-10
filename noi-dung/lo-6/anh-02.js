// Ảnh minh hoạ cho bài 2 — DOLLAR, FIXED
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'df-01-dollar-co-ban',
        tieuDe: 'DOLLAR — định dạng số thành chuỗi tiền tệ kiểu Mỹ',
        congThuc: { o: 'B2', ct: '=DOLLAR(1234567, 0)' },
        cot: [{ rong: 130 }, { rong: 140 }],
        hang: [
            [dauXanh('Số gốc'), dauXanh('DOLLAR(...,0)')],
            [{ v: '1234567', canLe: 'phai' }, { v: '$1,234,567', nen: 'xanh', canLe: 'phai' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'df-02-so-sanh-text',
        tieuDe: 'TEXT linh hoạt hơn cho định dạng tiền Việt Nam',
        cot: [{ rong: 280 }, { rong: 150 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DOLLAR(1234567,0)', mono: true }, { v: '$1,234,567', nen: 'do' }],
            [{ v: '=TEXT(1234567,"#.##0")&" đ"', mono: true }, { v: '1.234.567 đ', nen: 'xanh' }],
        ],
    },
    {
        ten: 'df-03-fixed-co-ban',
        tieuDe: 'FIXED — cố định đúng 2 chữ số thập phân',
        congThuc: { o: 'B2', ct: '=FIXED(1234.5678, 2)' },
        cot: [{ rong: 130 }, { rong: 140 }],
        hang: [
            [dauXanh('Số gốc'), dauXanh('FIXED(...,2)')],
            [{ v: '1234,5678', canLe: 'phai' }, { v: '1,234.57', nen: 'xanh', canLe: 'phai' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'df-04-fixed-khong-phay',
        tieuDe: 'FIXED với no_commas = TRUE — bỏ dấu ngăn nghìn',
        congThuc: { o: 'B1', ct: '=FIXED(1234.5678, 2, TRUE)' },
        cot: [{ rong: 220 }, { rong: 130 }],
        hang: [
            [{ v: '=FIXED(1234.5678,2,TRUE)', mono: true }, { v: '1234.57', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'df-05-ket-qua-la-van-ban',
        tieuDe: 'Kết quả DOLLAR/FIXED là VĂN BẢN — không cộng trực tiếp được',
        congThuc: { o: 'B3', ct: '=SUM(B1:B2)' },
        cot: [{ rong: 220 }, { rong: 140 }],
        hang: [
            [{ v: '=FIXED(500,0)', mono: true }, { v: '"500" (chữ)', canLe: 'trai' }],
            [{ v: '=FIXED(300,0)', mono: true }, { v: '"300" (chữ)', canLe: 'trai' }],
            ['Tổng', { v: '#VALUE! hoặc 0', nen: 'do' }],
        ],
        chon: 'B3',
    },
];

const LO = [{ slug: 'ham-dollar-fixed', anh: bai }];

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
