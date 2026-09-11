// Ảnh minh hoạ cho bài 1 — XMATCH
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'xm-01-cu-phap-co-ban',
        tieuDe: 'XMATCH mặc định khớp chính xác',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'XMATCH(giá_trị, mảng, [chế_độ_khớp], [chế_độ_tìm])', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'xm-02-vi-du-co-ban',
        tieuDe: 'Tìm vị trí "Bút bi" trong danh sách',
        congThuc: { o: 'C1', ct: '=XMATCH("Bút bi",A2:A5)' },
        cot: [{ rong: 100 }],
        hang: [
            [dauXanh('Sản phẩm')],
            ['Vở kẻ ngang'],
            [{ v: 'Bút bi', nen: 'xanh' }],
            ['Thước kẻ'],
        ],
        chon: 'A3',
    },
    {
        ten: 'xm-03-tim-tu-cuoi-len',
        tieuDe: 'Tìm giao dịch gần nhất — quét từ cuối lên',
        cot: [{ rong: 240 }],
        hang: [
            [{ v: 'XMATCH("KH0042",MaKhachHang,0,-1)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'xm-04-ky-tu-dai-dien',
        tieuDe: 'Khớp theo ký tự đại diện với chế_độ_khớp=2',
        congThuc: { o: 'C1', ct: '=XMATCH("Bút*",A2:A4,2)' },
        cot: [{ rong: 100 }],
        hang: [
            [dauXanh('Tên hàng')],
            [{ v: 'Bút chì', nen: 'xanh' }],
            ['Vở kẻ ngang'],
        ],
        chon: 'A2',
    },
    {
        ten: 'xm-05-khong-tim-thay',
        tieuDe: 'Không tìm thấy — báo #N/A giống MATCH',
        cot: [{ rong: 200 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=XMATCH("Không tồn tại",A2:A4)', mono: true }, { v: '#N/A', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-xmatch', anh: bai }];

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
