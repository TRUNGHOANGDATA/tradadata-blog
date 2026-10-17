// Ảnh bìa cho tuyến bài "Tính có điều kiện"
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'sumif-sumifs',
        ten: 'cover',
        eyebrow: 'Excel · Điều kiện',
        hook: 'SUMIFS',
        tieuDe: 'SUMIF và SUMIFS: cộng tổng có điều kiện',
        phu: 'Một hay nhiều điều kiện cùng lúc — và vị trí tham số bị đảo giữa hai hàm.',
    },
    {
        thuMuc: 'countif-countifs',
        ten: 'cover',
        eyebrow: 'Excel · Điều kiện',
        hook: 'COUNTIFS',
        tieuDe: 'COUNTIF và COUNTIFS: đếm ô có điều kiện',
        phu: 'Không đảo thứ tự tham số như SUMIF/SUMIFS — vì sao lại thế.',
    },
    {
        thuMuc: 'racon',
        ten: 'cover',
        eyebrow: 'Excel · Cú pháp',
        hook: 'RACON',
        tieuDe: 'RACON: vì sao thứ tự tham số bị đảo ngược',
        phu: 'SUMIFS, COUNTIFS, AVERAGEIFS, MAXIFS, MINIFS — quy tắc chung và ngoại lệ.',
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
