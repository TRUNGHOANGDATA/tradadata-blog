// Ảnh minh hoạ cho bài 3 — MINA
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'mn-01-cu-phap-co-ban',
        tieuDe: 'MINA cùng quy tắc quy đổi, tìm giá trị nhỏ nhất',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'MINA(giá_trị1, [giá_trị2], ...)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'mn-02-nguy-hiem-so-duong',
        tieuDe: 'Một ô FALSE kéo MINA về 0 dù toàn số dương',
        cot: [{ rong: 150 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=MIN(5,8,3)', mono: true }, { v: '3', canLe: 'giua' }],
            [{ v: '=MINA(5,8,3,FALSE)', mono: true }, { v: '0', nen: 'do', canLe: 'giua' }],
        ],
    },
    {
        ten: 'mn-03-van-ban-tuong-tu-false',
        tieuDe: 'Văn bản gây hiệu ứng giống hệt FALSE',
        cot: [{ rong: 180 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=MINA(5,8,3,"Không rõ")', mono: true }, { v: '0', nen: 'do', canLe: 'giua' }],
        ],
    },
    {
        ten: 'mn-04-ung-dung-hop-le',
        tieuDe: 'FALSE = 0% tiến độ là một mức hợp lệ',
        cot: [{ rong: 150 }, { rong: 100 }],
        hang: [
            [dauXanh('Ô'), dauXanh('Ý nghĩa')],
            [{ v: 'FALSE', canLe: 'trai' }, 'Chưa hoàn thành = 0%'],
        ],
    },
    {
        ten: 'mn-05-kiem-tra-truoc-khi-chon',
        tieuDe: 'Chạy song song MIN và MINA để phát hiện lệch',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Hàm'), dauXanh('Kết quả')],
            ['MIN', '3'],
            ['MINA', { v: '0 ← khác nhau, cần kiểm tra', nen: 'vang' }],
        ],
    },
];

const LO = [{ slug: 'ham-mina', anh: bai }];

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
