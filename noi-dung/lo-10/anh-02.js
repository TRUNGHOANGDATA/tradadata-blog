// Ảnh minh hoạ cho bài 2 — MOD
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'mod-01-cu-phap-co-ban',
        tieuDe: 'MOD lấy phần dư của một phép chia',
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=MOD(17,5)', mono: true }, { v: '2', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'mod-02-to-mau-xen-ke',
        tieuDe: 'Conditional Formatting: =MOD(ROW(),2)=0',
        cot: [{ rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Sản phẩm'), dauXanh('Số lượng')],
            ['Bút bi', '120'],
            [{ v: 'Vở kẻ ngang', nen: 'xanh' }, { v: '85', nen: 'xanh' }],
            ['Thước kẻ', '60'],
            [{ v: 'Gôm tẩy', nen: 'xanh' }, { v: '200', nen: 'xanh' }],
        ],
    },
    {
        ten: 'mod-03-kiem-tra-boi-so',
        tieuDe: 'Kiểm tra số lượng có đóng vừa đủ thùng không',
        congThuc: { o: 'B2', ct: '=IF(MOD(A2,5)=0,"Đủ thùng","Còn lẻ")' },
        cot: [{ rong: 80 }, { rong: 90 }],
        hang: [
            [dauXanh('Số lượng'), dauXanh('Kiểm tra')],
            ['25', { v: 'Đủ thùng', nen: 'xanh' }],
            ['27', { v: 'Còn lẻ', nen: 'vang' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'mod-04-mod-so-am',
        tieuDe: 'MOD với số âm — không giống phép chia dư lập trình',
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=MOD(-17,5)', mono: true }, { v: '3', nen: 'xanh', canLe: 'giua' }],
            [{ v: '(không phải -2)', canLe: 'trai' }, ''],
        ],
    },
    {
        ten: 'mod-05-cong-thuc-ben-trong',
        tieuDe: 'Công thức thật của MOD dùng INT làm tròn xuống',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'MOD(n,d) = n − d × INT(n/d)', mono: true, canLe: 'giua' }],
            [{ v: 'INT(-17/5) = INT(-3,4) = -4', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-mod', anh: bai }];

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
