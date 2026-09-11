// Ảnh minh hoạ cho bài 4 — TIME
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'tm-01-cu-phap-co-ban',
        tieuDe: 'TIME ghép giờ, phút, giây thành một giá trị thật',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=TIME(8,30,0)', mono: true }, { v: '08:30:00', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'tm-02-tinh-gio-ket-thuc-ca',
        tieuDe: 'Tính giờ kết thúc ca từ giờ bắt đầu + 8 tiếng',
        congThuc: { o: 'B1', ct: '=TIME(HOUR(A1)+8,MINUTE(A1),0)' },
        cot: [{ rong: 100 }, { rong: 100 }],
        hang: [
            [dauXanh('Giờ vào'), dauXanh('Giờ ra')],
            ['08:00:00', { v: '16:00:00', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'tm-03-ghep-tu-cot-rieng',
        tieuDe: 'Ghép giờ và phút từ hai cột dropdown riêng',
        congThuc: { o: 'C2', ct: '=TIME(A2,B2,0)' },
        cot: [{ rong: 60 }, { rong: 60 }, { rong: 90 }],
        hang: [
            [dauXanh('Giờ'), dauXanh('Phút'), dauXanh('Kết quả')],
            ['9', '45', { v: '09:45:00', nen: 'xanh' }],
        ],
        chon: 'C2',
    },
    {
        ten: 'tm-04-vuot-24-tieng-cuon-vong',
        tieuDe: 'Vượt 24 tiếng — tự cuộn vòng, không báo lỗi',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=TIME(25,0,0)', mono: true }, { v: '01:00:00', nen: 'vang', canLe: 'giua' }],
        ],
    },
    {
        ten: 'tm-05-giu-ca-ngay-khi-cong-gio',
        tieuDe: 'Muốn giữ cả ngày — cộng phân số 8/24, không dùng TIME',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'NgayGio + 8/24  →  giữ đúng cả phần ngày', nen: 'xanh', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-time', anh: bai }];

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
