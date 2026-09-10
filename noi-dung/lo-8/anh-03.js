// Ảnh minh hoạ cho bài 3 — NA
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'na2-01-na-co-ban',
        tieuDe: 'NA() — cố tình tạo ra lỗi #N/A',
        congThuc: { o: 'B1', ct: '=NA()' },
        cot: [{ rong: 100 }, { rong: 100 }],
        hang: [
            [{ v: '=NA()', mono: true }, { v: '#N/A', nen: 'do' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'na2-02-du-lieu-de-trong',
        tieuDe: 'Dự báo doanh thu 6 tháng — 2 tháng cuối chưa có dữ liệu',
        cot: [{ rong: 80 }, { rong: 110 }],
        hang: [
            [dauXanh('Tháng'), dauXanh('Doanh thu')],
            ['T1', '120'], ['T2', '135'], ['T3', '150'], ['T4', '145'],
            ['T5', ''], ['T6', ''],
        ],
    },
    {
        ten: 'na2-03-bieu-do-sai',
        tieuDe: 'Điền 0 hoặc để trống — biểu đồ dễ hiểu nhầm thành sụt giảm',
        cot: [{ rong: 80 }, { rong: 110 }],
        hang: [
            [dauXanh('Tháng'), dauXanh('Doanh thu')],
            ['T5', { v: '0 (sai — chưa có DL)', nen: 'do' }],
            ['T6', { v: '0 (sai — chưa có DL)', nen: 'do' }],
        ],
    },
    {
        ten: 'na2-04-dung-na',
        tieuDe: 'Dùng NA() thay vì 0 hoặc để trống',
        cot: [{ rong: 80 }, { rong: 110 }],
        hang: [
            [dauXanh('Tháng'), dauXanh('Doanh thu')],
            ['T1', '120'], ['T2', '135'], ['T3', '150'], ['T4', '145'],
            ['T5', { v: '#N/A', nen: 'xanh', mau: '#217346' }],
            ['T6', { v: '#N/A', nen: 'xanh', mau: '#217346' }],
        ],
    },
    {
        ten: 'na2-05-bieu-do-dung',
        tieuDe: 'Excel bỏ qua hẳn điểm #N/A — biểu đồ đứt đúng chỗ',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'Đường biểu đồ dừng đúng ở T4, không nối giả hay tụt về 0', nen: 'xanh' }],
        ],
    },
    {
        ten: 'na2-06-tu-dong-chuyen-na',
        tieuDe: 'Tự động chuyển sang NA() khi ngày còn ở tương lai',
        congThuc: { o: 'C2', ct: '=IF(A2>TODAY(), NA(), B2)' },
        cot: [{ rong: 110 }, { rong: 90 }, { rong: 100 }],
        hang: [
            [dauXanh('Ngày'), dauXanh('Số liệu'), dauXanh('Hiển thị')],
            ['01/09/2026', '120', '120'],
            ['01/12/2026', '', { v: '#N/A', nen: 'xanh' }],
        ],
        chon: 'C2',
    },
];

const LO = [{ slug: 'ham-na', anh: bai }];

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
