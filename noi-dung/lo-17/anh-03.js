// Ảnh minh hoạ cho bài 3 — AVERAGEIFS
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'as-01-cu-phap-co-ban',
        tieuDe: 'AVERAGEIFS — vùng tính trung bình đặt lên đầu',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'AVERAGEIFS(vùng_TB, vùng_đk1, đk1, ...)', mono: true, canLe: 'giua' }],
        ],
    },
    {
        ten: 'as-02-nhieu-dieu-kien',
        tieuDe: 'Trung bình theo hai điều kiện: nam VÀ lớp 10A',
        congThuc: { o: 'D1', ct: '=AVERAGEIFS(C2:C5,A2:A5,"Nam",B2:B5,"10A")' },
        cot: [{ rong: 60 }, { rong: 60 }, { rong: 60 }],
        hang: [
            [dauXanh('GT'), dauXanh('Lớp'), dauXanh('Điểm')],
            [{ v: 'Nam', nen: 'xanh' }, { v: '10A', nen: 'xanh' }, { v: '8', nen: 'xanh' }],
            ['Nam', '10B', '9'],
            ['Nữ', '10A', '7'],
        ],
    },
    {
        ten: 'as-03-nhac-lai-thu-tu-nguoc',
        tieuDe: 'Cùng kết quả, thứ tự tham số đầu ngược nhau',
        cot: [{ rong: 240 }, { rong: 100 }],
        hang: [
            [dauXanh('Hàm'), dauXanh('Tham số đầu')],
            [{ v: '=AVERAGEIFS(Diem,GioiTinh,"Nam")', mono: true }, { v: 'Diem', nen: 'xanh' }],
            [{ v: '=AVERAGEIF(GioiTinh,"Nam",Diem)', mono: true }, 'GioiTinh'],
        ],
    },
    {
        ten: 'as-04-loi-div0-nhieu-dieu-kien',
        tieuDe: 'Càng nhiều điều kiện, càng dễ không dòng nào khớp',
        cot: [{ rong: 200 }, { rong: 90 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: '=AVERAGEIFS(Diem,Lop,"10Z")', mono: true }, { v: '#DIV/0!', nen: 'do' }],
        ],
    },
    {
        ten: 'as-05-loc-dan-nhieu-tieu-chi',
        tieuDe: 'Lọc dần nhiều tiêu chí không cần cột phụ',
        cot: [{ rong: 260 }],
        hang: [
            [{ v: 'AVERAGEIFS(Diem,Lop,"10A",MonHoc,"Toán",HocKy,"HK1")', mono: true, canLe: 'giua' }],
        ],
    },
];

const LO = [{ slug: 'ham-averageifs', anh: bai }];

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
