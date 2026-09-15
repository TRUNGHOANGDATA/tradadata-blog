// Sơ đồ cho bài — "Dùng AI viết công thức Excel và Google Sheets"
const path = require('path');
const { sinhSoDo } = require('../../tao-so-do.js');
const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const anh = [
    {
        ten: 'ct-01-bon-manh',
        tieuDe: 'Bốn mảnh của một câu hỏi cho ra công thức đúng',
        kieu: 'cards',
        the: [
            { tieu: 'Kết quả cần', mau: 'luc', phu: 'Ra cái gì', dong: ['Nói bằng lời thường', 'Càng cụ thể càng tốt'] },
            { tieu: 'Dữ liệu ở đâu', mau: 'lam', phu: 'Tên cột & ô', dong: ['"Điểm ở cột B, B2:B500"', 'Mảnh hay bị bỏ nhất'] },
            { tieu: 'Điều kiện', mau: 'cam', phu: 'Lọc thế nào', dong: ['"Đậu = điểm >= 5"', '"Chỉ đơn đã thanh toán"'] },
            { tieu: 'Phiên bản', mau: 'tim', phu: 'Bạn dùng gì', dong: ['Excel 365 / 2016', 'hay Google Sheets'] },
        ],
    },
    {
        ten: 'ct-02-quy-trinh',
        tieuDe: 'Vòng lặp hỏi — thử — sửa',
        kieu: 'flow',
        buoc: [
            { nhan: 'Mô tả việc', phu: 'kèm đủ bốn mảnh', mau: 'luc' },
            { nhan: 'Dán vào Excel', phu: 'chạy thử trên dữ liệu thật', mau: 'lam' },
            { nhan: 'Tả lại lỗi', phu: 'báo mã lỗi / kết quả lệch', mau: 'cam' },
            { nhan: 'AI sửa & giải thích', phu: 'lặp tới khi đúng', mau: 'tim' },
        ],
    },
    {
        ten: 'ct-03-ba-bay',
        tieuDe: 'Ba cái bẫy phải kiểm trước khi tin AI',
        kieu: 'cards',
        the: [
            { tieu: 'Sai địa chỉ ô', mau: 'cam', phu: 'AI đoán vùng', dong: ['Trỏ B2:B100 khi tới B500', 'Luôn liếc lại vùng ô'] },
            { tieu: 'Hàm máy không có', mau: 'hong', phu: '#NAME?', dong: ['XLOOKUP, FILTER... chỉ 365', 'Phải khai rõ phiên bản'] },
            { tieu: 'Ảo giác ra hàm', mau: 'tim', phu: 'Hàm bịa', dong: ['Nghe thật mà không tồn tại', 'Dán chạy thử là lộ ngay'] },
        ],
    },
];

const LO = [{ slug: 'ai-cong-thuc-excel', anh }];
async function chay() {
    let tong = 0;
    for (const spec of anh) { const r = await sinhSoDo(spec, path.join(GOC, 'ai-cong-thuc-excel')); tong += r.nang;
        console.log(`  ai-cong-thuc-excel/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang/1024).toFixed(0)} KB`); }
    console.log(`Tổng ${(tong/1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
