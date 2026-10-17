// Ảnh minh hoạ cho bài Fill Handle
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'fh-01-keo-mot-o',
        tieuDe: 'Kéo MỘT ô — mặc định sao chép y nguyên',
        cot: [{ rong: 90 }],
        hang: [
            [dauXanh('Cột A')],
            [{ v: '5', nen: 'xanh', dam: true }],
            [{ v: '5', nen: 'vang' }],
            [{ v: '5', nen: 'vang' }],
        ],
        chon: 'A2',
    },
    {
        ten: 'fh-02-hai-o-tang-dan',
        tieuDe: 'Chọn HAI ô — Excel tự đoán bước nhảy',
        cot: [{ rong: 90 }],
        hang: [
            [dauXanh('Cột A')],
            [{ v: '1', nen: 'xanh', dam: true }],
            [{ v: '3', nen: 'xanh', dam: true }],
            [{ v: '5', nen: 'vang' }],
            [{ v: '7', nen: 'vang' }],
        ],
    },
    {
        ten: 'fh-03-double-click',
        tieuDe: 'Double-click núm điền — tự điền hết theo cột bên cạnh',
        cot: [{ rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Tên'), dauXanh('STT')],
            ['An', { v: '1', nen: 'xanh' }],
            ['Bình', { v: '2', nen: 'vang' }],
            ['Chi', { v: '3', nen: 'vang' }],
            ['Dũng', { v: '4', nen: 'vang' }],
        ],
    },
    {
        ten: 'fh-04-auto-fill-options',
        tieuDe: 'Auto Fill Options — chọn đúng kiểu điền sau khi kéo',
        cot: [{ rong: 190 }, { rong: 170 }],
        hang: [
            [dauXanh('Tuỳ chọn'), dauXanh('Hiệu ứng')],
            ['Copy Cells', 'Y nguyên, không tăng'],
            [{ v: 'Fill Series', nen: 'xanh' }, { v: 'Ép tăng dần', dam: true }],
            ['Fill Without Formatting', 'Giữ định dạng ô đích'],
        ],
    },
];

const LO = [{ slug: 'fill-handle', anh: bai }];

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
