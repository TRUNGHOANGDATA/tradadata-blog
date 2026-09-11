// Ảnh minh hoạ cho bài 4 — DEVSQ
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'dv-01-cu-phap-co-ban',
        tieuDe: 'DEVSQ tính tổng bình phương độ lệch',
        cot: [{ rong: 240 }],
        hang: [
            [{ v: 'DEVSQ = Σ(x − trung_bình)²', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'dv-02-quan-he-devsq-var',
        tieuDe: 'DEVSQ chính là tử số của VAR.P và VAR.S',
        cot: [{ rong: 150 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DEVSQ(80,85,90,95,100)', mono: true }, { v: '250', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=VAR.P(...)  = 250/5', mono: true }, { v: '50', canLe: 'giua' }],
            [{ v: '=VAR.S(...)  = 250/4', mono: true }, { v: '62,5', canLe: 'giua' }],
        ],
    },
    {
        ten: 'dv-03-so-sanh-nhom-cung-co-mau',
        tieuDe: 'So sánh trực tiếp độ phân tán 2 nhóm cùng cỡ',
        cot: [{ rong: 150 }, { rong: 100 }],
        hang: [
            [dauXanh('Nhóm'), dauXanh('DEVSQ')],
            ['Nhóm A', 'Cao hơn'],
            ['Nhóm B', 'Thấp hơn'],
        ],
    },
    {
        ten: 'dv-04-khong-phan-biet-tong-the-mau',
        tieuDe: 'DEVSQ không cần chọn tổng thể hay mẫu',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: 'Chưa chia cho n hay (n-1) — chưa cần phân biệt', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'dv-05-gia-tri-khong-am',
        tieuDe: 'Mọi giá trị bằng nhau — DEVSQ bằng 0',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DEVSQ(5,5,5,5)', mono: true }, { v: '0', nen: 'xanh', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-devsq', anh: bai }];

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
