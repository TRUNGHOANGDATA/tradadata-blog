// Ảnh bìa cho 5 bài của lô 12 — tra cứu và sắp xếp dữ liệu cơ bản
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-maxifs',
        ten: 'cover',
        eyebrow: 'Excel · Hàm tra cứu',
        hook: 'MAXIFS',
        tieuDe: 'MAXIFS: tìm giá trị lớn nhất có điều kiện',
        phu: 'Như MAX kết hợp SUMIFS — không cần cột phụ hay lọc tay.',
    },
    {
        thuMuc: 'ham-minifs',
        ten: 'cover',
        eyebrow: 'Excel · Hàm tra cứu',
        hook: 'MINIFS',
        tieuDe: 'MINIFS: chiều ngược lại của MAXIFS',
        phu: 'Hỗ trợ ký tự đại diện * và ? — khả năng MIN/MAX gốc không có.',
    },
    {
        thuMuc: 'ham-hlookup',
        ten: 'cover',
        eyebrow: 'Excel · Hàm tra cứu',
        hook: 'HLOOKUP',
        tieuDe: 'HLOOKUP: tra cứu theo hàng ngang',
        phu: 'Bản song sinh nằm ngang của VLOOKUP, dùng khi bảng đã xếp ngang.',
    },
    {
        thuMuc: 'ham-transpose',
        ten: 'cover',
        eyebrow: 'Excel · Hàm tra cứu',
        hook: 'TRANSPOSE',
        tieuDe: 'TRANSPOSE: hoán đổi hàng thành cột chỉ với một công thức',
        phu: 'Excel 365 tự tràn kết quả; bản cũ cần chọn đúng vùng trước CSE.',
    },
    {
        thuMuc: 'ham-getpivotdata',
        ten: 'cover',
        eyebrow: 'Excel · Hàm tra cứu',
        hook: 'GETPIVOTDATA',
        hookMau: MAU.do,
        tieuDe: 'GETPIVOTDATA: công thức Excel tự chèn trong Pivot Table',
        phu: 'Dài hơn tham chiếu ô thường, nhưng không lệch khi đổi bố cục.',
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
