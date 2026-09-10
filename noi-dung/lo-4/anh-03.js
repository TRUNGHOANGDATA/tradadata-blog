// Ảnh minh hoạ cho bài 3 — PROPER, UPPER, LOWER
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const COT_TEN = [{ rong: 220 }, { rong: 30 }, { rong: 200 }];

const bai = [
    {
        ten: 'pl-01-du-lieu',
        tieuDe: 'Tên khách hàng nhập từ nhiều nguồn — không đồng nhất hoa/thường',
        cot: [{ rong: 250 }],
        hang: [
            [dauXanh('Tên khách hàng (gốc)')],
            ['NGUYỄN VĂN A'],
            ['trần thị b'],
            ['lê VĂN c'],
            ['Phạm Thị D'],
        ],
    },
    {
        ten: 'pl-02-proper',
        tieuDe: 'PROPER — viết hoa chữ cái đầu mỗi từ',
        congThuc: { o: 'C2', ct: '=PROPER(A2)' },
        cot: COT_TEN,
        hang: [
            [dauXanh('Gốc'), '', dauXanh('PROPER(...)')],
            ['NGUYỄN VĂN A', '', { v: 'Nguyễn Văn A', nen: 'xanh' }],
            ['trần thị b', '', 'Trần Thị B'],
            ['lê VĂN c', '', 'Lê Văn C'],
        ],
        chon: 'C2',
    },
    {
        ten: 'pl-03-upper',
        tieuDe: 'UPPER — viết hoa toàn bộ, dùng cho mã dữ liệu',
        congThuc: { o: 'C2', ct: '=UPPER(A2)' },
        cot: [{ rong: 130 }, { rong: 30 }, { rong: 130 }],
        hang: [
            [dauXanh('Mã hàng'), '', dauXanh('UPPER(...)')],
            ['vt001', '', { v: 'VT001', nen: 'xanh' }],
            ['Vt002', '', 'VT002'],
        ],
        chon: 'C2',
    },
    {
        ten: 'pl-04-lower',
        tieuDe: 'LOWER — viết thường toàn bộ, dùng cho email',
        congThuc: { o: 'C2', ct: '=LOWER(A2)' },
        cot: [{ rong: 220 }, { rong: 30 }, { rong: 220 }],
        hang: [
            [dauXanh('Email (gốc)'), '', dauXanh('LOWER(...)')],
            ['NguyenVanA@GMAIL.com', '', { v: 'nguyenvana@gmail.com', nen: 'xanh' }],
        ],
        chon: 'C2',
    },
    {
        ten: 'pl-05-vlookup-khong-phan-biet',
        tieuDe: 'VLOOKUP không phân biệt hoa/thường khi dò tìm',
        congThuc: { o: 'D2', ct: '=VLOOKUP("nguyễn văn a", A2:B4, 2, 0)' },
        cot: [{ rong: 180 }, { rong: 130 }, { rong: 30 }, { rong: 160 }],
        hang: [
            [dauXanh('Tên (viết hoa)'), dauXanh('Điểm'), '', dauXanh('Kết quả dò')],
            ['NGUYỄN VĂN A', '9', '', { v: 'Vẫn tìm thấy: 9', nen: 'xanh' }],
            ['Trần Thị B', '8', '', ''],
            ['Lê Văn C', '7', '', ''],
        ],
        chon: 'D2',
    },
    {
        ten: 'pl-06-ket-hop-trim',
        tieuDe: 'Kết hợp PROPER và TRIM để dọn dữ liệu triệt để',
        congThuc: { o: 'B2', ct: '=PROPER(TRIM(A2))' },
        cot: [{ rong: 220 }, { rong: 200 }],
        hang: [
            [dauXanh('Gốc (có khoảng trắng thừa)'), dauXanh('PROPER(TRIM(...))')],
            ['  NGUYỄN  VĂN A  ', { v: 'Nguyễn Văn A', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
];

const LO = [{ slug: 'ham-proper-upper-lower', anh: bai }];

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
