// Sơ đồ cho bài — "Dùng AI trích xuất dữ liệu từ hoá đơn, PDF và ảnh chụp"
const path = require('path');
const { sinhSoDo } = require('../../tao-so-do.js');
const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const anh = [
    {
        ten: 'tx-01-khai-cot',
        tieuDe: 'Một prompt trích xuất tốt gồm bốn phần',
        kieu: 'cards',
        the: [
            { tieu: 'Cột cần lấy', mau: 'lam', dong: ['Ngày, Số HĐ, Mặt hàng,', 'Số lượng, Đơn giá, Thành tiền'] },
            { tieu: 'Định dạng', mau: 'luc', dong: ['Ngày dd/mm/yyyy', 'Số thuần, không "đ"'] },
            { tieu: 'Ô thiếu', mau: 'cam', dong: ['"Không có thì để trống,', 'đừng đoán"'] },
            { tieu: 'Dạng ra', mau: 'tim', dong: ['Bảng để dán Excel', 'hoặc CSV'] },
        ],
    },
    {
        ten: 'tx-02-theo-lo',
        tieuDe: 'Nhập theo lô: nhiều hoá đơn một lần',
        kieu: 'flow',
        buoc: [
            { nhan: 'Đưa nhiều ảnh/PDF', phu: 'cùng lúc', mau: 'lam' },
            { nhan: 'Gộp một bảng', phu: 'thêm cột "Tên file"', mau: 'luc' },
            { nhan: 'Giữ nguyên bộ cột', phu: 'để các bảng ghép được', mau: 'cam' },
            { nhan: 'Cộng bằng code', phu: 'máy tính tính, không nhẩm', mau: 'tim' },
        ],
    },
    {
        ten: 'tx-03-bat-loi',
        tieuDe: 'Ba kiểu đọc nhầm và cách tự bắt lỗi',
        kieu: 'cards',
        the: [
            { tieu: 'Nhầm chữ số', mau: 'hong', phu: 'Ảnh mờ', dong: ['1.500.000 → 15.000.000', 'Sai một số 0 = sai gấp 10'] },
            { tieu: 'Lệch cột', mau: 'cam', phu: 'Bố cục lạ', dong: ['Đơn giá nhảy sang thành tiền', 'Ô gộp gây lệch'] },
            { tieu: 'Bịa ô trống', mau: 'tim', phu: 'Không dặn', dong: ['Điền số nghe hợp lý', 'mà giấy không có'] },
            { tieu: 'Tự kiểm', mau: 'luc', phu: 'Chốt chặn', dong: ['SL × Đơn giá = Thành tiền', 'Đối chiếu tổng chứng từ'] },
        ],
    },
];

const LO = [{ slug: 'ai-trich-xuat-du-lieu', anh }];
async function chay() {
    let tong = 0;
    for (const spec of anh) { const r = await sinhSoDo(spec, path.join(GOC, 'ai-trich-xuat-du-lieu')); tong += r.nang;
        console.log(`  ai-trich-xuat-du-lieu/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang/1024).toFixed(0)} KB`); }
    console.log(`Tổng ${(tong/1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
