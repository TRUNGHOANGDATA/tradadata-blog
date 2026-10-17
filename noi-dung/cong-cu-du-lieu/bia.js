// Ảnh bìa cho tuyến bài "Công cụ xử lý dữ liệu" (Data tab)
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'flash-fill',
        ten: 'cover',
        eyebrow: 'Excel · Công cụ',
        hook: 'Ctrl+E',
        tieuDe: 'Flash Fill: điền nhanh theo mẫu',
        phu: 'Không cần viết công thức — nhưng kết quả là giá trị tĩnh, không tự cập nhật.',
    },
    {
        thuMuc: 'remove-duplicates',
        ten: 'cover',
        eyebrow: 'Excel · Công cụ',
        hook: 'Trùng lặp',
        hookMau: MAU.do,
        tieuDe: 'Remove Duplicates: xoá dữ liệu trùng lặp',
        phu: '"Trùng" tính theo cột bạn tick — không phải toàn dòng. Đếm trước khi xoá.',
    },
    {
        thuMuc: 'advanced-filter',
        ten: 'cover',
        eyebrow: 'Excel · Công cụ',
        hook: 'OR',
        tieuDe: 'Advanced Filter: lọc điều kiện OR phức tạp',
        phu: 'Cùng hàng là VÀ, khác hàng là HOẶC — điều AutoFilter không làm được.',
    },
    {
        thuMuc: 'consolidate',
        ten: 'cover',
        eyebrow: 'Excel · Công cụ',
        hook: 'Consolidate',
        tieuDe: 'Consolidate: hợp nhất số liệu nhiều sheet',
        phu: 'Gộp theo vị trí hoặc theo nhãn — không cần một công thức nào.',
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
