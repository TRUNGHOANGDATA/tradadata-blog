// Sơ đồ cho bài 4 — "Claude Connectors là gì"
const path = require('path');
const { sinhSoDo } = require('../../tao-so-do.js');
const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const anh = [
    {
        ten: 'co-01-skill-vs-connector',
        tieuDe: 'Skill và Connector khác nhau thế nào',
        kieu: 'cards',
        the: [
            { tieu: 'Skill', mau: 'luc', phu: 'Kiến thức', dong: ['Dạy Claude CÁCH làm', 'Không chạm dữ liệu của bạn', 'Ví dụ: cách trình bày báo cáo'] },
            { tieu: 'Connector', mau: 'lam', phu: 'Quyền truy cập', dong: ['Cho Claude CHỖ để làm', 'Đọc/ghi dữ liệu thật', 'Ví dụ: lấy số từ Google Sheets'] },
        ],
    },
    {
        ten: 'co-02-hub',
        tieuDe: 'Connectors nối Claude với dữ liệu của bạn',
        kieu: 'hub',
        trung: 'Claude',
        mauTrung: 'luc',
        quanh: [
            { nhan: 'Gmail' }, { nhan: 'Google Drive' }, { nhan: 'Notion' },
            { nhan: 'GitHub' }, { nhan: 'Slack' }, { nhan: 'Calendar' },
        ],
    },
    {
        ten: 'co-03-cach-them',
        tieuDe: 'Cách thêm một connector',
        kieu: 'flow',
        buoc: [
            { nhan: 'Settings → Connectors', phu: 'hoặc dấu "+" trong ô chat', mau: 'luc' },
            { nhan: 'Bấm "+" mở kho', phu: 'duyệt hoặc tìm tên', mau: 'lam' },
            { nhan: 'Chọn & Connect', phu: 'xem quyền đọc/ghi', mau: 'cam' },
            { nhan: 'Đăng nhập cấp quyền', phu: 'trực tiếp với nhà cung cấp', mau: 'tim' },
        ],
    },
    {
        ten: 'co-04-quyen',
        tieuDe: 'Quyền cho mỗi hành động của connector (Team/Enterprise)',
        kieu: 'cards',
        the: [
            { tieu: 'Always allow', mau: 'luc', phu: 'Luôn cho', dong: ['Claude tự làm', 'Hợp hành động chỉ đọc'] },
            { tieu: 'Needs approval', mau: 'cam', phu: 'Hỏi trước', dong: ['Chờ bạn duyệt', 'Hợp hành động ghi/gửi'] },
            { tieu: 'Blocked', mau: 'hong', phu: 'Chặn', dong: ['Không cho dùng', 'Với thao tác nhạy cảm'] },
        ],
    },
];

const LO = [{ slug: 'claude-connectors', anh }];
async function chay() {
    let tong = 0;
    for (const spec of anh) { const r = await sinhSoDo(spec, path.join(GOC, 'claude-connectors')); tong += r.nang;
        console.log(`  claude-connectors/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang/1024).toFixed(0)} KB`); }
    console.log(`Tổng ${(tong/1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
