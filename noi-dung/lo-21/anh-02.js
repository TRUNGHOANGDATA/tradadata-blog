// Ảnh minh hoạ cho bài 2 — MAXA
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'mx-01-cu-phap-co-ban',
        tieuDe: 'MAXA cùng quy tắc quy đổi với AVERAGEA',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'MAXA(giá_trị1, [giá_trị2], ...)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'mx-02-nguy-hiem-so-am',
        tieuDe: 'Một ô TRUE khiến MAXA sai lệch hoàn toàn với số âm',
        cot: [{ rong: 150 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=MAX(-5,-2,-8)', mono: true }, { v: '-2', canLe: 'giua' }],
            [{ v: '=MAXA(-5,-2,-8,TRUE)', mono: true }, { v: '1', nen: 'do', canLe: 'giua' }],
        ],
    },
    {
        ten: 'mx-03-ung-dung-dung-cho',
        tieuDe: 'Checkbox đại diện mức điểm tối đa',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Ô'), dauXanh('Quy đổi')],
            [{ v: 'TRUE (điểm tối đa)', canLe: 'trai' }, { v: '1 (không phải 10)', nen: 'vang' }],
        ],
    },
    {
        ten: 'mx-04-van-ban-cung-gay-loi',
        tieuDe: 'Văn bản cũng gây lỗi tương tự TRUE',
        cot: [{ rong: 200 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=MAX(-5,-2,"Không có DL")', mono: true }, { v: '-2', canLe: 'giua' }],
            [{ v: '=MAXA(-5,-2,"Không có DL")', mono: true }, { v: '0', nen: 'do', canLe: 'giua' }],
        ],
    },
    {
        ten: 'mx-05-luon-kiem-tra-du-lieu-am',
        tieuDe: 'Luôn kiểm tra kỹ khi dữ liệu có thể toàn số âm',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: 'Chênh lệch, lỗ/lãi, biến động → cẩn thận với MAXA', nen: 'vang', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-maxa', anh: bai }];

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
