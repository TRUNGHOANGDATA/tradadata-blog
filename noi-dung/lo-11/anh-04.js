// Ảnh minh hoạ cho bài 4 — POWER
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'pw-01-cu-phap-co-ban',
        tieuDe: 'POWER tính luỹ thừa',
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=POWER(2,10)', mono: true }, { v: '1024', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'pw-02-so-sanh-power-mu',
        tieuDe: 'POWER và dấu ^ cho cùng kết quả',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=2^10', mono: true }, { v: '1024', canLe: 'giua' }],
            [{ v: '=POWER(2,10)', mono: true }, { v: '1024', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'pw-03-lai-kep',
        tieuDe: 'Tính lãi kép bằng POWER thay vì FV',
        congThuc: { o: 'B1', ct: '=10000000*POWER(1+8%,5)' },
        cot: [{ rong: 140 }, { rong: 100 }],
        hang: [
            [{ v: 'Gốc 10.000.000đ, 8%/năm, 5 năm' }, { v: '14.693.281đ', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'pw-04-loi-num-co-so-am',
        tieuDe: 'Số mũ không nguyên với cơ số âm — lỗi #NUM!',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=POWER(-8,1/3)', mono: true }, { v: '#NUM!', nen: 'do' }],
        ],
    },
    {
        ten: 'pw-05-luu-y-so-mu-nguyen',
        tieuDe: 'Số mũ nguyên với cơ số âm thì không lỗi',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=POWER(-8,3)', mono: true }, { v: '-512', nen: 'xanh', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-power', anh: bai }];

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
