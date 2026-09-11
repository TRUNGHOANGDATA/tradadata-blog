// Sơ đồ cho bài 9 — "GPTs, Custom Instructions, Connectors của ChatGPT"
const path = require('path');
const { sinhSoDo } = require('../../tao-so-do.js');
const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const anh = [
    {
        ten: 'gc-01-ba-khai-niem',
        tieuDe: 'Ba cách mở rộng ChatGPT',
        kieu: 'cards',
        the: [
            { tieu: 'Custom Instructions', mau: 'luc', phu: 'Đặt sẵn cách trả lời', dong: ['Khai một lần', 'Áp cho mọi trò chuyện', 'Giống "chỉ dẫn" của Skills'] },
            { tieu: 'Custom GPTs', mau: 'tim', phu: 'Trợ lý đóng gói', dong: ['Cấu hình sẵn cho một việc', 'Dùng lại, chia sẻ được', 'Giống ý tưởng Plugins'] },
            { tieu: 'Connectors & Apps', mau: 'lam', phu: 'Nối dữ liệu thật', dong: ['Lịch, tài liệu, bảng tính', 'Cũng dùng chuẩn MCP', 'Apps hiện được cả giao diện'] },
        ],
    },
    {
        ten: 'gc-02-thanh-phan',
        tieuDe: 'Một Custom GPT gồm những gì',
        kieu: 'stack',
        nhanNgoai: '1 Custom GPT',
        phuNgoai: 'một trợ lý tái dùng',
        mauNgoai: 'tim',
        moiHang: 2,
        trong: [
            { nhan: 'Tên & mô tả', phu: 'để nhận biết, tìm lại', mau: 'luc' },
            { nhan: 'Instructions', phu: 'chỉ dẫn riêng cho GPT này', mau: 'lam' },
            { nhan: 'Knowledge', phu: 'tài liệu nền tham chiếu', mau: 'cam' },
            { nhan: 'Capabilities', phu: 'tìm web, tạo ảnh, chạy mã...', mau: 'hong' },
        ],
    },
    {
        ten: 'gc-03-cach-tao',
        tieuDe: 'Các bước tạo một Custom GPT',
        kieu: 'flow',
        moiHang: 5,
        rong: 1080,
        buoc: [
            { nhan: '+ Create', phu: 'ở trang Explore GPTs', mau: 'luc' },
            { nhan: 'Configure', phu: 'tên, mô tả, instructions', mau: 'lam' },
            { nhan: 'Thêm Knowledge', phu: 'tải tài liệu nền', mau: 'cam' },
            { nhan: 'Bật Capabilities', phu: 'chọn năng lực', mau: 'hong' },
            { nhan: 'Chọn hiển thị', phu: 'riêng / link / GPT Store', mau: 'tim' },
        ],
    },
];

const LO = [{ slug: 'chatgpt-gpts', anh }];
async function chay() {
    let tong = 0;
    for (const spec of anh) { const r = await sinhSoDo(spec, path.join(GOC, 'chatgpt-gpts')); tong += r.nang;
        console.log(`  chatgpt-gpts/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang/1024).toFixed(0)} KB`); }
    console.log(`Tổng ${(tong/1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
