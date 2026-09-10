// Ảnh minh hoạ cho bài 1 — YEAR, MONTH, DAY
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'ymd-01-cu-phap-co-ban',
        tieuDe: 'Tách năm, tháng, ngày từ một ô ngày tháng',
        cot: [{ rong: 150 }, { rong: 110 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: 'Ngày gốc: 15/03/1995', canLe: 'trai' }, ''],
            [{ v: '=YEAR(A2)', mono: true }, { v: '1995', nen: 'xanh' }],
            [{ v: '=MONTH(A2)', mono: true }, { v: '3', canLe: 'giua' }],
            [{ v: '=DAY(A2)', mono: true }, { v: '15', canLe: 'giua' }],
        ],
    },
    {
        ten: 'ymd-02-du-lieu-ban-hang',
        tieuDe: 'Bảng bán hàng — mỗi dòng một ngày khác nhau',
        cot: [{ rong: 90 }, { rong: 100 }],
        hang: [
            [dauXanh('Ngày bán'), dauXanh('Doanh thu')],
            ['05/07/2026', '2.400.000'],
            ['18/07/2026', '1.850.000'],
            ['02/08/2026', '3.100.000'],
        ],
    },
    {
        ten: 'ymd-03-cot-phu-nhom-thang',
        tieuDe: 'Cột phụ Tháng để SUMIFS gộp theo tháng',
        congThuc: { o: 'C2', ct: '=MONTH(A2)' },
        cot: [{ rong: 90 }, { rong: 100 }, { rong: 60 }],
        hang: [
            [dauXanh('Ngày bán'), dauXanh('Doanh thu'), dauXanh('Tháng')],
            ['05/07/2026', '2.400.000', { v: '7', nen: 'xanh' }],
            ['18/07/2026', '1.850.000', '7'],
            ['02/08/2026', '3.100.000', '8'],
        ],
        chon: 'C2',
    },
    {
        ten: 'ymd-04-ngay-dau-thang',
        tieuDe: 'Dựng lại ngày đầu tháng bằng DATE + YEAR + MONTH',
        congThuc: { o: 'B2', ct: '=DATE(YEAR(A2),MONTH(A2),1)' },
        cot: [{ rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Ngày gốc'), dauXanh('Đầu tháng')],
            ['18/07/2026', { v: '01/07/2026', nen: 'xanh' }],
            ['02/08/2026', '01/08/2026'],
        ],
        chon: 'B2',
    },
    {
        ten: 'ymd-05-loi-value-voi-text',
        tieuDe: 'Ô căn trái là văn bản — YEAR báo lỗi #VALUE!',
        congThuc: { o: 'B3', ct: '=YEAR(A3)' },
        cot: [{ rong: 110 }, { rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Ô A'), dauXanh('Kiểu dữ liệu'), dauXanh('=YEAR(A)')],
            [{ v: '15/03/1995', canLe: 'phai' }, 'Ngày thật', { v: '1995', nen: 'xanh' }],
            [{ v: '15/03/1995', canLe: 'trai' }, 'Văn bản', { v: '#VALUE!', nen: 'do' }],
        ],
        chon: 'B3',
    },
];

const LO = [{ slug: 'ham-year-month-day', anh: bai }];

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
