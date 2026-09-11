// Ảnh minh hoạ cho bài 2 — DEC2HEX, HEX2DEC
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'dh-01-cu-phap-co-ban',
        tieuDe: 'DEC2HEX và HEX2DEC — cặp hàm ngược nhau',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DEC2HEX(255)', mono: true }, { v: 'FF', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=HEX2DEC("FF")', mono: true }, { v: '255', canLe: 'giua' }],
        ],
    },
    {
        ten: 'dh-02-so-am-bu-hai',
        tieuDe: 'Số âm dùng bù hai trên 10 ký tự hex (2^40)',
        cot: [{ rong: 150 }, { rong: 140 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DEC2HEX(-9)', mono: true }, { v: 'FFFFFFFFF7', nen: 'xanh' }],
        ],
    },
    {
        ten: 'dh-03-ma-mau-rgb',
        tieuDe: 'Ghép mã màu RGB từ ba thành phần',
        congThuc: { o: 'D1', ct: '=DEC2HEX(A1,2)&DEC2HEX(B1,2)&DEC2HEX(C1,2)' },
        cot: [{ rong: 50 }, { rong: 50 }, { rong: 50 }],
        hang: [
            [dauXanh('R'), dauXanh('G'), dauXanh('B')],
            ['255', '87', '51'],
        ],
    },
    {
        ten: 'dh-04-khong-phan-biet-hoa-thuong',
        tieuDe: 'HEX2DEC không phân biệt chữ hoa thường',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=HEX2DEC("ff")', mono: true }, { v: '255', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=HEX2DEC("FF")', mono: true }, { v: '255', canLe: 'giua' }],
        ],
    },
    {
        ten: 'dh-05-doc-lai-bu-hai',
        tieuDe: 'Đọc lại giá trị âm từ hex bù hai',
        cot: [{ rong: 200 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=HEX2DEC("FFFFFFFFF7")', mono: true }, { v: '-9', nen: 'xanh', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-dec2hex-hex2dec', anh: bai }];

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
