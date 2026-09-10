// Ảnh bìa cho 5 bài của lô 7 — vị trí và cấu trúc bảng tính
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-row-column',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'ROW / COLUMN',
        tieuDe: 'ROW và COLUMN: đánh số thứ tự tự động, không lệ thuộc dòng thật',
        phu: 'Xoá một dòng ở giữa bảng, STT vẫn tự dịch lại đúng liên tục.',
    },
    {
        thuMuc: 'ham-rows-columns',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'ROWS vs ROW',
        tieuDe: 'ROWS và COLUMNS: đếm kích thước một vùng dữ liệu',
        phu: 'Tên gần giống ROW/COLUMN nhưng làm việc hoàn toàn khác.',
    },
    {
        thuMuc: 'ham-address',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'ADDRESS',
        tieuDe: 'ADDRESS: dựng địa chỉ ô dạng văn bản từ số hàng và cột',
        phu: 'Ghép với INDIRECT để xây tham chiếu hoàn toàn động.',
    },
    {
        thuMuc: 'ham-n-t',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'N & T',
        tieuDe: 'N và T: ép giá trị về số hoặc văn bản một cách im lặng',
        phu: 'Không báo lỗi khi không ép được — khác hẳn VALUE.',
    },
    {
        thuMuc: 'ham-type',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'TYPE',
        hookMau: MAU.do,
        tieuDe: 'TYPE: trả về mã số kiểu dữ liệu của một ô',
        phu: 'Một hàm duy nhất, thay cho việc gọi nhiều hàm IS liên tiếp.',
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
