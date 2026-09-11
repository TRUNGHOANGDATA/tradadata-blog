// Ảnh bìa cho 5 bài của lô 22 — hàm thống kê hiện đại thay thế
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-mode-sngl-mult',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'MODE.SNGL·MULT',
        tieuDe: 'MODE.SNGL, MODE.MULT: nhiều giá trị lặp lại nhất',
        phu: 'MODE.MULT trả về cả hai khi có nhiều mode bằng nhau, không bỏ sót.',
    },
    {
        thuMuc: 'ham-stdev-p-stdev-s',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'STDEV.P·S',
        tieuDe: 'STDEV.P, STDEV.S: tổng thể hay chỉ một mẫu',
        phu: 'Chọn sai loại vẫn ra số, nhưng sai về khái niệm thống kê.',
    },
    {
        thuMuc: 'ham-var-p-var-s',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'VAR.P·S',
        tieuDe: 'VAR.P, VAR.S: cùng khái niệm, áp dụng cho phương sai',
        phu: 'Chính là STDEV.P/STDEV.S trước khi khai căn.',
    },
    {
        thuMuc: 'ham-percentile-inc-exc',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'PERCENTILE',
        tieuDe: 'PERCENTILE.INC, PERCENTILE.EXC: hai cách định nghĩa phân vị',
        phu: 'Khác nhau ở việc có tính luôn giá trị nhỏ nhất và lớn nhất hay không.',
    },
    {
        thuMuc: 'ham-quartile-inc-exc',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'QUARTILE',
        hookMau: MAU.do,
        tieuDe: 'QUARTILE.INC, QUARTILE.EXC: hai cách định nghĩa tứ phân vị',
        phu: 'QUARTILE.EXC từ chối thẳng quart=0 và quart=4.',
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
