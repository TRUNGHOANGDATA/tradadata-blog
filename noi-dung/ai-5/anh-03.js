// Sơ đồ cho bài — "AI Agent (tác tử AI) là gì"
const path = require('path');
const { sinhSoDo } = require('../../tao-so-do.js');
const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const anh = [
    {
        ten: 'ag-01-chatbot-vs-agent',
        tieuDe: 'Chatbot trả lời từng mảnh — Tác tử theo đuổi mục tiêu',
        kieu: 'cards',
        the: [
            { tieu: 'Chatbot thường', mau: 'lam', phu: 'Bạn thi công', dong: ['Giúp từng mảnh một', 'Bạn ghép các bước', 'Trả lời rồi dừng'] },
            { tieu: 'AI Agent', mau: 'luc', phu: 'Nó tìm đường', dong: ['Nhận cả mục tiêu', 'Tự chạy chuỗi việc', 'Tự kiểm & sửa mỗi bước'] },
        ],
    },
    {
        ten: 'ag-02-vong-lap',
        tieuDe: 'Bên trong tác tử: vòng lặp Nghĩ — Làm — Xem',
        kieu: 'flow',
        buoc: [
            { nhan: 'Nghĩ', phu: 'quyết định bước tiếp theo', mau: 'luc' },
            { nhan: 'Làm', phu: 'dùng công cụ: chạy code, tra file...', mau: 'lam' },
            { nhan: 'Xem', phu: 'đọc kết quả, đúng hướng chưa?', mau: 'cam' },
            { nhan: 'Lặp lại', phu: 'tới khi xong thì báo cáo', mau: 'tim' },
        ],
    },
    {
        ten: 'ag-03-ranh-gioi',
        tieuDe: 'Để tác tử tự làm — nhưng đặt ranh giới',
        kieu: 'cards',
        the: [
            { tieu: 'Chốt duyệt', mau: 'hong', phu: 'Việc khó lùi', dong: ['Gửi mail, xoá, thanh toán', 'Bạn bấm xác nhận'] },
            { tieu: 'Bản sao', mau: 'cam', phu: 'Không đụng bản gốc', dong: ['Cho tác tử dùng file copy', 'Giữ bản gốc an toàn'] },
            { tieu: 'Nghiệm thu', mau: 'lam', phu: 'Thành phẩm cuối', dong: ['Vẫn có thể tính lệch', 'Qua mắt bạn trước khi ra ngoài'] },
            { tieu: 'Bắt đầu nhỏ', mau: 'luc', phu: 'Ít rủi ro', dong: ['Giao việc gọn trước', 'Nới dần khi tin'] },
        ],
    },
];

const LO = [{ slug: 'ai-agent', anh }];
async function chay() {
    let tong = 0;
    for (const spec of anh) { const r = await sinhSoDo(spec, path.join(GOC, 'ai-agent')); tong += r.nang;
        console.log(`  ai-agent/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang/1024).toFixed(0)} KB`); }
    console.log(`Tổng ${(tong/1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
