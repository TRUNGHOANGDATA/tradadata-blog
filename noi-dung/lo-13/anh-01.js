// Ảnh minh hoạ cho bài 1 — NETWORKDAYS.INTL
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'ni-01-cu-phap-co-ban',
        tieuDe: 'NETWORKDAYS.INTL thêm tham số kiểu cuối tuần',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'NETWORKDAYS.INTL(bắt_đầu, kết_thúc, [kiểu], [nghỉ])', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'ni-02-so-sanh-mac-dinh',
        tieuDe: 'Từ 10/09 đến 20/09/2026 — hai cách đếm khác nhau',
        cot: [{ rong: 210 }, { rong: 80 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=NETWORKDAYS(...)', mono: true }, { v: '7 ngày', nen: 'vang' }],
            [{ v: '=NETWORKDAYS.INTL(...,11)', mono: true }, { v: '9 ngày', nen: 'xanh' }],
        ],
    },
    {
        ten: 'ni-03-ung-dung-luong-6-ngay',
        tieuDe: 'Tính công cho lịch làm việc 6 ngày/tuần',
        congThuc: { o: 'C2', ct: '=NETWORKDAYS.INTL(A2,B2,11)' },
        cot: [{ rong: 80 }, { rong: 80 }, { rong: 90 }],
        hang: [
            [dauXanh('Vào'), dauXanh('Ra'), dauXanh('Số công')],
            ['10/09', '20/09', { v: '9', nen: 'xanh', canLe: 'giua' }],
        ],
        chon: 'C2',
    },
    {
        ten: 'ni-04-them-ngay-nghi-le',
        tieuDe: 'Vẫn loại trừ thêm được ngày nghỉ lễ',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'NETWORKDAYS.INTL(A2,B2,11,NgayNghiLe)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'ni-05-chuoi-tuy-chinh',
        tieuDe: 'Chuỗi 7 ký tự 0/1 tự khai ngày nghỉ',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: '"0000011" = 5 ngày làm (T2-T6) + 2 ngày nghỉ (T7,CN)', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-networkdays-intl', anh: bai }];

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
