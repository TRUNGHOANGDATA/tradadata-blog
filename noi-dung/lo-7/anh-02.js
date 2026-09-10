// Ảnh minh hoạ cho bài 2 — ROWS, COLUMNS
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'rc2-01-phan-biet-row-rows',
        tieuDe: 'ROW lấy vị trí ô đầu — ROWS đếm số lượng cả vùng',
        cot: [{ rong: 220 }, { rong: 130 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ROW(A2:A10)', mono: true }, { v: '2 (vị trí)', nen: 'do' }],
            [{ v: '=ROWS(A2:A10)', mono: true }, { v: '9 (số lượng)', nen: 'xanh' }],
        ],
    },
    {
        ten: 'rc2-02-columns',
        tieuDe: 'COLUMNS — đếm số cột trong vùng A2:D2',
        congThuc: { o: 'F1', ct: '=COLUMNS(A2:D2)' },
        cot: [{ rong: 60 }, { rong: 60 }, { rong: 60 }, { rong: 60 }, { rong: 30 }, { rong: 100 }],
        hang: [
            ['', '', '', '', '', dauXanh('COLUMNS')],
            ['A', 'B', 'C', 'D', '', { v: '4', nen: 'xanh' }],
        ],
        chon: 'F1',
    },
    {
        ten: 'rc2-03-du-lieu-bang',
        tieuDe: 'Bảng dữ liệu 5 cột, cần đếm tự động',
        cot: [{ rong: 90 }, { rong: 90 }, { rong: 90 }, { rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('T1'), dauXanh('T2'), dauXanh('T3'), dauXanh('T4'), dauXanh('T5')],
        ],
    },
    {
        ten: 'rc2-04-dem-cot',
        tieuDe: 'COLUMNS(B2:F2) — tự tăng khi thêm cột mới',
        congThuc: { o: 'H1', ct: '=COLUMNS(B2:F2)' },
        cot: [{ rong: 40 }, { rong: 40 }, { rong: 40 }, { rong: 40 }, { rong: 40 }, { rong: 30 }, { rong: 100 }],
        hang: [
            ['', '', '', '', '', '', dauXanh('Số cột')],
            ['', '', '', '', '', '', { v: '5', nen: 'xanh' }],
        ],
        chon: 'H1',
    },
    {
        ten: 'rc2-05-kiem-tra-kich-thuoc',
        tieuDe: 'Dùng ROWS kiểm tra hai vùng lệch kích thước trước khi ghép',
        congThuc: { o: 'D1', ct: '=IF(ROWS(A2:A9)=ROWS(B2:B10),"Cùng kích thước","LỆCH")' },
        cot: [{ rong: 100 }, { rong: 100 }, { rong: 30 }, { rong: 150 }],
        hang: [
            [dauXanh('Vùng A (8 hàng)'), dauXanh('Vùng B (9 hàng)'), '', dauXanh('Kiểm tra')],
            ['', '', '', { v: 'LỆCH — kiểm tra lại vùng', nen: 'do' }],
        ],
        chon: 'D1',
    },
    {
        ten: 'rc2-06-dem-dong-table',
        tieuDe: 'ROWS(Bang1) — tự tăng theo số dòng thật của Table',
        congThuc: { o: 'B1', ct: '=ROWS(Bang1)' },
        cot: [{ rong: 100 }, { rong: 100 }],
        hang: [
            [dauXanh('Tên vùng'), dauXanh('Số dòng')],
            ['Bang1', { v: '124', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
];

const LO = [{ slug: 'ham-rows-columns', anh: bai }];

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
