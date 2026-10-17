// Ảnh minh hoạ cho bài 6 — Tham chiếu tương đối và tuyệt đối
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'tc-01-bon-kieu',
        tieuDe: 'Bốn kiểu tham chiếu và cách khoá',
        cot: [{ rong: 80 }, { rong: 260 }],
        hang: [
            [dauXanh('Viết'), dauXanh('Khi copy')],
            ['A1', 'Cả cột và hàng đều chạy'],
            ['$A$1', 'Khoá cứng cả cột và hàng'],
            ['$A1', 'Khoá cột, hàng vẫn chạy'],
            ['A$1', 'Khoá hàng, cột vẫn chạy'],
        ],
    },
    {
        ten: 'tc-02-phim-f4',
        tieuDe: 'Bấm F4 để đổi vòng bốn kiểu',
        cot: [{ rong: 300 }],
        hang: [
            [{ v: 'A1 → $A$1 → A$1 → $A1 → A1', canLe: 'giua', mono: true }],
        ],
    },
    {
        ten: 'tc-03-bang-nhan',
        tieuDe: 'Cả bảng chỉ dùng =$F22*G$21',
        congThuc: { o: 'G22', ct: '=$F22*G$21' },
        cot: [{ rong: 100 }, { rong: 80 }, { rong: 90 }, { rong: 100 }],
        hang: [
            [{ v: 'Đơn giá \\ SL', dam: true }, dauXanh('1'), dauXanh('5'), dauXanh('10')],
            ['650000', '650000', '3250000', '6500000'],
            ['7400000', '7400000', '37000000', '74000000'],
            ['18500000', '18500000', '92500000', '185000000'],
        ],
    },
    {
        ten: 'tc-04-gia-dinh-vat',
        tieuDe: 'Giả định VAT ở một ô, tham chiếu tuyệt đối tới nó',
        congThuc: { o: 'B2', ct: '=A2*$H$2' },
        cot: [{ rong: 110 }, { rong: 100 }],
        hang: [
            [dauXanh('Đơn giá'), dauXanh('Tiền VAT')],
            ['650000', '52000'],
            ['7400000', '592000'],
            [{ v: 'H2 = 8% (nền vàng)', nen: 'vang' }, { v: 'sửa 1 ô, cả cột đổi', nen: 'vang' }],
        ],
    },
];

const LO = [{ slug: 'tham-chieu', anh: bai }];

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
