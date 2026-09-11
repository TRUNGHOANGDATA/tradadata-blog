// Ảnh minh hoạ cho bài 1 — AND
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'ad-01-cu-phap-co-ban',
        tieuDe: 'AND đúng khi TẤT CẢ điều kiện đều đúng',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'AND(điều_kiện1, điều_kiện2, ...)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'ad-02-duyet-don-hang',
        tieuDe: 'Duyệt đơn hàng cần cả hai tiêu chí',
        congThuc: { o: 'C2', ct: '=IF(AND(A2>=700,B2>=10000000),"Duyệt","Từ chối")' },
        cot: [{ rong: 90 }, { rong: 100 }, { rong: 80 }],
        hang: [
            [dauXanh('Điểm TD'), dauXanh('Thu nhập'), dauXanh('Kết quả')],
            ['750', '12tr', { v: 'Duyệt', nen: 'xanh' }],
            ['750', '5tr', 'Từ chối'],
        ],
        chon: 'C2',
    },
    {
        ten: 'ad-03-so-sanh-if-long',
        tieuDe: 'AND gọn hơn hẳn IF lồng hai lớp',
        cot: [{ rong: 100 }, { rong: 100 }],
        hang: [
            [dauXanh('Dùng AND'), dauXanh('IF lồng nhau')],
            ['1 lớp, gọn', '2 lớp, lặp "Từ chối"'],
        ],
    },
    {
        ten: 'ad-04-khong-ngan-mach',
        tieuDe: 'B2=0 nhưng vẫn tính C2/B2 — lỗi lan ra AND',
        congThuc: { o: 'C2', ct: '=AND(B2<>0,C2/B2>10)' },
        cot: [{ rong: 60 }, { rong: 60 }, { rong: 90 }],
        hang: [
            [dauXanh('B'), dauXanh('C'), dauXanh('AND')],
            ['0', '50', { v: '#DIV/0!', nen: 'do' }],
        ],
        chon: 'C2',
    },
    {
        ten: 'ad-05-cach-tranh-loi',
        tieuDe: 'Chặn bằng IF riêng trước khi đưa vào AND',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'IF(B2<>0, AND(B2<>0,C2/B2>10), FALSE)', mono: true, canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-and', anh: bai }];

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
