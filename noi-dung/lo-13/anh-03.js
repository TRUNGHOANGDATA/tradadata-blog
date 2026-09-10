// Ảnh minh hoạ cho bài 3 — LCM
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'lc-01-cu-phap-co-ban',
        tieuDe: 'LCM tìm bội số chung nhỏ nhất',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=LCM(4,6)', mono: true }, { v: '12', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'lc-02-hai-chu-ky-trung-nhau',
        tieuDe: 'Hai tuyến xe buýt 12 và 18 phút — bao lâu trùng nhau',
        congThuc: { o: 'C1', ct: '=LCM(12,18)' },
        cot: [{ rong: 200 }],
        hang: [
            [{ v: 'Kết quả: 36 phút', nen: 'xanh', canLe: 'giua' }],
        ],
        chon: 'C1',
    },
    {
        ten: 'lc-03-lich-bao-tri',
        tieuDe: 'Ba lịch bảo trì 15, 20, 30 ngày — gộp lại khi nào',
        congThuc: { o: 'D1', ct: '=LCM(15,20,30)' },
        cot: [{ rong: 200 }],
        hang: [
            [{ v: 'Kết quả: 60 ngày', nen: 'xanh', canLe: 'giua' }],
        ],
        chon: 'D1',
    },
    {
        ten: 'lc-04-quan-he-lcm-gcd',
        tieuDe: 'LCM × GCD luôn bằng tích hai số gốc',
        cot: [{ rong: 190 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=LCM(12,18)*GCD(12,18)', mono: true }, { v: '216', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=12*18', mono: true }, { v: '216', canLe: 'giua' }],
        ],
    },
    {
        ten: 'lc-05-loi-so-am',
        tieuDe: 'Cùng giới hạn với GCD — số âm báo lỗi',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=LCM(-12,18)', mono: true }, { v: '#NUM!', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-lcm', anh: bai }];

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
