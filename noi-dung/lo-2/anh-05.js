// Ảnh minh hoạ cho bài 5 — Khấu hao SLN, DDB, DB
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'kh-01-du-lieu',
        tieuDe: 'Tài sản cố định: 100 triệu, thanh lý 10 triệu, dùng 5 năm',
        cot: [{ rong: 200 }, { rong: 170 }],
        hang: [
            [dauXanh('Thông tin'), dauXanh('Giá trị')],
            ['Nguyên giá (cost)', '100.000.000'],
            ['Giá trị thanh lý (salvage)', '10.000.000'],
            ['Thời gian sử dụng (life)', '5 năm'],
        ],
    },
    {
        ten: 'kh-02-ddb-tung-nam',
        tieuDe: 'DDB — khấu hao giảm dần theo giá trị còn lại (40%/năm)',
        cot: [{ rong: 60 }, { rong: 160 }, { rong: 160 }],
        hang: [
            [dauXanh('Năm'), dauXanh('Khấu hao'), dauXanh('Giá trị còn lại')],
            ['1', '40.000.000', '60.000.000'],
            ['2', '24.000.000', '36.000.000'],
            ['3', '14.400.000', '21.600.000'],
            ['4', '8.640.000', '12.960.000'],
            ['5', { v: '2.960.000', nen: 'vang' }, '10.000.000'],
        ],
    },
    {
        ten: 'kh-03-db-tung-nam',
        tieuDe: 'DB — tỷ lệ cố định ~36,9%/năm, tính trên giá trị còn lại',
        cot: [{ rong: 60 }, { rong: 160 }, { rong: 160 }],
        hang: [
            [dauXanh('Năm'), dauXanh('Khấu hao'), dauXanh('Giá trị còn lại')],
            ['1', '36.900.000', '63.100.000'],
            ['2', '23.283.900', '39.816.100'],
            ['3', '14.690.100', '25.126.000'],
            ['4', '9.271.500', '15.854.500'],
            ['5', { v: '5.850.300', nen: 'vang' }, '~10.004.000'],
        ],
    },
    {
        ten: 'kh-04-so-sanh-ca-3',
        tieuDe: 'SLN chia đều — DDB và DB dồn nhiều hơn vào các năm đầu',
        cot: [{ rong: 50 }, { rong: 130 }, { rong: 130 }, { rong: 130 }],
        hang: [
            [dauXanh('Năm'), dauXanh('SLN'), dauXanh('DDB'), dauXanh('DB')],
            ['1', '18.000.000', { v: '40.000.000', nen: 'vang' }, { v: '36.900.000', nen: 'vang' }],
            ['2', '18.000.000', '24.000.000', '23.283.900'],
            ['3', '18.000.000', '14.400.000', '14.690.100'],
            ['4', '18.000.000', '8.640.000', '9.271.500'],
            ['5', '18.000.000', { v: '2.960.000', nen: 'xanh' }, { v: '5.850.300', nen: 'xanh' }],
        ],
    },
];

const LO = [{ slug: 'khau-hao', anh: bai }];

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
