// Ảnh bìa cho 5 bài của lô 2 — cụm hàm tài chính Excel
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-pmt',
        ten: 'cover',
        eyebrow: 'Excel · Hàm tài chính',
        hook: 'PMT',
        tieuDe: 'Hàm PMT: tính khoản trả góp vay hàng tháng',
        phu: 'Và vì sao kết quả PMT luôn ra số âm — không phải Excel tính sai.',
    },
    {
        thuMuc: 'ham-fv-pv',
        ten: 'cover',
        eyebrow: 'Excel · Hàm tài chính',
        hook: 'FV / PV',
        tieuDe: 'FV và PV: giá trị tương lai và hiện tại của một khoản tiền',
        phu: 'Vì sao 400 triệu sau 4 năm có thể kém giá trị hơn 300 triệu hôm nay.',
    },
    {
        thuMuc: 'ham-npv-irr',
        ten: 'cover',
        eyebrow: 'Excel · Hàm tài chính',
        hook: 'NPV / IRR',
        tieuDe: 'NPV và IRR: đánh giá dự án đầu tư có đáng làm hay không',
        phu: 'Vốn đầu tư ban đầu đặt sai vị trí — lỗi phổ biến nhất khi dùng NPV.',
    },
    {
        thuMuc: 'ham-rate-nper',
        ten: 'cover',
        eyebrow: 'Excel · Hàm tài chính',
        hook: 'RATE',
        hookMau: MAU.do,
        tieuDe: 'RATE và NPER: tìm lãi suất thực và thời gian trả hết nợ',
        phu: 'Lật tẩy lãi suất thực đằng sau chương trình "trả góp 0% lãi suất".',
    },
    {
        thuMuc: 'khau-hao',
        ten: 'cover',
        eyebrow: 'Excel · Kế toán',
        hook: 'SLN·DDB·DB',
        tieuDe: 'Khấu hao tài sản cố định: SLN, DDB và DB khác nhau thế nào',
        phu: 'Cùng một tài sản, ba phương pháp cho ra ba con số khấu hao mỗi năm.',
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
