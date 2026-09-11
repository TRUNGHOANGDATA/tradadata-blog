// Sơ đồ cho bài 7 — "Viết prompt hiệu quả"
const path = require('path');
const { sinhSoDo } = require('../../tao-so-do.js');
const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const anh = [
    {
        ten: 'pr-01-bon-thanh-phan',
        tieuDe: 'Bốn thành phần của một prompt tốt',
        kieu: 'cards',
        the: [
            { tieu: 'Bối cảnh', mau: 'luc', dong: ['Bạn là ai', 'Làm gì, cho ai'] },
            { tieu: 'Nhiệm vụ rõ', mau: 'lam', dong: ['Nói thẳng việc cần', 'Tránh chung chung'] },
            { tieu: 'Định dạng', mau: 'cam', dong: ['Bảng, gạch đầu dòng...', 'Độ dài mong muốn'] },
            { tieu: 'Ví dụ mẫu', mau: 'tim', dong: ['Đưa mẫu để bắt chước', 'Nâng chất nhanh nhất'] },
        ],
    },
    {
        ten: 'pr-02-truoc-sau',
        tieuDe: 'Prompt mơ hồ và prompt cụ thể',
        kieu: 'cards',
        the: [
            { tieu: 'Mơ hồ', mau: 'hong', phu: 'kết quả chung chung', dong: ['"Viết gì đó về Excel"', 'Phải hỏi lại nhiều lần', 'Dễ lệch hướng'] },
            { tieu: 'Cụ thể', mau: 'luc', phu: 'dùng được ngay', dong: ['"Viết mở đầu 3 câu về VLOOKUP cho người mới"', 'Rõ đối tượng, độ dài', 'Ít phải sửa'] },
        ],
    },
    {
        ten: 'pr-03-quy-trinh',
        tieuDe: 'Quy trình chỉnh prompt dần',
        kieu: 'flow',
        buoc: [
            { nhan: 'Viết', phu: 'đủ bối cảnh + nhiệm vụ', mau: 'luc' },
            { nhan: 'Xem kết quả', phu: 'lệch ý ở đâu?', mau: 'lam' },
            { nhan: 'Chỉnh', phu: 'bổ sung điều còn thiếu', mau: 'cam' },
            { nhan: 'Lặp lại', phu: 'tới khi ưng', mau: 'tim' },
        ],
    },
];

const LO = [{ slug: 'viet-prompt-claude', anh }];
async function chay() {
    let tong = 0;
    for (const spec of anh) { const r = await sinhSoDo(spec, path.join(GOC, 'viet-prompt-claude')); tong += r.nang;
        console.log(`  viet-prompt-claude/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang/1024).toFixed(0)} KB`); }
    console.log(`Tổng ${(tong/1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
