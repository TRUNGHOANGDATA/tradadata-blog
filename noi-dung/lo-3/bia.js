// Ảnh bìa cho 5 bài của lô 3 — cụm hồi quy tuyến tính Excel
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-correl',
        ten: 'cover',
        eyebrow: 'Excel · Phân tích dữ liệu',
        hook: 'CORREL',
        tieuDe: 'Hàm CORREL: đo mức độ tương quan giữa hai biến',
        phu: 'Và vì sao một hệ số tương quan cao không chứng minh được nhân quả.',
    },
    {
        thuMuc: 'ham-slope-intercept',
        ten: 'cover',
        eyebrow: 'Excel · Phân tích dữ liệu',
        hook: 'SLOPE / INTERCEPT',
        tieuDe: 'SLOPE và INTERCEPT: tự tay dựng phương trình hồi quy',
        phu: 'y = mx + b — từ dữ liệu thực tế, không cần vẽ biểu đồ.',
    },
    {
        thuMuc: 'ham-rsq',
        ten: 'cover',
        eyebrow: 'Excel · Phân tích dữ liệu',
        hook: 'R²',
        tieuDe: 'RSQ: R² đo được bao nhiêu % biến thiên mô hình giải thích được',
        phu: 'Và vì sao R² cao không có nghĩa là mô hình tốt cho mọi mục đích.',
    },
    {
        thuMuc: 'ham-steyx',
        ten: 'cover',
        eyebrow: 'Excel · Phân tích dữ liệu',
        hook: 'STEYX',
        tieuDe: 'STEYX: sai số chuẩn của mô hình hồi quy',
        phu: 'Một dự đoán thường lệch bao nhiêu, tính theo đúng đơn vị gốc.',
    },
    {
        thuMuc: 'ham-linest',
        ten: 'cover',
        eyebrow: 'Excel · Phân tích dữ liệu',
        hook: 'LINEST',
        hookMau: MAU.do,
        tieuDe: 'LINEST: hồi quy tuyến tính đa biến bằng một công thức mảng',
        phu: 'Hệ số trả về theo thứ tự ngược — cạm bẫy dễ gặp nhất khi đọc kết quả.',
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
