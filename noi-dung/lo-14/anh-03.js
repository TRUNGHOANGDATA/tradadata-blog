// Ảnh minh hoạ cho bài 3 — NUMBERVALUE
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'nv-01-cu-phap-co-ban',
        tieuDe: 'NUMBERVALUE tự khai định dạng số',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'NUMBERVALUE(văn_bản, [dấu_thập_phân], [dấu_nhóm])', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'nv-02-loi-value-thong-thuong',
        tieuDe: 'VALUE đọc theo vùng miền máy — dễ sai với dữ liệu ngoại',
        cot: [{ rong: 180 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=VALUE("1,234.56")', mono: true }, { v: '#VALUE!', nen: 'do' }],
        ],
    },
    {
        ten: 'nv-03-sua-bang-numbervalue',
        tieuDe: 'Khai rõ định dạng gốc — không phụ thuộc máy',
        cot: [{ rong: 220 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=NUMBERVALUE("1,234.56",".",",")', mono: true }, { v: '1234,56', nen: 'xanh' }],
        ],
    },
    {
        ten: 'nv-04-so-sanh-value-numbervalue',
        tieuDe: 'Khi nào cần NUMBERVALUE thay vì VALUE',
        cot: [{ rong: 200 }, { rong: 130 }],
        hang: [
            [dauXanh('Tình huống'), dauXanh('Nên dùng')],
            ['Cùng vùng miền với máy', 'VALUE'],
            ['Dữ liệu ngoại, khác định dạng', { v: 'NUMBERVALUE', nen: 'xanh' }],
        ],
    },
    {
        ten: 'nv-05-loi-khai-nguoc-dau',
        tieuDe: 'Khai ngược hai dấu — sai giá trị, không báo lỗi',
        cot: [{ rong: 220 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=NUMBERVALUE("1,234.56",",",".")', mono: true }, { v: '1,23456 (sai)', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-numbervalue', anh: bai }];

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
