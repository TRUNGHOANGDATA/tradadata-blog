// Ảnh minh hoạ cho bài COUNTIF/COUNTIFS
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'cf-01-cu-phap-countif',
        tieuDe: 'COUNTIF — chỉ hai tham số, không có vùng tính riêng',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'COUNTIF(vùng, điều_kiện)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'cf-02-vi-du-mot-dieu-kien',
        tieuDe: 'Đếm số đơn hàng ở Miền Bắc',
        congThuc: { o: 'C1', ct: '=COUNTIF(A2:A5,"Miền Bắc")' },
        cot: [{ rong: 110 }],
        hang: [
            [dauXanh('Khu vực')],
            [{ v: 'Miền Bắc', nen: 'xanh' }],
            ['Miền Nam'],
            [{ v: 'Miền Bắc', nen: 'xanh' }],
        ],
    },
    {
        ten: 'cf-03-cu-phap-countifs',
        tieuDe: 'COUNTIFS — chỉ lặp lại cặp vùng/điều kiện, KHÔNG đảo vị trí',
        cot: [{ rong: 320 }],
        hang: [
            [{ v: 'COUNTIFS(vùng_dk1, dk1, [vùng_dk2, dk2]...)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'cf-04-vi-du-nhieu-dieu-kien',
        tieuDe: 'Laptop VÀ Miền Bắc — đếm số đơn khớp cả hai',
        congThuc: { o: 'C1', ct: '=COUNTIFS(A2:A5,"Laptop",B2:B5,"Miền Bắc")' },
        cot: [{ rong: 90 }, { rong: 100 }],
        hang: [
            [dauXanh('Nhóm SP'), dauXanh('Khu vực')],
            [{ v: 'Laptop', nen: 'xanh' }, { v: 'Miền Bắc', nen: 'xanh' }],
            ['Laptop', 'Miền Nam'],
            ['Chuột', 'Miền Bắc'],
        ],
    },
    {
        ten: 'cf-05-hoac-cong-nhieu-countif',
        tieuDe: 'Đếm theo HOẶC: cộng hai COUNTIF lại',
        congThuc: { o: 'D1', ct: '=COUNTIF(A2:A5,"Laptop")+COUNTIF(A2:A5,"Chuột")' },
        cot: [{ rong: 100 }],
        hang: [
            [dauXanh('Nhóm SP')],
            [{ v: 'Laptop', nen: 'xanh' }],
            [{ v: 'Chuột', nen: 'vang' }],
            ['Bàn phím'],
        ],
    },
];

const LO = [{ slug: 'countif-countifs', anh: bai }];

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
