// Ảnh minh hoạ cho bài 3 — FACT
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'fa-01-cu-phap-co-ban',
        tieuDe: 'FACT tính giai thừa',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=FACT(5)', mono: true }, { v: '120', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'fa-02-y-nghia-sap-xep',
        tieuDe: '5 người xếp hàng — 120 cách sắp thứ tự',
        congThuc: { o: 'B1', ct: '=FACT(5)' },
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'Kết quả: 120 cách xếp hàng khác nhau', nen: 'xanh', canLe: 'giua' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'fa-03-fact-cua-0',
        tieuDe: 'FACT(0) = 1, không phải 0',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=FACT(0)', mono: true }, { v: '1', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'fa-04-so-thap-phan-bi-cat',
        tieuDe: 'Số thập phân tự động bị cắt, không báo lỗi',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=FACT(4,7)', mono: true }, { v: '24', nen: 'vang', canLe: 'giua' }],
        ],
    },
    {
        ten: 'fa-05-tang-rat-nhanh',
        tieuDe: 'Tăng cực nhanh theo cấp giai thừa',
        cot: [{ rong: 100 }, { rong: 160 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=FACT(15)', mono: true }, { v: '1.307.674.368.000', nen: 'xanh' }],
            [{ v: '=FACT(20)', mono: true }, { v: '2.432.902.008.176.640.000', canLe: 'phai' }],
        ],
    },
];

const LO = [{ slug: 'ham-fact', anh: bai }];

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
