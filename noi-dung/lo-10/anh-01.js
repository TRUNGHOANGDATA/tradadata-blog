// Ảnh minh hoạ cho bài 1 — ABS
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'abs-01-cu-phap-co-ban',
        tieuDe: 'ABS bỏ dấu âm, giữ nguyên độ lớn',
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ABS(-15,5)', mono: true }, { v: '15,5', nen: 'xanh' }],
            [{ v: '=ABS(15,5)', mono: true }, { v: '15,5', nen: 'xanh' }],
        ],
    },
    {
        ten: 'abs-02-chenh-lech-co-am',
        tieuDe: 'Trừ trực tiếp — dấu âm dương lẫn lộn',
        congThuc: { o: 'D2', ct: '=B2-C2' },
        cot: [{ rong: 80 }, { rong: 90 }, { rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Nhân viên'), dauXanh('Dự toán'), dauXanh('Thực tế'), dauXanh('Chênh lệch')],
            ['An', '10.000.000', '9.500.000', { v: '500.000', canLe: 'phai' }],
            ['Bình', '10.000.000', '10.700.000', { v: '-700.000', nen: 'do' }],
        ],
        chon: 'D2',
    },
    {
        ten: 'abs-03-boc-abs',
        tieuDe: 'Bọc ABS — mọi chênh lệch đều thành số dương',
        congThuc: { o: 'D2', ct: '=ABS(B2-C2)' },
        cot: [{ rong: 80 }, { rong: 90 }, { rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Nhân viên'), dauXanh('Dự toán'), dauXanh('Thực tế'), dauXanh('Lệch (ABS)')],
            ['An', '10.000.000', '9.500.000', { v: '500.000', nen: 'xanh' }],
            ['Bình', '10.000.000', '10.700.000', { v: '700.000', nen: 'xanh' }],
        ],
        chon: 'D2',
    },
    {
        ten: 'abs-04-sai-so-trung-binh',
        tieuDe: 'Sai số tuyệt đối trung bình giữa dự báo và thực tế',
        congThuc: { o: 'D2', ct: '=AVERAGE(ABS(B2:B4-C2:C4))' },
        cot: [{ rong: 70 }, { rong: 90 }, { rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Kỳ'), dauXanh('Dự báo'), dauXanh('Thực tế'), dauXanh('Sai số TB')],
            ['T1', '100', '92', { v: '5,7', nen: 'xanh' }],
            ['T2', '100', '108', ''],
            ['T3', '100', '101', ''],
        ],
        chon: 'D2',
    },
    {
        ten: 'abs-05-abs-khong-sua-loi',
        tieuDe: 'ABS không xoá được lỗi bên trong',
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=10/0', mono: true }, { v: '#DIV/0!', nen: 'do' }],
            [{ v: '=ABS(10/0)', mono: true }, { v: '#DIV/0!', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-abs', anh: bai }];

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
