// Sơ đồ cho bài — "Dùng AI soạn và trả lời email công việc"
const path = require('path');
const { sinhSoDo } = require('../../tao-so-do.js');
const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const anh = [
    {
        ten: 'em-01-bon-phan',
        tieuDe: 'Bốn phần của một prompt soạn email',
        kieu: 'cards',
        the: [
            { tieu: 'Bối cảnh', mau: 'lam', phu: 'Chuyện gì', dong: ['"Khách đã thanh toán,', 'hỏi khi nào giao"'] },
            { tieu: 'Mục tiêu', mau: 'luc', phu: 'Muốn gì sau khi đọc', dong: ['"Báo giao thứ Sáu,', 'xin lỗi vì chậm"'] },
            { tieu: 'Giọng điệu', mau: 'cam', phu: 'Nói kiểu nào', dong: ['"Lịch sự, ấm áp,', 'nhận lỗi gọn"'] },
            { tieu: 'Ràng buộc', mau: 'tim', phu: 'Giới hạn', dong: ['"Dưới 120 chữ,', 'xưng bên em"'] },
        ],
    },
    {
        ten: 'em-02-tra-loi',
        tieuDe: 'Trả lời email: dán cả chuỗi cho AI đọc',
        kieu: 'flow',
        buoc: [
            { nhan: 'Dán email nhận', phu: 'cả chuỗi nếu dài', mau: 'lam' },
            { nhan: 'Nói ý muốn đáp', phu: 'gạch đầu dòng thô cũng được', mau: 'luc' },
            { nhan: 'AI viết nháp', phu: 'bám đúng mọi câu hỏi trong mail', mau: 'cam' },
            { nhan: 'Bạn chỉnh & gửi', phu: 'người đọc cuối là bạn', mau: 'tim' },
        ],
    },
    {
        ten: 'em-03-ranh-gioi',
        tieuDe: 'Hai ranh giới không được vượt',
        kieu: 'cards',
        the: [
            { tieu: 'Không để AI bịa', mau: 'hong', phu: 'Thông tin', dong: ['Số, tên, ngày, cam kết', 'phải do BẠN cung cấp / xác nhận'] },
            { tieu: 'Không để AI gửi', mau: 'cam', phu: 'Việc khó lùi', dong: ['Gửi nhầm là không rút lại được', 'AI dừng ở nháp, bạn bấm gửi'] },
        ],
    },
];

const LO = [{ slug: 'ai-email-cong-viec', anh }];
async function chay() {
    let tong = 0;
    for (const spec of anh) { const r = await sinhSoDo(spec, path.join(GOC, 'ai-email-cong-viec')); tong += r.nang;
        console.log(`  ai-email-cong-viec/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang/1024).toFixed(0)} KB`); }
    console.log(`Tổng ${(tong/1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
