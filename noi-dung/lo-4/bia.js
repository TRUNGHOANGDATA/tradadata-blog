// Ảnh bìa cho 5 bài của lô 4 — cụm hàm Excel cơ bản, dùng hàng ngày
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-count-counta-countblank',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'COUNT vs COUNTA',
        tieuDe: 'COUNT, COUNTA và COUNTBLANK: ba hàm đếm dễ nhầm nhất',
        phu: 'Tên gần giống nhau nhưng đếm ba thứ hoàn toàn khác nhau.',
    },
    {
        thuMuc: 'ham-max-min-large-small',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'LARGE / SMALL',
        tieuDe: 'MAX, MIN, LARGE và SMALL: tìm giá trị và xếp hạng theo vị trí',
        phu: 'Muốn tìm giá trị cao thứ nhì, MAX bó tay — đây là hàm thay thế.',
    },
    {
        thuMuc: 'ham-proper-upper-lower',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'PROPER',
        tieuDe: 'PROPER, UPPER và LOWER: chuẩn hoá chữ hoa/thường',
        phu: 'Dữ liệu nhập tay lộn xộn — ba hàm gọn nhất để làm sạch.',
    },
    {
        thuMuc: 'ham-len-rept',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'LEN + REPT',
        tieuDe: 'LEN và REPT: đếm độ dài chuỗi và lặp ký tự',
        phu: 'Hai hàm nhỏ nhưng dùng liên tục — kể cả để tự vẽ thanh tiến độ.',
    },
    {
        thuMuc: 'ham-isnumber-istext-isblank-iserror',
        ten: 'cover',
        eyebrow: 'Excel · Hàm cơ bản',
        hook: 'IS...',
        hookMau: MAU.do,
        tieuDe: 'ISNUMBER, ISTEXT, ISBLANK, ISERROR: kiểm tra kiểu dữ liệu',
        phu: 'Xác nhận đúng kiểu dữ liệu trước khi tính, thay vì đoán rồi vá lỗi.',
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
