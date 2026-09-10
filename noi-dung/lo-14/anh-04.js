// Ảnh minh hoạ cho bài 4 — UNICHAR
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'uc-01-cu-phap-co-ban',
        tieuDe: 'UNICHAR trả về ký tự ứng với mã Unicode',
        cot: [{ rong: 200 }],
        hang: [
            [{ v: 'UNICHAR(mã_số) → ký tự', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'uc-02-dau-tich-ngoi-sao',
        tieuDe: 'Dấu tích và ngôi sao chỉ bằng một công thức',
        cot: [{ rong: 150 }, { rong: 80 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=UNICHAR(10003)', mono: true }, { v: '✓', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=UNICHAR(9733)', mono: true }, { v: '★', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'uc-03-thanh-danh-gia-sao',
        tieuDe: 'Thanh đánh giá sao dựng bằng REPT + UNICHAR',
        congThuc: { o: 'B1', ct: '=REPT(UNICHAR(9733),3)&REPT(UNICHAR(9734),2)' },
        cot: [{ rong: 200 }],
        hang: [
            [{ v: 'Kết quả: ★★★☆☆', nen: 'xanh', canLe: 'giua' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'uc-04-ham-nguoc-lai-unicode',
        tieuDe: 'UNICODE là hàm ngược lại — ký tự sang mã số',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=UNICODE("★")', mono: true }, { v: '9733', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'uc-05-luu-y-font-chu',
        tieuDe: 'Không phải font nào cũng hiển thị được mọi ký tự',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=UNICHAR(128512)', mono: true }, { v: '😀 hoặc □', nen: 'vang', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-unichar', anh: bai }];

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
