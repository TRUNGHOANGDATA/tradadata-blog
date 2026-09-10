// Ảnh bìa cho 5 bài của lô 10 — hàm chia và làm tròn toán học cơ bản
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-abs',
        ten: 'cover',
        eyebrow: 'Excel · Hàm toán học',
        hook: 'ABS',
        tieuDe: 'ABS: lấy trị tuyệt đối, biến mọi chênh lệch thành số dương',
        phu: 'So sánh đúng độ lớn chênh lệch mà không quan tâm hướng lệch.',
    },
    {
        thuMuc: 'ham-mod',
        ten: 'cover',
        eyebrow: 'Excel · Hàm toán học',
        hook: 'MOD',
        tieuDe: 'MOD: lấy phần dư phép chia, và vì sao số âm dễ gây bất ngờ',
        phu: 'Nền tảng của tô màu xen kẽ dòng và kiểm tra bội số.',
    },
    {
        thuMuc: 'ham-quotient',
        ten: 'cover',
        eyebrow: 'Excel · Hàm toán học',
        hook: 'QUOTIENT',
        tieuDe: 'QUOTIENT: lấy phần nguyên phép chia, phần còn lại của MOD',
        phu: 'Ghép cùng MOD để giải trọn bài toán chia đều còn dư.',
    },
    {
        thuMuc: 'ham-odd-even',
        ten: 'cover',
        eyebrow: 'Excel · Hàm toán học',
        hook: 'ODD·EVEN',
        tieuDe: 'ODD, EVEN: làm tròn lên tới số lẻ hoặc số chẵn gần nhất',
        phu: 'Luôn đẩy ra xa số 0 — khác hẳn cách làm tròn gần nhất của ROUND.',
    },
    {
        thuMuc: 'ham-mround',
        ten: 'cover',
        eyebrow: 'Excel · Hàm toán học',
        hook: 'MROUND',
        hookMau: MAU.do,
        tieuDe: 'MROUND: làm tròn tới bội số bất kỳ, không chỉ chẵn lẻ',
        phu: 'Number và multiple phải cùng dấu — khác dấu là lỗi #NUM!.',
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
