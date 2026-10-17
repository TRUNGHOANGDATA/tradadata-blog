// Ảnh minh hoạ cho bài Remove Duplicates
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'rd-01-hop-thoai',
        tieuDe: 'Hộp thoại Remove Duplicates — chỉ cột được tick mới xét trùng',
        cot: [{ rong: 60 }, { rong: 160 }],
        hang: [
            [dauXanh('Tick?'), dauXanh('Cột')],
            [{ v: '✓', nen: 'xanh', dam: true, canLe: 'giua' }, 'Email'],
            [{ v: '', nen: 'do' }, 'Tên'],
            [{ v: '', nen: 'do' }, 'Số điện thoại'],
        ],
    },
    {
        ten: 'rd-02-tick-cot-nao',
        tieuDe: 'Chỉ tick Email — 2 dòng có tên khác nhau vẫn bị xoá',
        cot: [{ rong: 130 }, { rong: 160 }],
        hang: [
            [dauXanh('Tên'), dauXanh('Email')],
            ['Nguyễn Văn An', { v: 'an@gmail.com', nen: 'xanh' }],
            [{ v: 'An Nguyễn', nen: 'do' }, { v: 'an@gmail.com', nen: 'do' }],
            [{ v: 'A. Nguyễn', nen: 'do' }, { v: 'an@gmail.com', nen: 'do' }],
        ],
    },
    {
        ten: 'rd-03-dem-truoc-khi-xoa',
        tieuDe: 'Đếm trước bằng COUNTIF — biết rõ cái gì sẽ mất trước khi xoá',
        congThuc: { o: 'B2', ct: '=COUNTIF(A:A,A2)' },
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Email'), dauXanh('Số lần lặp')],
            ['an@gmail.com', { v: '3', nen: 'do', dam: true }],
            ['binh@gmail.com', { v: '1', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
];

const LO = [{ slug: 'remove-duplicates', anh: bai }];

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
