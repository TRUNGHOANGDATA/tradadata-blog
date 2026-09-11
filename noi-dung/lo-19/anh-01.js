// Ảnh minh hoạ cho bài 1 — DSUM
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'ds-01-cu-phap-co-ban',
        tieuDe: 'DSUM cần vùng dữ liệu VÀ vùng điều kiện riêng',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'DSUM(vùng_dữ_liệu, trường, vùng_điều_kiện)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'ds-02-dieu-kien-hoac',
        tieuDe: 'Vùng điều kiện 2 dòng = quan hệ HOẶC',
        congThuc: { o: 'H1', ct: '=DSUM(A1:C5,"Doanh số",E1:E3)' },
        cot: [{ rong: 90 }],
        hang: [
            [dauXanh('Miền')],
            ['Miền Bắc'],
            ['Miền Nam'],
        ],
    },
    {
        ten: 'ds-03-so-sanh-sumifs',
        tieuDe: 'DSUM gọn hơn — không cần cộng nhiều SUMIFS',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'SUMIFS(DS,Mien,"Bắc")+SUMIFS(DS,Mien,"Nam")', mono: true, canLe: 'giua' }],
            [{ v: '= DSUM(A1:C10,"Doanh số",E1:E3)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'ds-04-dieu-kien-va',
        tieuDe: 'Cùng dòng, khác cột = quan hệ VÀ',
        cot: [{ rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Miền'), dauXanh('Sản phẩm')],
            ['Miền Bắc', 'Bút bi'],
        ],
    },
    {
        ten: 'ds-05-loi-ten-cot-khong-khop',
        tieuDe: 'Tên cột sai lệch — điều kiện bị bỏ qua âm thầm',
        cot: [{ rong: 100 }, { rong: 160 }],
        hang: [
            [dauXanh('Tiêu đề gốc'), dauXanh('Tiêu đề vùng đk')],
            ['Miền', { v: '"Miền " (thừa dấu cách)', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-dsum', anh: bai }];

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
