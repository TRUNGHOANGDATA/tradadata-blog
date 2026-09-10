// Ảnh minh hoạ cho bài 5 — ISLOGICAL
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'il-01-hai-loai-true',
        tieuDe: 'TRUE thật và chữ "TRUE" hiển thị giống hệt nhau',
        cot: [{ rong: 180 }, { rong: 130 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Hiển thị')],
            [{ v: '=TRUE', mono: true }, { v: 'TRUE', canLe: 'giua' }],
            [{ v: '="TRUE"', mono: true }, { v: 'TRUE', canLe: 'trai' }],
        ],
    },
    {
        ten: 'il-02-islogical-hai-truong-hop',
        tieuDe: 'ISLOGICAL phân biệt rạch ròi luận lý thật và chữ',
        cot: [{ rong: 200 }, { rong: 130 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ISLOGICAL(TRUE)', mono: true }, { v: 'TRUE', nen: 'xanh' }],
            [{ v: '=ISLOGICAL("TRUE")', mono: true }, { v: 'FALSE', nen: 'do' }],
        ],
    },
    {
        ten: 'il-03-du-lieu-checkbox',
        tieuDe: 'Cột liên kết checkbox — cần đúng luận lý thật',
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Việc cần làm'), dauXanh('Hoàn thành')],
            ['Gửi báo cáo', { v: 'TRUE', canLe: 'giua' }],
            ['Duyệt ngân sách', { v: 'TRUE', canLe: 'trai' }],
        ],
    },
    {
        ten: 'il-04-kiem-tra-checkbox',
        tieuDe: 'Rà soát cột checkbox — phát hiện dòng lẫn chữ thay vì luận lý',
        congThuc: { o: 'C3', ct: '=IF(ISLOGICAL(B3),"Dữ liệu hợp lệ","CẢNH BÁO — chỉ là chữ")' },
        cot: [{ rong: 130 }, { rong: 90 }, { rong: 200 }],
        hang: [
            [dauXanh('Việc cần làm'), dauXanh('Hoàn thành'), dauXanh('Kiểm tra')],
            ['Gửi báo cáo', 'TRUE', { v: 'Dữ liệu hợp lệ', nen: 'xanh' }],
            ['Duyệt ngân sách', 'TRUE', { v: 'CẢNH BÁO — chỉ là chữ', nen: 'do' }],
        ],
        chon: 'C3',
    },
    {
        ten: 'il-05-anh-huong-tinh-toan',
        tieuDe: 'TRUE thật cộng được, chữ "TRUE" thì báo lỗi',
        cot: [{ rong: 180 }, { rong: 130 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=TRUE + 5', mono: true }, { v: '6', nen: 'xanh' }],
            [{ v: '="TRUE" + 5', mono: true }, { v: '#VALUE!', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-islogical', anh: bai }];

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
