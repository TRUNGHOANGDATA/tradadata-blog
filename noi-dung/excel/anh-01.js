// Ảnh minh hoạ cho bài 1 — Kiểu dữ liệu
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'kd-01-bon-loai',
        tieuDe: 'Số căn phải, văn bản căn trái — nhìn là biết',
        cot: [{ rong: 120 }, { rong: 110 }, { rong: 70 }],
        hang: [
            [dauXanh('Ô mẫu'), dauXanh('Excel hiểu'), dauXanh('TYPE()')],
            ['1234.5', 'Số', '1'],
            [{ v: '1234.5', canLe: 'trai' }, 'Văn bản', '2'],
            [{ v: 'TRUE', canLe: 'giua' }, 'Luận lý', '4'],
            ['#DIV/0!', 'Lỗi', '16'],
        ],
    },
    {
        ten: 'kd-02-ngay-la-so',
        tieuDe: 'Ngày, giờ, % đều là số bên dưới',
        cot: [{ rong: 120 }, { rong: 120 }],
        hang: [
            [dauXanh('Bạn thấy'), dauXanh('Số nền thật')],
            ['15/03/2025', '45731'],
            ['14:30', '0.6042'],
            ['25%', '0.25'],
            ['18.500.000 ₫', '18500000'],
        ],
    },
    {
        ten: 'kd-03-ham-type',
        tieuDe: 'Hỏi thẳng Excel bằng TYPE()',
        congThuc: { o: 'B2', ct: '=TYPE(A2)' },
        cot: [{ rong: 120 }, { rong: 70 }],
        hang: [
            [dauXanh('Ô'), dauXanh('TYPE')],
            ['1234.5', '1'],
            ['Hà Nội', '2'],
            ['TRUE', '4'],
            ['#N/A', '16'],
        ],
    },
    {
        ten: 'kd-04-van-ban-gia-dang',
        tieuDe: 'Văn bản giả dạng: mã số và khoảng trắng thừa',
        cot: [{ rong: 130 }, { rong: 200 }],
        hang: [
            [dauXanh('Ô'), dauXanh('Vấn đề')],
            [{ v: '0912345678', canLe: 'trai' }, 'Để văn bản mới giữ số 0 đầu'],
            [{ v: 'Hà Nội ', canLe: 'trai', nen: 'do' }, 'Thừa dấu cách → VLOOKUP sai'],
        ],
    },
];

const LO = [{ slug: 'kieu-du-lieu', anh: bai }];

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
