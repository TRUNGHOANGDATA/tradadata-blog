// Ảnh minh hoạ cho bài 3 — NPV & IRR
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });
const dauVang = t => ({ v: t, dam: true, nen: 'vang' });

const COT_DL = [{ rong: 60 }, { rong: 170 }];

const bai = [
    {
        ten: 'npv-01-du-lieu',
        tieuDe: 'Dự án: đầu tư 200 triệu, thu về trong 4 năm tiếp theo',
        cot: COT_DL,
        hang: [
            [dauXanh('Năm'), dauXanh('Dòng tiền')],
            ['0', { v: '-200.000.000', nen: 'do' }],
            ['1', '60.000.000'],
            ['2', '70.000.000'],
            ['3', '80.000.000'],
            ['4', '90.000.000'],
        ],
    },
    {
        ten: 'npv-02-cong-thuc-dung',
        tieuDe: 'Cách viết đúng: vốn đầu tư cộng ở NGOÀI hàm NPV',
        congThuc: { o: 'B7', ct: '=-200000000+NPV(10%,60000000,70000000,80000000,90000000)' },
        cot: [{ rong: 260 }, { rong: 170 }],
        hang: [
            [dauXanh('Thành phần'), dauXanh('Giá trị')],
            ['Vốn đầu tư (kỳ 0, cộng ngoài)', '-200.000.000'],
            ['NPV của 4 dòng tiền (kỳ 1-4)', '~233.970.000'],
            ['NPV toàn dự án', { v: '~34.000.000', nen: 'xanh' }],
        ],
        chon: 'B7',
    },
    {
        ten: 'npv-03-loi-von-dau-tu',
        tieuDe: 'Cách viết SAI: nhét vốn đầu tư vào trong NPV',
        cot: [{ rong: 310 }, { rong: 130 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Đúng/Sai')],
            [{ v: '=-200000000+NPV(10%,60tr,70tr,80tr,90tr)', mono: true }, { v: 'ĐÚNG', nen: 'xanh' }],
            [{ v: '=NPV(10%,-200tr,60tr,70tr,80tr,90tr)', mono: true }, { v: 'SAI', nen: 'do' }],
        ],
    },
    {
        ten: 'npv-04-irr',
        tieuDe: 'IRR nhận vốn đầu tư NGAY TRONG dãy giá trị — ngược với NPV',
        congThuc: { o: 'B7', ct: '=IRR(A2:A6)' },
        cot: COT_DL,
        hang: [
            [dauXanh('Năm'), dauXanh('Dòng tiền')],
            ['0', '-200.000.000'],
            ['1', '60.000.000'],
            ['2', '70.000.000'],
            ['3', '80.000.000'],
            ['4', '90.000.000'],
            ['', { v: 'IRR ≈ 17%', nen: 'xanh' }],
        ],
        chon: 'B7',
    },
];

const LO = [{ slug: 'ham-npv-irr', anh: bai }];

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
