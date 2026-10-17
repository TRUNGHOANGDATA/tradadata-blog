// Ảnh minh hoạ cho bài 8 — Tóm tắt dữ liệu bằng hàm thống kê
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'tk-01-average-median',
        tieuDe: 'Trung bình cao hơn trung vị = có đơn rất lớn kéo lệch',
        cot: [{ rong: 130 }, { rong: 120 }],
        hang: [
            [dauXanh('Chỉ số'), dauXanh('Giá trị')],
            ['AVERAGE', '71862500'],
            ['MEDIAN', '55200000'],
            [{ v: 'Lệch → có đơn lớn', dam: true, nen: 'vang' }, { v: 'nêu cả hai', nen: 'vang' }],
        ],
    },
    {
        ten: 'tk-02-count-counta',
        tieuDe: 'COUNT lệch COUNTA = còn ô số dạng văn bản',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Hàm'), dauXanh('Kết quả')],
            ['COUNT', '34'],
            ['COUNTA', '35'],
            ['COUNTBLANK', '5'],
            [{ v: 'Lệch 1 ô', dam: true, nen: 'do' }, { v: '→ sửa', nen: 'do' }],
        ],
    },
    {
        ten: 'tk-03-min-max',
        tieuDe: 'MIN, MAX: soi khoảng và số bất thường',
        cot: [{ rong: 100 }, { rong: 130 }],
        hang: [
            [dauXanh('Hàm'), dauXanh('Giá trị')],
            ['MIN', '1300000'],
            ['MAX', '222000000'],
            [{ v: 'Chênh ~171 lần', dam: true }, { v: 'xem trước khi tin TB', nen: 'vang' }],
        ],
    },
    {
        ten: 'tk-04-countif-sumif',
        tieuDe: 'Cắt theo nhóm bằng COUNTIF, SUMIF',
        cot: [{ rong: 300 }],
        hang: [
            [{ v: '=COUNTIF(BanHang[Khu vực],"Miền Nam") → 12', mono: true }],
            [{ v: '=SUMIF(...,"Laptop",...) → 1831500000', mono: true }],
        ],
    },
    {
        ten: 'tk-05-subtotal',
        tieuDe: 'SUBTOTAL chỉ tính dòng đang hiển thị sau khi lọc',
        congThuc: { o: 'K1', ct: '=SUBTOTAL(109,BanHang[Doanh thu])' },
        cot: [{ rong: 150 }, { rong: 130 }],
        hang: [
            [dauXanh('Bộ lọc'), dauXanh('SUBTOTAL')],
            ['Không lọc', '2874500000'],
            [{ v: 'Lọc Miền Bắc', nen: 'xanh' }, { v: '866650000', nen: 'xanh' }],
        ],
    },
];

const LO = [{ slug: 'tom-tat-thong-ke', anh: bai }];

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
