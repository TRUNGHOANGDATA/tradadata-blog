// Ảnh minh hoạ cho bài SUMIF/SUMIFS
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'sf-01-cu-phap-sumif',
        tieuDe: 'SUMIF — vùng điều kiện đặt lên đầu',
        cot: [{ rong: 300 }],
        hang: [
            [{ v: 'SUMIF(vùng_điều_kiện, điều_kiện, [vùng_tổng])', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'sf-02-vi-du-mot-dieu-kien',
        tieuDe: 'Tổng doanh thu chỉ tính riêng nhóm Laptop',
        congThuc: { o: 'D1', ct: '=SUMIF(A2:A5,"Laptop",B2:B5)' },
        cot: [{ rong: 100 }, { rong: 110 }],
        hang: [
            [dauXanh('Nhóm SP'), dauXanh('Doanh thu')],
            [{ v: 'Laptop', nen: 'xanh' }, { v: '18.000.000', nen: 'xanh' }],
            ['Chuột', '350.000'],
            [{ v: 'Laptop', nen: 'xanh' }, { v: '22.000.000', nen: 'xanh' }],
        ],
    },
    {
        ten: 'sf-03-cu-phap-sumifs',
        tieuDe: 'SUMIFS — vùng tính tổng đặt lên đầu (ngược SUMIF)',
        cot: [{ rong: 340 }],
        hang: [
            [{ v: 'SUMIFS(vùng_tổng, vùng_dk1, dk1, [vùng_dk2, dk2]...)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'sf-04-vi-du-nhieu-dieu-kien',
        tieuDe: 'Laptop VÀ Miền Bắc — cả hai điều kiện phải cùng đúng',
        congThuc: { o: 'E1', ct: '=SUMIFS(C2:C5,A2:A5,"Laptop",B2:B5,"Miền Bắc")' },
        cot: [{ rong: 100 }, { rong: 110 }, { rong: 130 }],
        hang: [
            [dauXanh('Nhóm SP'), dauXanh('Khu vực'), dauXanh('Doanh thu')],
            [{ v: 'Laptop', nen: 'xanh' }, { v: 'Miền Bắc', nen: 'xanh' }, { v: '18.000.000', nen: 'xanh', dam: true }],
            ['Laptop', 'Miền Nam', '15.000.000'],
            ['Chuột', 'Miền Bắc', '350.000'],
        ],
    },
    {
        ten: 'sf-05-loi-value',
        tieuDe: 'Vùng lệch số hàng — SUMIFS báo #VALUE!',
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Vùng'), dauXanh('Số hàng')],
            ['DoanhThu (B2:B100)', '99'],
            [{ v: 'KhuVuc (C2:C90)', nen: 'do' }, { v: '89', mau: '#c0392b', dam: true }],
        ],
    },
];

const LO = [{ slug: 'sumif-sumifs', anh: bai }];

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
