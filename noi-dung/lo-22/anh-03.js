// Ảnh minh hoạ cho bài 3 — VAR.P, VAR.S
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'vp-01-cu-phap-co-ban',
        tieuDe: 'VAR.S (mẫu) và VAR.P (tổng thể)',
        cot: [{ rong: 130 }, { rong: 130 }],
        hang: [
            [dauXanh('Tên cũ'), dauXanh('Tên mới')],
            ['VAR', 'VAR.S'],
            ['VARP', 'VAR.P'],
        ],
    },
    {
        ten: 'vp-02-quan-he-var-stdev',
        tieuDe: 'VAR.P luôn bằng STDEV.P bình phương',
        cot: [{ rong: 200 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=VAR.P(80,85,90,95,100)', mono: true }, { v: '50,00', nen: 'xanh' }],
            [{ v: '=STDEV.P(...)^2', mono: true }, { v: '50,00', canLe: 'giua' }],
        ],
    },
    {
        ten: 'vp-03-cung-cau-hoi-cot-loi',
        tieuDe: 'Cùng câu hỏi cốt lõi: tổng thể hay mẫu',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: 'Áp dụng đúng quy tắc như STDEV.P/STDEV.S', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'vp-04-vi-du-tinh-toan',
        tieuDe: 'Cùng dữ liệu, chênh lệch rõ hơn STDEV',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=VAR.P(80,85,90,95,100)', mono: true }, { v: '50,00', nen: 'xanh' }],
            [{ v: '=VAR.S(80,85,90,95,100)', mono: true }, { v: '62,50', nen: 'do' }],
        ],
    },
    {
        ten: 'vp-05-khi-nao-dung-var-truc-tiep',
        tieuDe: 'Dùng thẳng VAR khi cần cho bước tính tiếp theo',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: 'Tránh sai số làm tròn khi tự bình phương STDEV', nen: 'xanh', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-var-p-var-s', anh: bai }];

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
