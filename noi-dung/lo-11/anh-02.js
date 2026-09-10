// Ảnh minh hoạ cho bài 2 — SIGN
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'sg-01-cu-phap-co-ban',
        tieuDe: 'SIGN chỉ có đúng ba kết quả có thể xảy ra',
        cot: [{ rong: 120 }, { rong: 80 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=SIGN(-8)', mono: true }, { v: '-1', canLe: 'giua' }],
            [{ v: '=SIGN(8)', mono: true }, { v: '1', canLe: 'giua' }],
            [{ v: '=SIGN(0)', mono: true }, { v: '0', canLe: 'giua' }],
        ],
    },
    {
        ten: 'sg-02-xu-huong-tang-giam',
        tieuDe: 'Xác định xu hướng mà chưa cần biết độ lớn',
        congThuc: { o: 'C2', ct: '=SIGN(B2-A2)' },
        cot: [{ rong: 90 }, { rong: 90 }, { rong: 70 }],
        hang: [
            [dauXanh('Tháng trước'), dauXanh('Tháng này'), dauXanh('Xu hướng')],
            ['100', '135', { v: '1', nen: 'xanh', canLe: 'giua' }],
            ['100', '80', { v: '-1', canLe: 'giua' }],
        ],
        chon: 'C2',
    },
    {
        ten: 'sg-03-ket-hop-choose',
        tieuDe: 'SIGN + 2 khớp đúng chỉ số của CHOOSE',
        congThuc: { o: 'C2', ct: '=CHOOSE(SIGN(B2-A2)+2,"Giảm","Không đổi","Tăng")' },
        cot: [{ rong: 90 }, { rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Tháng trước'), dauXanh('Tháng này'), dauXanh('Nhận xét')],
            ['100', '135', { v: 'Tăng', nen: 'xanh' }],
            ['100', '80', 'Giảm'],
        ],
        chon: 'C2',
    },
    {
        ten: 'sg-04-giu-dau-khi-tinh-ty-le',
        tieuDe: 'SIGN giữ chiều, ABS đảm bảo tỷ lệ luôn tính đúng',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'SIGN(ChenhLech) × ABS(ChenhLech) / GiaTriGoc', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'sg-05-loi-voi-text',
        tieuDe: 'SIGN với văn bản báo lỗi #VALUE!',
        cot: [{ rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=SIGN("mười")', mono: true }, { v: '#VALUE!', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-sign', anh: bai }];

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
