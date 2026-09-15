// Sơ đồ cho bài — "Dùng AI tóm tắt tài liệu dài và biên bản cuộc họp"
const path = require('path');
const { sinhSoDo } = require('../../tao-so-do.js');
const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const anh = [
    {
        ten: 'tt-01-theo-muc-dich',
        tieuDe: 'Cùng một tài liệu, ba mục đích, ba bản tóm tắt',
        kieu: 'cards',
        the: [
            { tieu: 'Để nắm nhanh', mau: 'luc', dong: ['"5 gạch đầu dòng', 'cho người bận"'] },
            { tieu: 'Để tìm rủi ro', mau: 'cam', dong: ['"Điều khoản bất lợi:', 'phạt, gia hạn tự động"'] },
            { tieu: 'Để so sánh', mau: 'lam', dong: ['"Khác mẫu chuẩn', 'ở điểm nào?"'] },
        ],
    },
    {
        ten: 'tt-02-hop-thanh-viec',
        tieuDe: 'Biến biên bản cuộc họp thành thứ dùng được',
        kieu: 'flow',
        buoc: [
            { nhan: 'Dán bản ghi', phu: 'chép lời hoặc ghi chú thô', mau: 'lam' },
            { nhan: 'Quyết định đã chốt', phu: 'lọc ra khỏi phần bàn luận', mau: 'luc' },
            { nhan: 'Việc + người + hạn', phu: 'ai làm gì, khi nào', mau: 'cam' },
            { nhan: 'Vấn đề bỏ ngỏ', phu: 'chưa quyết, cần theo tiếp', mau: 'tim' },
        ],
    },
    {
        ten: 'tt-03-doi-chieu',
        tieuDe: 'Đối chiếu bản gốc ở chỗ quan trọng',
        kieu: 'cards',
        the: [
            { tieu: 'Đọc gốc', mau: 'lam', phu: 'Việc hệ trọng', dong: ['Trước khi ký / chuyển tiền', 'Tóm tắt chỉ để định hướng'] },
            { tieu: 'Bắt trích dẫn', mau: 'luc', phu: 'Kèm câu gốc', dong: ['"Trích câu gốc mỗi ý"', 'Kiểm tích tắc'] },
            { tieu: 'Soi phủ định', mau: 'cam', phu: 'Dễ bị đánh rơi', dong: ['"Không áp dụng nếu..."', 'Đổi hẳn ý nghĩa'] },
            { tieu: 'Cân dữ liệu mật', mau: 'hong', phu: 'Trước khi tải', dong: ['Hợp đồng, dữ liệu khách', 'Theo quy định công ty'] },
        ],
    },
];

const LO = [{ slug: 'ai-tom-tat-tai-lieu', anh }];
async function chay() {
    let tong = 0;
    for (const spec of anh) { const r = await sinhSoDo(spec, path.join(GOC, 'ai-tom-tat-tai-lieu')); tong += r.nang;
        console.log(`  ai-tom-tat-tai-lieu/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang/1024).toFixed(0)} KB`); }
    console.log(`Tổng ${(tong/1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
