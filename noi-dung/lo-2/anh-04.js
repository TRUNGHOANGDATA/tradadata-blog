// Ảnh minh hoạ cho bài 4 — RATE & NPER
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'rn-01-du-lieu-tra-gop-0',
        tieuDe: 'Điện thoại 24 triệu, "trả góp 0% lãi suất", phí hồ sơ 1,2 triệu',
        cot: [{ rong: 240 }, { rong: 170 }],
        hang: [
            [dauXanh('Thông tin'), dauXanh('Giá trị')],
            ['Giá gốc', '24.000.000'],
            ['Phí hồ sơ (thu ngay)', '1.200.000'],
            ['Vốn thực nhận', '22.800.000'],
            ['Trả mỗi tháng (12 tháng)', '2.000.000'],
        ],
    },
    {
        ten: 'rn-02-rate-that',
        tieuDe: 'RATE lật tẩy: lãi suất thực không phải 0%',
        congThuc: { o: 'B5', ct: '=RATE(12, -2000000, 22800000)' },
        cot: [{ rong: 240 }, { rong: 170 }],
        hang: [
            [dauXanh('Thông tin'), dauXanh('Giá trị')],
            ['Số kỳ trả', '12'],
            ['Trả mỗi tháng', '-2.000.000'],
            ['Vốn thực nhận', '22.800.000'],
            ['Lãi suất thực/tháng', { v: '~0,8% (~9,6%/năm)', nen: 'do' }],
        ],
        chon: 'B5',
    },
    {
        ten: 'rn-03-nper',
        tieuDe: 'Vay 300 triệu, lãi 9%/năm, trả 6 triệu/tháng — mất bao lâu?',
        congThuc: { o: 'B4', ct: '=NPER(9%/12, -6000000, 300000000)' },
        cot: [{ rong: 210 }, { rong: 170 }],
        hang: [
            [dauXanh('Thông tin'), dauXanh('Giá trị')],
            ['Số tiền vay', '300.000.000'],
            ['Lãi suất năm', '9%'],
            ['Trả mỗi tháng', '-6.000.000'],
            ['Số tháng cần trả', { v: '~63 tháng', nen: 'xanh' }],
        ],
        chon: 'B4',
    },
];

const LO = [{ slug: 'ham-rate-nper', anh: bai }];

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
