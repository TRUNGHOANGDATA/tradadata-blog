// Ảnh bìa cho 5 bài của lô 6 — kiểm tra, so sánh và định dạng số cơ bản
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-exact',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'EXACT',
        tieuDe: 'EXACT: so sánh chính xác tuyệt đối hai chuỗi',
        phu: 'Dấu = trong Excel không phân biệt hoa/thường — nhiều người không biết.',
    },
    {
        thuMuc: 'ham-dollar-fixed',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'DOLLAR / FIXED',
        tieuDe: 'DOLLAR và FIXED: định dạng tiền tệ và số thập phân cố định',
        phu: 'Hai phiên bản rút gọn của TEXT, chuyên cho hai nhu cầu phổ biến nhất.',
    },
    {
        thuMuc: 'ham-iseven-isodd',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'ISEVEN',
        tieuDe: 'ISEVEN và ISODD: kiểm tra số chẵn, số lẻ',
        phu: 'Tô màu xen kẽ dòng, chia ca trực theo ngày chẵn lẻ.',
    },
    {
        thuMuc: 'ham-sumsq-product',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'SUMSQ · PRODUCT',
        tieuDe: 'SUMSQ và PRODUCT: tổng bình phương và tích của một dãy số',
        phu: 'Thay cho công thức dài dòng hơn nhiều nếu phải viết tay.',
    },
    {
        thuMuc: 'ham-days-days360',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'DAYS ≠ DAYS360',
        hookMau: MAU.do,
        tieuDe: 'DAYS và DAYS360: hai cách đếm ngày cho ra hai kết quả',
        phu: 'Một hàm đếm ngày thật, một hàm theo quy ước tài chính 30/360.',
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
