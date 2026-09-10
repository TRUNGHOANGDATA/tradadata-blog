// Ảnh minh hoạ cho bài 3 — ADDRESS
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'ad-01-address-co-ban',
        tieuDe: 'ADDRESS(5,2) — dựng địa chỉ tuyệt đối mặc định',
        congThuc: { o: 'B1', ct: '=ADDRESS(5, 2)' },
        cot: [{ rong: 150 }, { rong: 100 }],
        hang: [
            [{ v: '=ADDRESS(5, 2)', mono: true }, { v: '"$B$5"', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'ad-02-abs-num',
        tieuDe: 'Tham số abs_num = 4 — địa chỉ tương đối hoàn toàn',
        congThuc: { o: 'B1', ct: '=ADDRESS(5, 2, 4)' },
        cot: [{ rong: 170 }, { rong: 100 }],
        hang: [
            [{ v: '=ADDRESS(5, 2, 4)', mono: true }, { v: '"B5"', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'ad-03-chi-la-van-ban',
        tieuDe: 'Kết quả ADDRESS chỉ là văn bản, chưa đọc được giá trị ô',
        cot: [{ rong: 200 }, { rong: 150 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ADDRESS(5,2)', mono: true }, { v: '"$B$5" (chỉ là chữ)', nen: 'do' }],
        ],
    },
    {
        ten: 'ad-04-address-indirect',
        tieuDe: 'Ghép INDIRECT để đọc được giá trị thật tại địa chỉ đó',
        congThuc: { o: 'D1', ct: '=INDIRECT(ADDRESS(5, 2))' },
        cot: [{ rong: 60 }, { rong: 80 }, { rong: 30 }, { rong: 150 }],
        hang: [
            ['', { v: '2.400.000', canLe: 'phai' }, '', dauXanh('Đọc được')],
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
            ['', { v: '(B5)', canLe: 'giua' }, '', { v: '2.400.000', nen: 'xanh' }],
        ],
        chon: 'D1',
    },
    {
        ten: 'ad-05-du-lieu-toa-do',
        tieuDe: 'Hai ô riêng chứa toạ độ hàng và cột cần đọc',
        cot: [{ rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Số hàng'), dauXanh('Số cột')],
            ['5', '2'],
        ],
    },
    {
        ten: 'ad-06-doc-theo-toa-do',
        tieuDe: 'INDIRECT(ADDRESS(D2,E2)) — đọc theo toạ độ tính động',
        congThuc: { o: 'F2', ct: '=INDIRECT(ADDRESS(D2, E2))' },
        cot: [{ rong: 90 }, { rong: 90 }, { rong: 30 }, { rong: 130 }],
        hang: [
            [dauXanh('Số hàng'), dauXanh('Số cột'), '', dauXanh('Giá trị tại đó')],
            ['5', '2', '', { v: '2.400.000', nen: 'xanh' }],
        ],
        chon: 'F2',
    },
];

const LO = [{ slug: 'ham-address', anh: bai }];

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
