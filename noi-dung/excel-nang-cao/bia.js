// Ảnh bìa cho tuyến bài "Excel nâng cao" (lỗi, sắp xếp, định dạng, kiểm tra)
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'circular-reference',
        ten: 'cover',
        eyebrow: 'Excel · Lỗi & sửa lỗi',
        hook: 'Vòng lặp',
        hookMau: MAU.do,
        tieuDe: 'Tham chiếu vòng: vì sao Excel báo lỗi',
        phu: 'Phần lớn là lỗi cần sửa — Iterative Calculation chỉ dành cho số ít trường hợp cố ý.',
    },
    {
        thuMuc: 'custom-sort',
        ten: 'cover',
        eyebrow: 'Excel · Sắp xếp',
        hook: 'Custom List',
        tieuDe: 'Sắp xếp theo danh sách tuỳ chỉnh',
        phu: 'Khi A-Z không phải là thứ tự bạn cần — cấp bậc, quy trình, tên tháng.',
    },
    {
        thuMuc: 'merge-and-center',
        ten: 'cover',
        eyebrow: 'Excel · Nguyên tắc',
        hook: 'Đừng gộp ô',
        hookMau: MAU.do,
        tieuDe: 'Merge & Center: vì sao dân pro tránh dùng',
        phu: 'Phá Sort, Filter, công thức kéo lệch — Center Across Selection an toàn hơn.',
    },
    {
        thuMuc: 'watch-window',
        ten: 'cover',
        eyebrow: 'Excel · Kiểm tra công thức',
        hook: 'Watch',
        tieuDe: 'Watch Window: theo dõi ô ở xa',
        phu: 'Không cần cuộn qua lại — xem giá trị một ô dù đang ở sheet khác.',
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
