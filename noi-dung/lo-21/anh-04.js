// Ảnh minh hoạ cho bài 4 — STDEVA
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'sd-01-cu-phap-co-ban',
        tieuDe: 'STDEVA — phiên bản mẫu, cùng quy tắc quy đổi',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'STDEVA(giá_trị1, [giá_trị2], ...)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'sd-02-thoi-phong-do-lech-chuan',
        tieuDe: 'Một ô văn bản thổi phồng kết quả gấp 8 lần',
        cot: [{ rong: 180 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=STDEV(80,85,90)', mono: true }, { v: '5,00', nen: 'xanh' }],
            [{ v: '=STDEVA(80,85,90,"Chưa chấm")', mono: true }, { v: '42,70', nen: 'do' }],
        ],
    },
    {
        ten: 'sd-03-vi-sao-nghiem-trong-hon',
        tieuDe: 'Bình phương khoảng cách khuếch đại sai lệch',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: 'AVERAGEA: lệch tuyến tính  —  STDEVA: lệch theo bình phương', nen: 'vang', canLe: 'giua' }],
        ],
    },
    {
        ten: 'sd-04-ung-dung-dung-cho',
        tieuDe: 'Checkbox thật sự mang ý nghĩa 0/1 trong khảo sát',
        cot: [{ rong: 100 }, { rong: 130 }],
        hang: [
            [dauXanh('Phản hồi'), dauXanh('Giá trị')],
            ['1-5 (thang điểm)', 'Số thật'],
            [{ v: 'TRUE/FALSE (checkbox)', canLe: 'trai' }, '1 hoặc 0'],
        ],
    },
    {
        ten: 'sd-05-kiem-tra-du-lieu-truoc',
        tieuDe: 'So sánh COUNTA và COUNT để phát hiện ô không phải số',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: '=COUNTA(B2:B20)-COUNT(B2:B20)', mono: true, canLe: 'giua' }],
            [{ v: 'Khác 0 → có ô văn bản/luận lý cần kiểm tra', nen: 'vang', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-stdeva', anh: bai }];

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
