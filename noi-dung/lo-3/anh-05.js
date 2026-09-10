// Ảnh minh hoạ cho bài 5 — LINEST
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });
const dauVang = t => ({ v: t, dam: true, nen: 'vang' });

const bai = [
    {
        ten: 'le-01-du-lieu',
        tieuDe: 'Thêm biến thứ hai: số nhân viên bán hàng mỗi tháng',
        cot: [{ rong: 70 }, { rong: 130 }, { rong: 130 }, { rong: 130 }],
        hang: [
            [dauXanh('Tháng'), dauXanh('Chi phí QC (tr)'), dauXanh('Số NV bán hàng'), dauXanh('Doanh thu (tr)')],
            ['1', '10', '5', '120'],
            ['2', '15', '6', '150'],
            ['3', '12', '5', '135'],
            ['4', '20', '8', '200'],
            ['5', '18', '7', '180'],
            ['6', '25', '9', '240'],
        ],
    },
    {
        ten: 'le-02-linest-ket-qua',
        tieuDe: 'LINEST tràn ra một hàng — 2 hệ số + hệ số chặn',
        congThuc: { o: 'F2', ct: '=LINEST(D2:D7, B2:C7)' },
        cot: [{ rong: 130 }, { rong: 130 }, { rong: 130 }, { rong: 30 }, { rong: 30 }, { rong: 110 }, { rong: 110 }, { rong: 110 }],
        hang: [
            [dauXanh('Chi phí QC'), dauXanh('Số NV'), dauXanh('Doanh thu'), '', '', dauVang('Hệ số C'), dauVang('Hệ số B'), dauVang('Hệ số chặn')],
            ['10', '5', '120', '', '', { v: '6,69', nen: 'xanh' }, { v: '6,15', nen: 'xanh' }, { v: '23,81', nen: 'xanh' }],
            ['15', '6', '150', '', '', '', '', ''],
            ['12', '5', '135', '', '', '', '', ''],
            ['20', '8', '200', '', '', '', '', ''],
            ['18', '7', '180', '', '', '', '', ''],
            ['25', '9', '240', '', '', '', '', ''],
        ],
        chon: 'F2',
    },
    {
        ten: 'le-03-thu-tu-nguoc',
        tieuDe: 'Thứ tự hệ số LINEST trả về — đọc từ PHẢI sang TRÁI',
        cot: [{ rong: 160 }, { rong: 160 }, { rong: 160 }],
        hang: [
            [dauVang('Hệ số cột C (cuối)'), dauVang('Hệ số cột B (đầu)'), dauVang('Hệ số chặn')],
            ['6,69 (số NV)', '6,15 (chi phí QC)', '23,81'],
        ],
    },
    {
        ten: 'le-04-stats-day-du',
        tieuDe: 'So sánh R² đơn biến và đa biến — R² điều chỉnh mới công bằng',
        cot: [{ rong: 220 }, { rong: 150 }, { rong: 150 }],
        hang: [
            [dauXanh('Chỉ số'), dauXanh('Đơn biến (chỉ QC)'), dauXanh('Đa biến (QC + NV)')],
            ['R²', '0,992', { v: '0,994', nen: 'vang' }],
            ['R² điều chỉnh', '≈ 0,990', { v: '≈ 0,990', nen: 'xanh' }],
            ['Sai số chuẩn (SE_y)', '4,41', '4,56'],
        ],
    },
];

const LO = [{ slug: 'ham-linest', anh: bai }];

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
