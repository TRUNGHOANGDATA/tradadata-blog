// Ảnh minh hoạ cho bài 2 — DCOUNT, DCOUNTA
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'dc-01-cu-phap-co-ban',
        tieuDe: 'DCOUNT và DCOUNTA cùng cấu trúc với DSUM',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'DCOUNT(vùng, [trường], vùng_đk)  /  DCOUNTA(...)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'dc-02-dcount-khac-dcounta',
        tieuDe: 'Cột MaDon là chữ — DCOUNT trả về 0',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Hàm'), dauXanh('Kết quả')],
            [{ v: '=DCOUNT(...,"MaDon",...)', mono: true }, { v: '0', nen: 'do', canLe: 'giua' }],
            [{ v: '=DCOUNTA(...,"MaDon",...)', mono: true }, { v: '5', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'dc-03-dem-don-hang-vip',
        tieuDe: 'Đếm đơn hàng của khách VIP hoặc Thân thiết',
        cot: [{ rong: 100 }],
        hang: [
            [dauXanh('Hạng khách')],
            ['VIP'],
            ['Thân thiết'],
        ],
    },
    {
        ten: 'dc-04-bo-trong-truong',
        tieuDe: 'Bỏ trống trường — đếm toàn bộ dòng khớp',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: '=DCOUNT(A1:D50,,F1:F3)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'dc-05-kiem-tra-truoc-khi-tin',
        tieuDe: 'Đếm trước để chắc chắn có dòng khớp',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'DCOUNTA trước → rồi mới tin DSUM/DAVERAGE', nen: 'xanh', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-dcount-dcounta', anh: bai }];

async function chay() {
    let tong = 0;
    for (const b of LO) for (const spec of b.anh) {
        const r = await sinhAnh(spec, path.join(GOC, b.slug));
        tong += r.nang;
        console.log(`  ${b.slug}/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang / 1024).toFixed(0)} KB`);
    }
    console.log(`Tổng ${(tong / 1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
