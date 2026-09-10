// Ảnh minh hoạ cho bài 5 — MROUND
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'mr-01-cu-phap-co-ban',
        tieuDe: 'MROUND làm tròn tới bội số gần nhất',
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=MROUND(11,3)', mono: true }, { v: '12', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'mr-02-lam-tron-gia-tien',
        tieuDe: 'Làm tròn giá bán tới bội số 500đ',
        congThuc: { o: 'B1', ct: '=MROUND(12345,500)' },
        cot: [{ rong: 110 }, { rong: 100 }],
        hang: [
            [{ v: 'Giá tính ra: 12.345đ' }, { v: '12.500đ', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'mr-03-lam-tron-gio-cham-cong',
        tieuDe: 'Làm tròn phút lẻ tới khối 15 phút gần nhất',
        congThuc: { o: 'B2', ct: '=MROUND(A2,15)' },
        cot: [{ rong: 130 }, { rong: 100 }],
        hang: [
            [dauXanh('Quét thẻ'), dauXanh('Làm tròn')],
            ['08:07 (7 phút lẻ)', { v: '08:00', nen: 'xanh' }],
            ['08:09 (9 phút lẻ)', '08:15'],
        ],
        chon: 'B2',
    },
    {
        ten: 'mr-04-loi-num-khac-dau',
        tieuDe: 'Number và multiple khác dấu — lỗi #NUM!',
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=MROUND(10,3)', mono: true }, { v: '9', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=MROUND(10,-3)', mono: true }, { v: '#NUM!', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-mround', anh: bai }];

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
