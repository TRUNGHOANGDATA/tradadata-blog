// Ảnh minh hoạ cho bài 5 — DELTA, GESTEP
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'dg-01-cu-phap-co-ban',
        tieuDe: 'DELTA và GESTEP trả về 0 hoặc 1',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DELTA(5,5)', mono: true }, { v: '1', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=GESTEP(8,5)', mono: true }, { v: '1', canLe: 'giua' }],
        ],
    },
    {
        ten: 'dg-02-khac-phep-so-sanh-thuong',
        tieuDe: 'DELTA trả số thật, không phải TRUE/FALSE',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=A1=A2', mono: true }, { v: 'TRUE', canLe: 'giua' }],
            [{ v: '=DELTA(A1,A2)', mono: true }, { v: '1', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'dg-03-dem-khop-gia-tri',
        tieuDe: 'Đếm số ô khớp đúng giá trị bằng SUMPRODUCT',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: '=SUMPRODUCT(DELTA(A2:A20,10))', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'dg-04-co-hieu-nguong',
        tieuDe: 'GESTEP làm cờ hiệu nhân vào công thức khác',
        congThuc: { o: 'C2', ct: '=A2*GESTEP(A2,B2)' },
        cot: [{ rong: 90 }, { rong: 80 }, { rong: 90 }],
        hang: [
            [dauXanh('DoanhSo'), dauXanh('ChiTieu'), dauXanh('Kết quả')],
            ['12tr', '10tr', { v: '12tr', nen: 'xanh' }],
            ['8tr', '10tr', '0'],
        ],
        chon: 'C2',
    },
    {
        ten: 'dg-05-gestep-bo-trong-nguong',
        tieuDe: 'Bỏ trống ngưỡng — mặc định so với 0',
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=GESTEP(-5)', mono: true }, { v: '0', nen: 'do', canLe: 'giua' }],
            [{ v: '=GESTEP(5)', mono: true }, { v: '1', nen: 'xanh', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-delta-gestep', anh: bai }];

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
