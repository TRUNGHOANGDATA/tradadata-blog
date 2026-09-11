// Ảnh minh hoạ cho bài 5 — VARA
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'va-01-cu-phap-co-ban',
        tieuDe: 'VARA — phiên bản mẫu, phương sai tính cả văn bản',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'VARA(giá_trị1, [giá_trị2], ...)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'vr-02-quan-he-vara-stdeva',
        tieuDe: 'VARA luôn bằng bình phương của STDEVA',
        cot: [{ rong: 220 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=VARA(80,85,90,"Chưa chấm")', mono: true }, { v: '1822,92', nen: 'xanh' }],
            [{ v: '=STDEVA(...)^2', mono: true }, { v: '1822,92', canLe: 'giua' }],
        ],
    },
    {
        ten: 'vr-03-cung-chiu-bay-thoi-phong',
        tieuDe: 'Chênh lệch còn rõ hơn STDEVA — hơn 70 lần',
        cot: [{ rong: 180 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=VAR(80,85,90)', mono: true }, { v: '25,00', nen: 'xanh' }],
            [{ v: '=VARA(80,85,90,"Chưa chấm")', mono: true }, { v: '1822,92', nen: 'do' }],
        ],
    },
    {
        ten: 'vr-04-khi-nao-dung-vara',
        tieuDe: 'Dùng thẳng VARA khi cần phương sai cho bước tiếp theo',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: 'Tránh sai số làm tròn khi tự bình phương STDEVA', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'vr-05-kiem-tra-truoc-khi-tin',
        tieuDe: 'Kiểm tra COUNTA = COUNT trước khi tin VARA',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'IF(COUNTA(...)=COUNT(...), VARA(...), "Kiểm tra lại")', mono: true, canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-vara', anh: bai }];

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
