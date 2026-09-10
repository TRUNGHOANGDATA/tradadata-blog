// Ảnh minh hoạ cho bài 2 — CEILING, FLOOR
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'cf-01-vi-sao-round-khong-du',
        tieuDe: 'ROUND làm tròn theo hướng gần nhất, không phải hướng cố định',
        congThuc: { o: 'B2', ct: '=ROUND(123, -2)' },
        cot: [{ rong: 130 }, { rong: 130 }],
        hang: [
            [dauXanh('Số gốc'), dauXanh('ROUND(...,-2)')],
            ['123', { v: '100 (xuống)', nen: 'do' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'cf-02-ceiling',
        tieuDe: 'CEILING — luôn làm tròn LÊN tới bội số chỉ định',
        congThuc: { o: 'B2', ct: '=CEILING(123400, 1000)' },
        cot: [{ rong: 150 }, { rong: 150 }],
        hang: [
            [dauXanh('Giá vốn'), dauXanh('Làm tròn lên')],
            ['123.400', { v: '124.000', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'cf-03-floor',
        tieuDe: 'FLOOR — số thùng nguyên đóng được, không làm tròn lên',
        congThuc: { o: 'B2', ct: '=FLOOR(237, 12)' },
        cot: [{ rong: 150 }, { rong: 170 }],
        hang: [
            [dauXanh('Số sản phẩm'), dauXanh('Làm tròn xuống (bội 12)')],
            ['237', { v: '228 (= 19 thùng)', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'cf-04-quy-tac-gia-ban',
        tieuDe: 'Định giá kết thúc bằng 900 — kỹ thuật định giá tâm lý',
        congThuc: { o: 'B2', ct: '=CEILING(A2, 1000) - 100' },
        cot: [{ rong: 150 }, { rong: 150 }],
        hang: [
            [dauXanh('Giá vốn'), dauXanh('Giá niêm yết')],
            ['123.400', { v: '123.900', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'cf-05-so-am',
        tieuDe: 'Số âm: CEILING tiến gần 0 hơn, FLOOR tiến xa 0 hơn',
        cot: [{ rong: 210 }, { rong: 150 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=CEILING(-123, 10)', mono: true }, { v: '-120', nen: 'xanh' }],
            [{ v: '=FLOOR(-123, 10)', mono: true }, { v: '-130', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-ceiling-floor', anh: bai }];

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
