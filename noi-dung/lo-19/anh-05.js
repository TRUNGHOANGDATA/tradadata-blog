// Ảnh minh hoạ cho bài 5 — DGET
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'dg-01-cu-phap-co-ban',
        tieuDe: 'DGET lấy đúng một giá trị duy nhất',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: 'DGET(vùng_dữ_liệu, trường, vùng_điều_kiện)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'dg-02-tra-cuu-nhieu-cot',
        tieuDe: 'Đối chiếu 2 cột để xác định đúng 1 dòng',
        cot: [{ rong: 100 }, { rong: 100 }],
        hang: [
            [dauXanh('SảnPhẩm'), dauXanh('NhàCC')],
            ['Bút bi', 'NCC01'],
        ],
    },
    {
        ten: 'dg-03-loi-nhieu-hon-mot-dong',
        tieuDe: 'Khớp 2 dòng cùng lúc — DGET từ chối đoán',
        cot: [{ rong: 200 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DGET(A1:D50,"Giá",F1:F2)', mono: true }, { v: '#NUM!', nen: 'do' }],
        ],
    },
    {
        ten: 'dg-04-phat-hien-trung-lap',
        tieuDe: 'DGET lỗi = tín hiệu dữ liệu bị trùng lặp',
        cot: [{ rong: 100 }, { rong: 160 }],
        hang: [
            [dauXanh('Hàm'), dauXanh('Khi trùng lặp')],
            ['VLOOKUP', { v: 'Im lặng lấy dòng đầu', nen: 'do' }],
            ['DGET', { v: 'Báo lỗi ngay #NUM!', nen: 'xanh' }],
        ],
    },
    {
        ten: 'dg-05-khong-khop-dong-nao',
        tieuDe: 'Không khớp dòng nào — lỗi khác: #VALUE!',
        cot: [{ rong: 200 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DGET(A1:D50,"Giá",F1:F2)', mono: true }, { v: '#VALUE!', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-dget', anh: bai }];

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
