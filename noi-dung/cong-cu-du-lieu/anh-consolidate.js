// Ảnh minh hoạ cho bài Consolidate
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'cs-01-hai-cach-gop',
        tieuDe: 'By Position (theo ô) — By Category (theo nhãn)',
        cot: [{ rong: 110 }, { rong: 220 }],
        hang: [
            [dauXanh('Cách gộp'), dauXanh('Yêu cầu')],
            ['By position', { v: 'Mọi sheet PHẢI giống hệt cấu trúc', mau: '#c0392b' }],
            [{ v: 'By category', nen: 'xanh' }, { v: 'Tự khớp theo nhãn, thứ tự khác nhau OK', nen: 'xanh', dam: true }],
        ],
    },
    {
        ten: 'cs-02-theo-nhan',
        tieuDe: 'Thứ tự khác nhau, Consolidate vẫn khớp đúng nhãn',
        cot: [{ rong: 90 }, { rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Tháng 1'), dauXanh('Tháng 2'), dauXanh('Tổng')],
            ['Laptop: 10tr', 'Bàn phím: 2tr', ''],
            ['Chuột: 1tr', 'Laptop: 12tr', { v: 'Laptop: 22tr', nen: 'xanh', dam: true }],
            ['Bàn phím: 3tr', 'Chuột: 1tr', ''],
        ],
    },
    {
        ten: 'cs-03-lien-ket-nguon',
        tieuDe: '"Create links to source data" — tĩnh hay tự cập nhật?',
        cot: [{ rong: 220 }, { rong: 130 }],
        hang: [
            [dauXanh('Tuỳ chọn'), dauXanh('Sửa nguồn thì sao?')],
            [{ v: 'Không tick', canLe: 'trai', nen: 'do' }, { v: 'Không đổi (tĩnh)', mau: '#c0392b' }],
            [{ v: 'Create links to source data', canLe: 'trai', nen: 'xanh' }, { v: 'Tự cập nhật', dam: true }],
        ],
    },
];

const LO = [{ slug: 'consolidate', anh: bai }];

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
