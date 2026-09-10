// Ảnh minh hoạ cho bài 3 — HLOOKUP
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'hl-01-cu-phap-co-ban',
        tieuDe: 'HLOOKUP tìm theo hàng, không phải theo cột',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: 'HLOOKUP(giá_trị_tìm, bảng, số_hàng, [khớp])', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'hl-02-vi-du-bang-ngang',
        tieuDe: 'Bảng tra cứu xếp ngang — ngưỡng lương và tỷ lệ thuế',
        congThuc: { o: 'B3', ct: '=HLOOKUP(15000000,A1:D2,2,TRUE)' },
        cot: [{ rong: 90 }, { rong: 90 }, { rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('0'), dauXanh('10tr'), dauXanh('20tr'), dauXanh('30tr')],
            [{ v: '5%', canLe: 'giua' }, { v: '10%', nen: 'xanh', canLe: 'giua' }, { v: '15%', canLe: 'giua' }, { v: '20%', canLe: 'giua' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'hl-03-gioi-han-hang-dau',
        tieuDe: 'Chỉ tìm được ở hàng trên cùng của bảng',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'Giá trị tìm phải nằm ở HÀNG 1 — không phải hàng bất kỳ', canLe: 'giua', nen: 'vang' }],
        ],
    },
    {
        ten: 'hl-04-bao-cao-theo-quy',
        tieuDe: 'Tra cứu chi phí theo quý xếp ngang',
        congThuc: { o: 'D5', ct: '=HLOOKUP("Q3",A1:D5,5,FALSE)' },
        cot: [{ rong: 60 }, { rong: 60 }, { rong: 60 }, { rong: 60 }],
        hang: [
            [dauXanh('Q1'), dauXanh('Q2'), dauXanh('Q3'), dauXanh('Q4')],
            ['20tr', '22tr', { v: '25tr', nen: 'xanh' }, '24tr'],
        ],
        chon: 'C2',
    },
    {
        ten: 'hl-05-can-nhac-xoay-bang',
        tieuDe: 'Cân nhắc xoay bảng bằng TRANSPOSE rồi dùng VLOOKUP',
        cot: [{ rong: 220 }],
        hang: [
            [{ v: 'Bảng ngang quen dùng → xoay dọc → VLOOKUP quen thuộc hơn', canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-hlookup', anh: bai }];

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
