// Ảnh minh hoạ cho bài 1 — MAXIFS
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'mx-01-cu-phap-co-ban',
        tieuDe: 'MAXIFS = MAX có điều kiện',
        cot: [{ rong: 200 }],
        hang: [
            [{ v: 'MAXIFS(vùng_max, vùng_đk1, đk1, ...)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'mx-02-doanh-so-cao-nhat',
        tieuDe: 'Doanh số cao nhất của nhân viên An',
        congThuc: { o: 'D1', ct: '=MAXIFS(C2:C5,A2:A5,"An")' },
        cot: [{ rong: 70 }, { rong: 60 }, { rong: 100 }],
        hang: [
            [dauXanh('Nhân viên'), dauXanh('Tháng'), dauXanh('Doanh số')],
            ['An', 'T1', '12.000.000'],
            ['An', 'T2', { v: '15.500.000', nen: 'xanh' }],
            ['Bình', 'T1', '9.000.000'],
        ],
        chon: 'C3',
    },
    {
        ten: 'mx-03-nhieu-dieu-kien',
        tieuDe: 'Thêm điều kiện thứ hai để thu hẹp phạm vi',
        congThuc: { o: 'D1', ct: '=MAXIFS(C2:C5,A2:A5,"An",B2:B5,"T2")' },
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'Kết quả: 15.500.000 (An, riêng T2)', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'mx-04-tra-ve-0-khong-loi',
        tieuDe: 'Không có dòng khớp — trả về 0, không phải lỗi',
        cot: [{ rong: 200 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=MAXIFS(C:C,A:A,"Chưa tồn tại")', mono: true }, { v: '0', nen: 'vang', canLe: 'giua' }],
        ],
    },
    {
        ten: 'mx-05-thay-the-ban-cu',
        tieuDe: 'Công thức mảng thay thế cho Excel bản cũ',
        cot: [{ rong: 230 }],
        hang: [
            [{ v: '{=MAX(IF(A2:A5="An",C2:C5))}', mono: true, canLe: 'giua' }],
            [{ v: 'nhấn Ctrl+Shift+Enter', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-maxifs', anh: bai }];

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
