// Ảnh minh hoạ cho bài 2 — MINIFS
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'mn-01-cu-phap-co-ban',
        tieuDe: 'MINIFS = MIN có điều kiện',
        cot: [{ rong: 200 }],
        hang: [
            [{ v: 'MINIFS(vùng_min, vùng_đk1, đk1, ...)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'mn-02-gia-thap-nhat',
        tieuDe: 'Giá thấp nhất trong nhóm Văn phòng phẩm',
        congThuc: { o: 'C2', ct: '=MINIFS(B2:B5,A2:A5,"Văn phòng phẩm")' },
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Nhóm hàng'), dauXanh('Giá bán')],
            ['Văn phòng phẩm', { v: '5.000', nen: 'xanh' }],
            ['Văn phòng phẩm', '12.000'],
            ['Điện tử', '450.000'],
        ],
        chon: 'B2',
    },
    {
        ten: 'mn-03-ky-tu-dai-dien',
        tieuDe: 'Ký tự đại diện * khớp mọi tên bắt đầu bằng "Bút"',
        congThuc: { o: 'C1', ct: '=MINIFS(GiaBan,TenHang,"Bút*")' },
        cot: [{ rong: 100 }, { rong: 90 }],
        hang: [
            [dauXanh('Tên hàng'), dauXanh('Giá bán')],
            ['Bút bi', { v: '3.000', nen: 'xanh' }],
            ['Bút chì', '4.000'],
            ['Thước kẻ', '6.000'],
        ],
    },
    {
        ten: 'mn-04-nhieu-dieu-kien',
        tieuDe: 'Thêm điều kiện còn tồn kho',
        cot: [{ rong: 240 }],
        hang: [
            [{ v: 'MINIFS(GiaBan,NhomHang,"VPP",TonKho,">0")', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'mn-05-thay-the-ban-cu',
        tieuDe: 'Công thức mảng thay thế cho Excel bản cũ',
        cot: [{ rong: 240 }],
        hang: [
            [{ v: '{=MIN(IF(NhomHang="VPP",GiaBan))}', mono: true, canLe: 'giua' }],
            [{ v: 'nhấn Ctrl+Shift+Enter', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-minifs', anh: bai }];

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
