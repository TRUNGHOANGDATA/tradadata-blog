// Ảnh minh hoạ cho bài 4 — Nhập ngày tháng đúng cách
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });
const vanBan = t => ({ v: t, canLe: 'trai', nen: 'do' });

const bai = [
    {
        ten: 'ng-01-short-date',
        tieuDe: 'Cùng chuỗi, hai máy hiểu khác nhau',
        cot: [{ rong: 100 }, { rong: 130 }, { rong: 130 }],
        hang: [
            [dauXanh('Bạn gõ'), dauXanh('Máy dd/MM/yyyy'), dauXanh('Máy M/d/yyyy')],
            ['03/04/2025', 'Ngày 3 tháng 4', 'Ngày 4 tháng 3'],
        ],
    },
    {
        ten: 'ng-02-go-gi-hieu-gi',
        tieuDe: 'Máy dd/MM/yyyy: gõ gì hiểu gì',
        cot: [{ rong: 130 }, { rong: 190 }],
        hang: [
            [dauXanh('Bạn gõ'), dauXanh('Excel hiểu')],
            [{ v: '25/12/2025', canLe: 'trai' }, { v: 'Ngày 25/12/2025', nen: 'xanh' }],
            [{ v: '2025-12-25', canLe: 'trai' }, { v: 'Ngày — máy nào cũng hiểu', nen: 'xanh' }],
            [vanBan('25.12.2025'), { v: 'Văn bản (dấu chấm)', nen: 'do' }],
            [vanBan('12/25/2025'), { v: 'Văn bản (kiểu Mỹ)', nen: 'do' }],
        ],
    },
    {
        ten: 'ng-03-ham-date',
        tieuDe: 'DATE() đúng trên mọi máy',
        congThuc: { o: 'A1', ct: '=DATE(2025,12,25)' },
        cot: [{ rong: 130 }],
        hang: [
            [{ v: '25/12/2025', canLe: 'phai', nen: 'xanh' }],
        ],
    },
    {
        ten: 'ng-04-countifs-date',
        tieuDe: 'Lọc theo ngày dùng DATE, đừng gõ chuỗi ngày',
        congThuc: { o: 'A1', ct: '=COUNTIFS(...,">="&DATE(2025,3,1),...)' },
        cot: [{ rong: 90 }],
        hang: [
            [{ v: '7', dam: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'ng-05-text-to-columns',
        tieuDe: 'Sửa cả cột ngày văn bản: Text to Columns › DMY',
        cot: [{ rong: 120 }, { rong: 120 }],
        hang: [
            [dauXanh('Trước'), dauXanh('Sau (DMY)')],
            [vanBan('12/25/2025'), { v: '25/12/2025', canLe: 'phai', nen: 'xanh' }],
            [vanBan('03/14/2025'), { v: '14/03/2025', canLe: 'phai', nen: 'xanh' }],
        ],
    },
];

const LO = [{ slug: 'ngay-thang', anh: bai }];

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
