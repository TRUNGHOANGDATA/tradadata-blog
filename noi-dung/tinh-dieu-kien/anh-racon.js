// Ảnh minh hoạ cho bài RACON (SUMIFS/COUNTIFS/AVERAGEIFS — cú pháp đặc biệt)
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'rc-01-so-sanh-thu-tu',
        tieuDe: 'Số ít: điều kiện trước · Số nhiều: phép tính trước',
        cot: [{ rong: 260 }, { rong: 110 }],
        hang: [
            [dauXanh('Hàm'), dauXanh('Tham số đầu')],
            [{ v: 'SUMIF(NhomSP,"Laptop",DoanhThu)', mono: true }, 'NhomSP'],
            [{ v: 'SUMIFS(DoanhThu,NhomSP,"Laptop")', mono: true }, { v: 'DoanhThu', nen: 'xanh', dam: true }],
            [{ v: 'AVERAGEIF(GioiTinh,"Nam",Diem)', mono: true }, 'GioiTinh'],
            [{ v: 'AVERAGEIFS(Diem,GioiTinh,"Nam")', mono: true }, { v: 'Diem', nen: 'xanh', dam: true }],
        ],
    },
    {
        ten: 'rc-02-countif-khong-doi',
        tieuDe: 'COUNTIF/COUNTIFS: không có vùng tính riêng, không bị đảo',
        cot: [{ rong: 300 }],
        hang: [
            [{ v: 'COUNTIF(KhuVuc,"Miền Bắc")', mono: true, canLe: 'giua' }],
            [{ v: 'COUNTIFS(KhuVuc,"Miền Bắc",NhomSP,"Laptop")', mono: true, canLe: 'giua', nen: 'xanh' }],
        ],
    },
    {
        ten: 'rc-03-meo-nho',
        tieuDe: 'Mẹo nhớ: có chữ S cuối tên hàm → phép tính đứng ĐẦU',
        cot: [{ rong: 150 }, { rong: 200 }],
        hang: [
            [dauXanh('Tên hàm'), dauXanh('Vùng nào đứng đầu?')],
            ['SUMIF · AVERAGEIF', 'Vùng điều kiện'],
            [{ v: 'SUMIFS · AVERAGEIFS', nen: 'xanh' }, { v: 'Vùng tính toán', nen: 'xanh', dam: true }],
            [{ v: 'MAXIFS · MINIFS', nen: 'xanh' }, { v: 'Vùng tính toán', nen: 'xanh', dam: true }],
            [{ v: 'COUNTIF · COUNTIFS', nen: 'vang' }, { v: '(không có, không lo)', mau: '#217346' }],
        ],
    },
];

const LO = [{ slug: 'racon', anh: bai }];

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
