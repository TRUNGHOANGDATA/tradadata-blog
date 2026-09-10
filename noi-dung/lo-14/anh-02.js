// Ảnh minh hoạ cho bài 2 — ARRAYTOTEXT
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'at-01-cu-phap-co-ban',
        tieuDe: 'ARRAYTOTEXT gộp một mảng thành một chuỗi',
        cot: [{ rong: 200 }],
        hang: [
            [{ v: 'ARRAYTOTEXT(mảng, [định_dạng])', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'at-02-hien-thi-trong-cau',
        tieuDe: 'Ghép kết quả FILTER vào một câu hoàn chỉnh',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: '"Sản phẩm còn hàng: " & ARRAYTOTEXT(FILTER(...))', mono: true, canLe: 'giua' }],
            [{ v: '→ "Sản phẩm còn hàng: Bút, Vở, Thước"', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'at-03-hai-dinh-dang',
        tieuDe: 'Định dạng 0 dễ đọc — định dạng 1 dán lại được',
        cot: [{ rong: 170 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ARRAYTOTEXT({1,2,3})', mono: true }, { v: '1, 2, 3', nen: 'xanh' }],
            [{ v: '=ARRAYTOTEXT({1,2,3},1)', mono: true }, { v: '{1,2,3}', canLe: 'giua' }],
        ],
    },
    {
        ten: 'at-04-gop-dong-log',
        tieuDe: 'Gộp danh sách dòng lỗi thành một dòng log',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: '"Dòng lỗi: " & ARRAYTOTEXT(FILTER(ROW(...),ISERROR(...)))', mono: true, canLe: 'giua' }],
            [{ v: '→ "Dòng lỗi: 5, 12, 19"', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'at-05-luu-y-dau-phay-trong-text',
        tieuDe: 'Dấu phẩy trong nội dung dễ gây nhầm số phần tử',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: '"Hà Nội, Việt Nam, Đà Nẵng" ← thực ra chỉ 2 phần tử', nen: 'vang', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-arraytotext', anh: bai }];

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
