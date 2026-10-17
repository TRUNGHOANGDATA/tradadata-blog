// Ảnh minh hoạ cho bài SUBSTITUTE
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'sub-01-thay-va-xoa',
        tieuDe: 'Đoạn mới để rỗng ("") nghĩa là XOÁ đoạn cũ',
        cot: [{ rong: 220 }, { rong: 150 }, { rong: 130 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Trên "0912.345.678"'), dauXanh('Kết quả')],
            ['=SUBSTITUTE(A2,".","")', 'Xoá mọi dấu chấm', { v: '0912345678', nen: 'xanh', dam: true }],
            ['=SUBSTITUTE(A2,".","-")', 'Đổi chấm thành gạch', { v: '0912-345-678', nen: 'vang' }],
        ],
    },
    {
        ten: 'sub-02-so-replace',
        tieuDe: 'SUBSTITUTE thay theo NỘI DUNG — REPLACE thay theo VỊ TRÍ',
        cot: [{ rong: 130 }, { rong: 240 }],
        hang: [
            [dauXanh('Hàm'), dauXanh('Dùng khi')],
            [{ v: 'SUBSTITUTE', nen: 'xanh', dam: true }, 'Biết chữ cần thay, không biết ở đâu'],
            [{ v: 'REPLACE', dam: true }, 'Biết vị trí, không quan tâm nội dung'],
        ],
    },
    {
        ten: 'sub-03-dem',
        tieuDe: 'Mẹo đếm: độ dài trước trừ độ dài sau khi xoá',
        congThuc: { o: 'B2', ct: '=LEN(A2)-LEN(SUBSTITUTE(A2,",",""))' },
        cot: [{ rong: 230 }, { rong: 130 }],
        hang: [
            [dauXanh('Chuỗi'), dauXanh('Số dấu phẩy')],
            ['Cam, Táo, Lê, Nho', { v: '3', nen: 'xanh', dam: true }],
        ],
        chon: 'B2',
    },
];

const LO = [{ slug: 'substitute', anh: bai }];

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
