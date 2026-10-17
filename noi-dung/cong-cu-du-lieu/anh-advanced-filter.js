// Ảnh minh hoạ cho bài Advanced Filter
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'af-01-vung-dieu-kien',
        tieuDe: 'Vùng điều kiện: dòng đầu là TÊN CỘT giống hệt bảng gốc',
        cot: [{ rong: 90 }, { rong: 100 }],
        hang: [
            [dauXanh('Khu vực'), dauXanh('Doanh thu')],
            [{ v: 'Miền Bắc', nen: 'vang' }, ''],
        ],
    },
    {
        ten: 'af-02-va-hoac',
        tieuDe: 'Cùng hàng = VÀ · Khác hàng = HOẶC',
        cot: [{ rong: 90 }, { rong: 110 }],
        hang: [
            [dauXanh('Khu vực'), dauXanh('Doanh thu')],
            [{ v: 'Miền Bắc', nen: 'xanh' }, ''],
            ['', { v: '>20000000', nen: 'xanh' }],
        ],
    },
    {
        ten: 'af-03-hop-thoai',
        tieuDe: 'Hộp thoại Advanced Filter — ba vùng cần khai',
        cot: [{ rong: 100 }, { rong: 150 }],
        hang: [
            [dauXanh('Tham số'), dauXanh('Ý nghĩa')],
            ['List range', 'Vùng dữ liệu gốc'],
            ['Criteria range', 'Vùng điều kiện'],
            [{ v: 'Copy to', nen: 'vang' }, 'Nơi dán kết quả lọc'],
        ],
    },
];

const LO = [{ slug: 'advanced-filter', anh: bai }];

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
