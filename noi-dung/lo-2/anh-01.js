// Ảnh minh hoạ cho bài 1 — PMT
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'pmt-01-cong-thuc-co-ban',
        tieuDe: 'Vay 500 triệu, lãi suất 8%/năm, trả góp trong 5 năm',
        congThuc: { o: 'B4', ct: '=PMT(8%/12, 5*12, 500000000)' },
        cot: [{ rong: 180 }, { rong: 170 }],
        hang: [
            [dauXanh('Thông tin khoản vay'), dauXanh('Giá trị')],
            ['Số tiền vay', '500.000.000'],
            ['Lãi suất năm', '8%'],
            ['Thời hạn vay', '5 năm (60 tháng)'],
            ['Khoản trả mỗi tháng', { v: '-10.137.000', nen: 'do' }],
        ],
        chon: 'B4',
    },
    {
        ten: 'pmt-02-quy-uoc-dau',
        tieuDe: 'Quy ước dấu: tiền nhận vào (+), tiền chi ra (-)',
        cot: [{ rong: 210 }, { rong: 170 }, { rong: 110 }],
        hang: [
            [dauXanh('Sự kiện'), dauXanh('Chiều dòng tiền'), dauXanh('Dấu')],
            ['Nhận khoản vay 500 triệu', 'Tiền chảy vào túi bạn', { v: '+', canLe: 'giua' }],
            ['Trả góp mỗi tháng', 'Tiền chảy ra khỏi túi bạn', { v: '-', canLe: 'giua', mau: '#c0392b', dam: true }],
        ],
    },
    {
        ten: 'pmt-03-hai-cach-ra-duong',
        tieuDe: 'Hai cách lấy PMT ra số dương — cùng một kết quả',
        cot: [{ rong: 260 }, { rong: 170 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=-PMT(8%/12, 5*12, 500000000)', mono: true }, { v: '10.137.000', nen: 'xanh' }],
            [{ v: '=PMT(8%/12, 5*12, -500000000)', mono: true }, { v: '10.137.000', nen: 'xanh' }],
        ],
    },
    {
        ten: 'pmt-04-quen-chia-12',
        tieuDe: 'Quên chia lãi suất năm cho 12 — sai lệch rất lớn',
        cot: [{ rong: 260 }, { rong: 190 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Khoản trả mỗi tháng')],
            [{ v: '=-PMT(8%/12, 5*12, 500000000)', mono: true }, { v: '10.137.000 (đúng)', nen: 'xanh' }],
            [{ v: '=-PMT(8%, 5*12, 500000000)', mono: true }, { v: '40.048.000 (sai)', nen: 'do' }],
        ],
    },
    {
        ten: 'pmt-05-tong-lai',
        tieuDe: 'Tổng lãi phải trả trong suốt 5 năm vay',
        congThuc: { o: 'B4', ct: '=-PMT(8%/12,5*12,500000000)*5*12-500000000' },
        cot: [{ rong: 210 }, { rong: 170 }],
        hang: [
            [dauXanh('Khoản mục'), dauXanh('Số tiền')],
            ['Tổng đã trả (60 tháng)', '608.220.000'],
            ['Số tiền gốc đã vay', '500.000.000'],
            ['Tổng lãi phải trả', { v: '108.220.000', nen: 'do' }],
        ],
        chon: 'B4',
    },
];

const LO = [{ slug: 'ham-pmt', anh: bai }];

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
