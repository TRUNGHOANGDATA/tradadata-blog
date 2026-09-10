// Ảnh minh hoạ cho bài 3 — FIND, SEARCH
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'fs-01-find-co-ban',
        tieuDe: 'FIND — tìm vị trí ký tự @ trong email',
        congThuc: { o: 'B2', ct: '=FIND("@", A2)' },
        cot: [{ rong: 220 }, { rong: 110 }],
        hang: [
            [dauXanh('Email'), dauXanh('Vị trí @')],
            ['nguyenvana@gmail.com', { v: '11', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'fs-02-cat-ten-mien',
        tieuDe: 'Ghép RIGHT + FIND để cắt tên miền ra khỏi email',
        congThuc: { o: 'B2', ct: '=RIGHT(A2, LEN(A2) - FIND("@", A2))' },
        cot: [{ rong: 220 }, { rong: 150 }],
        hang: [
            [dauXanh('Email'), dauXanh('Tên miền')],
            ['nguyenvana@gmail.com', { v: 'gmail.com', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'fs-03-phan-biet-hoa-thuong',
        tieuDe: 'FIND phân biệt hoa/thường — SEARCH thì không',
        cot: [{ rong: 220 }, { rong: 170 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=FIND("a", "Nguyễn Văn A")', mono: true }, { v: '#VALUE!', nen: 'do' }],
            [{ v: '=SEARCH("a", "Nguyễn Văn A")', mono: true }, { v: 'Tìm thấy vị trí', nen: 'xanh' }],
        ],
    },
    {
        ten: 'fs-04-ky-tu-dai-dien',
        tieuDe: 'SEARCH hỗ trợ ký tự đại diện ? — FIND thì không',
        congThuc: { o: 'B1', ct: '=SEARCH("v?n", "Nguyễn Văn A")' },
        cot: [{ rong: 260 }, { rong: 150 }],
        hang: [
            [{ v: '=SEARCH("v?n", "Nguyễn Văn A")', mono: true }, { v: 'Tìm thấy "văn"', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'fs-05-xu-ly-khong-tim-thay',
        tieuDe: 'Bọc IFERROR khi không chắc ký tự cần tìm có tồn tại',
        congThuc: { o: 'B2', ct: '=IFERROR(FIND("@", A2), 0)' },
        cot: [{ rong: 180 }, { rong: 130 }],
        hang: [
            [dauXanh('Dữ liệu'), dauXanh('Kết quả')],
            ['nguyenvana(thiếu @)', { v: '0', nen: 'do' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'fs-06-tim-lan-thu-hai',
        tieuDe: 'Tìm dấu gạch ngang thứ HAI trong mã sản phẩm',
        congThuc: { o: 'B1', ct: '=FIND("-", "SP-2026-001", FIND("-","SP-2026-001")+1)' },
        cot: [{ rong: 280 }, { rong: 100 }],
        hang: [
            [{ v: '"SP-2026-001"', canLe: 'giua' }, { v: '8', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
];

const LO = [{ slug: 'ham-find-search', anh: bai }];

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
