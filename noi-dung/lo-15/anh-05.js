// Ảnh minh hoạ cho bài 5 — PERMUT
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'pm-01-cu-phap-co-ban',
        tieuDe: 'PERMUT đếm số cách chọn, có phân biệt thứ tự',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=PERMUT(10,3)', mono: true }, { v: '720', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'pm-02-xep-giai-nhat-nhi-ba',
        tieuDe: 'Xếp giải Nhất-Nhì-Ba từ 10 thí sinh',
        congThuc: { o: 'B1', ct: '=PERMUT(10,3)' },
        cot: [{ rong: 240 }],
        hang: [
            [{ v: '(An Nhất, Bình Nhì) ≠ (Bình Nhất, An Nhì): KHÁC NHAU', nen: 'xanh', canLe: 'giua' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'pm-03-quan-he-ba-ham',
        tieuDe: 'PERMUT luôn gấp COMBIN đúng FACT(số chọn) lần',
        cot: [{ rong: 200 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=PERMUT(10,3)/COMBIN(10,3)', mono: true }, { v: '6', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=FACT(3)', mono: true }, { v: '6', canLe: 'giua' }],
        ],
    },
    {
        ten: 'pm-04-permut-bang-fact',
        tieuDe: 'Chọn và xếp toàn bộ nhóm — PERMUT bằng FACT',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=PERMUT(5,5)', mono: true }, { v: '120', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=FACT(5)', mono: true }, { v: '120', canLe: 'giua' }],
        ],
    },
    {
        ten: 'pm-05-chon-dung-ham',
        tieuDe: 'Vai trò phân biệt hay không — chọn đúng hàm',
        cot: [{ rong: 160 }, { rong: 90 }],
        hang: [
            [dauXanh('Tình huống'), dauXanh('Dùng hàm')],
            ['Vai trò không phân biệt', { v: 'COMBIN', nen: 'xanh' }],
            ['Vai trò có phân biệt', { v: 'PERMUT', nen: 'xanh' }],
        ],
    },
];

const LO = [{ slug: 'ham-permut', anh: bai }];

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
