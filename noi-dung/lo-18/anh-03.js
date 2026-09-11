// Ảnh minh hoạ cho bài 3 — BASE
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'bs-01-cu-phap-co-ban',
        tieuDe: 'BASE chuyển số sang hệ đếm khác',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'BASE(số, cơ_số, [độ_dài_tối_thiểu])', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'bs-02-nhi-phan-va-hex',
        tieuDe: 'Chuyển sang nhị phân và thập lục phân',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=BASE(15,2)', mono: true }, { v: '1111', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=BASE(255,16)', mono: true }, { v: 'FF', canLe: 'giua' }],
        ],
    },
    {
        ten: 'bs-03-dem-so-0',
        tieuDe: 'Đệm số 0 phía trước cho đủ độ dài cố định',
        cot: [{ rong: 150 }, { rong: 120 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=BASE(5,2,8)', mono: true }, { v: '00000101', nen: 'xanh' }],
        ],
    },
    {
        ten: 'bs-04-co-so-36',
        tieuDe: 'Cơ số 36 rút gọn số lớn thành chuỗi ngắn',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=BASE(2026,36)', mono: true }, { v: '1KA', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'bs-05-loi-co-so-ngoai-pham-vi',
        tieuDe: 'Cơ số ngoài phạm vi 2-36 báo lỗi',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=BASE(15,1)', mono: true }, { v: '#NUM!', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-base', anh: bai }];

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
