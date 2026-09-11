// Ảnh bìa cho 5 bài của lô 16 — hàm luận lý và ngày giờ thông dụng
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-and',
        ten: 'cover',
        eyebrow: 'Excel · Hàm luận lý',
        hook: 'AND',
        tieuDe: 'AND: kiểm tra tất cả điều kiện cùng đúng',
        phu: 'Excel tính hết mọi đối số, không ngắn mạch như nhiều ngôn ngữ lập trình.',
    },
    {
        thuMuc: 'ham-or',
        ten: 'cover',
        eyebrow: 'Excel · Hàm luận lý',
        hook: 'OR',
        tieuDe: 'OR: chỉ cần một điều kiện đúng là đủ',
        phu: 'Gộp nhiều trường hợp chấp nhận được vào một công thức duy nhất.',
    },
    {
        thuMuc: 'ham-not',
        ten: 'cover',
        eyebrow: 'Excel · Hàm luận lý',
        hook: 'NOT',
        tieuDe: 'NOT: đảo ngược một giá trị luận lý',
        phu: 'Đôi khi diễn đạt rõ ý hơn hẳn viết điều kiện thuận.',
    },
    {
        thuMuc: 'ham-time',
        ten: 'cover',
        eyebrow: 'Excel · Hàm ngày tháng',
        hook: 'TIME',
        tieuDe: 'TIME: dựng một giá trị giờ từ giờ, phút, giây',
        phu: 'Vượt 24 tiếng tự cuộn vòng, không báo lỗi — dễ mất phần ngày dư.',
    },
    {
        thuMuc: 'ham-now',
        ten: 'cover',
        eyebrow: 'Excel · Hàm ngày tháng',
        hook: 'NOW',
        hookMau: MAU.do,
        tieuDe: 'NOW: ngày giờ hiện tại, và cái bẫy đóng dấu thời gian',
        phu: 'Hàm biến động — không phù hợp để ghi lại một mốc thời gian cố định.',
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
