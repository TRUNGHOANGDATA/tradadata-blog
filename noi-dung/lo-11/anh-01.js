// Ảnh minh hoạ cho bài 1 — REPLACE
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'rp-01-cu-phap-co-ban',
        tieuDe: 'REPLACE cắt và thay theo vị trí ký tự',
        congThuc: { o: 'B1', ct: '=REPLACE("ABCDEFG",3,2,"xy")' },
        cot: [{ rong: 100 }, { rong: 110 }],
        hang: [
            [{ v: 'Chuỗi gốc: ABCDEFG' }, { v: 'ABxyFG', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'rp-02-che-so-dien-thoai',
        tieuDe: 'Che 4 số giữa của số điện thoại',
        congThuc: { o: 'B2', ct: '=REPLACE(A2,4,4,"****")' },
        cot: [{ rong: 100 }, { rong: 100 }],
        hang: [
            [dauXanh('Số gốc'), dauXanh('Đã che')],
            ['0912345678', { v: '091****678', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'rp-03-so-sanh-replace-substitute',
        tieuDe: 'Biết vị trí dùng REPLACE — biết nội dung dùng SUBSTITUTE',
        cot: [{ rong: 90 }, { rong: 190 }],
        hang: [
            [dauXanh('Hàm'), dauXanh('Biết trước điều gì')],
            [{ v: 'REPLACE', mono: true }, 'Vị trí ký tự cần thay'],
            [{ v: 'SUBSTITUTE', mono: true }, 'Nội dung cần tìm và thay'],
        ],
    },
    {
        ten: 'rp-04-sua-ma-hang-loat',
        tieuDe: 'Đổi 2 ký tự đầu mã hàng loạt theo vị trí',
        congThuc: { o: 'B2', ct: '=REPLACE(A2,1,2,"HP")' },
        cot: [{ rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Mã cũ'), dauXanh('Mã mới')],
            ['HN-0012', { v: 'HP-0012', nen: 'xanh' }],
            ['HN-0045', 'HP-0045'],
        ],
        chon: 'B2',
    },
    {
        ten: 'rp-05-do-dai-khong-dong-nhat',
        tieuDe: 'Độ dài khác nhau — REPLACE che sai chỗ',
        congThuc: { o: 'B3', ct: '=REPLACE(A3,4,4,"****")' },
        cot: [{ rong: 100 }, { rong: 100 }],
        hang: [
            [dauXanh('Số gốc'), dauXanh('Đã che')],
            ['0912345678', '091****678'],
            [{ v: '024123', canLe: 'trai' }, { v: '024****', nen: 'do' }],
        ],
        chon: 'B3',
    },
];

const LO = [{ slug: 'ham-replace', anh: bai }];

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
