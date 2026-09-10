// Ảnh bìa cho 5 bài của lô 13
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-networkdays-intl',
        ten: 'cover',
        eyebrow: 'Excel · Hàm ngày tháng',
        hook: 'NETWORKDAYS.INTL',
        tieuDe: 'NETWORKDAYS.INTL: đếm ngày làm việc khi cuối tuần khác chuẩn',
        phu: 'Tự chọn cặp ngày nghỉ thay vì mặc định cố định Thứ Bảy-Chủ Nhật.',
    },
    {
        thuMuc: 'ham-gcd',
        ten: 'cover',
        eyebrow: 'Excel · Hàm toán học',
        hook: 'GCD',
        tieuDe: 'GCD: ước số chung lớn nhất, rút gọn một tỷ lệ',
        phu: 'Từ tỷ lệ pha trộn tới tỷ lệ khung hình, không cần dò tay.',
    },
    {
        thuMuc: 'ham-lcm',
        ten: 'cover',
        eyebrow: 'Excel · Hàm toán học',
        hook: 'LCM',
        tieuDe: 'LCM: bội số chung nhỏ nhất, tìm chu kỳ trùng nhau',
        phu: 'Hai tuyến xe buýt hay ba lịch bảo trì — bao lâu nữa gặp lại.',
    },
    {
        thuMuc: 'ham-rank-eq-avg',
        ten: 'cover',
        eyebrow: 'Excel · Hàm thống kê',
        hook: 'RANK.EQ·AVG',
        tieuDe: 'RANK.EQ, RANK.AVG: hai cách xử lý điểm số bằng nhau',
        phu: 'Đồng hạng và bỏ qua hạng kế, hay chia đều hạng trung bình.',
    },
    {
        thuMuc: 'ham-sortby',
        ten: 'cover',
        eyebrow: 'Excel · Hàm mảng động',
        hook: 'SORTBY',
        hookMau: MAU.do,
        tieuDe: 'SORTBY: sắp xếp một danh sách theo tiêu chí ở cột khác',
        phu: 'Hiện tên nhưng sắp theo điểm — điều SORT một mình không làm được.',
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
