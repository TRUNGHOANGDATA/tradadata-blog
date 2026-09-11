// Sơ đồ cho bài 8 — "Cài đặt ChatGPT"
const path = require('path');
const { sinhSoDo } = require('../../tao-so-do.js');
const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const anh = [
    {
        ten: 'gpt-01-bon-buoc',
        tieuDe: 'Bốn bước bắt đầu với ChatGPT',
        kieu: 'flow',
        buoc: [
            { nhan: 'Tạo tài khoản', phu: 'tại chatgpt.com', mau: 'luc' },
            { nhan: 'Chọn cách dùng', phu: 'web, máy tính, điện thoại', mau: 'lam' },
            { nhan: 'Đăng nhập', phu: 'bằng tài khoản vừa tạo', mau: 'cam' },
            { nhan: 'Hỏi thử', phu: 'gõ một câu bất kỳ', mau: 'tim' },
        ],
    },
    {
        ten: 'gpt-02-tai-app',
        tieuDe: 'ChatGPT có mặt trên mọi thiết bị',
        kieu: 'mockup',
        url: 'chatgpt.com',
        tieuDeChinh: 'Tải ChatGPT',
        phu: 'Dùng trên web, hoặc cài app máy tính và điện thoại.',
        moiHang: 2,
        nut: [
            { nhan: 'Windows', chinh: true },
            { nhan: 'macOS', chinh: true },
            { nhan: 'iOS (App Store)' },
            { nhan: 'Android (Google Play)' },
        ],
    },
    {
        ten: 'gpt-03-goi-gia',
        tieuDe: 'Các gói ChatGPT cho cá nhân',
        kieu: 'cards',
        the: [
            { tieu: 'Free', mau: 'luc', phu: '0 đồng', dong: ['Sản phẩm thật, không phải demo', 'Có trần sử dụng', 'Không có model cao nhất'] },
            { tieu: 'Go', mau: 'lam', phu: '~8 USD/tháng', dong: ['Gói nhẹ giá rẻ', 'Nới giới hạn cơ bản'] },
            { tieu: 'Plus', mau: 'cam', phu: '~20 USD/tháng', dong: ['Gần đủ mọi tính năng', 'Phổ biến nhất', 'Model mạnh'] },
            { tieu: 'Pro', mau: 'tim', phu: '~100–200 USD', dong: ['Cường độ cao', 'Giới hạn gấp nhiều lần Plus'] },
        ],
    },
];

const LO = [{ slug: 'chatgpt-cai-dat', anh }];
async function chay() {
    let tong = 0;
    for (const spec of anh) { const r = await sinhSoDo(spec, path.join(GOC, 'chatgpt-cai-dat')); tong += r.nang;
        console.log(`  chatgpt-cai-dat/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang/1024).toFixed(0)} KB`); }
    console.log(`Tổng ${(tong/1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
