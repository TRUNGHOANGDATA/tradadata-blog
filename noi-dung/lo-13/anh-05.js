// Ảnh minh hoạ cho bài 5 — SORTBY
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'sb-01-cu-phap-co-ban',
        tieuDe: 'SORTBY sắp theo một mảng khác',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: 'SORTBY(mảng, mảng_sắp_xếp, [thứ_tự])', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'sb-02-hien-ten-sap-theo-diem',
        tieuDe: 'Hiện tên, sắp theo điểm số giảm dần',
        congThuc: { o: 'D1', ct: '=SORTBY(A2:A4,B2:B4,-1)' },
        cot: [{ rong: 90 }, { rong: 70 }],
        hang: [
            [dauXanh('Tên'), dauXanh('Điểm')],
            [{ v: 'Bình', nen: 'xanh' }, { v: '95', nen: 'xanh' }],
            ['An', '80'],
            ['Chi', '70'],
        ],
    },
    {
        ten: 'sb-03-sap-xep-ca-bang',
        tieuDe: 'Sắp cả bảng nhiều cột theo doanh số',
        congThuc: { o: 'E1', ct: '=SORTBY(A2:C10,C2:C10,-1)' },
        cot: [{ rong: 100 }, { rong: 90 }, { rong: 80 }],
        hang: [
            [dauXanh('Sản phẩm'), dauXanh('Nhóm hàng'), dauXanh('Doanh số')],
            [{ v: 'Bút cao cấp', nen: 'xanh' }, { v: 'VPP', nen: 'xanh' }, { v: '25tr', nen: 'xanh' }],
        ],
    },
    {
        ten: 'sb-04-nhieu-tieu-chi',
        tieuDe: 'Kết hợp nhiều cấp tiêu chí sắp xếp',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'SORTBY(A2:C10, B2:B10,1, C2:C10,-1)', mono: true, canLe: 'giua' }],
            [{ v: 'Nhóm hàng tăng dần → trong nhóm, Doanh số giảm dần', canLe: 'giua' }],
        ],
    },
    {
        ten: 'sb-05-mang-dong-tu-cap-nhat',
        tieuDe: 'Kết quả là mảng động, tự cập nhật khi sửa dữ liệu gốc',
        cot: [{ rong: 240 }],
        hang: [
            [{ v: 'Chỉ Excel 365 / 2021+ — kết quả tự "tràn" ra', nen: 'xanh', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-sortby', anh: bai }];

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
