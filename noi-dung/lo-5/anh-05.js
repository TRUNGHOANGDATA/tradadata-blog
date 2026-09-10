// Ảnh minh hoạ cho bài 5 — CHAR, CODE
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'cc2-01-code-co-ban',
        tieuDe: 'CODE — tra mã số của ký tự "A"',
        congThuc: { o: 'B1', ct: '=CODE("A")' },
        cot: [{ rong: 100 }, { rong: 100 }],
        hang: [
            [{ v: '"A"', canLe: 'giua' }, { v: '65', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'cc2-02-char-co-ban',
        tieuDe: 'CHAR — làm ngược lại: từ mã số ra ký tự',
        congThuc: { o: 'B1', ct: '=CHAR(65)' },
        cot: [{ rong: 100 }, { rong: 100 }],
        hang: [
            [{ v: '65', canLe: 'giua' }, { v: '"A"', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'cc2-03-du-lieu-dia-chi',
        tieuDe: 'Ba cột thông tin liên hệ cần gộp thành một ô',
        cot: [{ rong: 140 }, { rong: 120 }, { rong: 180 }],
        hang: [
            [dauXanh('Tên'), dauXanh('SĐT'), dauXanh('Địa chỉ')],
            ['Nguyễn Văn A', '0912345678', '12 Lê Lợi, Đà Nẵng'],
        ],
    },
    {
        ten: 'cc2-04-ghep-xuong-dong',
        tieuDe: 'CHAR(10) chèn dấu xuống dòng ngay trong công thức',
        congThuc: { o: 'D2', ct: '=A2 & CHAR(10) & B2 & CHAR(10) & C2' },
        cot: [{ rong: 140 }, { rong: 120 }, { rong: 180 }, { rong: 200 }],
        hang: [
            [dauXanh('Tên'), dauXanh('SĐT'), dauXanh('Địa chỉ'), dauXanh('Gộp lại')],
            ['Nguyễn Văn A', '0912345678', '12 Lê Lợi, Đà Nẵng',
                { v: 'Nguyễn Văn A / 0912345678 / 12 Lê Lợi...', nen: 'xanh' }],
        ],
        chon: 'D2',
    },
    {
        ten: 'cc2-05-truoc-sau-wrap-text',
        tieuDe: 'Phải bật Wrap Text mới nhìn thấy dấu xuống dòng',
        cot: [{ rong: 220 }, { rong: 220 }],
        hang: [
            [dauXanh('Chưa bật Wrap Text'), dauXanh('Đã bật Wrap Text')],
            [{ v: 'Nguyễn Văn A 0912345678...', nen: 'do' }, { v: 'Nguyễn Văn A ⏎ 0912345678 ⏎ ...', nen: 'xanh' }],
        ],
    },
    {
        ten: 'cc2-06-bang-ma-thuong-dung',
        tieuDe: 'Vài mã CHAR thường gặp',
        cot: [{ rong: 90 }, { rong: 150 }, { rong: 250 }],
        hang: [
            [dauXanh('Mã số'), dauXanh('Ký tự'), dauXanh('Công dụng')],
            ['9', 'Tab', 'Chèn khoảng cách kiểu tab'],
            ['10', 'Xuống dòng', 'Ngắt dòng trong ô (cần Wrap Text)'],
            ['34', 'Dấu ngoặc kép "', 'Chèn " vào giữa chuỗi ghép bằng &'],
        ],
    },
];

const LO = [{ slug: 'ham-char-code', anh: bai }];

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
