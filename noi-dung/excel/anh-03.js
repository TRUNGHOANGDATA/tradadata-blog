// Ảnh minh hoạ cho bài 3 — Các mã lỗi thường gặp
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'le-01-sau-loi',
        tieuDe: 'Sáu mã lỗi và ý nghĩa',
        cot: [{ rong: 90 }, { rong: 230 }],
        hang: [
            [dauXanh('Mã lỗi'), dauXanh('Nghĩa')],
            ['#DIV/0!', 'Chia cho 0 hoặc ô trống'],
            ['#N/A', 'Không tìm thấy giá trị cần tra'],
            ['#VALUE!', 'Đưa văn bản vào phép tính'],
            ['#REF!', 'Tham chiếu đã bị xoá'],
            ['#NAME?', 'Sai tên hàm hoặc tên vùng'],
            ['#NUM!', 'Phép tính không có nghĩa'],
        ],
    },
    {
        ten: 'le-02-error-type',
        tieuDe: 'ERROR.TYPE trả mã số cho từng loại lỗi',
        congThuc: { o: 'B2', ct: '=ERROR.TYPE(A2)' },
        cot: [{ rong: 90 }, { rong: 80 }],
        hang: [
            [dauXanh('Lỗi'), dauXanh('Mã')],
            ['#DIV/0!', '2'],
            ['#VALUE!', '3'],
            ['#N/A', '7'],
        ],
    },
    {
        ten: 'le-03-iferror',
        tieuDe: 'Bọc IFERROR ở lớp trình bày, không ở lớp tính',
        congThuc: { o: 'B2', ct: '=IFERROR(VLOOKUP(...),"Không tìm thấy")' },
        cot: [{ rong: 260 }],
        hang: [
            [{ v: '#N/A  →  "Không tìm thấy"', canLe: 'giua', nen: 'xanh' }],
        ],
    },
];

const LO = [{ slug: 'loi-excel', anh: bai }];

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
