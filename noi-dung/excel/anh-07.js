// Ảnh minh hoạ cho bài 7 — Excel Table và tham chiếu theo tên cột
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'et-01-ctrl-t',
        tieuDe: 'Ctrl+T đóng vùng thành Table, đặt tên BanHang',
        cot: [{ rong: 90 }, { rong: 100 }, { rong: 120 }],
        hang: [
            [dauXanh('Mã đơn'), dauXanh('Khu vực'), dauXanh('Doanh thu')],
            ['DH-1001', 'Miền Trung', '111000000'],
            ['DH-1002', 'Miền Trung', '92000000'],
            ['DH-1003', 'Miền Bắc', '129500000'],
        ],
    },
    {
        ten: 'et-02-tham-chieu-cau-truc',
        tieuDe: 'Tham chiếu theo tên cột tự giãn khi thêm dòng',
        cot: [{ rong: 300 }],
        hang: [
            [{ v: '=SUM(I5:I44)', mono: true, nen: 'do' }],
            [{ v: '→ quên sửa vùng khi thêm dòng', nen: 'do' }],
            [{ v: '=SUM(BanHang[Doanh thu])', mono: true, nen: 'xanh' }],
            [{ v: '→ tự giãn, không bao giờ sót', nen: 'xanh' }],
        ],
    },
    {
        ten: 'et-03-goi-y-ten-cot',
        tieuDe: 'Gõ BanHang[ là Excel gợi ý tên cột',
        congThuc: { o: 'K2', ct: '=SUM(BanHang[' },
        cot: [{ rong: 200 }],
        hang: [
            [{ v: 'Khu vực' }],
            [{ v: 'Số lượng' }],
            [{ v: 'Đơn giá (VNĐ)' }],
            [{ v: 'Doanh thu (VNĐ)', nen: 'xanh' }],
        ],
    },
    {
        ten: 'et-04-sumifs-table',
        tieuDe: 'SUMIFS theo tên cột đọc gần như câu tiếng Việt',
        congThuc: { o: 'K1', ct: '=SUMIFS(BanHang[Doanh thu],BanHang[Nhóm SP],"Laptop")' },
        cot: [{ rong: 120 }],
        hang: [
            [{ v: '777000000', canLe: 'phai', dam: true, nen: 'xanh' }],
        ],
    },
];

const LO = [{ slug: 'excel-table', anh: bai }];

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
