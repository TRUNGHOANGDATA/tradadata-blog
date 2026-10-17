// Ảnh bìa cho 9 bài tuyến "Nền tảng Excel cốt lõi" (Module 1)
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'kieu-du-lieu',
        ten: 'cover',
        eyebrow: 'Excel · Nền tảng',
        hook: 'Số·VB·Lỗi',
        tieuDe: 'Excel đang hiểu dữ liệu của bạn là gì?',
        phu: 'Bốn loại giá trị, và mẹo nhìn căn lề là biết Excel hiểu ô đó ra sao.',
    },
    {
        thuMuc: 'so-van-ban',
        ten: 'cover',
        eyebrow: 'Excel · Nền tảng',
        hook: 'SUM = ?',
        hookMau: MAU.do,
        tieuDe: 'Số bị lưu thành văn bản: vì sao SUM thiếu tổng',
        phu: 'Nhận ra ô lỗi, đếm còn bao nhiêu, và ba cách ép về số thật.',
    },
    {
        thuMuc: 'loi-excel',
        ten: 'cover',
        eyebrow: 'Excel · Nền tảng',
        hook: '#N/A',
        hookMau: MAU.do,
        tieuDe: 'Đọc sáu mã lỗi thường gặp trong Excel',
        phu: 'Mỗi mã nói chính xác chuyện gì sai — và khi nào nên bọc IFERROR.',
    },
    {
        thuMuc: 'ngay-thang',
        ten: 'cover',
        eyebrow: 'Excel · Nền tảng',
        hook: 'DATE()',
        tieuDe: 'Nhập ngày tháng đúng cách trong Excel',
        phu: 'Vì sao cùng chuỗi ra ngày khác nhau, và cách gõ đúng trên mọi máy.',
    },
    {
        thuMuc: 'nguyen-tac-file',
        ten: 'cover',
        eyebrow: 'Excel · Nền tảng',
        hook: '12 quy tắc',
        tieuDe: 'Mười hai nguyên tắc dựng một file Excel gọn gàng',
        phu: 'Tách dữ liệu khỏi trình bày, giữ công thức truy được nguồn.',
    },
    {
        thuMuc: 'tham-chieu',
        ten: 'cover',
        eyebrow: 'Excel · Nền tảng',
        hook: '$A$1',
        tieuDe: 'Tham chiếu tương đối và tuyệt đối, và phím F4',
        phu: 'A1, $A$1, $A1, A$1 khác nhau ra sao khi copy công thức.',
    },
    {
        thuMuc: 'excel-table',
        ten: 'cover',
        eyebrow: 'Excel · Nền tảng',
        hook: 'Ctrl+T',
        tieuDe: 'Excel Table và tham chiếu theo tên cột',
        phu: 'Công thức tự giãn khi thêm dòng, khỏi lo sót vùng dữ liệu.',
    },
    {
        thuMuc: 'tom-tat-thong-ke',
        ten: 'cover',
        eyebrow: 'Excel · Nền tảng',
        hook: 'AVG·MED',
        tieuDe: 'Tóm tắt một bộ dữ liệu lạ trong vài phút',
        phu: 'Kiểm tra dữ liệu sạch trước, đọc con số sau — quy trình năm bước.',
    },
    {
        thuMuc: 'bai-tap-nen-tang',
        ten: 'cover',
        eyebrow: 'Excel · Nền tảng',
        hook: '20 bài',
        tieuDe: '20 bài tập Excel nền tảng có đáp án',
        phu: 'Tự luyện trên bảng bán hàng mẫu trước khi học PivotTable.',
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
