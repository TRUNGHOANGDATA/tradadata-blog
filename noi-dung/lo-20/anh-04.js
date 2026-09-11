// Ảnh minh hoạ cho bài 4 — BIN2HEX, HEX2BIN
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'bh-01-cu-phap-co-ban',
        tieuDe: 'BIN2HEX và HEX2BIN chuyển thẳng, không qua thập phân',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=BIN2HEX("1001")', mono: true }, { v: '9', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=HEX2BIN("9")', mono: true }, { v: '1001', canLe: 'giua' }],
        ],
    },
    {
        ten: 'bh-02-khong-can-long-cong-thuc',
        tieuDe: 'Gọn hơn hẳn cách lồng hai hàm qua thập phân',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: 'DEC2HEX(BIN2DEC("1001"))  =  BIN2HEX("1001")', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'bh-03-so-am-giu-gia-tri',
        tieuDe: 'Số âm bù hai chuyển thẳng, giữ nguyên giá trị',
        cot: [{ rong: 200 }, { rong: 130 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=BIN2HEX("1111110111")', mono: true }, { v: 'FFFFFFFFF7', nen: 'xanh' }],
        ],
    },
    {
        ten: 'bh-04-gioi-han-hep-hon',
        tieuDe: 'HEX2BIN giới hạn hẹp hơn hẳn HEX2DEC',
        cot: [{ rong: 150 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=HEX2DEC("2000")', mono: true }, { v: '8192', nen: 'xanh', canLe: 'giua' }],
            [{ v: '=HEX2BIN("2000")', mono: true }, { v: '#NUM!', nen: 'do' }],
        ],
    },
    {
        ten: 'bh-05-du-6-cap-chuyen-doi',
        tieuDe: 'Đủ 6 cặp hàm chuyển đổi trực tiếp',
        cot: [{ rong: 130 }, { rong: 130 }],
        hang: [
            [dauXanh('Cặp 1'), dauXanh('Cặp 2')],
            ['BIN2HEX / HEX2BIN', 'BIN2OCT / OCT2BIN'],
            ['HEX2OCT / OCT2HEX', ''],
        ],
    },
];

const LO = [{ slug: 'ham-bin2hex-hex2bin', anh: bai }];

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
