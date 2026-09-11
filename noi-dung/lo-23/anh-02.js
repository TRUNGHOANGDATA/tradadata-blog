// Ảnh minh hoạ cho bài 2 — HARMEAN
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'hm-01-cu-phap-co-ban',
        tieuDe: 'HARMEAN tính trung bình điều hoà',
        cot: [{ rong: 240 }],
        hang: [
            [{ v: 'HARMEAN = n / tổng(1/x)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'hm-02-bai-toan-kinh-dien',
        tieuDe: 'Tốc độ trung bình cả hành trình: 60 và 40 km/h',
        cot: [{ rong: 150 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=AVERAGE(60,40)', mono: true }, { v: '50 km/h (sai)', nen: 'do' }],
            [{ v: '=HARMEAN(60,40)', mono: true }, { v: '48 km/h (đúng)', nen: 'xanh' }],
        ],
    },
    {
        ten: 'hm-03-vi-sao-trung-binh-cong-sai',
        tieuDe: 'Cùng quãng đường 120km — thời gian khác nhau',
        cot: [{ rong: 100 }, { rong: 100 }],
        hang: [
            [dauXanh('Chặng'), dauXanh('Thời gian')],
            ['60 km/h', '2 giờ'],
            ['40 km/h', '3 giờ'],
        ],
    },
    {
        ten: 'hm-04-khi-nao-dung-ham-nao',
        tieuDe: 'Cùng quãng đường → HARMEAN; cùng thời gian → AVERAGE',
        cot: [{ rong: 130 }, { rong: 130 }],
        hang: [
            [dauXanh('Cùng quãng đường'), dauXanh('Cùng thời gian')],
            [{ v: 'HARMEAN', nen: 'xanh' }, 'AVERAGE'],
        ],
    },
    {
        ten: 'hm-05-gioi-han-so-duong',
        tieuDe: 'Số âm — báo lỗi ngay, giống GEOMEAN',
        cot: [{ rong: 170 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=HARMEAN(60,-40)', mono: true }, { v: '#NUM!', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-harmean', anh: bai }];

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
