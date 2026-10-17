// Ảnh minh hoạ cho bài INDEX/MATCH
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'im-01-match',
        tieuDe: 'MATCH trả về VỊ TRÍ, không phải dữ liệu',
        congThuc: { o: 'C1', ct: '=MATCH("SP03",A2:A5,0)' },
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Mã'), dauXanh('Thứ tự')],
            ['SP01', '1'],
            ['SP02', '2'],
            [{ v: 'SP03', dam: true, nen: 'xanh' }, { v: '3', nen: 'xanh', dam: true }],
            ['SP04', '4'],
        ],
        chon: 'A4',
    },
    {
        ten: 'im-02-index',
        tieuDe: 'INDEX lấy giá trị ở vị trí thứ N của vùng',
        congThuc: { o: 'D1', ct: '=INDEX(B2:B5,3)' },
        cot: [{ rong: 70 }, { rong: 200 }],
        hang: [
            [dauXanh('Thứ tự'), dauXanh('Tên hàng')],
            ['1', 'Chuột không dây'],
            ['2', 'Bàn phím cơ'],
            [{ v: '3', dam: true, nen: 'xanh' }, { v: 'Tai nghe Bluetooth', nen: 'vang', dam: true }],
            ['4', 'Webcam HD'],
        ],
        chon: 'B4',
    },
    {
        ten: 'im-03-ghep',
        tieuDe: 'Ghép: MATCH nuôi số dòng cho INDEX',
        congThuc: { o: 'E2', ct: '=INDEX(B2:B5,MATCH("SP03",A2:A5,0))' },
        cot: [{ rong: 100 }, { rong: 210 }],
        hang: [
            [dauXanh('Mã (dò ở đây)'), dauXanh('Tên (trả ở đây)')],
            ['SP01', 'Chuột không dây'],
            ['SP02', 'Bàn phím cơ'],
            [{ v: 'SP03', dam: true, nen: 'xanh' }, { v: 'Tai nghe Bluetooth', nen: 'vang', dam: true }],
            ['SP04', 'Webcam HD'],
        ],
        chon: 'B4',
    },
];

const LO = [{ slug: 'index-match', anh: bai }];

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
