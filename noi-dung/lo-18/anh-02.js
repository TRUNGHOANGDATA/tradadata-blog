// Ảnh minh hoạ cho bài 2 — ARABIC
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'ar-01-cu-phap-co-ban',
        tieuDe: 'ARABIC đọc chữ số La Mã thành số',
        cot: [{ rong: 160 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ARABIC("MCMXCIV")', mono: true }, { v: '1994', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'ar-02-doi-nguoc-so-chuong',
        tieuDe: 'Bóc chữ "Chương " rồi mới đọc số La Mã',
        congThuc: { o: 'B2', ct: '=ARABIC(SUBSTITUTE(A2,"Chương ",""))' },
        cot: [{ rong: 110 }, { rong: 70 }],
        hang: [
            [dauXanh('Ô A'), dauXanh('Kết quả')],
            ['Chương IV', { v: '4', nen: 'xanh', canLe: 'giua' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'ar-03-kiem-tra-nguoc',
        tieuDe: 'ROMAN rồi ARABIC phải khớp lại số ban đầu',
        cot: [{ rong: 200 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ARABIC(ROMAN(1994))', mono: true }, { v: '1994', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'ar-04-ho-tro-so-am',
        tieuDe: 'Dấu trừ phía trước cho ra số âm',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ARABIC("-XIV")', mono: true }, { v: '-14', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'ar-05-ky-tu-khong-hop-le',
        tieuDe: 'Trộn ký tự không hợp lệ — báo lỗi ngay',
        cot: [{ rong: 200 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ARABIC("MCMXCIV2026")', mono: true }, { v: '#VALUE!', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-arabic', anh: bai }];

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
