// Ảnh minh hoạ cho bài 2 — GCD
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'gc-01-cu-phap-co-ban',
        tieuDe: 'GCD tìm ước số chung lớn nhất',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=GCD(24,36)', mono: true }, { v: '12', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'gc-02-rut-gon-ty-le',
        tieuDe: 'Rút gọn tỷ lệ pha trộn 24:36 về 2:3',
        congThuc: { o: 'C1', ct: '=A1/GCD(A1,B1)&":"&B1/GCD(A1,B1)' },
        cot: [{ rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Tỷ lệ gốc'), dauXanh('Rút gọn')],
            ['24 : 36', { v: '2 : 3', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'gc-03-ty-le-khung-hinh',
        tieuDe: 'Quy đổi 1920×1080 về tỷ lệ khung hình',
        congThuc: { o: 'C1', ct: '=A1/GCD(A1,B1)&":"&B1/GCD(A1,B1)' },
        cot: [{ rong: 100 }, { rong: 90 }],
        hang: [
            [dauXanh('Kích thước'), dauXanh('Tỷ lệ')],
            ['1920×1080', { v: '16:9', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'gc-04-so-nguyen-to-cung-nhau',
        tieuDe: 'Không có ước chung nào ngoài 1',
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=GCD(7,15)', mono: true }, { v: '1', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'gc-05-loi-so-am',
        tieuDe: 'Số âm luôn báo lỗi #NUM!',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=GCD(-24,36)', mono: true }, { v: '#NUM!', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-gcd', anh: bai }];

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
