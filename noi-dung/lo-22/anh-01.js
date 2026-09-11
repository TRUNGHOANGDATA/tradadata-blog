// Ảnh minh hoạ cho bài 1 — MODE.SNGL, MODE.MULT
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'md-01-cu-phap-co-ban',
        tieuDe: 'MODE.SNGL là tên mới của MODE cũ',
        cot: [{ rong: 130 }, { rong: 130 }],
        hang: [
            [dauXanh('Tên cũ'), dauXanh('Tên mới')],
            ['MODE', 'MODE.SNGL'],
            ['(không có)', { v: 'MODE.MULT', nen: 'xanh' }],
        ],
    },
    {
        ten: 'md-02-nhieu-mode-bang-nhau',
        tieuDe: 'Dữ liệu 1,2,2,3,3,4 — hai mode bằng nhau',
        cot: [{ rong: 150 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=MODE.SNGL(1,2,2,3,3,4)', mono: true }, { v: '2 (bỏ sót 3)', nen: 'do' }],
            [{ v: '=MODE.MULT(1,2,2,3,3,4)', mono: true }, { v: '{2;3}', nen: 'xanh' }],
        ],
    },
    {
        ten: 'md-03-nhap-mang-dong',
        tieuDe: 'MODE.MULT tự tràn 2 ô trên Excel 365',
        cot: [{ rong: 90 }],
        hang: [
            [dauXanh('Kết quả')],
            [{ v: '2', nen: 'xanh' }],
            [{ v: '3', nen: 'xanh' }],
        ],
    },
    {
        ten: 'md-04-chi-mot-mode',
        tieuDe: 'Chỉ một mode — cả hai hàm cho cùng kết quả',
        cot: [{ rong: 180 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=MODE.SNGL(1,2,2,2,3,4)', mono: true }, { v: '2', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=MODE.MULT(1,2,2,2,3,4)', mono: true }, { v: '2', canLe: 'giua' }],
        ],
    },
    {
        ten: 'md-05-khong-co-gia-tri-lap-lai',
        tieuDe: 'Không giá trị nào lặp lại — cả hai báo lỗi',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=MODE.SNGL(1,2,3,4,5)', mono: true }, { v: '#N/A', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-mode-sngl-mult', anh: bai }];

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
