// Ảnh minh hoạ cho bài 3 — DAVERAGE
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'da-01-cu-phap-co-ban',
        tieuDe: 'DAVERAGE tính trung bình kiểu cơ sở dữ liệu',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'DAVERAGE(vùng_dữ_liệu, trường, vùng_điều_kiện)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'da-02-dieu-kien-va',
        tieuDe: 'Cùng dòng = VÀ: Điện tử và còn tồn kho',
        cot: [{ rong: 100 }, { rong: 90 }],
        hang: [
            [dauXanh('NhómHàng'), dauXanh('TồnKho')],
            ['Điện tử', '>0'],
        ],
    },
    {
        ten: 'da-03-mo-rong-dieu-kien-hoac',
        tieuDe: 'Thêm dòng để mở rộng sang nhóm hàng khác',
        cot: [{ rong: 100 }, { rong: 90 }],
        hang: [
            [dauXanh('NhómHàng'), dauXanh('TồnKho')],
            ['Điện tử', '>0'],
            [{ v: 'Gia dụng', nen: 'xanh' }, { v: '>0', nen: 'xanh' }],
        ],
    },
    {
        ten: 'da-04-loi-div0',
        tieuDe: 'Không dòng nào khớp — báo lỗi #DIV/0!',
        cot: [{ rong: 200 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DAVERAGE(A1:D50,"Giá",F1:G2)', mono: true }, { v: '#DIV/0!', nen: 'do' }],
        ],
    },
    {
        ten: 'da-05-kiem-tra-truoc-bang-dcounta',
        tieuDe: 'Kiểm tra bằng DCOUNTA trước khi gọi DAVERAGE',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'IF(DCOUNTA(...)=0,"Không có dữ liệu",DAVERAGE(...))', mono: true, canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-daverage', anh: bai }];

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
