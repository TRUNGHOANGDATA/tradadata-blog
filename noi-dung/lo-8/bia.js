// Ảnh bìa cho 5 bài của lô 8 — kiểm tra công thức và tham chiếu
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-isformula-formulatext',
        ten: 'cover',
        eyebrow: 'Excel · Kiểm tra công thức',
        hook: 'ISFORMULA',
        tieuDe: 'ISFORMULA và FORMULATEXT: tìm ô đã bị gõ đè công thức',
        phu: 'Rà soát cả bảng tính lớn, phát hiện lỗi khó thấy bằng mắt.',
    },
    {
        thuMuc: 'ham-isref',
        ten: 'cover',
        eyebrow: 'Excel · Kiểm tra công thức',
        hook: 'ISREF',
        tieuDe: 'ISREF: phân biệt tham chiếu thật với giá trị hằng số',
        phu: 'Hai loại tên trong Name Manager, hiển thị giống nhau nhưng khác bản chất.',
    },
    {
        thuMuc: 'ham-na',
        ten: 'cover',
        eyebrow: 'Excel · Kiểm tra công thức',
        hook: '#N/A',
        hookMau: MAU.do,
        tieuDe: 'NA: tạo lỗi #N/A có chủ đích cho biểu đồ',
        phu: 'Cách đúng để biểu đồ bỏ qua điểm chưa có dữ liệu, không vẽ sai thành 0.',
    },
    {
        thuMuc: 'ham-error-type',
        ten: 'cover',
        eyebrow: 'Excel · Kiểm tra công thức',
        hook: 'ERROR.TYPE',
        tieuDe: 'ERROR.TYPE: mã số cho biết chính xác loại lỗi nào',
        phu: 'Đi xa hơn ISERROR — phân biệt được 8 loại lỗi khác nhau.',
    },
    {
        thuMuc: 'ham-islogical',
        ten: 'cover',
        eyebrow: 'Excel · Kiểm tra công thức',
        hook: 'ISLOGICAL',
        tieuDe: 'ISLOGICAL: phân biệt TRUE thật với chữ "TRUE"',
        phu: 'Hiển thị giống hệt nhau, nhưng một bên tính được, một bên báo lỗi.',
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
