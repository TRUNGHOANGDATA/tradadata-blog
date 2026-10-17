// Ảnh minh hoạ cho bài CONCAT/TEXTJOIN
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'ct-01-ba-cach',
        tieuDe: 'Ba cách nối chuỗi, ba mức tiện lợi',
        cot: [{ rong: 210 }, { rong: 90 }, { rong: 230 }],
        hang: [
            [dauXanh('Cách'), dauXanh('Dấu ngăn'), dauXanh('Điểm yếu')],
            ['A2 & " " & B2', { v: 'Tự chèn', nen: 'xanh' }, 'Dài dòng khi nhiều ô'],
            ['=CONCAT(A2:D2)', { v: 'Không có', nen: 'do', mau: '#c0392b' }, 'Mọi thứ dính liền'],
            ['=TEXTJOIN(", ",TRUE,A2:D2)', { v: 'Có sẵn', nen: 'xanh', dam: true }, 'Bỏ luôn ô trống'],
        ],
    },
    {
        ten: 'ct-02-textjoin',
        tieuDe: 'TEXTJOIN bỏ ô trống, không để lại dấu phẩy thừa',
        congThuc: { o: 'E2', ct: '=TEXTJOIN(", ",TRUE,A2:D2)' },
        cot: [{ rong: 70 }, { rong: 90 }, { rong: 80 }, { rong: 70 }],
        hang: [
            [dauXanh('Số nhà'), dauXanh('Đường'), dauXanh('Phường'), dauXanh('Quận')],
            ['12', 'Lê Lợi', { v: '', nen: 'do' }, 'Q1'],
        ],
    },
    {
        ten: 'ct-03-ket-qua',
        tieuDe: 'Kết quả TEXTJOIN cho hàng trên: bỏ Phường trống',
        cot: [{ rong: 360 }],
        hang: [
            [dauXanh('Kết quả nối')],
            [{ v: '12, Lê Lợi, Q1', nen: 'xanh', dam: true }],
        ],
    },
];

const LO = [{ slug: 'concat-textjoin', anh: bai }];

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
