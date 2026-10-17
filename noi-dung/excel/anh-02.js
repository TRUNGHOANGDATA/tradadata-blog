// Ảnh minh hoạ cho bài 2 — Số bị lưu thành văn bản
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });
const vanBan = t => ({ v: t, canLe: 'trai', nen: 'do' });

const bai = [
    {
        ten: 'sv-01-sum-thieu',
        tieuDe: 'Hai ô văn bản bị bỏ qua nên tổng thiếu 600',
        congThuc: { o: 'C6', ct: '=SUM(C1:C5)' },
        cot: [{ rong: 90 }],
        hang: [
            ['100'],
            [vanBan('200')],
            ['300'],
            [vanBan('400')],
            ['500'],
            [{ v: '900', dam: true }],
        ],
    },
    {
        ten: 'sv-02-count-lech',
        tieuDe: 'COUNT lệch COUNTA = có ô văn bản trà trộn',
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Hàm'), dauXanh('Kết quả')],
            ['=COUNT(C1:C5)', '3'],
            ['=COUNTA(C1:C5)', '5'],
            [{ v: 'Lệch 2 ô', dam: true, nen: 'do' }, { v: '→ sửa', nen: 'do' }],
        ],
    },
    {
        ten: 'sv-03-dem-o-loi',
        tieuDe: 'Đếm còn bao nhiêu ô số dạng văn bản',
        congThuc: { o: 'E1', ct: '=SUMPRODUCT(--ISTEXT(C1:C5))' },
        cot: [{ rong: 90 }],
        hang: [
            [{ v: '2', dam: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'sv-04-sumproduct-ep',
        tieuDe: 'Ép về số bằng dấu -- rồi cộng thì đủ 1500',
        cot: [{ rong: 240 }],
        hang: [
            [{ v: '=SUM(C1:C5)', mono: true }, ],
            [{ v: '→ 900 (thiếu)', nen: 'do' }],
            [{ v: '=SUMPRODUCT(--(C1:C5))', mono: true }],
            [{ v: '→ 1500 (đủ)', nen: 'xanh' }],
        ],
    },
];

const LO = [{ slug: 'so-van-ban', anh: bai }];

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
