// Ảnh minh hoạ cho bài 2 — AVERAGEIF
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'av-01-cu-phap-co-ban',
        tieuDe: 'AVERAGEIF — vùng điều kiện đặt lên đầu',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'AVERAGEIF(vùng_điều_kiện, điều_kiện, [vùng_TB])', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'av-02-diem-trung-binh-nhom',
        tieuDe: 'Điểm trung bình chỉ tính riêng học sinh nam',
        congThuc: { o: 'D1', ct: '=AVERAGEIF(A2:A5,"Nam",B2:B5)' },
        cot: [{ rong: 70 }, { rong: 70 }],
        hang: [
            [dauXanh('Giới tính'), dauXanh('Điểm')],
            [{ v: 'Nam', nen: 'xanh' }, { v: '8', nen: 'xanh' }],
            ['Nữ', '9'],
            [{ v: 'Nam', nen: 'xanh' }, { v: '7', nen: 'xanh' }],
        ],
    },
    {
        ten: 'av-03-thu-tu-nguoc-averageifs',
        tieuDe: 'Thứ tự tham số ngược hẳn với AVERAGEIFS',
        cot: [{ rong: 240 }, { rong: 100 }],
        hang: [
            [dauXanh('Hàm'), dauXanh('Tham số đầu')],
            [{ v: '=AVERAGEIF(GioiTinh,"Nam",Diem)', mono: true }, 'GioiTinh'],
            [{ v: '=AVERAGEIFS(Diem,GioiTinh,"Nam")', mono: true }, { v: 'Diem', nen: 'xanh' }],
        ],
    },
    {
        ten: 'av-04-loi-div0',
        tieuDe: 'Không có dòng khớp — báo lỗi #DIV/0!',
        cot: [{ rong: 180 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=AVERAGEIF(A:A,"Khác",B:B)', mono: true }, { v: '#DIV/0!', nen: 'do' }],
        ],
    },
    {
        ten: 'av-05-ket-hop-iferror',
        tieuDe: 'Bọc IFERROR để hiện thông báo dễ hiểu',
        cot: [{ rong: 250 }],
        hang: [
            [{ v: 'IFERROR(AVERAGEIF(...), "Chưa có dữ liệu")', mono: true, canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-averageif', anh: bai }];

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
