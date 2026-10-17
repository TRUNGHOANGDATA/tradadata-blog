// Ảnh minh hoạ cho bài 9 — 20 bài tập nền tảng
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'bt-01-bang-mau',
        tieuDe: 'Bảng mẫu BanHang dùng cho cả 20 bài',
        cot: [{ rong: 80 }, { rong: 100 }, { rong: 90 }, { rong: 70 }, { rong: 110 }, { rong: 90 }],
        hang: [
            [dauXanh('Mã đơn'), dauXanh('Khu vực'), dauXanh('Nhân viên'), dauXanh('SL'), dauXanh('Doanh thu'), dauXanh('Hài lòng')],
            ['DH-1001', 'Miền Trung', 'Lan Anh', '6', '111000000', '3'],
            ['DH-1002', 'Miền Trung', 'Cẩm Tú', '10', '92000000', '3'],
            ['DH-1003', 'Miền Bắc', 'Đức Huy', '7', '129500000', '3'],
            ['DH-1004', 'Miền Nam', 'Gia Hân', '6', '111000000', '4'],
            ['DH-1005', 'Miền Trung', 'Đức Huy', '3', '27600000', '4'],
        ],
    },
];

const LO = [{ slug: 'bai-tap-nen-tang', anh: bai }];

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
