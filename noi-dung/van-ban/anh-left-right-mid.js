// Ảnh minh hoạ cho bài LEFT/RIGHT/MID
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'lrm-01-ba-huong',
        tieuDe: 'LEFT lấy từ đầu · RIGHT lấy từ cuối · MID lấy từ giữa',
        cot: [{ rong: 200 }, { rong: 130 }, { rong: 80 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Trên "DH-2025-018"'), dauXanh('Kết quả')],
            ['=LEFT(A2,2)', 'Hai ký tự đầu', { v: 'DH', nen: 'xanh', dam: true }],
            ['=RIGHT(A2,3)', 'Ba ký tự cuối', { v: '018', nen: 'xanh', dam: true }],
            ['=MID(A2,4,4)', 'Từ vị trí 4, lấy 4', { v: '2025', nen: 'vang', dam: true }],
        ],
    },
    {
        ten: 'lrm-02-cat-dong',
        tieuDe: 'MID/LEFT + FIND: cắt động theo dấu phân cách',
        congThuc: { o: 'B2', ct: '=LEFT(A2,FIND("-",A2)-1)' },
        cot: [{ rong: 210 }, { rong: 130 }],
        hang: [
            [dauXanh('Ô nguồn'), dauXanh('Lấy phần trước "-"')],
            ['Hà Nội - 0912345678', { v: 'Hà Nội', nen: 'xanh', dam: true }],
            ['TP Hồ Chí Minh - 0987', { v: 'TP Hồ Chí Minh', nen: 'xanh', dam: true }],
        ],
        chon: 'B2',
    },
    {
        ten: 'lrm-03-la-van-ban',
        tieuDe: 'Số cắt ra là VĂN BẢN (căn trái) — bọc VALUE để thành số',
        cot: [{ rong: 170 }, { rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả'), dauXanh('Kiểu')],
            ['=MID(A2,4,4)', { v: '2025', canLe: 'trai', nen: 'do' }, { v: 'Văn bản', mau: '#c0392b' }],
            ['=VALUE(MID(A2,4,4))', { v: '2025', canLe: 'phai', nen: 'xanh' }, { v: 'Số', dam: true }],
        ],
    },
];

const LO = [{ slug: 'left-right-mid', anh: bai }];

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
