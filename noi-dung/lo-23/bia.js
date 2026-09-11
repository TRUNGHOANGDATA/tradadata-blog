// Ảnh bìa cho 5 bài của lô 23 — các loại trung bình và đo độ phân tán khác
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-geomean',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'GEOMEAN',
        tieuDe: 'GEOMEAN: trung bình nhân, đúng cho tỷ lệ tăng trưởng',
        phu: 'AVERAGE luôn cho kết quả cao hơn thực tế trong bài toán tăng trưởng.',
    },
    {
        thuMuc: 'ham-harmean',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'HARMEAN',
        tieuDe: 'HARMEAN: trung bình điều hoà, đúng cho tốc độ trung bình',
        phu: 'Cùng quãng đường, khác tốc độ — AVERAGE tính sai, HARMEAN tính đúng.',
    },
    {
        thuMuc: 'ham-trimmean',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'TRIMMEAN',
        tieuDe: 'TRIMMEAN: trung bình cắt bớt, chấm điểm thi đấu công bằng',
        phu: 'Loại bỏ điểm cao nhất và thấp nhất trước khi tính trung bình.',
    },
    {
        thuMuc: 'ham-devsq',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'DEVSQ',
        tieuDe: 'DEVSQ: tổng bình phương độ lệch',
        phu: 'Chính là tử số ẩn giấu bên trong công thức VAR.P và VAR.S.',
    },
    {
        thuMuc: 'ham-avedev',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'AVEDEV',
        hookMau: MAU.do,
        tieuDe: 'AVEDEV: độ lệch tuyệt đối trung bình',
        phu: 'Dễ diễn giải hơn hẳn độ lệch chuẩn — cùng đơn vị với dữ liệu gốc.',
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
