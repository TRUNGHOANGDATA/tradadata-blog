// Ảnh minh hoạ cho bài 1 — GEOMEAN
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'gm-01-cu-phap-co-ban',
        tieuDe: 'GEOMEAN tính trung bình nhân',
        cot: [{ rong: 230 }],
        hang: [
            [{ v: 'GEOMEAN = căn bậc n của tích n số', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'gm-02-van-de-trung-binh-cong',
        tieuDe: 'Trung bình cộng 3 tỷ lệ tăng trưởng — sai',
        cot: [{ rong: 150 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=AVERAGE(10%,20%,5%)', mono: true }, { v: '11,67%', nen: 'do' }],
        ],
    },
    {
        ten: 'gm-03-cach-tinh-dung',
        tieuDe: 'GEOMEAN trên hệ số nhân — đúng thực tế',
        cot: [{ rong: 200 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=GEOMEAN(1.10,1.20,1.05)-1', mono: true }, { v: '11,49%', nen: 'xanh' }],
        ],
    },
    {
        ten: 'gm-04-am-gm',
        tieuDe: 'Trung bình cộng luôn ≥ trung bình nhân',
        cot: [{ rong: 240 }],
        hang: [
            [{ v: 'AVERAGE ≥ GEOMEAN (bất đẳng thức AM-GM)', nen: 'vang', canLe: 'giua' }],
        ],
    },
    {
        ten: 'gm-05-gioi-han-so-duong',
        tieuDe: 'Số âm hoặc 0 — báo lỗi ngay',
        cot: [{ rong: 170 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=GEOMEAN(10,-5,8)', mono: true }, { v: '#NUM!', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-geomean', anh: bai }];

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
