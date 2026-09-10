// Ảnh bìa cho 5 bài của lô 9 — trích xuất và tính toán ngày giờ cơ bản
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-year-month-day',
        ten: 'cover',
        eyebrow: 'Excel · Hàm ngày tháng',
        hook: 'YEAR·MONTH·DAY',
        tieuDe: 'YEAR, MONTH, DAY: tách năm, tháng, ngày ra khỏi một ô ngày tháng',
        phu: 'Dùng làm cột phụ để nhóm và so sánh dữ liệu theo tháng hoặc theo năm.',
    },
    {
        thuMuc: 'ham-hour-minute-second',
        ten: 'cover',
        eyebrow: 'Excel · Hàm ngày tháng',
        hook: 'HOUR·MINUTE·SECOND',
        tieuDe: 'HOUR, MINUTE, SECOND: tách giờ, phút, giây từ một ô thời gian',
        phu: 'Phân ca làm việc và quy đổi thời lượng ra một con số tính được.',
    },
    {
        thuMuc: 'ham-weeknum',
        ten: 'cover',
        eyebrow: 'Excel · Hàm ngày tháng',
        hook: 'WEEKNUM',
        tieuDe: 'WEEKNUM: tìm số thứ tự tuần, và vì sao nó dễ lệch với lịch quốc tế',
        phu: 'Kiểu mặc định không theo chuẩn ISO 8601 — dễ lệch một tuần khi ghép dữ liệu.',
    },
    {
        thuMuc: 'ham-datevalue-timevalue',
        ten: 'cover',
        eyebrow: 'Excel · Hàm ngày tháng',
        hook: 'DATEVALUE',
        tieuDe: 'DATEVALUE, TIMEVALUE: chuyển văn bản thành ngày giờ tính toán được',
        phu: 'Sửa lỗi #VALUE! khi ngày tháng xuất từ hệ thống khác chỉ là văn bản.',
    },
    {
        thuMuc: 'ham-workday',
        ten: 'cover',
        eyebrow: 'Excel · Hàm ngày tháng',
        hook: 'WORKDAY',
        hookMau: MAU.do,
        tieuDe: 'WORKDAY, WORKDAY.INTL: tính ngày làm việc sau N ngày',
        phu: 'Tự động bỏ qua cuối tuần và ngày nghỉ lễ — ngược chiều với NETWORKDAYS.',
    },
];

async function chay() {
    let tong = 0;
    for (const spec of BIA) {
        const r = await sinhAnhBia(spec, path.join(GOC, spec.thuMuc));
        tong += r.nang;
        console.log(`  ${spec.thuMuc}/cover.png  ${r.rong}x${r.cao}  ${(r.nang / 1024).toFixed(0)} KB`);
    }
    console.log(`Tổng ${(tong / 1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { BIA };
