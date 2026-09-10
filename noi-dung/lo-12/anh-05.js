// Ảnh minh hoạ cho bài 5 — GETPIVOTDATA
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'gp-01-cu-phap-co-ban',
        tieuDe: 'GETPIVOTDATA tra theo tên trường, không theo vị trí',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'GETPIVOTDATA(trường_dữ_liệu, ô_pivot, [trường,mục]...)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'gp-02-tu-dong-chen',
        tieuDe: 'Excel tự chèn khi bấm vào ô trong Pivot Table',
        congThuc: { o: 'B1', ct: '=GETPIVOTDATA("Doanh thu",$A$3,"Miền","Miền Bắc")' },
        cot: [{ rong: 90 }, { rong: 100 }],
        hang: [
            [dauXanh('Miền'), dauXanh('Doanh thu')],
            [{ v: 'Miền Bắc', nen: 'xanh' }, { v: '850tr', nen: 'xanh' }],
            ['Miền Nam', '920tr'],
        ],
        chon: 'B2',
    },
    {
        ten: 'gp-03-tham-chieu-o-thuong',
        tieuDe: 'Tham chiếu ô thường — lệch khi bố cục Pivot đổi',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: '=$B$5  →  đúng vị trí, nhưng có thể sai dữ liệu sau khi đổi bố cục', canLe: 'giua', nen: 'vang' }],
        ],
    },
    {
        ten: 'gp-04-tat-tu-dong-chen',
        tieuDe: 'Tắt tự động chèn: File → Options → Formulas',
        cot: [{ rong: 240 }],
        hang: [
            [{ v: 'Bỏ chọn "Use GetPivotData functions..."', canLe: 'giua' }],
        ],
    },
    {
        ten: 'gp-05-loi-sai-ten-muc',
        tieuDe: 'Gõ sai tên mục — báo lỗi #REF! rõ ràng',
        cot: [{ rong: 220 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=GETPIVOTDATA("Doanh thu",$A$3,"Miền","Miền Tây")', mono: true }, { v: '#REF!', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-getpivotdata', anh: bai }];

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
