// Ảnh minh hoạ cho bài 1 — ROMAN
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'rm-01-cu-phap-co-ban',
        tieuDe: 'ROMAN chuyển số thành chữ số La Mã',
        cot: [{ rong: 140 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ROMAN(1994)', mono: true }, { v: 'MCMXCIV', nen: 'xanh' }],
        ],
    },
    {
        ten: 'rm-02-danh-so-chuong-sach',
        tieuDe: 'Đánh số chương sách bằng ROMAN',
        congThuc: { o: 'B2', ct: '="Chương "&ROMAN(A2)' },
        cot: [{ rong: 60 }, { rong: 110 }],
        hang: [
            [dauXanh('Số'), dauXanh('Hiển thị')],
            ['4', { v: 'Chương IV', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'rm-03-cac-muc-rut-gon',
        tieuDe: 'Các mức rút gọn khác nhau của cùng một số',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ROMAN(499,0)', mono: true }, { v: 'CDXCIX', nen: 'xanh' }],
            [{ v: '=ROMAN(499,4)', mono: true }, { v: 'ID', canLe: 'giua' }],
        ],
    },
    {
        ten: 'rm-04-gioi-han-3999',
        tieuDe: 'Vượt quá 3.999 — báo lỗi ngay',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ROMAN(4000)', mono: true }, { v: '#VALUE!', nen: 'do' }],
        ],
    },
    {
        ten: 'rm-05-so-0-va-so-am',
        tieuDe: 'Số 0 và số âm đều không có cách biểu diễn',
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ROMAN(0)', mono: true }, { v: '(rỗng)', canLe: 'giua' }],
            [{ v: '=ROMAN(-5)', mono: true }, { v: '#VALUE!', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-roman', anh: bai }];

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
