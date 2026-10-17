// Ảnh minh hoạ cho bài XLOOKUP
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'xl-01-hai-vung',
        tieuDe: 'XLOOKUP: vùng dò và vùng trả là HAI vùng tách biệt',
        congThuc: { o: 'D2', ct: '=XLOOKUP("SP03",A2:A5,B2:B5)' },
        cot: [{ rong: 70 }, { rong: 170 }, { rong: 90 }],
        hang: [
            [dauXanh('Mã'), dauXanh('Tên hàng'), dauXanh('Giá')],
            ['SP01', 'Chuột không dây', '150.000'],
            ['SP02', 'Bàn phím cơ', '850.000'],
            [{ v: 'SP03', dam: true, nen: 'xanh' }, { v: 'Tai nghe Bluetooth', nen: 'vang' }, '620.000'],
            ['SP04', 'Webcam HD', '470.000'],
        ],
        chon: 'B4',
    },
    {
        ten: 'xl-02-so-vlookup',
        tieuDe: 'XLOOKUP gỡ đúng ba điểm yếu của VLOOKUP',
        cot: [{ rong: 200 }, { rong: 120 }, { rong: 120 }],
        hang: [
            [dauXanh('Việc'), dauXanh('VLOOKUP'), dauXanh('XLOOKUP')],
            ['Dò sang trái', { v: 'Không', mau: '#c0392b', dam: true }, { v: 'Được', nen: 'xanh', dam: true }],
            ['Chèn cột giữa bảng', { v: 'Gãy', mau: '#c0392b', dam: true }, { v: 'Không sao', nen: 'xanh', dam: true }],
            ['Câu thay khi không thấy', { v: 'Phải bọc IFERROR', mau: '#c0392b' }, { v: 'Có sẵn', nen: 'xanh', dam: true }],
            ['Mặc định khớp', 'Gần đúng', { v: 'Chính xác', nen: 'xanh' }],
        ],
    },
    {
        ten: 'xl-03-neu-khong-thay',
        tieuDe: 'Tham số thứ tư: câu hiển thị khi không tìm thấy',
        congThuc: { o: 'B2', ct: '=XLOOKUP(A2,MaSP,TenSP,"Chưa có mã này")' },
        cot: [{ rong: 130 }, { rong: 230 }],
        hang: [
            [dauXanh('Mã dò'), dauXanh('Kết quả')],
            ['SP02', 'Bàn phím cơ'],
            [{ v: 'SP99', nen: 'do' }, { v: 'Chưa có mã này', mau: '#c0392b' }],
        ],
        chon: 'B3',
    },
];

const LO = [{ slug: 'xlookup', anh: bai }];

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
