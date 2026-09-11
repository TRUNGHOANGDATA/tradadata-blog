// Ảnh minh hoạ cho bài 5 — AVEDEV
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'ad-01-cu-phap-co-ban',
        tieuDe: 'AVEDEV: trung bình các khoảng cách tuyệt đối',
        cot: [{ rong: 240 }],
        hang: [
            [{ v: 'AVEDEV = trung bình của |x − trung_bình|', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'ad-02-vi-du-tinh-toan',
        tieuDe: 'Kết quả mang đúng đơn vị dữ liệu gốc',
        cot: [{ rong: 150 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=AVEDEV(80,85,90,95,100)', mono: true }, { v: '6', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=STDEV.P(...)', mono: true }, { v: '7,07', canLe: 'giua' }],
        ],
    },
    {
        ten: 'ad-03-vi-sao-de-dien-giai-hon',
        tieuDe: 'Trị tuyệt đối giữ nguyên ý nghĩa "khoảng cách"',
        cot: [{ rong: 130 }, { rong: 130 }],
        hang: [
            [dauXanh('AVEDEV'), dauXanh('STDEV')],
            [{ v: 'Trị tuyệt đối', nen: 'xanh' }, 'Bình phương rồi khai căn'],
        ],
    },
    {
        ten: 'ad-04-vi-sao-van-uu-tien-stdev',
        tieuDe: 'STDEV vẫn được ưu tiên trong thống kê suy luận',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: 'Trị tuyệt đối không "mượt" toán học tại điểm 0', nen: 'vang', canLe: 'giua' }],
        ],
    },
    {
        ten: 'ad-05-ung-dung-giai-thich-de-hieu',
        tieuDe: 'Diễn giải dễ hiểu cho người không chuyên',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: '"Trung bình mỗi tháng lệch 6 so với mức chung"', nen: 'xanh', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-avedev', anh: bai }];

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
