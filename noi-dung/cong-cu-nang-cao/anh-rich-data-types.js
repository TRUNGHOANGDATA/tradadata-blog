// Ảnh minh hoạ cho bài Rich Data Types
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'rd-01-chuyen-doi',
        tieuDe: 'Data → Stock: văn bản thường trở thành Rich Data Type',
        cot: [{ rong: 100 }, { rong: 100 }],
        hang: [
            [dauXanh('Trước'), dauXanh('Sau')],
            [{ v: 'MSFT (văn bản)', canLe: 'trai' }, { v: 'MSFT 🔗 (Data Type)', canLe: 'trai', nen: 'xanh', dam: true }],
        ],
    },
    {
        ten: 'rd-02-xem-the',
        tieuDe: 'Bấm vào thẻ — xem hàng loạt thuộc tính đi kèm',
        cot: [{ rong: 100 }, { rong: 110 }],
        hang: [
            [dauXanh('Thuộc tính'), dauXanh('Giá trị')],
            ['Price', { v: '415.20', nen: 'xanh' }],
            ['Market Cap', '3.08T'],
            ['Volume', '18.500.000'],
        ],
    },
    {
        ten: 'rd-03-trich-thuoc-tinh',
        tieuDe: 'Gõ =A2. để Excel gợi ý danh sách thuộc tính',
        congThuc: { o: 'B2', ct: '=A2.Price' },
        cot: [{ rong: 80 }, { rong: 100 }],
        hang: [
            [dauXanh('Mã CP'), dauXanh('Giá')],
            [{ v: 'MSFT', nen: 'xanh' }, { v: '415.20', nen: 'vang', dam: true }],
        ],
        chon: 'B2',
    },
    {
        ten: 'rd-04-gioi-han',
        tieuDe: 'Hai giới hạn cần nhớ',
        cot: [{ rong: 400 }],
        hang: [
            [{ v: 'Cần Internet để tra cứu và Refresh', canLe: 'trai', nen: 'do' }],
            [{ v: 'Cổ phiếu HOSE/HNX thường KHÔNG nhận diện được', canLe: 'trai', mau: '#c0392b', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'rich-data-types', anh: bai }];

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
