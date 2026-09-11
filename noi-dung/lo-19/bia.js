// Ảnh bìa cho 5 bài của lô 19 — nhóm hàm cơ sở dữ liệu (D-functions)
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-dsum',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ sở dữ liệu',
        hook: 'DSUM',
        tieuDe: 'DSUM: tính tổng kiểu cơ sở dữ liệu',
        phu: 'Làm được điều SUMIFS không làm trực tiếp — kết hợp cả VÀ lẫn HOẶC.',
    },
    {
        thuMuc: 'ham-dcount-dcounta',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ sở dữ liệu',
        hook: 'DCOUNT·A',
        tieuDe: 'DCOUNT, DCOUNTA: đếm kiểu cơ sở dữ liệu',
        phu: 'DCOUNT chỉ đếm số, DCOUNTA đếm mọi ô có dữ liệu.',
    },
    {
        thuMuc: 'ham-daverage',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ sở dữ liệu',
        hook: 'DAVERAGE',
        tieuDe: 'DAVERAGE: tính trung bình kiểu cơ sở dữ liệu',
        phu: 'Kết hợp điều kiện VÀ lẫn HOẶC chỉ bằng cách sắp xếp bảng điều kiện.',
    },
    {
        thuMuc: 'ham-dmax-dmin',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ sở dữ liệu',
        hook: 'DMAX·DMIN',
        tieuDe: 'DMAX, DMIN: giá trị lớn nhất và nhỏ nhất',
        phu: 'Không khớp dòng nào thì trả về 0, không báo lỗi.',
    },
    {
        thuMuc: 'ham-dget',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ sở dữ liệu',
        hook: 'DGET',
        hookMau: MAU.do,
        tieuDe: 'DGET: lấy đúng một giá trị, và cách nó bắt lỗi trùng lặp',
        phu: 'Khác VLOOKUP — báo lỗi thay vì âm thầm lấy dòng đầu tiên.',
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
