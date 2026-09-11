// Ảnh minh hoạ cho bài 5 — SHEET, SHEETS
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'sh-01-cu-phap-co-ban',
        tieuDe: 'SHEET biết vị trí — SHEETS đếm tổng số',
        cot: [{ rong: 240 }],
        hang: [
            [{ v: 'SHEET([giá_trị])   /   SHEETS([phạm_vi])', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'sh-02-vi-du-co-ban',
        tieuDe: 'Sheet thứ 3 trong workbook có 12 sheet',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=SHEET()', mono: true }, { v: '3', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=SHEETS()', mono: true }, { v: '12', canLe: 'giua' }],
        ],
    },
    {
        ten: 'sh-03-tim-vi-tri-theo-ten',
        tieuDe: 'Tìm vị trí tab của một sheet theo tên',
        cot: [{ rong: 170 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=SHEET("Thang6")', mono: true }, { v: '6', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'sh-04-kiem-tra-so-sheet-3d',
        tieuDe: 'Kiểm tra đủ 12 sheet trước khi tin SUM 3D',
        cot: [{ rong: 200 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=SHEETS(Thang1:Thang12)', mono: true }, { v: '12 ✓', nen: 'xanh' }],
        ],
    },
    {
        ten: 'sh-05-tinh-ca-sheet-an',
        tieuDe: 'SHEETS tính cả sheet đang ẩn',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Loại sheet'), dauXanh('Số lượng')],
            ['Đang hiển thị', '10'],
            [{ v: 'Đang ẩn', canLe: 'trai' }, '2'],
            [{ v: 'SHEETS() trả về', dam: true }, { v: '12', nen: 'xanh' }],
        ],
    },
];

const LO = [{ slug: 'ham-sheet-sheets', anh: bai }];

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
