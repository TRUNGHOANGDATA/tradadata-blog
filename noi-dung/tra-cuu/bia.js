// Ảnh bìa cho tuyến bài "Tra cứu & dò tìm"
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'vlookup',
        ten: 'cover',
        eyebrow: 'Excel · Tra cứu',
        hook: 'VLOOKUP',
        tieuDe: 'VLOOKUP: dò một giá trị, kéo dữ liệu từ bảng khác',
        phu: 'Cú pháp bốn tham số, bẫy TRUE/FALSE, và vì sao hay ra #N/A.',
    },
    {
        thuMuc: 'xlookup',
        ten: 'cover',
        eyebrow: 'Excel · Tra cứu',
        hook: 'XLOOKUP',
        tieuDe: 'XLOOKUP: bản kế nhiệm VLOOKUP, dò hai chiều',
        phu: 'Dò được sang trái, khỏi đếm cột, có sẵn câu khi không tìm thấy.',
    },
    {
        thuMuc: 'index-match',
        ten: 'cover',
        eyebrow: 'Excel · Tra cứu',
        hook: 'INDEX+MATCH',
        tieuDe: 'INDEX và MATCH: cặp đôi tra cứu linh hoạt',
        phu: 'MATCH tìm vị trí, INDEX lấy giá trị — dò trái, khỏi gãy khi chèn cột.',
    },
    {
        thuMuc: 'iferror',
        ten: 'cover',
        eyebrow: 'Excel · Xử lý lỗi',
        hook: 'IFERROR',
        hookMau: MAU.do,
        tieuDe: 'IFERROR: thay lỗi bằng giá trị dễ đọc',
        phu: 'Biến #N/A thành câu rõ nghĩa — và khi nào nên dùng IFNA thay thế.',
    },
    {
        thuMuc: 'ham-if',
        ten: 'cover',
        eyebrow: 'Excel · Logic',
        hook: 'IF()',
        tieuDe: 'IF: ra quyết định theo điều kiện',
        phu: 'Cấu trúc ba phần, lồng nhiều IF để xếp loại, ghép với AND/OR.',
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
