// Ảnh minh hoạ cho bài 1 — CORREL
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const DU_LIEU = [
    dauXanh('Tháng'), dauXanh('Chi phí QC (tr)'), dauXanh('Doanh thu (tr)'),
];
const HANG_GOC = [
    ['1', '10', '120'], ['2', '15', '150'], ['3', '12', '135'],
    ['4', '20', '200'], ['5', '18', '180'], ['6', '25', '240'],
];

const bai = [
    {
        ten: 'cr-01-du-lieu',
        tieuDe: 'Chi phí quảng cáo và doanh thu — 6 tháng',
        cot: [{ rong: 70 }, { rong: 150 }, { rong: 150 }],
        hang: [DU_LIEU, ...HANG_GOC],
    },
    {
        ten: 'cr-02-cong-thuc',
        tieuDe: 'CORREL đo mức độ hai biến di chuyển cùng nhau',
        congThuc: { o: 'E2', ct: '=CORREL(B2:B7, C2:C7)' },
        cot: [{ rong: 70 }, { rong: 130 }, { rong: 130 }, { rong: 30 }, { rong: 150 }],
        hang: [
            [...DU_LIEU, '', dauXanh('Hệ số tương quan')],
            [...HANG_GOC[0], '', { v: '0,996', nen: 'xanh' }],
            HANG_GOC[1], HANG_GOC[2], HANG_GOC[3], HANG_GOC[4], HANG_GOC[5],
        ],
        chon: 'E2',
    },
    {
        ten: 'cr-03-doc-ket-qua',
        tieuDe: 'Đọc khoảng giá trị của CORREL',
        cot: [{ rong: 150 }, { rong: 320 }],
        hang: [
            [dauXanh('Kết quả CORREL'), dauXanh('Ý nghĩa')],
            [{ v: 'Gần 1', canLe: 'giua', nen: 'xanh' }, 'Hai biến tăng cùng nhau rất chặt chẽ'],
            [{ v: 'Gần 0', canLe: 'giua' }, 'Gần như không có quan hệ tuyến tính'],
            [{ v: 'Gần -1', canLe: 'giua', nen: 'do' }, 'Hai biến di chuyển ngược chiều chặt chẽ'],
        ],
    },
    {
        ten: 'cr-04-quan-he-phi-tuyen',
        tieuDe: 'Đường cong parabol hoàn hảo — CORREL vẫn ra đúng 0',
        congThuc: { o: 'C9', ct: '=CORREL(A2:A8, B2:B8)' },
        cot: [{ rong: 70 }, { rong: 90 }, { rong: 30 }, { rong: 200 }],
        hang: [
            [dauXanh('x'), dauXanh('y = x²'), '', dauXanh('CORREL')],
            ['-3', '9', '', ''],
            ['-2', '4', '', ''],
            ['-1', '1', '', ''],
            ['0', '0', '', ''],
            ['1', '1', '', ''],
            ['2', '4', '', ''],
            ['3', '9', '', { v: '0 (đúng vậy!)', nen: 'do' }],
        ],
        chon: 'D9',
    },
];

const LO = [{ slug: 'ham-correl', anh: bai }];

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
