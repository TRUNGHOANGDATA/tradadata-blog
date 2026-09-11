// Ảnh minh hoạ cho bài 3 — DEC2OCT, OCT2DEC
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'do-01-cu-phap-co-ban',
        tieuDe: 'DEC2OCT và OCT2DEC — hệ bát phân',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'DEC2OCT(số, [độ_dài])  /  OCT2DEC(số_bát_phân)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'do-02-y-nghia-chmod',
        tieuDe: 'Quyền file Unix 755 — mỗi chữ số là 3 bit quyền',
        cot: [{ rong: 90 }, { rong: 130 }],
        hang: [
            [dauXanh('Chữ số'), dauXanh('Ý nghĩa')],
            ['7', 'rwx (đọc-ghi-thực thi)'],
            ['5', 'r-x (đọc-thực thi)'],
            ['5', 'r-x (đọc-thực thi)'],
        ],
    },
    {
        ten: 'do-03-dec2oct-co-ban',
        tieuDe: 'Tái tạo lại chuỗi bát phân từ số thập phân',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DEC2OCT(493)', mono: true }, { v: '755', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'do-04-so-am-bu-hai',
        tieuDe: 'Số âm dùng bù hai trên 10 chữ số bát phân',
        cot: [{ rong: 150 }, { rong: 140 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DEC2OCT(-9)', mono: true }, { v: '7777777767', nen: 'xanh' }],
        ],
    },
    {
        ten: 'do-05-gioi-han-pham-vi',
        tieuDe: 'Phạm vi hợp lệ rộng hơn nhị phân, hẹp hơn hex',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DEC2OCT(600000000)', mono: true }, { v: '#NUM!', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-dec2oct-oct2dec', anh: bai }];

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
