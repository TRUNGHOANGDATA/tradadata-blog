// Ảnh minh hoạ cho bài 1 — ROW, COLUMN
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'rc-01-row-co-ban',
        tieuDe: 'ROW() trả về số thứ tự hàng thật của ô A5',
        congThuc: { o: 'A5', ct: '=ROW()' },
        cot: [{ rong: 150 }],
        hang: [
            [''], [''], [''], [''],
            [{ v: '5', nen: 'xanh' }],
        ],
        chon: 'A5',
    },
    {
        ten: 'rc-02-danh-so-tu-dong',
        tieuDe: 'ROW()-1: STT luôn bắt đầu từ 1 dù dữ liệu ở hàng thật nào',
        congThuc: { o: 'A2', ct: '=ROW() - 1' },
        cot: [{ rong: 60 }, { rong: 150 }],
        hang: [
            [dauXanh('STT'), dauXanh('Tên')],
            [{ v: '1', nen: 'xanh' }, 'Nguyễn Văn A'],
            ['2', 'Trần Thị B'],
            ['3', 'Lê Hoàng Bảo'],
        ],
        chon: 'A2',
    },
    {
        ten: 'rc-03-sau-khi-xoa-dong',
        tieuDe: 'Xoá dòng giữa bảng — STT tự dịch lại, không để trống',
        cot: [{ rong: 60 }, { rong: 150 }],
        hang: [
            [dauXanh('STT'), dauXanh('Tên')],
            [{ v: '1', nen: 'xanh' }, 'Nguyễn Văn A'],
            [{ v: '2', nen: 'xanh' }, 'Lê Hoàng Bảo'],
        ],
    },
    {
        ten: 'rc-04-column-co-ban',
        tieuDe: 'COLUMN() trả về số thứ tự cột thật của ô C1',
        congThuc: { o: 'C1', ct: '=COLUMN()' },
        cot: [{ rong: 80 }, { rong: 80 }, { rong: 80 }],
        hang: [
            ['', '', { v: '3', nen: 'xanh' }],
        ],
        chon: 'C1',
    },
    {
        ten: 'rc-05-bang-nhan',
        tieuDe: 'ROW()*COLUMN() — bảng cửu chương tự thích ứng theo vị trí',
        congThuc: { o: 'B2', ct: '=ROW()*COLUMN()' },
        cot: [{ rong: 60 }, { rong: 60 }, { rong: 60 }],
        hang: [
            ['', { v: '2', nen: 'vang' }, { v: '3', nen: 'vang' }],
            [{ v: '2', nen: 'vang' }, { v: '4', nen: 'xanh' }, '6'],
            [{ v: '3', nen: 'vang' }, '6', '9'],
        ],
        chon: 'B2',
    },
    {
        ten: 'rc-06-tham-chieu-o-khac',
        tieuDe: 'Truyền tham chiếu để lấy vị trí của một ô KHÁC',
        cot: [{ rong: 200 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=ROW(D10)', mono: true }, { v: '10', nen: 'xanh' }],
            [{ v: '=COLUMN(D10)', mono: true }, { v: '4', nen: 'xanh' }],
        ],
    },
];

const LO = [{ slug: 'ham-row-column', anh: bai }];

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
