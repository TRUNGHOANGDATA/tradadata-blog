// Ảnh minh hoạ cho bài 2 — FV & PV
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'fvpv-01-fv-mot-lan',
        tieuDe: 'Gửi 200 triệu, lãi suất 6%/năm, sau 10 năm được bao nhiêu?',
        congThuc: { o: 'B4', ct: '=FV(6%, 10, 0, -200000000)' },
        cot: [{ rong: 190 }, { rong: 170 }],
        hang: [
            [dauXanh('Thông tin'), dauXanh('Giá trị')],
            ['Gửi ban đầu', '-200.000.000'],
            ['Lãi suất năm', '6%'],
            ['Số năm gửi', '10'],
            ['Số tiền nhận lại', { v: '358.170.000', nen: 'xanh' }],
        ],
        chon: 'B4',
    },
    {
        ten: 'fvpv-02-fv-co-gop-them',
        tieuDe: 'Gửi 50 triệu ban đầu, thêm 5 triệu mỗi tháng, 10 năm',
        congThuc: { o: 'B5', ct: '=FV(6%/12, 10*12, -5000000, -50000000)' },
        cot: [{ rong: 210 }, { rong: 170 }],
        hang: [
            [dauXanh('Thông tin'), dauXanh('Giá trị')],
            ['Gửi ban đầu', '-50.000.000'],
            ['Gửi thêm mỗi tháng', '-5.000.000'],
            ['Lãi suất năm', '6%'],
            ['Số tiền sau 10 năm', { v: '~910.370.000', nen: 'xanh' }],
        ],
        chon: 'B5',
    },
    {
        ten: 'fvpv-03-pv-mot-lan',
        tieuDe: 'Nhận 500 triệu sau 5 năm — đáng giá bao nhiêu ở hiện tại?',
        congThuc: { o: 'B4', ct: '=PV(7%, 5, 0, 500000000)' },
        cot: [{ rong: 210 }, { rong: 170 }],
        hang: [
            [dauXanh('Thông tin'), dauXanh('Giá trị')],
            ['Nhận trong tương lai', '500.000.000'],
            ['Lãi suất chiết khấu', '7%/năm'],
            ['Số năm', '5'],
            ['Giá trị hiện tại', { v: '-356.500.000', nen: 'do' }],
        ],
        chon: 'B4',
    },
    {
        ten: 'fvpv-04-so-sanh-hai-phuong-an',
        tieuDe: 'So sánh 2 phương án nhận tiền ở thời điểm khác nhau',
        cot: [{ rong: 190 }, { rong: 150 }, { rong: 190 }],
        hang: [
            [dauXanh('Phương án'), dauXanh('Số tiền danh nghĩa'), dauXanh('Quy về hiện tại')],
            ['Nhận ngay', '300.000.000', { v: '300.000.000', nen: 'xanh' }],
            ['Nhận sau 4 năm', '400.000.000', { v: '294.000.000', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-fv-pv', anh: bai }];

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
