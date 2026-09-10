// Ảnh bìa cho 5 bài của lô 5 — cụm hàm Excel cơ bản (đợt 2)
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-weekday-eomonth',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'WEEKDAY',
        tieuDe: 'WEEKDAY và EOMONTH: thứ trong tuần, ngày cuối tháng',
        phu: 'Tránh lên lịch giao hàng cuối tuần, tính đúng hạn thanh toán.',
    },
    {
        thuMuc: 'ham-ceiling-floor',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'CEILING / FLOOR',
        tieuDe: 'CEILING và FLOOR: làm tròn theo hướng cố định',
        phu: 'Khác ROUND — luôn làm tròn lên hoặc luôn làm tròn xuống.',
    },
    {
        thuMuc: 'ham-find-search',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'FIND vs SEARCH',
        tieuDe: 'FIND và SEARCH: tìm vị trí ký tự, khác nhau đúng một điểm',
        phu: 'Gần như giống hệt nhau — chỉ khác ở việc phân biệt hoa/thường.',
    },
    {
        thuMuc: 'ham-value-text',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'VALUE ⇄ TEXT',
        tieuDe: 'VALUE và TEXT: chuyển đổi qua lại số và văn bản',
        phu: 'Hai hàm đi hai chiều ngược nhau — chữa lỗi và định dạng hiển thị.',
    },
    {
        thuMuc: 'ham-char-code',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'CHAR(10)',
        hookMau: MAU.do,
        tieuDe: 'CHAR và CODE: ký tự đặc biệt, ngắt dòng trong ô',
        phu: 'Mẹo nhiều người dùng Excel lâu năm vẫn không biết làm được.',
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
