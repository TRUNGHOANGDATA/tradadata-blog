// Ảnh bìa cho 5 bài của lô 15
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-xmatch',
        ten: 'cover',
        eyebrow: 'Excel · Hàm tra cứu',
        hook: 'XMATCH',
        tieuDe: 'XMATCH: bản thay thế hiện đại của MATCH',
        phu: 'Mặc định khớp chính xác — bỏ hẳn cái bẫy quên khai tham số 0.',
    },
    {
        thuMuc: 'ham-valuetotext',
        ten: 'cover',
        eyebrow: 'Excel · Hàm văn bản',
        hook: 'VALUETOTEXT',
        tieuDe: 'VALUETOTEXT: chuyển một giá trị thành văn bản',
        phu: 'Giữ giá trị lỗi thành chuỗi, không để lỗi lây lan như nối chuỗi thường.',
    },
    {
        thuMuc: 'ham-fact',
        ten: 'cover',
        eyebrow: 'Excel · Hàm toán học',
        hook: 'FACT',
        tieuDe: 'FACT: giai thừa, đếm số cách sắp xếp thứ tự',
        phu: 'FACT(0) bằng 1, không phải 0 — điểm hay gây bất ngờ nhất.',
    },
    {
        thuMuc: 'ham-combin',
        ten: 'cover',
        eyebrow: 'Excel · Hàm toán học',
        hook: 'COMBIN',
        tieuDe: 'COMBIN: đếm số cách chọn, không phân biệt thứ tự',
        phu: 'Chọn đội đại diện hay số trúng giải — ai được chọn, không quan tâm ai trước ai sau.',
    },
    {
        thuMuc: 'ham-permut',
        ten: 'cover',
        eyebrow: 'Excel · Hàm toán học',
        hook: 'PERMUT',
        hookMau: MAU.do,
        tieuDe: 'PERMUT: cùng bài toán chọn, nhưng thứ tự lại quan trọng',
        phu: 'Xếp giải Nhất-Nhì-Ba — luôn gấp COMBIN đúng FACT(số chọn) lần.',
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
