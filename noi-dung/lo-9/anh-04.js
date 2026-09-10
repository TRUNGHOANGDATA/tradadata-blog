// Ảnh minh hoạ cho bài 4 — DATEVALUE, TIMEVALUE
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'dv-01-cu-phap-co-ban',
        tieuDe: 'DATEVALUE và TIMEVALUE — chuyển văn bản thành số',
        cot: [{ rong: 190 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DATEVALUE("15/03/2026")', mono: true }, { v: '46096', nen: 'xanh' }],
            [{ v: '=TIMEVALUE("08:45:30")', mono: true }, { v: '0,3649', nen: 'xanh' }],
        ],
    },
    {
        ten: 'dv-02-can-trai-la-text',
        tieuDe: 'Căn trái là dấu hiệu của văn bản, không phải ngày thật',
        cot: [{ rong: 110 }, { rong: 100 }],
        hang: [
            [dauXanh('Ô A'), dauXanh('Căn lề')],
            [{ v: '15/03/2026', canLe: 'phai' }, 'Phải — ngày thật'],
            [{ v: '15/03/2026', canLe: 'trai', nen: 'do' }, 'Trái — văn bản'],
        ],
    },
    {
        ten: 'dv-03-sua-bang-datevalue',
        tieuDe: 'Chuyển cột văn bản thành ngày thật bằng DATEVALUE',
        congThuc: { o: 'B2', ct: '=DATEVALUE(A2)' },
        cot: [{ rong: 110 }, { rong: 100 }],
        hang: [
            [dauXanh('A: văn bản'), dauXanh('B: ngày thật')],
            [{ v: '15/03/2026', canLe: 'trai' }, { v: '15/03/2026', canLe: 'phai', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'dv-04-mo-ho-vung-mien',
        tieuDe: 'Cùng một chuỗi, hai vùng miền hiểu thành hai ngày khác nhau',
        cot: [{ rong: 130 }, { rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Chuỗi gốc'), dauXanh('Vùng miền VN'), dauXanh('Vùng miền Mỹ')],
            [{ v: '"03/04/2026"', mono: true }, '3 tháng 4', '4 tháng 3'],
        ],
    },
    {
        ten: 'dv-05-timevalue',
        tieuDe: 'TIMEVALUE chuyển giờ chấm công dạng văn bản',
        congThuc: { o: 'B2', ct: '=TIMEVALUE(A2)' },
        cot: [{ rong: 110 }, { rong: 90 }],
        hang: [
            [dauXanh('A: văn bản'), dauXanh('B: giờ thật')],
            [{ v: '08:45:30', canLe: 'trai' }, { v: '08:45:30', canLe: 'phai', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
];

const LO = [{ slug: 'ham-datevalue-timevalue', anh: bai }];

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
