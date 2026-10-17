// Ảnh minh hoạ cho bài IPMT/PPMT
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'ip-01-hai-phan',
        tieuDe: 'IPMT lấy phần LÃI · PPMT lấy phần GỐC, cùng một kỳ',
        cot: [{ rong: 90 }, { rong: 130 }],
        hang: [
            [dauXanh('Hàm'), dauXanh('Trả về')],
            [{ v: 'IPMT', nen: 'do' }, { v: 'Phần lãi kỳ đó', mau: '#c0392b' }],
            [{ v: 'PPMT', nen: 'xanh' }, { v: 'Phần gốc kỳ đó', dam: true }],
        ],
    },
    {
        ten: 'ip-02-cong-lai-bang-pmt',
        tieuDe: 'IPMT + PPMT của cùng kỳ luôn = PMT',
        cot: [{ rong: 110 }, { rong: 130 }],
        hang: [
            [dauXanh('Hàm (kỳ 1)'), dauXanh('Kết quả')],
            ['IPMT', { v: '-416.667', nen: 'do' }],
            ['PPMT', { v: '-2.361.111', nen: 'xanh' }],
            [{ v: 'PMT', dam: true }, { v: '-2.777.778', nen: 'vang', dam: true }],
        ],
    },
    {
        ten: 'ip-03-lich-tra-no',
        tieuDe: 'Lãi giảm dần, gốc tăng dần — dù PMT không đổi',
        cot: [{ rong: 50 }, { rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Kỳ'), dauXanh('Lãi'), dauXanh('Gốc')],
            ['1', { v: '416.667', nen: 'do' }, { v: '2.361.111', nen: 'xanh' }],
            ['18', { v: '215.000', nen: 'vang' }, { v: '2.562.778', nen: 'vang' }],
            ['36', { v: '11.500', nen: 'xanh' }, { v: '2.766.278', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ipmt-ppmt', anh: bai }];

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
