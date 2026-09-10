// Ảnh minh hoạ cho bài 1 — EXACT
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'ex-01-dau-bang-khong-phan-biet',
        tieuDe: 'Dấu = không phân biệt chữ hoa/thường khi so chuỗi',
        congThuc: { o: 'B1', ct: '="Excel" = "excel"' },
        cot: [{ rong: 140 }, { rong: 100 }],
        hang: [
            [{ v: '"Excel" = "excel"', canLe: 'giua' }, { v: 'TRUE', nen: 'do' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'ex-02-exact-phan-biet',
        tieuDe: 'EXACT — so khớp tuyệt đối, tính cả kiểu chữ',
        congThuc: { o: 'B1', ct: '=EXACT("Excel", "excel")' },
        cot: [{ rong: 180 }, { rong: 100 }],
        hang: [
            [{ v: '=EXACT("Excel","excel")', mono: true }, { v: 'FALSE', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'ex-03-du-lieu-ma-hang',
        tieuDe: 'Hai cột mã hàng cần so khớp phân biệt hoa/thường',
        cot: [{ rong: 130 }, { rong: 130 }],
        hang: [
            [dauXanh('Mã hệ thống A'), dauXanh('Mã hệ thống B')],
            ['VT001', 'vt001'],
        ],
    },
    {
        ten: 'ex-04-kiem-tra-ma-hang',
        tieuDe: 'IF + EXACT phát hiện đúng khác biệt hoa/thường',
        congThuc: { o: 'C2', ct: '=IF(EXACT(A2,B2),"Khớp chính xác","Khác kiểu chữ")' },
        cot: [{ rong: 130 }, { rong: 130 }, { rong: 160 }],
        hang: [
            [dauXanh('Mã A'), dauXanh('Mã B'), dauXanh('Kiểm tra')],
            ['VT001', 'vt001', { v: 'Khác kiểu chữ', nen: 'do' }],
        ],
        chon: 'C2',
    },
    {
        ten: 'ex-05-do-tim-phan-biet-hoa-thuong',
        tieuDe: 'Dò tìm phân biệt hoa/thường bằng EXACT + MATCH + INDEX',
        congThuc: { o: 'D2', ct: '=INDEX(C2:C6,MATCH(TRUE,EXACT(A2:A6,"VT001"),0))' },
        cot: [{ rong: 90 }, { rong: 90 }, { rong: 110 }, { rong: 130 }],
        hang: [
            [dauXanh('Mã'), '', dauXanh('Đơn giá'), dauXanh('Kết quả')],
            ['VT001', '', '2.400.000', { v: '2.400.000', nen: 'xanh' }],
            ['vt001', '', '890.000', ''],
        ],
        chon: 'D2',
    },
    {
        ten: 'ex-06-khoang-trang',
        tieuDe: 'EXACT phát hiện cả khoảng trắng thừa',
        congThuc: { o: 'B1', ct: '=EXACT("Excel", "Excel ")' },
        cot: [{ rong: 180 }, { rong: 100 }],
        hang: [
            [{ v: '=EXACT("Excel","Excel ")', mono: true }, { v: 'FALSE', nen: 'do' }],
        ],
        chon: 'B1',
    },
];

const LO = [{ slug: 'ham-exact', anh: bai }];

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
