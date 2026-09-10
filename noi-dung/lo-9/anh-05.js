// Ảnh minh hoạ cho bài 5 — WORKDAY, WORKDAY.INTL
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'wd-01-vi-du-co-ban',
        tieuDe: 'WORKDAY cộng 5 ngày làm việc, bỏ qua cuối tuần',
        congThuc: { o: 'B1', ct: '=WORKDAY(DATE(2026,9,10),5)' },
        cot: [{ rong: 150 }, { rong: 100 }],
        hang: [
            [{ v: 'Bắt đầu: 10/09/2026 (Thứ Năm)' }, { v: '17/09/2026', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'wd-02-them-ngay-nghi',
        tieuDe: 'Danh sách ngày nghỉ lễ đưa vào tham số thứ ba',
        cot: [{ rong: 150 }],
        hang: [
            [dauXanh('Ngày nghỉ (NgayNghi)')],
            ['14/09/2026'],
        ],
    },
    {
        ten: 'wd-03-ket-qua-co-ngay-nghi',
        tieuDe: 'Có ngày nghỉ lễ, kết quả lùi thêm một ngày',
        cot: [{ rong: 190 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=WORKDAY(DATE(2026,9,10),5)', mono: true }, { v: '17/09/2026', nen: 'vang' }],
            [{ v: '=WORKDAY(DATE(2026,9,10),5,NgayNghi)', mono: true }, { v: '18/09/2026', nen: 'xanh' }],
        ],
    },
    {
        ten: 'wd-04-bang-kieu-cuoi-tuan',
        tieuDe: 'Một số kiểu cuối tuần của WORKDAY.INTL',
        cot: [{ rong: 60 }, { rong: 200 }],
        hang: [
            [dauXanh('Kiểu'), dauXanh('Ngày nghỉ cố định')],
            [{ v: '1', canLe: 'giua' }, 'Thứ Bảy, Chủ Nhật (mặc định)'],
            [{ v: '7', canLe: 'giua' }, 'Thứ Sáu, Thứ Bảy'],
            [{ v: '11', canLe: 'giua' }, 'Chỉ Chủ Nhật'],
        ],
    },
    {
        ten: 'wd-05-so-sanh-ket-qua',
        tieuDe: 'Đổi kiểu cuối tuần — kết quả sớm hơn 1 ngày',
        cot: [{ rong: 210 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=WORKDAY(DATE(2026,9,10),5)', mono: true }, { v: '17/09/2026', nen: 'vang' }],
            [{ v: '=WORKDAY.INTL(DATE(2026,9,10),5,11)', mono: true }, { v: '16/09/2026', nen: 'xanh' }],
        ],
    },
    {
        ten: 'wd-06-so-sanh-workday-networkdays',
        tieuDe: 'WORKDAY và NETWORKDAYS tính theo hai chiều ngược nhau',
        cot: [{ rong: 90 }, { rong: 100 }, { rong: 100 }],
        hang: [
            [dauXanh('Hàm'), dauXanh('Đầu vào'), dauXanh('Đầu ra')],
            [{ v: 'NETWORKDAYS', mono: true }, 'Ngày đầu + ngày cuối', 'Số ngày làm việc ở giữa'],
            [{ v: 'WORKDAY', mono: true }, 'Ngày đầu + số ngày', 'Ngày kết thúc'],
        ],
    },
];

const LO = [{ slug: 'ham-workday', anh: bai }];

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
