// Ảnh minh hoạ cho bài 1 — IMAGE
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'im-01-cu-phap-co-ban',
        tieuDe: 'IMAGE chèn ảnh từ URL vào một ô',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'IMAGE(url, [alt], [kích_cỡ], [cao], [rộng])', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'im-02-danh-muc-san-pham',
        tieuDe: 'Bảng danh mục sản phẩm — ảnh đi kèm mỗi dòng',
        congThuc: { o: 'C2', ct: '=IMAGE(B2)' },
        cot: [{ rong: 100 }, { rong: 130 }, { rong: 60 }],
        hang: [
            [dauXanh('Sản phẩm'), dauXanh('URL ảnh'), dauXanh('Ảnh')],
            ['Bút bi cao cấp', 'cdn.shop/but.png', { v: '[ảnh]', nen: 'xanh', canLe: 'giua' }],
        ],
        chon: 'C2',
    },
    {
        ten: 'im-03-khac-biet-anh-noi',
        tieuDe: 'Ảnh nổi vs ảnh trong ô — ai theo dữ liệu, ai không',
        cot: [{ rong: 100 }, { rong: 160 }],
        hang: [
            [dauXanh('Kiểu ảnh'), dauXanh('Khi lọc / sắp xếp')],
            ['Insert Picture (nổi)', { v: 'Đứng yên, không theo dòng', nen: 'do' }],
            ['IMAGE (trong ô)', { v: 'Theo đúng dòng dữ liệu', nen: 'xanh' }],
        ],
    },
    {
        ten: 'im-04-kiem-soat-kich-co',
        tieuDe: 'Tham số kích_cỡ = 1 kéo ảnh lấp đầy ô',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: '=IMAGE(B2,"Ảnh sản phẩm",1)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'im-05-loi-url-khong-truy-cap',
        tieuDe: 'URL nội bộ hoặc riêng tư — IMAGE không hiển thị được',
        cot: [{ rong: 220 }, { rong: 90 }],
        hang: [
            [dauXanh('URL'), dauXanh('Kết quả')],
            [{ v: 'noi-bo.congty.local/anh.png', mono: true }, { v: '#VALUE!', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-image', anh: bai }];

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
