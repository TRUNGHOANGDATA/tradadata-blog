// Ảnh minh hoạ cho bài 5 — FREQUENCY
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'fr-01-cu-phap-co-ban',
        tieuDe: 'FREQUENCY đếm số lượng theo từng khoảng',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: 'FREQUENCY(mảng_dữ_liệu, mảng_khoảng)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'fr-02-phan-phoi-diem-thi',
        tieuDe: 'Phân phối điểm thi vào 5 khoảng xếp loại',
        congThuc: { o: 'C1', ct: '=FREQUENCY(A2:A11,{59,69,79,89})' },
        cot: [{ rong: 60 }, { rong: 60 }],
        hang: [
            [dauXanh('Khoảng'), dauXanh('Số lượng')],
            ['≤59', { v: '2', nen: 'xanh', canLe: 'giua' }],
            ['60-69', { v: '2', canLe: 'giua' }],
            ['70-79', { v: '2', canLe: 'giua' }],
            ['80-89', { v: '2', canLe: 'giua' }],
            ['>89', { v: '2', canLe: 'giua' }],
        ],
    },
    {
        ten: 'fr-03-nhap-cong-thuc-mang',
        tieuDe: 'Excel 365 tự tràn — bản cũ cần chọn đủ vùng trước CSE',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: 'Chọn thiếu ô → mất phần kết quả cuối', nen: 'do', canLe: 'giua' }],
        ],
    },
    {
        ten: 'fr-04-so-sanh-countifs',
        tieuDe: 'Một FREQUENCY thay cho nhiều COUNTIFS lặp lại',
        cot: [{ rong: 130 }, { rong: 130 }],
        hang: [
            [dauXanh('FREQUENCY'), dauXanh('COUNTIFS tương đương')],
            ['1 công thức', '5 công thức riêng'],
        ],
    },
    {
        ten: 'fr-05-bo-qua-o-trong-va-text',
        tieuDe: 'Tự động bỏ qua ô trống và ô chứa văn bản',
        cot: [{ rong: 100 }, { rong: 100 }],
        hang: [
            [dauXanh('Ô dữ liệu'), dauXanh('Được tính?')],
            ['85', { v: 'Có', nen: 'xanh', canLe: 'giua' }],
            ['Vắng thi', { v: 'Không', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-frequency', anh: bai }];

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
