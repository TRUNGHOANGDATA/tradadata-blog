// Ảnh minh hoạ cho bài IF
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'if-01-co-ban',
        tieuDe: 'IF: đúng thì một kết quả, sai thì kết quả kia',
        congThuc: { o: 'C2', ct: '=IF(B2>=5,"Đạt","Trượt")' },
        cot: [{ rong: 130 }, { rong: 70 }, { rong: 90 }],
        hang: [
            [dauXanh('Học viên'), dauXanh('Điểm'), dauXanh('Kết quả')],
            ['An', '8', { v: 'Đạt', nen: 'xanh' }],
            ['Bình', '4', { v: 'Trượt', nen: 'do', mau: '#c0392b' }],
            ['Chi', '5', { v: 'Đạt', nen: 'xanh' }],
        ],
        chon: 'C2',
    },
    {
        ten: 'if-02-long',
        tieuDe: 'IF lồng nhau: chia nhiều bậc, xét từ cao xuống thấp',
        cot: [{ rong: 130 }, { rong: 70 }, { rong: 90 }],
        hang: [
            [dauXanh('Học viên'), dauXanh('Điểm'), dauXanh('Xếp loại')],
            ['An', '8.5', { v: 'Giỏi', nen: 'xanh' }],
            ['Bình', '7', { v: 'Khá', nen: 'xanh' }],
            ['Chi', '5.5', { v: 'TB', nen: 'vang' }],
            ['Dũng', '4', { v: 'Yếu', nen: 'do', mau: '#c0392b' }],
        ],
    },
    {
        ten: 'if-03-and',
        tieuDe: 'IF cùng AND: đúng khi MỌI điều kiện đều đạt',
        congThuc: { o: 'D2', ct: '=IF(AND(B2>=5,C2>=5),"Đạt cả hai","Chưa đạt")' },
        cot: [{ rong: 110 }, { rong: 95 }, { rong: 95 }, { rong: 120 }],
        hang: [
            [dauXanh('Học viên'), dauXanh('Lý thuyết'), dauXanh('Thực hành'), dauXanh('Kết quả')],
            ['An', '8', '6', { v: 'Đạt cả hai', nen: 'xanh' }],
            ['Bình', '9', '4', { v: 'Chưa đạt', nen: 'do', mau: '#c0392b' }],
        ],
    },
];

const LO = [{ slug: 'ham-if', anh: bai }];

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
