// Ảnh minh hoạ cho bài Group and Outline
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'go-01-nhom-dong',
        tieuDe: 'Nhóm dòng chi tiết — nút − thu gọn, nút + mở rộng',
        cot: [{ rong: 40 }, { rong: 110 }, { rong: 90 }],
        hang: [
            [{ v: '−', canLe: 'giua', dam: true, nen: 'xanh' }, dauXanh('Sản phẩm'), dauXanh('Doanh thu')],
            ['', 'Laptop', '18.000.000'],
            ['', 'Chuột', '350.000'],
            [{ v: '', nen: 'vang' }, { v: 'Tổng Điện tử', dam: true, nen: 'vang' }, { v: '18.350.000', dam: true, nen: 'vang' }],
        ],
    },
    {
        ten: 'go-02-auto-outline',
        tieuDe: 'Auto Outline tự nhận diện dòng tổng có công thức SUM',
        cot: [{ rong: 110 }, { rong: 100 }],
        hang: [
            [dauXanh('Dòng'), dauXanh('Nhận diện')],
            ['Chi tiết 1, 2, 3', 'Dòng con'],
            [{ v: '=SUM(...) → Tổng', nen: 'xanh', dam: true }, { v: 'Dòng nhóm', nen: 'xanh' }],
        ],
    },
    {
        ten: 'go-03-nhieu-cap',
        tieuDe: 'Nút 1·2·3 ở góc — thu gọn cả báo cáo về đúng 1 cấp',
        cot: [{ rong: 60 }, { rong: 60 }, { rong: 60 }],
        hang: [
            [dauXanh('Cấp 1'), dauXanh('Cấp 2'), dauXanh('Cấp 3')],
            [{ v: 'Tổng lớn', nen: 'xanh', dam: true }, { v: 'Tổng nhóm', nen: 'vang' }, 'Chi tiết'],
        ],
    },
];

const LO = [{ slug: 'group-outline', anh: bai }];

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
