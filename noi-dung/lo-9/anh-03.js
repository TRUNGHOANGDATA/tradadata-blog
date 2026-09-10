// Ảnh minh hoạ cho bài 3 — WEEKNUM
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'wn-01-bang-kieu-tra-ve',
        tieuDe: 'Ba kiểu tra về hay dùng của WEEKNUM',
        cot: [{ rong: 60 }, { rong: 200 }],
        hang: [
            [dauXanh('Kiểu'), dauXanh('Tuần bắt đầu từ')],
            [{ v: '1', canLe: 'giua' }, 'Chủ Nhật (mặc định)'],
            [{ v: '2', canLe: 'giua' }, 'Thứ Hai'],
            [{ v: '21', canLe: 'giua' }, 'Thứ Hai — chuẩn ISO 8601'],
        ],
    },
    {
        ten: 'wn-02-vi-du-co-ban',
        tieuDe: 'WEEKNUM cho ngày giữa năm — hai kiểu trùng nhau',
        congThuc: { o: 'B1', ct: '=WEEKNUM(DATE(2026,9,10))' },
        cot: [{ rong: 110 }, { rong: 90 }],
        hang: [
            [{ v: 'Ngày: 10/09/2026' }, { v: 'Tuần 37', nen: 'xanh' }],
        ],
        chon: 'B1',
    },
    {
        ten: 'wn-03-lech-cuoi-nam',
        tieuDe: 'Cùng một ngày, hai kiểu tính ra hai tuần khác hẳn',
        cot: [{ rong: 150 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: 'Ngày: 31/12/2025 (Thứ Tư)', canLe: 'trai' }, ''],
            [{ v: '=WEEKNUM(A2,1)', mono: true }, { v: 'Tuần 53 / 2025', nen: 'vang' }],
            [{ v: '=WEEKNUM(A2,21)', mono: true }, { v: 'Tuần 1 / 2026', nen: 'xanh' }],
        ],
    },
    {
        ten: 'wn-04-isoweeknum',
        tieuDe: 'ISOWEEKNUM — cách viết gọn cho kiểu ISO',
        cot: [{ rong: 170 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=WEEKNUM(A2,21)', mono: true }, { v: '1', canLe: 'giua' }],
            [{ v: '=ISOWEEKNUM(A2)', mono: true }, { v: '1', nen: 'xanh', canLe: 'giua' }],
        ],
    },
    {
        ten: 'wn-05-nhom-theo-tuan',
        tieuDe: 'Cột phụ WEEKNUM để gộp doanh số theo tuần',
        congThuc: { o: 'C2', ct: '=WEEKNUM(A2)' },
        cot: [{ rong: 90 }, { rong: 100 }, { rong: 60 }],
        hang: [
            [dauXanh('Ngày bán'), dauXanh('Doanh thu'), dauXanh('Tuần')],
            ['07/09/2026', '2.400.000', { v: '37', nen: 'xanh' }],
            ['12/09/2026', '1.850.000', '37'],
            ['14/09/2026', '3.100.000', '38'],
        ],
        chon: 'C2',
    },
];

const LO = [{ slug: 'ham-weeknum', anh: bai }];

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
