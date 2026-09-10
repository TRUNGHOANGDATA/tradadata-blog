// Ảnh minh hoạ cho bài 4 — LEN, REPT
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'lr-01-len-co-ban',
        tieuDe: 'LEN — đếm tổng số ký tự trong ô, kể cả khoảng trắng',
        congThuc: { o: 'B2', ct: '=LEN(A2)' },
        cot: [{ rong: 180 }, { rong: 100 }],
        hang: [
            [dauXanh('Chuỗi'), dauXanh('LEN(...)')],
            ['Trà Đá Data', { v: '11', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'lr-02-du-lieu-sdt',
        tieuDe: 'Số điện thoại khách hàng nhập tay — cần đúng 10 số',
        cot: [{ rong: 150 }, { rong: 150 }],
        hang: [
            [dauXanh('Khách hàng'), dauXanh('Số điện thoại')],
            ['Nguyễn Thị Mai', '0912345678'],
            ['Trần Văn Hải', '091234567'],
            ['Lê Hoàng Bảo', '09123456789'],
        ],
    },
    {
        ten: 'lr-03-kiem-tra-sdt',
        tieuDe: 'Dùng LEN để lọc thô số điện thoại sai định dạng',
        congThuc: { o: 'C2', ct: '=IF(LEN(B2)=10, "Hợp lệ", "Sai định dạng")' },
        cot: [{ rong: 150 }, { rong: 150 }, { rong: 150 }],
        hang: [
            [dauXanh('Khách hàng'), dauXanh('SĐT'), dauXanh('Kiểm tra')],
            ['Nguyễn Thị Mai', '0912345678', { v: 'Hợp lệ', nen: 'xanh' }],
            ['Trần Văn Hải', '091234567', { v: 'Sai định dạng', nen: 'do' }],
            ['Lê Hoàng Bảo', '09123456789', { v: 'Sai định dạng', nen: 'do' }],
        ],
        chon: 'C2',
    },
    {
        ten: 'lr-04-loi-khoang-trang',
        tieuDe: 'Khoảng trắng thừa khiến LEN đếm dư — nhìn không thấy gì khác',
        cot: [{ rong: 200 }, { rong: 100 }],
        hang: [
            [dauXanh('Chuỗi (có dấu cách cuối)'), dauXanh('LEN(...)')],
            ['0912345678 ', { v: '11 (sai)', nen: 'do' }],
            ['=TRIM(A2) -> 0912345678', { v: '10 (đúng)', nen: 'xanh' }],
        ],
    },
    {
        ten: 'lr-05-rept-co-ban',
        tieuDe: 'REPT — lặp lại một chuỗi ký tự theo số lần chỉ định',
        congThuc: { o: 'B2', ct: '=REPT("★", 3)' },
        cot: [{ rong: 100 }, { rong: 150 }],
        hang: [
            [dauXanh('Số lần'), dauXanh('Kết quả')],
            ['3', { v: '★★★', nen: 'xanh' }],
        ],
        chon: 'B2',
    },
    {
        ten: 'lr-06-du-lieu-tien-do',
        tieuDe: 'Tỷ lệ hoàn thành công việc của 4 dự án',
        cot: [{ rong: 150 }, { rong: 120 }],
        hang: [
            [dauXanh('Dự án'), dauXanh('Hoàn thành')],
            ['Website mới', '0,7'],
            ['App di động', '0,3'],
            ['Báo cáo Q3', '1'],
            ['Đào tạo nội bộ', '0,5'],
        ],
    },
    {
        ten: 'lr-07-thanh-tien-do',
        tieuDe: 'Ghép REPT và ROUND để vẽ thanh tiến độ ngay trong ô',
        congThuc: { o: 'C2', ct: '=REPT("█", ROUND(B2*10, 0))' },
        cot: [{ rong: 150 }, { rong: 100 }, { rong: 200 }],
        hang: [
            [dauXanh('Dự án'), dauXanh('%'), dauXanh('Thanh tiến độ')],
            ['Website mới', '70%', { v: '███████', nen: 'xanh' }],
            ['App di động', '30%', '███'],
            ['Báo cáo Q3', '100%', '██████████'],
            ['Đào tạo nội bộ', '50%', '█████'],
        ],
        chon: 'C2',
    },
];

const LO = [{ slug: 'ham-len-rept', anh: bai }];

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
