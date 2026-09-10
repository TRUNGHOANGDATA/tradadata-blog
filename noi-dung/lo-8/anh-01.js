// Ảnh minh hoạ cho bài 1 — ISFORMULA, FORMULATEXT
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'if2-01-du-lieu',
        tieuDe: 'Bảng thành tiền — công thức nhân số lượng với đơn giá',
        cot: [{ rong: 100 }, { rong: 100 }, { rong: 120 }],
        hang: [
            [dauXanh('SL'), dauXanh('Đơn giá'), dauXanh('Thành tiền')],
            ['5', '2.400.000', { v: '=B2*C2', mono: true }],
            ['3', '890.000', '2.670.000 (số cứng)'],
        ],
    },
    {
        ten: 'if2-02-isformula',
        tieuDe: 'ISFORMULA — ô này có đang chứa công thức không',
        congThuc: { o: 'D2', ct: '=ISFORMULA(C2)' },
        cot: [{ rong: 90 }, { rong: 110 }, { rong: 130 }, { rong: 90 }],
        hang: [
            [dauXanh('SL'), dauXanh('Đơn giá'), dauXanh('Thành tiền'), dauXanh('ISFORMULA')],
            ['5', '2.400.000', '=B2*C2', { v: 'TRUE', nen: 'xanh' }],
        ],
        chon: 'D2',
    },
    {
        ten: 'if2-03-quet-ca-cot',
        tieuDe: 'Quét cả cột để tìm dòng đã bị gõ đè số cứng',
        cot: [{ rong: 90 }, { rong: 110 }, { rong: 130 }],
        hang: [
            [dauXanh('SL'), dauXanh('Đơn giá'), dauXanh('Thành tiền')],
            ['5', '2.400.000', { v: '=B2*C2', mono: true, nen: 'xanh' }],
            ['3', '890.000', { v: '2.670.000', nen: 'do' }],
            ['2', '1.150.000', { v: '=B4*C4', mono: true, nen: 'xanh' }],
        ],
    },
    {
        ten: 'if2-04-canh-bao',
        tieuDe: 'IF + ISFORMULA — cảnh báo dòng đã bị gõ đè',
        congThuc: { o: 'D3', ct: '=IF(ISFORMULA(C3),"OK","CẢNH BÁO — số cứng")' },
        cot: [{ rong: 90 }, { rong: 110 }, { rong: 130 }, { rong: 180 }],
        hang: [
            [dauXanh('SL'), dauXanh('Đơn giá'), dauXanh('Thành tiền'), dauXanh('Kiểm tra')],
            ['5', '2.400.000', '=B2*C2', { v: 'OK — vẫn là công thức', nen: 'xanh' }],
            ['3', '890.000', '2.670.000', { v: 'CẢNH BÁO — số cứng', nen: 'do' }],
        ],
        chon: 'D3',
    },
    {
        ten: 'if2-05-formulatext',
        tieuDe: 'FORMULATEXT — hiển thị nguyên văn công thức dưới dạng chữ',
        congThuc: { o: 'D2', ct: '=FORMULATEXT(C2)' },
        cot: [{ rong: 90 }, { rong: 110 }, { rong: 130 }, { rong: 150 }],
        hang: [
            [dauXanh('SL'), dauXanh('Đơn giá'), dauXanh('Thành tiền'), dauXanh('Công thức thật')],
            ['5', '2.400.000', '12.000.000', { v: '"=B2*C2"', nen: 'xanh' }],
        ],
        chon: 'D2',
    },
    {
        ten: 'if2-06-ket-hop-ca-hai',
        tieuDe: 'Kết hợp ISFORMULA + FORMULATEXT — tránh lỗi #N/A',
        congThuc: { o: 'D3', ct: '=IF(ISFORMULA(C3),FORMULATEXT(C3),"(số cứng)")' },
        cot: [{ rong: 90 }, { rong: 110 }, { rong: 130 }, { rong: 180 }],
        hang: [
            [dauXanh('SL'), dauXanh('Đơn giá'), dauXanh('Thành tiền'), dauXanh('Công thức')],
            ['5', '2.400.000', '12.000.000', { v: '"=B2*C2"', nen: 'xanh' }],
            ['3', '890.000', '2.670.000', { v: '(không có công thức — số cứng)', nen: 'do' }],
        ],
        chon: 'D3',
    },
    {
        ten: 'if2-07-tai-lieu-hoa',
        tieuDe: 'Cột FORMULATEXT song song giúp tài liệu hoá mẫu báo cáo',
        cot: [{ rong: 130 }, { rong: 200 }],
        hang: [
            [dauXanh('Ô công thức'), dauXanh('Ghi chú công thức')],
            ['12.000.000', '=B2*C2'],
            ['2.670.000', '=B3*C3'],
        ],
    },
];

const LO = [{ slug: 'ham-isformula-formulatext', anh: bai }];

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
