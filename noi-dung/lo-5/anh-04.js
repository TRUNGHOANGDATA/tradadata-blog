// Ảnh minh hoạ cho bài 4 — VALUE, TEXT
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'vt-01-value-co-ban',
        tieuDe: 'VALUE — ép văn bản trông giống số thành số thật',
        congThuc: { o: 'B2', ct: '=VALUE(A2)' },
        cot: [{ rong: 170 }, { rong: 130 }],
        hang: [
            [dauXanh('Văn bản'), dauXanh('VALUE(...)')],
            [{ v: '1024', canLe: 'trai' }, { v: '1024', nen: 'xanh', canLe: 'phai' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'vt-02-sua-loi-vlookup',
        tieuDe: 'Bọc VALUE quanh giá trị dò để sửa lỗi số lưu dạng văn bản',
        congThuc: { o: 'D2', ct: '=VLOOKUP(VALUE(C2), $F$2:$G$4, 2, 0)' },
        cot: [{ rong: 90 }, { rong: 90 }, { rong: 30 }, { rong: 130 }],
        hang: [
            [dauXanh('Mã (text)'), dauXanh('Đơn giá'), '', dauXanh('Mã (số)')],
            [{ v: '1024', canLe: 'trai' }, { v: '2.400.000', nen: 'xanh' }, '', '1024'],
        ],
        chon: 'D2',
    },
    {
        ten: 'vt-03-value-loi',
        tieuDe: 'VALUE báo lỗi khi chuỗi có lẫn chữ, không tự lọc bỏ',
        congThuc: { o: 'B1', ct: '=VALUE("1024 chiếc")' },
        cot: [{ rong: 260 }, { rong: 130 }],
        hang: [
            [{ v: '"1024 chiếc"', canLe: 'giua' }, { v: '#VALUE!', nen: 'do' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'vt-04-text-co-ban',
        tieuDe: 'TEXT — định dạng số thành chuỗi có dấu ngăn cách',
        congThuc: { o: 'B2', ct: '=TEXT(1234567, "#.##0")' },
        cot: [{ rong: 130 }, { rong: 150 }],
        hang: [
            [dauXanh('Số gốc'), dauXanh('TEXT(...)')],
            [{ v: '1234567', canLe: 'phai' }, { v: '1.234.567', nen: 'xanh', canLe: 'phai' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'vt-05-noi-chuoi-truc-tiep',
        tieuDe: 'Nối chuỗi trực tiếp — số không có dấu ngăn cách',
        congThuc: { o: 'C2', ct: '=A2 & " đã thanh toán " & B2 & " đồng"' },
        cot: [{ rong: 130 }, { rong: 100 }, { rong: 260 }],
        hang: [
            [dauXanh('Tên'), dauXanh('Số tiền'), dauXanh('Kết quả ghép')],
            ['Nguyễn Văn A', '1234567', { v: '...thanh toán 1234567 đồng', nen: 'do' }],
        ],
        chon: 'C2',
    },
    {
        ten: 'vt-06-noi-chuoi-co-text',
        tieuDe: 'Bọc TEXT trước khi ghép — số có dấu ngăn cách, dễ đọc',
        congThuc: { o: 'C2', ct: '=A2&" đã thanh toán "&TEXT(B2,"#.##0")&" đồng"' },
        cot: [{ rong: 130 }, { rong: 100 }, { rong: 280 }],
        hang: [
            [dauXanh('Tên'), dauXanh('Số tiền'), dauXanh('Kết quả ghép')],
            ['Nguyễn Văn A', '1234567', { v: '...thanh toán 1.234.567 đồng', nen: 'xanh' }],
        ],
        chon: 'C2',
    },
    {
        ten: 'vt-07-bang-ma-dinh-dang',
        tieuDe: 'Vài mã định dạng thường dùng với TEXT',
        cot: [{ rong: 130 }, { rong: 110 }, { rong: 110 }],
        hang: [
            [dauXanh('Mã định dạng'), dauXanh('Input'), dauXanh('Kết quả')],
            [{ v: '"#.##0"', mono: true }, '1234567', '1.234.567'],
            [{ v: '"0%"', mono: true }, '0,7', '70%'],
            [{ v: '"dd/mm/yyyy"', mono: true }, '15/09/2026', '15/09/2026'],
            [{ v: '"0,00"', mono: true }, '5', '5,00'],
        ],
    },
];

const LO = [{ slug: 'ham-value-text', anh: bai }];

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
