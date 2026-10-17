// Ảnh minh hoạ cho bài 5 — 12 nguyên tắc dựng file
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'nt-01-flat-table',
        tieuDe: 'Bảng phẳng: một dòng tiêu đề, mỗi dòng một bản ghi',
        cot: [{ rong: 90 }, { rong: 90 }, { rong: 80 }, { rong: 110 }],
        hang: [
            [dauXanh('Mã đơn'), dauXanh('Khu vực'), dauXanh('Số lượng'), dauXanh('Doanh thu')],
            ['DH-1001', 'Miền Trung', '6', '111000000'],
            ['DH-1002', 'Miền Trung', '10', '92000000'],
            ['DH-1003', 'Miền Bắc', '7', '129500000'],
            ['DH-1004', 'Miền Nam', '6', '111000000'],
        ],
    },
    {
        ten: 'nt-02-quy-uoc-mau',
        tieuDe: 'Quy ước màu: nhìn là biết ô nào được sửa',
        cot: [{ rong: 170 }, { rong: 180 }],
        hang: [
            [dauXanh('Màu'), dauXanh('Ý nghĩa')],
            [{ v: 'Xanh dương', mau: '#1f4e79' }, 'Số nhập tay, được sửa'],
            [{ v: 'Đen', mau: '#1a1a1a' }, 'Ô công thức, đừng gõ đè'],
            [{ v: 'Xanh lá', mau: '#217346' }, 'Lấy số từ sheet khác'],
            [{ v: 'Nền vàng', nen: 'vang' }, 'Giả định, soát định kỳ'],
            [{ v: 'Đỏ', mau: '#c0392b' }, 'Ô kiểm tra đang lệch'],
        ],
    },
    {
        ten: 'nt-03-o-kiem-tra',
        tieuDe: 'Ô kiểm tra: chênh lệch phải bằng 0',
        congThuc: { o: 'B3', ct: '=B1-B2' },
        cot: [{ rong: 180 }, { rong: 120 }],
        hang: [
            ['Tổng chi tiết', '2874500000'],
            ['Tổng tổng hợp', '2874500000'],
            [{ v: 'Chênh lệch', dam: true }, { v: '0', dam: true, nen: 'xanh' }],
        ],
    },
];

const LO = [{ slug: 'nguyen-tac-file', anh: bai }];

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
