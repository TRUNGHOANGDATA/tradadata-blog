// Sơ đồ cho bài 3 — "Claude Skills là gì"
const path = require('path');
const { sinhSoDo } = require('../../tao-so-do.js');
const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const anh = [
    {
        ten: 'sk-01-thanh-phan',
        tieuDe: 'Một Skill gồm những gì: SKILL.md, scripts, tài nguyên',
        kieu: 'stack',
        nhanNgoai: '1 Skill = một thư mục',
        phuNgoai: 'gói lại và dùng chung cho web, app, Claude Code, API',
        mauNgoai: 'luc',
        moiHang: 3,
        wChip: 210,
        trong: [
            { nhan: 'SKILL.md', phu: 'bắt buộc — mô tả cách làm', mau: 'luc' },
            { nhan: 'Scripts', phu: 'tuỳ chọn — mã chạy chính xác', mau: 'lam' },
            { nhan: 'Tài nguyên', phu: 'tuỳ chọn — mẫu, ví dụ', mau: 'cam' },
        ],
    },
    {
        ten: 'sk-02-cach-hoat-dong',
        tieuDe: 'Progressive disclosure: chỉ nạp skill khi liên quan',
        kieu: 'flow',
        buoc: [
            { nhan: 'Quét lướt', phu: 'đọc tên + mô tả ngắn các skill', mau: 'luc' },
            { nhan: 'So khớp việc', phu: 'có skill nào hợp không?', mau: 'lam' },
            { nhan: 'Nạp đầy đủ', phu: 'chỉ nạp skill liên quan', mau: 'cam' },
            { nhan: 'Làm & giải phóng', phu: 'xong thì trả lại chỗ', mau: 'tim' },
        ],
    },
    {
        ten: 'sk-03-vi-du',
        tieuDe: 'Vài skill dựng sẵn cho việc văn phòng',
        kieu: 'cards',
        the: [
            { tieu: 'Excel', mau: 'luc', dong: ['Bảng tính có công thức thật', 'Không phải ảnh chụp'] },
            { tieu: 'PowerPoint', mau: 'cam', dong: ['Dựng slide trình bày', 'Bố cục chỉn chu'] },
            { tieu: 'Word', mau: 'lam', dong: ['Văn bản định dạng', 'Sẵn sàng gửi đi'] },
            { tieu: 'PDF', mau: 'hong', dong: ['Tạo PDF', 'Điền được (fillable)'] },
        ],
    },
    {
        ten: 'sk-04-bat-skills',
        tieuDe: 'Cách bật Skills trong Claude',
        kieu: 'flow',
        buoc: [
            { nhan: 'Mở Settings', phu: 'phần Cài đặt', mau: 'luc' },
            { nhan: 'Vào Features', phu: 'mục Tính năng', mau: 'lam' },
            { nhan: 'Bật Skills', phu: 'kèm công cụ Code Execution', mau: 'cam' },
            { nhan: 'Team: admin bật trước', phu: 'cho phép ở cấp tổ chức', mau: 'xam' },
        ],
    },
];

const LO = [{ slug: 'claude-skills', anh }];
async function chay() {
    let tong = 0;
    for (const spec of anh) { const r = await sinhSoDo(spec, path.join(GOC, 'claude-skills')); tong += r.nang;
        console.log(`  claude-skills/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang/1024).toFixed(0)} KB`); }
    console.log(`Tổng ${(tong/1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
