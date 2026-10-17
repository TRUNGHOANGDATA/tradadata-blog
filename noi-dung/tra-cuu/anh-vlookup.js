// Ảnh minh hoạ cho bài VLOOKUP
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'vl-01-bang-tra',
        tieuDe: 'VLOOKUP dò ở CỘT ĐẦU của vùng, trả về cột thứ N',
        congThuc: { o: 'E2', ct: '=VLOOKUP("SP03",A2:C5,2,FALSE)' },
        cot: [{ rong: 70 }, { rong: 170 }, { rong: 90 }],
        hang: [
            [dauXanh('Mã'), dauXanh('Tên hàng'), dauXanh('Giá')],
            ['SP01', 'Chuột không dây', '150.000'],
            ['SP02', 'Bàn phím cơ', '850.000'],
            [{ v: 'SP03', dam: true, nen: 'xanh' }, { v: 'Tai nghe Bluetooth', nen: 'xanh' }, { v: '620.000', nen: 'xanh' }],
            ['SP04', 'Webcam HD', '470.000'],
        ],
        chon: 'B4',
    },
    {
        ten: 'vl-02-gan-dung-chinh-xac',
        tieuDe: 'Tham số cuối: FALSE (0) khớp chính xác — TRUE (1) khớp gần đúng',
        cot: [{ rong: 150 }, { rong: 90 }, { rong: 220 }],
        hang: [
            [dauXanh('Tham số cuối'), dauXanh('Nghĩa'), dauXanh('Dùng khi nào')],
            ['FALSE  hoặc  0', 'Chính xác', 'Gần như luôn dùng cái này'],
            ['TRUE  hoặc  1', 'Gần đúng', 'Bảng bậc thang, ĐÃ sắp xếp tăng dần'],
            [{ v: '(bỏ trống)', mau: '#c0392b', dam: true }, { v: '= TRUE', mau: '#c0392b' }, { v: 'Bẫy: âm thầm ra kết quả sai', nen: 'do' }],
        ],
    },
    {
        ten: 'vl-03-loi-na',
        tieuDe: 'VLOOKUP trả #N/A — bốn nguyên nhân hay gặp',
        cot: [{ rong: 250 }, { rong: 170 }],
        hang: [
            [dauXanh('Vì sao ra #N/A'), dauXanh('Cách sửa')],
            ['Giá trị dò không có trong cột đầu', 'Kiểm lại mã cần dò'],
            ['Một bên là số, bên kia là văn bản', 'Ép về cùng kiểu'],
            [{ v: 'Thừa khoảng trắng: "SP03 "', nen: 'do' }, 'Bọc TRIM()'],
            ['Cột dò không nằm ở đầu vùng', 'Dịch vùng bắt đầu ở cột dò'],
        ],
    },
    {
        ten: 'vl-04-cot-index',
        tieuDe: 'Số cột (3) đếm từ cột ĐẦU vùng, không theo A/B/C của sheet',
        cot: [{ rong: 80 }, { rong: 120 }, { rong: 110 }, { rong: 110 }],
        hang: [
            [dauXanh('Mã · 1'), dauXanh('Tên · 2'), dauXanh('Giá nhập · 3'), dauXanh('Giá bán · 4')],
            ['SP03', 'Tai nghe', { v: '380.000', nen: 'vang', dam: true }, '620.000'],
        ],
        chon: 'C2',
    },
];

const LO = [{ slug: 'vlookup', anh: bai }];

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
