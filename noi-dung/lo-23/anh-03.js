// Ảnh minh hoạ cho bài 3 — TRIMMEAN
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'tm-01-cu-phap-co-ban',
        tieuDe: 'TRIMMEAN cắt bớt hai đầu trước khi tính trung bình',
        cot: [{ rong: 240 }],
        hang: [
            [{ v: 'TRIMMEAN(mảng, tỷ_lệ_cắt)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'tm-02-ung-dung-cham-diem',
        tieuDe: 'Điểm 10 giám khảo, một điểm lệch hẳn (2)',
        cot: [{ rong: 150 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=AVERAGE(A2:A11)', mono: true }, { v: '7,50', nen: 'do' }],
            [{ v: '=TRIMMEAN(A2:A11,0.2)', mono: true }, { v: '7,875', nen: 'xanh' }],
        ],
    },
    {
        ten: 'tm-03-lam-tron-xuong-so-chan',
        tieuDe: 'Tỷ lệ cắt 0.15 trên 10 giá trị — không cắt được gì',
        cot: [{ rong: 200 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=TRIMMEAN(A2:A11,0.15)', mono: true }, { v: '= AVERAGE', nen: 'vang' }],
        ],
    },
    {
        ten: 'tm-04-du-lieu-it-khong-cat-duoc',
        tieuDe: 'Dữ liệu ít + tỷ lệ cắt thấp = không cắt được gì',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: 'Số ô cắt luôn làm tròn XUỐNG số chẵn gần nhất', nen: 'vang', canLe: 'giua' }],
        ],
    },
    {
        ten: 'tm-05-so-sanh-median',
        tieuDe: 'MEDIAN bỏ hết dữ liệu ngoài giá trị giữa',
        cot: [{ rong: 130 }, { rong: 130 }],
        hang: [
            [dauXanh('MEDIAN'), dauXanh('TRIMMEAN')],
            ['Chỉ 1 giá trị giữa', { v: 'Dùng phần lớn dữ liệu', nen: 'xanh' }],
        ],
    },
];

const LO = [{ slug: 'ham-trimmean', anh: bai }];

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
