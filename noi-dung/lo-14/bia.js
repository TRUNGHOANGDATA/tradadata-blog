// Ảnh bìa cho 5 bài của lô 14
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-image',
        ten: 'cover',
        eyebrow: 'Excel · Hàm mới 365',
        hook: 'IMAGE',
        tieuDe: 'IMAGE: chèn ảnh thẳng vào một ô',
        phu: 'Ảnh di chuyển, lọc, sắp xếp theo đúng ô — khác hẳn ảnh nổi truyền thống.',
    },
    {
        thuMuc: 'ham-arraytotext',
        ten: 'cover',
        eyebrow: 'Excel · Hàm mảng động',
        hook: 'ARRAYTOTEXT',
        tieuDe: 'ARRAYTOTEXT: chuyển cả một mảng thành một chuỗi',
        phu: 'Gộp kết quả FILTER thành một câu, thay vì tràn ra nhiều ô.',
    },
    {
        thuMuc: 'ham-numbervalue',
        ten: 'cover',
        eyebrow: 'Excel · Hàm văn bản',
        hook: 'NUMBERVALUE',
        tieuDe: 'NUMBERVALUE: chuyển văn bản số thành số thật',
        phu: 'Tự khai định dạng, không phụ thuộc vùng miền máy đang mở file.',
    },
    {
        thuMuc: 'ham-unichar',
        ten: 'cover',
        eyebrow: 'Excel · Hàm văn bản',
        hook: 'UNICHAR',
        tieuDe: 'UNICHAR: chèn ký tự đặc biệt chỉ bằng mã số',
        phu: 'Dấu tích, ngôi sao, hàng nghìn ký hiệu — không cần Character Map.',
    },
    {
        thuMuc: 'ham-frequency',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'FREQUENCY',
        hookMau: MAU.do,
        tieuDe: 'FREQUENCY: đếm phân phối dữ liệu theo từng khoảng',
        phu: 'Một công thức thay cho nhiều COUNTIFS lặp lại cho từng khoảng.',
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
