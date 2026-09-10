// Ảnh minh hoạ cho bài 4 — N, T
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'nt-01-n-voi-so',
        tieuDe: 'N — với ô đã là số, giữ nguyên',
        congThuc: { o: 'B1', ct: '=N(1024)' },
        cot: [{ rong: 120 }, { rong: 100 }],
        hang: [
            [{ v: '=N(1024)', mono: true }, { v: '1024', nen: 'xanh', canLe: 'phai' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'nt-02-n-voi-chu',
        tieuDe: 'N với chữ — im lặng trả về 0, không báo lỗi',
        congThuc: { o: 'B1', ct: '=N("Excel")' },
        cot: [{ rong: 150 }, { rong: 100 }],
        hang: [
            [{ v: '=N("Excel")', mono: true }, { v: '0', nen: 'xanh', canLe: 'phai' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'nt-03-t-voi-chu',
        tieuDe: 'T — với ô đã là văn bản, giữ nguyên',
        congThuc: { o: 'B1', ct: '=T("VT005")' },
        cot: [{ rong: 150 }, { rong: 100 }],
        hang: [
            [{ v: '=T("VT005")', mono: true }, { v: '"VT005"', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'nt-04-t-voi-so',
        tieuDe: 'T với số — im lặng trả về chuỗi rỗng',
        congThuc: { o: 'B1', ct: '=T(1024)' },
        cot: [{ rong: 120 }, { rong: 130 }],
        hang: [
            [{ v: '=T(1024)', mono: true }, { v: '"" (rỗng)', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'nt-05-du-lieu-hon-hop',
        tieuDe: 'Vùng dữ liệu hỗn hợp số và chữ',
        cot: [{ rong: 100 }],
        hang: [
            [dauXanh('Giá trị')],
            ['1024'], ['VT005'], ['890'], [''], ['2100'],
        ],
    },
    {
        ten: 'nt-06-so-sanh-hien-dai',
        tieuDe: 'IF + ISNUMBER thay cho N — dễ đọc hơn',
        cot: [{ rong: 220 }, { rong: 150 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=N(B2)', mono: true }, { v: 'Ngắn, khó đoán ý', nen: 'do' }],
            [{ v: '=IF(ISNUMBER(B2),B2,0)', mono: true }, { v: 'Dài hơn, rõ ý hơn', nen: 'xanh' }],
        ],
    },
];

const LO = [{ slug: 'ham-n-t', anh: bai }];

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
