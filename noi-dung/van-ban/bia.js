// Ảnh bìa cho tuyến bài "Xử lý văn bản"
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'left-right-mid',
        ten: 'cover',
        eyebrow: 'Excel · Văn bản',
        hook: 'LEFT·MID',
        tieuDe: 'LEFT, RIGHT, MID: cắt lấy một phần của chuỗi',
        phu: 'Ghép với FIND để cắt động theo dấu phân cách — và nhớ kết quả là văn bản.',
    },
    {
        thuMuc: 'concat-textjoin',
        ten: 'cover',
        eyebrow: 'Excel · Văn bản',
        hook: 'TEXTJOIN',
        tieuDe: 'CONCAT và TEXTJOIN: nối chuỗi gọn hơn dấu &',
        phu: 'Nối cả một vùng, thêm dấu phân cách, và bỏ qua ô trống.',
    },
    {
        thuMuc: 'substitute',
        ten: 'cover',
        eyebrow: 'Excel · Văn bản',
        hook: 'SUBSTITUTE',
        tieuDe: 'SUBSTITUTE: thay thế theo nội dung',
        phu: 'Khác REPLACE theo vị trí — và mẹo đếm số lần xuất hiện.',
    },
    {
        thuMuc: 'trim-clean',
        ten: 'cover',
        eyebrow: 'Excel · Văn bản',
        hook: 'TRIM',
        hookMau: MAU.do,
        tieuDe: 'TRIM và CLEAN: dọn khoảng trắng thừa và ký tự ẩn',
        phu: 'Thủ phạm thầm lặng khiến VLOOKUP trả #N/A — và vì sao TRIM đôi khi chưa đủ.',
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
