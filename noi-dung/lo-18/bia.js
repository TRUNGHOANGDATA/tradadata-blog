// Ảnh bìa cho 5 bài của lô 18 — chuyển đổi số và thông tin sheet
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-roman',
        ten: 'cover',
        eyebrow: 'Excel · Hàm văn bản',
        hook: 'ROMAN',
        tieuDe: 'ROMAN: chuyển một số thành chữ số La Mã',
        phu: 'Chỉ nhận số nguyên từ 1 đến 3.999 — vượt ngưỡng là báo lỗi.',
    },
    {
        thuMuc: 'ham-arabic',
        ten: 'cover',
        eyebrow: 'Excel · Hàm văn bản',
        hook: 'ARABIC',
        tieuDe: 'ARABIC: đọc chữ số La Mã thành số thường',
        phu: 'Chiều ngược lại của ROMAN, hỗ trợ cả dấu trừ cho số âm.',
    },
    {
        thuMuc: 'ham-base',
        ten: 'cover',
        eyebrow: 'Excel · Hàm toán học',
        hook: 'BASE',
        tieuDe: 'BASE: chuyển số sang hệ đếm khác',
        phu: 'Nhị phân, thập lục phân, hay bất kỳ cơ số nào từ 2 đến 36.',
    },
    {
        thuMuc: 'ham-decimal',
        ten: 'cover',
        eyebrow: 'Excel · Hàm toán học',
        hook: 'DECIMAL',
        tieuDe: 'DECIMAL: đọc số từ hệ đếm khác về thập phân',
        phu: 'Chiều ngược lại của BASE — đọc lại mã hex hay nhị phân.',
    },
    {
        thuMuc: 'ham-sheet-sheets',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thông tin',
        hook: 'SHEET·SHEETS',
        hookMau: MAU.do,
        tieuDe: 'SHEET, SHEETS: vị trí và tổng số trang tính',
        phu: 'Kiểm tra công thức 3D đã cộng đủ sheet mong đợi hay chưa.',
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
