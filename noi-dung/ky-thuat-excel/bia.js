// Ảnh bìa cho tuyến bài "Kỹ thuật Excel" (tài chính + công cụ)
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ipmt-ppmt',
        ten: 'cover',
        eyebrow: 'Excel · Tài chính',
        hook: 'IPMT·PPMT',
        tieuDe: 'IPMT và PPMT: tách trả góp thành lãi và gốc',
        phu: 'PMT cho tổng số tiền — IPMT/PPMT tách rõ bao nhiêu là lãi, bao nhiêu là gốc.',
    },
    {
        thuMuc: 'text-to-columns',
        ten: 'cover',
        eyebrow: 'Excel · Công cụ',
        hook: 'Tách cột',
        tieuDe: 'Text to Columns: tách một cột thành nhiều cột',
        phu: 'Theo dấu phân cách hoặc độ rộng cố định — và mẹo ép số về đúng kiểu.',
    },
    {
        thuMuc: 'group-outline',
        ten: 'cover',
        eyebrow: 'Excel · Công cụ',
        hook: '+ / −',
        tieuDe: 'Group and Outline: thu gọn dữ liệu theo cấp bậc',
        phu: 'Nút cộng trừ ở lề bảng — giữ nguyên bố cục, khác hẳn PivotTable.',
    },
    {
        thuMuc: 'autosave-version-history',
        ten: 'cover',
        eyebrow: 'Excel · Công cụ',
        hook: 'AutoSave',
        tieuDe: 'AutoSave và Version History: khôi phục bản cũ',
        phu: 'Vì sao "đóng không lưu để huỷ sửa" hết tác dụng khi AutoSave đang bật.',
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
