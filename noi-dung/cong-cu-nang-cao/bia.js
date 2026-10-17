// Ảnh bìa cho tuyến bài "Công cụ nâng cao" (kiểm tra, chọn nhanh, điền, data type)
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'evaluate-formula',
        ten: 'cover',
        eyebrow: 'Excel · Kiểm tra công thức',
        hook: 'Evaluate',
        tieuDe: 'Evaluate Formula: tính từng bước một',
        phu: 'Xem chính xác công thức lồng nhau sai ở khâu nào, không cần đoán.',
    },
    {
        thuMuc: 'go-to-special',
        ten: 'cover',
        eyebrow: 'Excel · Công cụ',
        hook: 'F5',
        tieuDe: 'Go To Special: chọn nhanh hàng loạt ô',
        phu: 'Mọi ô trống, mọi công thức, hay chỉ dòng đang hiển thị — một thao tác.',
    },
    {
        thuMuc: 'fill-handle',
        ten: 'cover',
        eyebrow: 'Excel · Công cụ',
        hook: '⊞',
        tieuDe: 'Fill Handle: kéo núm điền tự động',
        phu: 'Double-click để điền hết cả cột, và các tuỳ chọn ít ai để ý.',
    },
    {
        thuMuc: 'rich-data-types',
        ten: 'cover',
        eyebrow: 'Excel · 365',
        hook: 'Data Type',
        tieuDe: 'Rich Data Types: một ô, nhiều dữ liệu ẩn bên trong',
        phu: 'Stock và Geography — kéo giá cổ phiếu, dân số ra bằng công thức.',
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
