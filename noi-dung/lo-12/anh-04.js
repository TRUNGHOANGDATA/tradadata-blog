// Ảnh minh hoạ cho bài 4 — TRANSPOSE
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'tp-01-cu-phap-co-ban',
        tieuDe: 'TRANSPOSE xoay bảng 90 độ',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'Nguồn 3×2  →  TRANSPOSE  →  Kết quả 2×3', canLe: 'giua' }],
        ],
    },
    {
        ten: 'tp-02-mang-dong-365',
        tieuDe: 'Excel 365: chỉ cần Enter, tự tràn ra',
        congThuc: { o: 'E1', ct: '=TRANSPOSE(A1:C4)' },
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'Kết quả tự "tràn" (spill) ra đủ số ô cần thiết', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'tp-03-chon-vung-truoc-cse',
        tieuDe: 'Excel cũ: phải chọn đúng vùng trước Ctrl+Shift+Enter',
        cot: [{ rong: 230 }],
        hang: [
            [{ v: 'Chọn thiếu vùng → phần thừa bị CẮT MẤT dữ liệu', nen: 'do', canLe: 'giua' }],
        ],
    },
    {
        ten: 'tp-04-du-lieu-nhap-ngang',
        tieuDe: 'Dữ liệu nhập ngang — mỗi tháng một cột',
        cot: [{ rong: 60 }, { rong: 60 }, { rong: 60 }],
        hang: [
            [dauXanh('T1'), dauXanh('T2'), dauXanh('T3')],
            ['120', '135', '150'],
        ],
    },
    {
        ten: 'tp-05-xoay-thanh-du-lieu-doc',
        tieuDe: 'Sau TRANSPOSE — mỗi tháng một dòng',
        congThuc: { o: 'E1', ct: '=TRANSPOSE(B1:D2)' },
        cot: [{ rong: 70 }, { rong: 70 }],
        hang: [
            [dauXanh('Tháng'), dauXanh('Giá trị')],
            ['T1', { v: '120', nen: 'xanh' }],
            ['T2', '135'],
            ['T3', '150'],
        ],
    },
];

const LO = [{ slug: 'ham-transpose', anh: bai }];

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
