// Ảnh minh hoạ cho bài 5 — NOW
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'nw-01-cu-phap-co-ban',
        tieuDe: 'NOW không cần đối số nào',
        cot: [{ rong: 150 }, { rong: 130 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=NOW()', mono: true }, { v: '10/09/2026 14:35:22', nen: 'xanh' }],
        ],
    },
    {
        ten: 'nw-02-khac-biet-today',
        tieuDe: 'TODAY chỉ có ngày — NOW có cả giờ',
        cot: [{ rong: 130 }, { rong: 150 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=TODAY()', mono: true }, { v: '10/09/2026', canLe: 'giua' }],
            [{ v: '=NOW()', mono: true }, { v: '10/09/2026 14:35:22', nen: 'xanh' }],
        ],
    },
    {
        ten: 'nw-03-tinh-khoang-con-lai',
        tieuDe: 'Đếm ngược chính xác tới từng giờ bằng NOW',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'HanChot − NOW()  →  còn bao nhiêu GIỜ, không chỉ NGÀY', canLe: 'giua' }],
        ],
    },
    {
        ten: 'nw-04-ham-bien-dong',
        tieuDe: 'NOW là hàm biến động — tự tính lại liên tục',
        cot: [{ rong: 100 }, { rong: 150 }],
        hang: [
            [dauXanh('Sự kiện'), dauXanh('NOW() có đổi?')],
            ['Mở lại file', { v: 'Có — đổi ngay', nen: 'vang' }],
            ['Sửa bất kỳ ô nào', { v: 'Có — đổi ngay', nen: 'vang' }],
        ],
    },
    {
        ten: 'nw-05-khong-dung-dong-dau',
        tieuDe: 'Không dùng NOW để đóng dấu thời gian cố định',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'Cần Paste Special → Values để "đóng băng" giá trị', nen: 'do', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-now', anh: bai }];

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
