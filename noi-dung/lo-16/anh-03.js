// Ảnh minh hoạ cho bài 3 — NOT
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'nt-01-cu-phap-co-ban',
        tieuDe: 'NOT đảo ngược một giá trị luận lý',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=NOT(TRUE)', mono: true }, { v: 'FALSE', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=NOT(FALSE)', mono: true }, { v: 'TRUE', canLe: 'giua' }],
        ],
    },
    {
        ten: 'nt-02-chi-nhan-mot-doi-so',
        tieuDe: 'NOT chỉ nhận đúng một đối số — khác AND/OR',
        cot: [{ rong: 200 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=NOT(A2>0,B2>0)', mono: true }, { v: '#VALUE!', nen: 'do' }],
        ],
    },
    {
        ten: 'nt-03-not-isblank',
        tieuDe: 'NOT(ISBLANK()) đọc rõ ý hơn A2<>""',
        congThuc: { o: 'B2', ct: '=IF(NOT(ISBLANK(A2)),"Đã nhập","Chưa nhập")' },
        cot: [{ rong: 80 }, { rong: 90 }],
        hang: [
            [dauXanh('Ô A'), dauXanh('Kết quả')],
            ['Có dữ liệu', { v: 'Đã nhập', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'nt-04-dao-nguoc-dieu-kien-loc',
        tieuDe: 'Dễ liệt kê điều kiện loại trừ hơn điều kiện chấp nhận',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'NOT(OR(NhomHang="Ngừng bán", TonKho=0))', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'nt-05-so-sanh-truc-tiep',
        tieuDe: 'Với so sánh đơn giản, <> thường gọn hơn NOT',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Cách viết'), dauXanh('Kết quả')],
            [{ v: '=NOT(A2=B2)', mono: true }, { v: 'giống hệt', canLe: 'giua' }],
            [{ v: '=A2<>B2', mono: true }, { v: 'gọn hơn', nen: 'xanh', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-not', anh: bai }];

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
