// Ảnh minh hoạ cho bài 2 — STDEV.P, STDEV.S
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'sp-01-cu-phap-co-ban',
        tieuDe: 'STDEV.S (mẫu) và STDEV.P (tổng thể)',
        cot: [{ rong: 130 }, { rong: 130 }],
        hang: [
            [dauXanh('Tên cũ'), dauXanh('Tên mới')],
            ['STDEV', 'STDEV.S'],
            ['STDEVP', 'STDEV.P'],
        ],
    },
    {
        ten: 'sp-02-cau-hoi-cot-loi',
        tieuDe: 'Dữ liệu là toàn bộ hay chỉ một phần?',
        cot: [{ rong: 160 }, { rong: 100 }],
        hang: [
            [dauXanh('Tình huống'), dauXanh('Dùng hàm')],
            ['Toàn bộ đối tượng', { v: 'STDEV.P', nen: 'xanh' }],
            ['Chỉ một mẫu đại diện', { v: 'STDEV.S', nen: 'xanh' }],
        ],
    },
    {
        ten: 'sp-03-vi-du-tinh-toan',
        tieuDe: 'Cùng dữ liệu, hai kết quả khác nhau',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=STDEV.P(80,85,90,95,100)', mono: true }, { v: '7,07', nen: 'xanh' }],
            [{ v: '=STDEV.S(80,85,90,95,100)', mono: true }, { v: '7,91', canLe: 'giua' }],
        ],
    },
    {
        ten: 'sp-04-chenh-lech-thu-hep',
        tieuDe: 'Chênh lệch thu hẹp dần khi dữ liệu càng lớn',
        cot: [{ rong: 100 }, { rong: 150 }],
        hang: [
            [dauXanh('Cỡ dữ liệu'), dauXanh('Chênh lệch P và S')],
            ['5 giá trị', 'Rõ rệt'],
            ['Hàng trăm+', { v: 'Gần như bằng nhau', nen: 'xanh' }],
        ],
    },
    {
        ten: 'sp-05-hau-qua-chon-sai',
        tieuDe: 'Chọn sai — sai về khái niệm, không phải phép tính',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: 'Toàn bộ tổng thể mà dùng STDEV.S → thổi phồng nhẹ, sai khái niệm', nen: 'vang', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-stdev-p-stdev-s', anh: bai }];

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
