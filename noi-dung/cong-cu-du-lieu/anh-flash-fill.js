// Ảnh minh hoạ cho bài Flash Fill
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'ff-01-go-mau',
        tieuDe: 'Gõ một mẫu — Ctrl+E để Excel đoán và điền tiếp',
        cot: [{ rong: 170 }, { rong: 90 }],
        hang: [
            [dauXanh('Họ và tên'), dauXanh('Tên')],
            ['Nguyễn Văn An', { v: 'An', nen: 'vang', dam: true }],
            ['Trần Thị Bình', { v: '', nen: 'xanh' }],
            ['Lê Văn Cường', { v: '', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'ff-02-vi-du-nhieu-dong',
        tieuDe: 'Quy luật phức tạp hơn: gõ 2 dòng mẫu cho chắc',
        cot: [{ rong: 170 }, { rong: 120 }],
        hang: [
            [dauXanh('Họ và tên'), dauXanh('Tên viết hoa')],
            ['nguyễn văn an', { v: 'AN', nen: 'vang', dam: true }],
            ['trần thị bình', { v: 'BÌNH', nen: 'vang', dam: true }],
            ['lê văn cường', { v: '', nen: 'xanh' }],
        ],
    },
    {
        ten: 'ff-03-tinh-vs-cong-thuc',
        tieuDe: 'Flash Fill là GIÁ TRỊ TĨNH — sửa nguồn không tự cập nhật',
        cot: [{ rong: 130 }, { rong: 140 }],
        hang: [
            [dauXanh('Cách làm'), dauXanh('Sửa nguồn thì sao?')],
            [{ v: 'Flash Fill', nen: 'do' }, { v: 'Không đổi theo', mau: '#c0392b', dam: true }],
            [{ v: '=LEFT/MID(...)', nen: 'xanh' }, { v: 'Tự tính lại ngay', dam: true }],
        ],
    },
];

const LO = [{ slug: 'flash-fill', anh: bai }];

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
