// Sơ đồ cho bài 6 — "Projects và Memory"
const path = require('path');
const { sinhSoDo } = require('../../tao-so-do.js');
const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const anh = [
    {
        ten: 'pj-01-projects-vs-memory',
        tieuDe: 'Projects và Memory: hai vai trò khác nhau',
        kieu: 'cards',
        the: [
            { tieu: 'Projects', mau: 'luc', phu: 'Bạn tự sắp', dong: ['Không gian riêng cho một mảng việc', 'Gom tài liệu + chỉ dẫn + hội thoại', 'Chủ động tạo và sắp xếp'] },
            { tieu: 'Memory', mau: 'lam', phu: 'Claude tự giữ', dong: ['Nhớ chi tiết về bạn', 'Mang sang các hội thoại sau', 'Xem, chỉnh, xoá, tắt được'] },
        ],
    },
    {
        ten: 'pj-02-thanh-phan',
        tieuDe: 'Một Project gom những gì',
        kieu: 'stack',
        nhanNgoai: '1 Project',
        phuNgoai: 'một không gian, chung bối cảnh',
        mauNgoai: 'luc',
        moiHang: 3,
        wChip: 210,
        trong: [
            { nhan: 'Chỉ dẫn riêng', phu: 'vai trò, giọng văn, ràng buộc', mau: 'luc' },
            { nhan: 'Tài liệu nền', phu: 'mẫu, dữ liệu để tham chiếu', mau: 'lam' },
            { nhan: 'Các trò chuyện', phu: 'gọn một nơi', mau: 'cam' },
        ],
    },
    {
        ten: 'pj-03-cach-dung',
        tieuDe: 'Ba bước dùng một Project',
        kieu: 'flow',
        buoc: [
            { nhan: 'Tạo Project', phu: 'đặt tên theo mảng việc', mau: 'luc' },
            { nhan: 'Thêm tài liệu & chỉ dẫn', phu: 'khai một lần', mau: 'lam' },
            { nhan: 'Trò chuyện trong đó', phu: 'Claude đã có sẵn bối cảnh', mau: 'cam' },
        ],
    },
];

const LO = [{ slug: 'claude-projects-memory', anh }];
async function chay() {
    let tong = 0;
    for (const spec of anh) { const r = await sinhSoDo(spec, path.join(GOC, 'claude-projects-memory')); tong += r.nang;
        console.log(`  claude-projects-memory/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang/1024).toFixed(0)} KB`); }
    console.log(`Tổng ${(tong/1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
