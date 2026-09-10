// Ảnh minh hoạ cho bài 5 — DAYS, DAYS360
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'dd-01-days-co-ban',
        tieuDe: 'DAYS — đếm đúng số ngày lịch thật (kết thúc trước)',
        congThuc: { o: 'C1', ct: '=DAYS(A3, A2)' },
        cot: [{ rong: 150 }, { rong: 30 }, { rong: 110 }],
        hang: [
            [dauXanh('Ngày bắt đầu'), '', dauXanh('Số ngày')],
            ['15/09/2026', '', { v: '101', nen: 'xanh' }],
            ['25/12/2026 (kết thúc)', '', ''],
        ],
        chon: 'C1',
    },
    {
        ten: 'dd-02-days360',
        tieuDe: 'DAYS360 — bắt đầu trước, quy ước mỗi tháng 30 ngày',
        congThuc: { o: 'C1', ct: '=DAYS360(A2, A3)' },
        cot: [{ rong: 150 }, { rong: 30 }, { rong: 110 }],
        hang: [
            [dauXanh('Ngày bắt đầu'), '', dauXanh('Số ngày')],
            ['15/09/2026', '', { v: '100', nen: 'xanh' }],
            ['25/12/2026 (kết thúc)', '', ''],
        ],
        chon: 'C1',
    },
    {
        ten: 'dd-03-so-sanh-hai-cach',
        tieuDe: 'Cùng 2 mốc ngày, hai cách đếm ra hai kết quả khác nhau',
        cot: [{ rong: 200 }, { rong: 130 }],
        hang: [
            [dauXanh('Hàm'), dauXanh('Kết quả')],
            [{ v: '=DAYS(A3,A2)', mono: true }, { v: '101 (ngày thật)', nen: 'xanh' }],
            [{ v: '=DAYS360(A2,A3)', mono: true }, { v: '100 (quy ước 30/360)', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-days-days360', anh: bai }];

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
