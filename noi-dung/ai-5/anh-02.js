// Sơ đồ cho bài — "Đưa file Excel và CSV cho AI phân tích"
const path = require('path');
const { sinhSoDo } = require('../../tao-so-do.js');
const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const anh = [
    {
        ten: 'pt-01-hai-kieu',
        tieuDe: 'Hai kiểu "AI đọc file" — rất khác nhau',
        kieu: 'cards',
        the: [
            { tieu: 'Đọc như đọc chữ', mau: 'lam', phu: 'Suy luận', dong: ['Hiểu ý nghĩa, tóm tắt', 'Tính số lớn thì NHẨM → lệch', 'Nhanh, hợp file nhỏ'] },
            { tieu: 'Đọc bằng chạy code', mau: 'luc', phu: 'Tính thật', dong: ['Viết code, máy chạy thật', 'Số chính xác như Excel', 'Dùng cho mọi phép tính nghiêm túc'] },
        ],
    },
    {
        ten: 'pt-02-viec-lam-duoc',
        tieuDe: 'Những việc đáng đưa cho AI khi đã tải file lên',
        kieu: 'cards',
        the: [
            { tieu: 'Tổng hợp', mau: 'luc', dong: ['Doanh thu theo tháng', 'Top 10 khách hàng'] },
            { tieu: 'Tìm bất thường', mau: 'cam', dong: ['Dòng âm / trống', 'Mã đơn bị trùng'] },
            { tieu: 'Làm sạch', mau: 'lam', dong: ['Chuẩn hoá SĐT, ngày', 'Gộp hai file'] },
            { tieu: 'Biểu đồ & báo cáo', mau: 'tim', dong: ['Xuất hình thật', 'Nháp nhận xét'] },
        ],
    },
    {
        ten: 'pt-03-kiem-tra',
        tieuDe: 'Bốn cách kiểm lại con số AI đưa',
        kieu: 'flow',
        buoc: [
            { nhan: 'Bắt dùng code', phu: 'không cho nhẩm số quan trọng', mau: 'luc' },
            { nhan: 'Đối chiếu tay', phu: 'SUM thử một mẫu nhỏ trong Excel', mau: 'lam' },
            { nhan: 'Hỏi cách tính', phu: '"đã loại đơn huỷ chưa?"', mau: 'cam' },
            { nhan: 'Nghi số quá đẹp', phu: 'số thật hiếm khi tròn trịa', mau: 'tim' },
        ],
    },
];

const LO = [{ slug: 'ai-phan-tich-file', anh }];
async function chay() {
    let tong = 0;
    for (const spec of anh) { const r = await sinhSoDo(spec, path.join(GOC, 'ai-phan-tich-file')); tong += r.nang;
        console.log(`  ai-phan-tich-file/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang/1024).toFixed(0)} KB`); }
    console.log(`Tổng ${(tong/1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
