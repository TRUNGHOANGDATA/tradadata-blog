// Ảnh minh hoạ cho bài 4 — ERROR.TYPE
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'et-01-bang-ma-so',
        tieuDe: 'Bảng mã số của ERROR.TYPE',
        cot: [{ rong: 80 }, { rong: 110 }],
        hang: [
            [dauXanh('Mã số'), dauXanh('Loại lỗi')],
            ['1', '#NULL!'],
            ['2', '#DIV/0!'],
            ['3', '#VALUE!'],
            ['4', '#REF!'],
            ['5', '#NAME?'],
            ['6', '#NUM!'],
            ['7', '#N/A'],
            ['8', '#GETTING_DATA'],
        ],
    },
    {
        ten: 'et-02-du-lieu-cac-loi',
        tieuDe: 'Ba ô chứa ba loại lỗi khác nhau',
        cot: [{ rong: 100 }],
        hang: [
            [dauXanh('Giá trị')],
            [{ v: '#DIV/0!', mau: '#c0392b', dam: true }],
            [{ v: '#VALUE!', mau: '#c0392b', dam: true }],
            [{ v: '#N/A', mau: '#c0392b', dam: true }],
        ],
    },
    {
        ten: 'et-03-ket-qua-tung-loi',
        tieuDe: 'ERROR.TYPE trả về đúng mã số cho từng loại lỗi',
        congThuc: { o: 'B2', ct: '=ERROR.TYPE(A2)' },
        cot: [{ rong: 100 }, { rong: 90 }],
        hang: [
            [dauXanh('Giá trị'), dauXanh('ERROR.TYPE')],
            [{ v: '#DIV/0!', mau: '#c0392b', dam: true }, { v: '2', nen: 'xanh' }],
            [{ v: '#VALUE!', mau: '#c0392b', dam: true }, '3'],
            [{ v: '#N/A', mau: '#c0392b', dam: true }, '7'],
        ],
        chon: 'B2',
    },
    {
        ten: 'et-04-phan-ung-theo-loai',
        tieuDe: 'Phản ứng khác nhau tuỳ loại lỗi cụ thể',
        congThuc: { o: 'B2', ct: '=IF(ERROR.TYPE(A2)=7,"Chưa có dữ liệu",IF(ERROR.TYPE(A2)=2,"Lỗi chia 0","Lỗi khác"))' },
        cot: [{ rong: 100 }, { rong: 160 }],
        hang: [
            [dauXanh('Giá trị'), dauXanh('Thông báo')],
            [{ v: '#N/A', mau: '#c0392b', dam: true }, { v: 'Chưa có dữ liệu', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'et-05-so-sanh-cach-cu',
        tieuDe: 'ISNA vẫn ngắn hơn khi chỉ cần biết đúng một loại lỗi',
        cot: [{ rong: 200 }, { rong: 150 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Khi nào dùng')],
            [{ v: '=ISNA(A2)', mono: true }, 'Chỉ cần biết có #N/A hay không'],
            [{ v: '=ERROR.TYPE(A2)', mono: true }, 'Cần phân biệt từ 3 loại lỗi trở lên'],
        ],
    },
];

const LO = [{ slug: 'ham-error-type', anh: bai }];

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
