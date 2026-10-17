// Ảnh minh hoạ cho bài Custom Sort
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'cs-01-van-de',
        tieuDe: 'A-Z mặc định làm sai thứ tự cấp bậc thật',
        cot: [{ rong: 110 }, { rong: 110 }],
        hang: [
            [dauXanh('Sắp A-Z (sai)'), dauXanh('Đúng cấp bậc')],
            ['Giám đốc', { v: 'Giám đốc', nen: 'xanh' }],
            [{ v: 'Nhân viên', nen: 'do' }, 'Trưởng phòng'],
            ['Phó phòng', 'Phó phòng'],
            [{ v: 'Trưởng phòng', nen: 'do' }, { v: 'Nhân viên', nen: 'xanh' }],
        ],
    },
    {
        ten: 'cs-02-danh-sach-co-san',
        tieuDe: 'Danh sách có sẵn: thứ trong tuần, tên tháng',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'Sun, Mon, Tue, Wed, Thu, Fri, Sat', canLe: 'giua', nen: 'xanh' }],
            [{ v: 'Jan, Feb, Mar, Apr, May, Jun...', canLe: 'giua', nen: 'xanh' }],
        ],
    },
    {
        ten: 'cs-03-tao-danh-sach-rieng',
        tieuDe: 'Custom Lists: gõ đúng thứ tự, mỗi giá trị một dòng',
        cot: [{ rong: 150 }],
        hang: [
            [dauXanh('Danh sách mới')],
            ['Giám đốc'],
            ['Trưởng phòng'],
            ['Phó phòng'],
            ['Nhân viên'],
        ],
    },
    {
        ten: 'cs-04-ket-qua',
        tieuDe: 'Kết quả sau khi sắp xếp bằng Custom List',
        cot: [{ rong: 150 }],
        hang: [
            [dauXanh('Chức vụ (đúng thứ tự)')],
            [{ v: 'Giám đốc', nen: 'xanh', dam: true }],
            [{ v: 'Trưởng phòng', nen: 'vang' }],
            ['Phó phòng'],
            ['Nhân viên'],
        ],
    },
];

const LO = [{ slug: 'custom-sort', anh: bai }];

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
