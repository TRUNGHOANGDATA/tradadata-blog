// Ảnh bìa cho 5 bài của lô 11 — các hàm cơ bản dễ bị bỏ qua
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-replace',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'REPLACE',
        tieuDe: 'REPLACE: thay thế văn bản theo vị trí, không cần biết nội dung cũ',
        phu: 'Che một phần số điện thoại hay CCCD mà không cần biết trước con số.',
    },
    {
        thuMuc: 'ham-sign',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'SIGN',
        tieuDe: 'SIGN: biết ngay một số dương, âm hay bằng 0',
        phu: 'Kết hợp CHOOSE để gán nhãn Tăng/Giảm mà không cần IF lồng nhau.',
    },
    {
        thuMuc: 'ham-sqrt',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'SQRT',
        tieuDe: 'SQRT: căn bậc hai, vì sao số âm luôn báo lỗi',
        phu: 'Không trả về số ảo như máy tính khoa học — báo #NUM! ngay lập tức.',
    },
    {
        thuMuc: 'ham-power',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'POWER',
        hookMau: MAU.do,
        tieuDe: 'POWER: tính luỹ thừa rõ ràng hơn dấu mũ',
        phu: 'Số mũ không nguyên với cơ số âm gây lỗi #NUM! dù đáp án có tồn tại.',
    },
    {
        thuMuc: 'ham-true-false',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'TRUE·FALSE',
        tieuDe: 'TRUE, FALSE: hai hàm không đối số, và cái bẫy dấu ngoặc kép',
        phu: 'Gõ trong ngoặc kép biến giá trị luận lý thật thành một chuỗi giả dạng.',
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
