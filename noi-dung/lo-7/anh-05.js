// Ảnh minh hoạ cho bài 5 — TYPE
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'ty-01-bang-ma-so',
        tieuDe: 'Năm mã số TYPE trả về',
        cot: [{ rong: 90 }, { rong: 170 }],
        hang: [
            [dauXanh('Mã số'), dauXanh('Kiểu dữ liệu')],
            ['1', 'Số (number)'],
            ['2', 'Văn bản (text)'],
            ['4', 'Luận lý (TRUE/FALSE)'],
            ['16', 'Lỗi (error)'],
            ['64', 'Mảng (array)'],
        ],
    },
    {
        ten: 'ty-02-du-lieu-hon-hop',
        tieuDe: 'Bốn ô, bốn kiểu dữ liệu khác nhau',
        cot: [{ rong: 130 }],
        hang: [
            [dauXanh('Giá trị')],
            ['1024'],
            ['VT005'],
            ['TRUE'],
            [{ v: '#REF!', mau: '#c0392b', dam: true }],
        ],
    },
    {
        ten: 'ty-03-ket-qua-tung-dong',
        tieuDe: 'TYPE(A2) đến TYPE(A5) — mỗi kiểu ra đúng một mã',
        congThuc: { o: 'B2', ct: '=TYPE(A2)' },
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Giá trị'), dauXanh('TYPE')],
            ['1024', { v: '1', nen: 'xanh' }],
            ['VT005', '2'],
            ['TRUE', '4'],
            [{ v: '#REF!', mau: '#c0392b', dam: true }, '16'],
        ],
        chon: 'B2',
    },
    {
        ten: 'ty-04-cach-is-long-nhau',
        tieuDe: 'Cách viết bằng IF lồng nhau các hàm IS',
        congThuc: { o: 'B2', ct: '=IF(ISNUMBER(A2),"Số",IF(ISTEXT(A2),"Chữ","..."))' },
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Giá trị'), dauXanh('Kết quả')],
            ['1024', { v: 'Số', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'ty-05-cach-type-choose',
        tieuDe: 'Cách viết ngắn hơn bằng TYPE + CHOOSE',
        congThuc: { o: 'B2', ct: '=CHOOSE(TYPE(A2),"Số","Chữ","","Luận lý")' },
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Giá trị'), dauXanh('Kết quả')],
            ['1024', { v: 'Số', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
];

const LO = [{ slug: 'ham-type', anh: bai }];

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
