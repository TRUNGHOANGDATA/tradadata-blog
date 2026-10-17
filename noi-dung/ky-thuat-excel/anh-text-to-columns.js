// Ảnh minh hoạ cho bài Text to Columns
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'tc-01-hai-che-do',
        tieuDe: 'Delimited (theo dấu) hay Fixed width (theo độ rộng)?',
        cot: [{ rong: 110 }, { rong: 300 }],
        hang: [
            [dauXanh('Chế độ'), dauXanh('Dùng khi')],
            [{ v: 'Delimited', nen: 'xanh' }, 'Có dấu phân cách rõ ràng: , ; tab'],
            [{ v: 'Fixed width', nen: 'vang' }, 'Mỗi phần luôn đúng N ký tự, không dấu ngăn'],
        ],
    },
    {
        ten: 'tc-02-chon-dau-phan-cach',
        tieuDe: 'Trước và sau khi tách theo dấu phẩy',
        cot: [{ rong: 220 }],
        hang: [
            [dauXanh('Trước: 1 cột')],
            [{ v: 'SP01,Laptop,15000000', canLe: 'trai' }],
        ],
    },
    {
        ten: 'tc-03-meo-ep-so',
        tieuDe: 'Mẹo: Delimited + Finish ngay — ép văn bản về số thật',
        cot: [{ rong: 130 }, { rong: 130 }],
        hang: [
            [dauXanh('Trước'), dauXanh('Sau Finish')],
            [{ v: '123', canLe: 'trai', nen: 'do' }, { v: '123', canLe: 'phai', nen: 'xanh', dam: true }],
            [{ v: 'Văn bản', mau: '#c0392b' }, { v: 'Số thật', dam: true }],
        ],
    },
];

const LO = [{ slug: 'text-to-columns', anh: bai }];

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
