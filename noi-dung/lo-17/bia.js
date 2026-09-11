// Ảnh bìa cho 3 bài của lô 17 — SUM và cụm AVERAGEIF/AVERAGEIFS
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-sum',
        ten: 'cover',
        eyebrow: 'Excel · Hàm toán học',
        hook: 'SUM',
        tieuDe: 'SUM: hàm cơ bản nhất, nhưng vẫn có vài điều đáng biết',
        phu: 'Tự bỏ qua văn bản, cộng xuyên nhiều sheet, không tự loại trừ dòng đã lọc.',
    },
    {
        thuMuc: 'ham-averageif',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'AVERAGEIF',
        tieuDe: 'AVERAGEIF: tính trung bình có một điều kiện',
        phu: 'Thứ tự tham số ngược hẳn với AVERAGEIFS — dễ nhầm nhất khi đổi hàm.',
    },
    {
        thuMuc: 'ham-averageifs',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'AVERAGEIFS',
        hookMau: MAU.do,
        tieuDe: 'AVERAGEIFS: tính trung bình nhiều điều kiện cùng lúc',
        phu: 'Vùng tính trung bình đặt lên đầu — đúng quy tắc cú pháp RACON.',
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
