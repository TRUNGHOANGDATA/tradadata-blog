// Ảnh minh hoạ cho bài 1 — WEEKDAY, EOMONTH
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'we-01-weekday-co-ban',
        tieuDe: 'WEEKDAY — ngày 15/09/2026 (Thứ Ba) rơi vào vị trí nào',
        congThuc: { o: 'B2', ct: '=WEEKDAY(A2, 2)' },
        cot: [{ rong: 150 }, { rong: 150 }],
        hang: [
            [dauXanh('Ngày'), dauXanh('WEEKDAY(...,2)')],
            ['15/09/2026 (Thứ Ba)', { v: '2', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'we-02-kiem-tra-cuoi-tuan',
        tieuDe: 'Lọc ngày giao hàng rơi vào cuối tuần để dời lịch',
        congThuc: { o: 'B2', ct: '=IF(WEEKDAY(A2,2)>=6,"Cuối tuần — dời lịch","Ngày làm việc")' },
        cot: [{ rong: 160 }, { rong: 200 }],
        hang: [
            [dauXanh('Ngày giao dự kiến'), dauXanh('Kiểm tra')],
            ['19/09/2026 (Thứ Bảy)', { v: 'Cuối tuần — dời lịch', nen: 'do' }],
            ['21/09/2026 (Thứ Hai)', { v: 'Ngày làm việc', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'we-03-eomonth',
        tieuDe: 'EOMONTH — hạn thanh toán là cuối tháng SAU',
        congThuc: { o: 'B2', ct: '=EOMONTH(A2, 1)' },
        cot: [{ rong: 160 }, { rong: 160 }],
        hang: [
            [dauXanh('Ngày lập đơn'), dauXanh('Hạn thanh toán')],
            ['15/09/2026', { v: '31/10/2026', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'we-04-so-sanh-edate',
        tieuDe: 'EDATE giữ nguyên số ngày — EOMONTH luôn về cuối tháng',
        cot: [{ rong: 220 }, { rong: 160 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=EDATE(A2, 1)', mono: true }, { v: '15/10/2026', nen: 'xanh' }],
            [{ v: '=EOMONTH(A2, 1)', mono: true }, { v: '31/10/2026', nen: 'xanh' }],
        ],
    },
    {
        ten: 'we-05-ngay-cuoi-thang-lam-viec',
        tieuDe: 'Ghép WEEKDAY + EOMONTH: ngày làm việc cuối cùng của tháng',
        cot: [{ rong: 130 }, { rong: 130 }, { rong: 170 }],
        hang: [
            [dauXanh('Tháng'), dauXanh('Cuối tháng lịch'), dauXanh('Ngày làm việc cuối')],
            ['08/2026', '31/08 (Thứ Hai)', { v: '31/08 — giữ nguyên', nen: 'xanh' }],
            ['05/2026', '31/05 (Chủ Nhật)', { v: '29/05 — lùi về T6', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-weekday-eomonth', anh: bai }];

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
