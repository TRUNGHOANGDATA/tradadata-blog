// Ảnh bìa cho 5 bài của lô 21 — nhóm hàm "-A" tính cả văn bản và luận lý
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-averagea',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'AVERAGEA',
        tieuDe: 'AVERAGEA: trung bình tính cả văn bản và TRUE/FALSE',
        phu: 'Một ô ghi chú tưởng vô hại có thể kéo tụt kết quả rất mạnh.',
    },
    {
        thuMuc: 'ham-maxa',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'MAXA',
        tieuDe: 'MAXA: giá trị lớn nhất, nguy hiểm với số âm',
        phu: 'Một ô TRUE có thể khiến MAXA trả về 1 thay vì đúng số lớn nhất.',
    },
    {
        thuMuc: 'ham-mina',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'MINA',
        tieuDe: 'MINA: giá trị nhỏ nhất, nguy hiểm với số dương',
        phu: 'Một ô FALSE có thể kéo kết quả về 0 dù dữ liệu toàn số dương.',
    },
    {
        thuMuc: 'ham-stdeva',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'STDEVA',
        tieuDe: 'STDEVA: độ lệch chuẩn, dễ thổi phồng độ phân tán',
        phu: 'Một ô văn bản có thể thổi phồng kết quả lên gấp nhiều lần.',
    },
    {
        thuMuc: 'ham-vara',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'VARA',
        hookMau: MAU.do,
        tieuDe: 'VARA: phương sai, chính là STDEVA trước khi khai căn',
        phu: 'Cùng cái bẫy thổi phồng — thậm chí còn rõ hơn STDEVA.',
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
