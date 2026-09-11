// Ảnh minh hoạ cho bài 1 — DEC2BIN, BIN2DEC
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'db-01-cu-phap-co-ban',
        tieuDe: 'DEC2BIN và BIN2DEC — cặp hàm ngược nhau',
        cot: [{ rong: 150 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DEC2BIN(9)', mono: true }, { v: '1001', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=BIN2DEC("1001")', mono: true }, { v: '9', canLe: 'giua' }],
        ],
    },
    {
        ten: 'db-02-so-am-bu-hai',
        tieuDe: 'Số âm dùng bù hai 10-bit — không phải lỗi',
        cot: [{ rong: 150 }, { rong: 120 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DEC2BIN(-9)', mono: true }, { v: '1111110111', nen: 'xanh' }],
        ],
    },
    {
        ten: 'db-03-gioi-han-pham-vi',
        tieuDe: 'Vượt phạm vi -512 đến 511 — báo lỗi',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DEC2BIN(600)', mono: true }, { v: '#NUM!', nen: 'do' }],
        ],
    },
    {
        ten: 'db-04-dem-so-0',
        tieuDe: 'Đệm số 0 chỉ có tác dụng với số không âm',
        cot: [{ rong: 150 }, { rong: 130 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DEC2BIN(9,8)', mono: true }, { v: '00001001', nen: 'xanh' }],
            [{ v: '=DEC2BIN(-9,8)', mono: true }, { v: '1111110111', canLe: 'giua' }],
        ],
    },
    {
        ten: 'db-05-bin2dec-nhan-dien-dau',
        tieuDe: 'BIN2DEC tự nhận diện dấu qua bit đầu tiên',
        cot: [{ rong: 190 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=BIN2DEC("1111110111")', mono: true }, { v: '-9', nen: 'xanh', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-dec2bin-bin2dec', anh: bai }];

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
