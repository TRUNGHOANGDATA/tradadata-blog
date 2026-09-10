// Ảnh minh hoạ cho bài 2 — ISREF
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'ir-01-name-manager',
        tieuDe: 'Name Manager — hai loại tên khác bản chất',
        cot: [{ rong: 150 }, { rong: 220 }],
        hang: [
            [dauXanh('Tên'), dauXanh('Refers to')],
            ['VungDoanhThu', 'Sheet1!$B$2:$B$10'],
            ['ThueSuat', '=10%'],
        ],
    },
    {
        ten: 'ir-02-isref-hai-truong-hop',
        tieuDe: 'ISREF phân biệt tham chiếu thật với giá trị hằng số',
        cot: [{ rong: 220 }, { rong: 150 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ISREF(VungDoanhThu)', mono: true }, { v: 'TRUE', nen: 'xanh' }],
            [{ v: '=ISREF(ThueSuat)', mono: true }, { v: 'FALSE', nen: 'do' }],
        ],
    },
    {
        ten: 'ir-03-vi-du-nham-lan',
        tieuDe: 'Dùng nhầm tên hằng số ở chỗ cần một vùng ô',
        cot: [{ rong: 220 }, { rong: 180 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Vấn đề')],
            [{ v: '=SUM(ThueSuat)', mono: true }, { v: 'Chạy được, nhưng sai ý định', nen: 'do' }],
        ],
    },
    {
        ten: 'ir-04-bang-ra-soat',
        tieuDe: 'Bảng liệt kê tên để rà soát hàng loạt',
        cot: [{ rong: 150 }],
        hang: [
            [dauXanh('Tên (dạng chữ)')],
            ['VungDoanhThu'],
            ['ThueSuat'],
        ],
    },
    {
        ten: 'ir-05-ra-soat-bang-indirect',
        tieuDe: 'ISREF + INDIRECT — rà soát hàng loạt Named Range',
        congThuc: { o: 'B2', ct: '=IF(ISREF(INDIRECT(A2)),"Tham chiếu hợp lệ","Không phải tham chiếu")' },
        cot: [{ rong: 150 }, { rong: 200 }],
        hang: [
            [dauXanh('Tên'), dauXanh('Kiểm tra')],
            ['VungDoanhThu', { v: 'Tham chiếu hợp lệ', nen: 'xanh' }],
            ['ThueSuat', { v: 'Không phải tham chiếu', nen: 'do' }],
        ],
        chon: 'B2',
    },
];

const LO = [{ slug: 'ham-isref', anh: bai }];

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
