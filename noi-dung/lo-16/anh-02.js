// Ảnh minh hoạ cho bài 2 — OR
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'or-01-cu-phap-co-ban',
        tieuDe: 'OR đúng khi ÍT NHẤT MỘT điều kiện đúng',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'OR(điều_kiện1, điều_kiện2, ...)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'or-02-gan-co-ngoai-le',
        tieuDe: 'Gắn cờ ngoại lệ khi một trong hai điều kiện sai',
        congThuc: { o: 'C2', ct: '=IF(OR(A2<0,B2<0),"Cần kiểm tra","Bình thường")' },
        cot: [{ rong: 80 }, { rong: 80 }, { rong: 100 }],
        hang: [
            [dauXanh('Tồn kho'), dauXanh('Giá bán'), dauXanh('Kết quả')],
            ['-5', '20000', { v: 'Cần kiểm tra', nen: 'do' }],
            ['10', '20000', 'Bình thường'],
        ],
        chon: 'C2',
    },
    {
        ten: 'or-03-gop-nhieu-truong-hop',
        tieuDe: 'Gộp Thứ Bảy hoặc Chủ Nhật vào một điều kiện',
        congThuc: { o: 'B1', ct: '=IF(OR(A1="Thứ Bảy",A1="Chủ Nhật"),"Cuối tuần","Ngày thường")' },
        cot: [{ rong: 100 }, { rong: 100 }],
        hang: [
            [dauXanh('Ngày'), dauXanh('Kết quả')],
            [{ v: 'Thứ Bảy', nen: 'xanh' }, { v: 'Cuối tuần', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'or-04-khong-ngan-mach',
        tieuDe: 'OR cũng tính hết mọi đối số, dù đã biết kết quả',
        cot: [{ rong: 60 }, { rong: 60 }, { rong: 90 }],
        hang: [
            [dauXanh('B'), dauXanh('C'), dauXanh('OR')],
            ['0', '50', { v: '#DIV/0!', nen: 'do' }],
        ],
    },
    {
        ten: 'or-05-ket-hop-and-or',
        tieuDe: 'Kết hợp AND và OR trong cùng công thức',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'AND(Điểm>=50, OR(ThamGia="Đủ", MienThi="Có"))', mono: true, canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-or', anh: bai }];

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
