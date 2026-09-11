// Ảnh minh hoạ cho bài 4 — COMBIN
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'cb-01-cu-phap-co-ban',
        tieuDe: 'COMBIN đếm số cách chọn, không phân biệt thứ tự',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=COMBIN(10,3)', mono: true }, { v: '120', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'cb-02-chon-doi-dai-dien',
        tieuDe: 'Chọn 3 học sinh từ 10 — không phân biệt vai trò',
        congThuc: { o: 'B1', ct: '=COMBIN(10,3)' },
        cot: [{ rong: 220 }],
        hang: [
            [{ v: '(An, Bình, Chi) = (Chi, An, Bình): CÙNG 1 cách chọn', nen: 'xanh', canLe: 'giua' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'cb-03-xo-so-khong-thu-tu',
        tieuDe: 'Chọn 6 số từ 45 — hơn 8 triệu tổ hợp',
        congThuc: { o: 'B1', ct: '=COMBIN(45,6)' },
        cot: [{ rong: 200 }],
        hang: [
            [{ v: 'Kết quả: 8.145.060', nen: 'xanh', canLe: 'giua' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'cb-04-truong-hop-bien',
        tieuDe: 'Chọn tất cả hoặc chọn 0 — đều chỉ có 1 cách',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=COMBIN(10,10)', mono: true }, { v: '1', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=COMBIN(10,0)', mono: true }, { v: '1', canLe: 'giua' }],
        ],
    },
    {
        ten: 'cb-05-loi-chon-nhieu-hon-co-san',
        tieuDe: 'Chọn nhiều hơn số lượng có sẵn — báo lỗi',
        cot: [{ rong: 140 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=COMBIN(5,8)', mono: true }, { v: '#NUM!', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-combin', anh: bai }];

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
