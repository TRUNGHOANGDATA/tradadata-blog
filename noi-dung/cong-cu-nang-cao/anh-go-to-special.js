// Ảnh minh hoạ cho bài Go To Special
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'gs-01-mo-hop-thoai',
        tieuDe: 'F5 (hoặc Ctrl+G) → nút Special...',
        cot: [{ rong: 150 }, { rong: 150 }],
        hang: [
            [dauXanh('Phím tắt'), dauXanh('Mở gì')],
            ['F5 / Ctrl+G', 'Hộp thoại Go To'],
            [{ v: 'Nút Special...', nen: 'xanh' }, { v: 'Go To Special', dam: true, nen: 'xanh' }],
        ],
    },
    {
        ten: 'gs-02-blanks',
        tieuDe: 'Blanks — chọn hết ô trống, gõ 0 rồi Ctrl+Enter điền hàng loạt',
        cot: [{ rong: 90 }],
        hang: [
            [dauXanh('Doanh thu')],
            ['150.000'],
            [{ v: '(trống)', nen: 'do', canLe: 'giua' }],
            ['320.000'],
            [{ v: '(trống)', nen: 'do', canLe: 'giua' }],
        ],
    },
    {
        ten: 'gs-03-formulas-constants',
        tieuDe: 'Formulas (chọn ô công thức) — Constants (chọn ô nhập tay)',
        cot: [{ rong: 100 }, { rong: 120 }],
        hang: [
            [dauXanh('Tiêu chí'), dauXanh('Chọn được gì')],
            ['Formulas', { v: 'Mọi ô có =...', nen: 'xanh' }],
            ['Constants', { v: 'Mọi ô gõ tay', nen: 'vang' }],
        ],
    },
    {
        ten: 'gs-04-visible-cells',
        tieuDe: 'Visible Cells Only (Alt+;) — copy đúng phần đang hiện',
        cot: [{ rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Dòng'), dauXanh('Trạng thái')],
            ['1', { v: 'Hiện', nen: 'xanh' }],
            [{ v: '2', nen: 'do' }, { v: 'Đang ẩn', mau: '#c0392b' }],
            ['3', { v: 'Hiện', nen: 'xanh' }],
        ],
    },
];

const LO = [{ slug: 'go-to-special', anh: bai }];

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
