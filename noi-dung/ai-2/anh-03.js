// Sơ đồ cho bài 5 — "Claude Plugins là gì"
const path = require('path');
const { sinhSoDo } = require('../../tao-so-do.js');
const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const anh = [
    {
        ten: 'pl-01-thanh-phan',
        tieuDe: 'Một plugin có thể gói những gì',
        kieu: 'stack',
        nhanNgoai: '1 Plugin',
        phuNgoai: 'cài một lần là có tất cả',
        mauNgoai: 'tim',
        moiHang: 2,
        trong: [
            { nhan: 'Skills', phu: 'các kỹ năng đóng gói', mau: 'luc' },
            { nhan: 'MCP / Connectors', phu: 'kết nối dữ liệu, công cụ', mau: 'lam' },
            { nhan: 'Lệnh (commands)', phu: 'lối tắt thao tác', mau: 'cam' },
            { nhan: 'Agents / hooks', phu: 'cấu hình tự động hoá', mau: 'hong' },
        ],
    },
    {
        ten: 'pl-02-ba-khai-niem',
        tieuDe: 'Skills, Connectors, Plugins — bổ sung cho nhau',
        kieu: 'cards',
        the: [
            { tieu: 'Skills', mau: 'luc', phu: 'Kiến thức', dong: ['Dạy Claude CÁCH làm', 'Gói SKILL.md'] },
            { tieu: 'Connectors', mau: 'lam', phu: 'Quyền truy cập', dong: ['Nối dữ liệu thật', 'Qua chuẩn MCP'] },
            { tieu: 'Plugins', mau: 'tim', phu: 'Đóng gói', dong: ['Gộp cả hai + lệnh', 'Cài một phát'] },
        ],
    },
    {
        ten: 'pl-03-cai-dat',
        tieuDe: 'Cài plugin trong Claude Code',
        kieu: 'flow',
        buoc: [
            { nhan: 'Gõ /plugin', phu: 'thẻ Discover và Installed', mau: 'luc' },
            { nhan: 'marketplace add', phu: 'đăng ký kho plugin', mau: 'lam' },
            { nhan: 'plugin install', phu: 'cài plugin từ kho', mau: 'cam' },
            { nhan: 'Dùng ngay', phu: 'skills + lệnh + kết nối sẵn sàng', mau: 'tim' },
        ],
    },
];

const LO = [{ slug: 'claude-plugins', anh }];
async function chay() {
    let tong = 0;
    for (const spec of anh) { const r = await sinhSoDo(spec, path.join(GOC, 'claude-plugins')); tong += r.nang;
        console.log(`  claude-plugins/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang/1024).toFixed(0)} KB`); }
    console.log(`Tổng ${(tong/1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
