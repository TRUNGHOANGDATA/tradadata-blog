// Ảnh minh hoạ cho bài 4 — DECIMAL
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'dc-01-cu-phap-co-ban',
        tieuDe: 'DECIMAL đọc chuỗi ở hệ đếm khác thành số thập phân',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'DECIMAL(văn_bản, cơ_số)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'dc-02-doc-hex-va-nhi-phan',
        tieuDe: 'Đọc lại mã hex và chuỗi nhị phân',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DECIMAL("FF",16)', mono: true }, { v: '255', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=DECIMAL("1111",2)', mono: true }, { v: '15', canLe: 'giua' }],
        ],
    },
    {
        ten: 'dc-03-kiem-tra-nguoc',
        tieuDe: 'BASE rồi DECIMAL phải khớp lại số ban đầu',
        cot: [{ rong: 220 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DECIMAL(BASE(2026,36),36)', mono: true }, { v: '2026', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'dc-04-loi-ky-tu-khong-hop-le',
        tieuDe: 'Ký tự "2","9" không tồn tại trong hệ nhị phân',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DECIMAL("129",2)', mono: true }, { v: '#NUM!', nen: 'do' }],
        ],
    },
    {
        ten: 'dc-05-kiem-tra-hop-le',
        tieuDe: 'Bọc IFERROR để kiểm tra chuỗi hợp lệ',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'IFERROR(DECIMAL(A2,2),"Không phải nhị phân hợp lệ")', mono: true, canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-decimal', anh: bai }];

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
