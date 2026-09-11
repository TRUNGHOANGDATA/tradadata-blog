// Ảnh minh hoạ cho bài 1 — AVERAGEA
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'ag-01-cu-phap-co-ban',
        tieuDe: 'AVERAGEA quy đổi TRUE=1, FALSE=0, văn bản=0',
        cot: [{ rong: 100 }, { rong: 90 }],
        hang: [
            [dauXanh('Loại ô'), dauXanh('Quy đổi')],
            ['TRUE', { v: '1', nen: 'xanh', canLe: 'giua' }],
            ['FALSE / văn bản', { v: '0', canLe: 'giua' }],
        ],
    },
    {
        ten: 'ag-02-so-sanh-average',
        tieuDe: 'Một ô "Chưa chấm" kéo tụt trung bình rất mạnh',
        cot: [{ rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Điểm'), dauXanh('')],
            ['8', ''],
            ['9', ''],
            [{ v: 'Chưa chấm', canLe: 'trai' }, ''],
            ['7', ''],
        ],
    },
    {
        ten: 'ag-03-ung-dung-checkbox',
        tieuDe: 'Checkbox TRUE cần đóng góp vào trung bình',
        cot: [{ rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Tiến độ'), dauXanh('Quy đổi')],
            ['75%', '0,75'],
            [{ v: 'TRUE (checkbox)', canLe: 'trai' }, { v: '1', nen: 'xanh' }],
        ],
    },
    {
        ten: 'ag-04-o-trong-van-bo-qua',
        tieuDe: 'Ô trống vẫn bị bỏ qua như AVERAGE',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=AVERAGEA(8,9,,7)', mono: true }, { v: '8', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'ag-05-van-ban-giong-so',
        tieuDe: 'Văn bản trông giống số vẫn tính là 0',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=AVERAGEA(8,"9",7)', mono: true }, { v: '5', nen: 'do', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-averagea', anh: bai }];

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
