// Ảnh minh hoạ cho bài 4 — DMAX, DMIN
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'dm-01-cu-phap-co-ban',
        tieuDe: 'DMAX và DMIN cùng cấu trúc vùng điều kiện',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'DMAX(vùng, trường, đk)  /  DMIN(vùng, trường, đk)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'dm-02-gia-cao-nhat-nhieu-nhom',
        tieuDe: 'Giá cao nhất trong Điện tử hoặc Gia dụng',
        cot: [{ rong: 100 }],
        hang: [
            [dauXanh('NhómHàng')],
            ['Điện tử'],
            ['Gia dụng'],
        ],
    },
    {
        ten: 'dm-03-tra-ve-0-khong-loi',
        tieuDe: 'Không khớp — trả về 0, không báo lỗi',
        cot: [{ rong: 180 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=DMAX(A1:D50,"Giá",F1:F2)', mono: true }, { v: '0', nen: 'vang', canLe: 'giua' }],
        ],
    },
    {
        ten: 'dm-04-canh-bao-ton-kho-thap',
        tieuDe: 'Tồn kho thấp nhất — chỉ nhóm đang bán',
        cot: [{ rong: 100 }, { rong: 100 }],
        hang: [
            [dauXanh('NhómHàng'), dauXanh('TrạngThái')],
            ['Điện tử', 'Đang bán'],
        ],
    },
    {
        ten: 'dm-05-tinh-khoang-chenh-lech',
        tieuDe: 'DMAX trừ DMIN — khoảng chênh lệch giá',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'DMAX(...,"Giá",...) − DMIN(...,"Giá",...)', mono: true, canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-dmax-dmin', anh: bai }];

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
