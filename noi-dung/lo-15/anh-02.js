// Ảnh minh hoạ cho bài 2 — VALUETOTEXT
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'vt-01-cu-phap-co-ban',
        tieuDe: 'VALUETOTEXT chuyển một giá trị đơn thành văn bản',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'VALUETOTEXT(giá_trị, [định_dạng])', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'vt-02-cac-kieu-gia-tri',
        tieuDe: 'Chuyển đổi các kiểu giá trị khác nhau',
        cot: [{ rong: 160 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=VALUETOTEXT(TRUE)', mono: true }, { v: 'TRUE', nen: 'xanh' }],
            [{ v: '=VALUETOTEXT(3.14)', mono: true }, { v: '3.14', canLe: 'giua' }],
        ],
    },
    {
        ten: 'vt-03-dinh-dang-chat-che',
        tieuDe: 'Định dạng 1 giữ nguyên dấu ngoặc kép',
        cot: [{ rong: 180 }, { rong: 130 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=VALUETOTEXT("Xin chào",1)', mono: true }, { v: '"Xin chào"', nen: 'xanh' }],
        ],
    },
    {
        ten: 'vt-04-noi-chuoi-thong-thuong-loi-lay-lan',
        tieuDe: 'Nối chuỗi thường — lỗi lây lan ra cả công thức',
        cot: [{ rong: 180 }, { rong: 110 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '="Kết quả: "&A2', mono: true }, { v: '#N/A', nen: 'do' }],
        ],
    },
    {
        ten: 'vt-05-valuetotext-giu-nguyen-chuoi',
        tieuDe: 'VALUETOTEXT giữ lỗi thành chuỗi, không lây lan',
        cot: [{ rong: 200 }, { rong: 150 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '="Kết quả: "&VALUETOTEXT(A2)', mono: true }, { v: 'Kết quả: #N/A', nen: 'xanh' }],
        ],
    },
];

const LO = [{ slug: 'ham-valuetotext', anh: bai }];

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
