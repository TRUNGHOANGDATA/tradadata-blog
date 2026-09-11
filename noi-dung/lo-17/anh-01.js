// Ảnh minh hoạ cho bài 1 — SUM
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'sm-01-cu-phap-co-ban',
        tieuDe: 'SUM cộng một dãy số',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=SUM(10,20,30)', mono: true }, { v: '60', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'sm-02-sum-khac-dau-cong',
        tieuDe: 'SUM bỏ qua văn bản — dấu + thì báo lỗi ngay',
        cot: [{ rong: 90 }, { rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('A1'), dauXanh('A2'), dauXanh('A3')],
            ['10', { v: 'Chưa có', canLe: 'trai' }, '20'],
        ],
    },
    {
        ten: 'sm-03-sum-xuyen-nhieu-sheet',
        tieuDe: 'Cộng cùng một ô B2 xuyên 12 sheet tháng',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: '=SUM(Thang1:Thang12!B2)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'sm-04-can-than-dong-tong',
        tieuDe: 'SUM(A:A) dễ cộng nhầm luôn dòng Tổng cộng',
        cot: [{ rong: 100 }, { rong: 100 }],
        hang: [
            [dauXanh('Sản phẩm'), dauXanh('Doanh số')],
            ['Bút bi', '5.000.000'],
            [{ v: 'Tổng cộng', dam: true }, { v: '5.000.000', nen: 'do' }],
        ],
    },
    {
        ten: 'sm-05-sum-khong-loai-tru-loc',
        tieuDe: 'SUM vẫn cộng cả dòng đang bị lọc/ẩn',
        cot: [{ rong: 150 }, { rong: 130 }],
        hang: [
            [dauXanh('Hàm'), dauXanh('Có loại trừ dòng ẩn?')],
            ['SUM', { v: 'Không', nen: 'do' }],
            ['SUBTOTAL(109,...)', { v: 'Có', nen: 'xanh' }],
        ],
    },
];

const LO = [{ slug: 'ham-sum', anh: bai }];

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
