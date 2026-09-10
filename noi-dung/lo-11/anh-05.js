// Ảnh minh hoạ cho bài 5 — TRUE, FALSE
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'tf-01-cu-phap-co-ban',
        tieuDe: 'TRUE() và FALSE() — hai hàm không đối số',
        cot: [{ rong: 100 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=TRUE()', mono: true }, { v: 'TRUE', canLe: 'giua' }],
            [{ v: '=FALSE()', mono: true }, { v: 'FALSE', canLe: 'giua' }],
        ],
    },
    {
        ten: 'tf-02-hai-cach-viet-tuong-duong',
        tieuDe: 'Gõ thẳng TRUE hay gọi TRUE() đều ra cùng kết quả',
        cot: [{ rong: 170 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=IF(TRUE,"Đúng","Sai")', mono: true }, { v: 'Đúng', nen: 'xanh' }],
            [{ v: '=IF(TRUE(),"Đúng","Sai")', mono: true }, { v: 'Đúng', nen: 'xanh' }],
        ],
    },
    {
        ten: 'tf-03-islogical-phan-biet',
        tieuDe: 'ISLOGICAL vạch trần chuỗi "TRUE" giả dạng',
        cot: [{ rong: 190 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ISLOGICAL(TRUE)', mono: true }, { v: 'TRUE', nen: 'xanh' }],
            [{ v: '=ISLOGICAL("TRUE")', mono: true }, { v: 'FALSE', nen: 'do' }],
        ],
    },
    {
        ten: 'tf-04-anh-huong-tinh-toan',
        tieuDe: 'TRUE thật cộng được, chữ "TRUE" thì báo lỗi',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=TRUE+5', mono: true }, { v: '6', nen: 'xanh', canLe: 'giua' }],
            [{ v: '="TRUE"+5', mono: true }, { v: '#VALUE!', nen: 'do' }],
        ],
    },
    {
        ten: 'tf-05-mac-dinh-trong-lambda',
        tieuDe: 'Gọi rõ TRUE()/FALSE() khi truyền tham số LAMBDA',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'LAMBDA(so,hienThem,IF(hienThem,so&"đ",so))(1000,TRUE())', mono: true, canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-true-false', anh: bai }];

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
