// Sơ đồ minh hoạ cho bài 2 — "Cài đặt Claude"
// cd-02-trang-tai là mockup dựng lại trang claude.ai/download (đúng các nút thật).
const path = require('path');
const { sinhSoDo } = require('../../tao-so-do.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

// Ảnh do script tự sinh
const anhSinh = [
    {
        ten: 'cd-01-bon-buoc',
        tieuDe: 'Bốn bước bắt đầu với Claude',
        kieu: 'flow',
        buoc: [
            { nhan: 'Tạo tài khoản', phu: 'tại claude.ai, bằng email hoặc Google', mau: 'luc' },
            { nhan: 'Chọn cách dùng', phu: 'web, app máy tính hoặc điện thoại', mau: 'lam' },
            { nhan: 'Đăng nhập', phu: 'bằng tài khoản vừa tạo', mau: 'cam' },
            { nhan: 'Trò chuyện thử', phu: 'gõ một câu hỏi bất kỳ', mau: 'tim' },
        ],
    },
    {
        ten: 'cd-02-trang-tai',
        tieuDe: 'Trang tải chính thức claude.ai/download — chọn hệ điều hành rồi bấm tải',
        kieu: 'mockup',
        url: 'claude.ai/download',
        tieuDeChinh: 'Tải Claude cho máy tính',
        phu: 'Claude luôn sẵn trong máy bạn, không cần mở tab trình duyệt.',
        moiHang: 2,
        nut: [
            { nhan: 'Windows', chinh: true },
            { nhan: 'macOS', chinh: true },
            { nhan: 'Windows (arm64)' },
            { nhan: 'Linux .deb (x64)' },
        ],
    },
    {
        ten: 'cd-03-goi-gia',
        tieuDe: 'Ba gói Claude cho cá nhân: Free, Pro, Max',
        kieu: 'cards',
        the: [
            { tieu: 'Free', mau: 'luc', phu: '0 đồng', dong: ['Đủ dùng việc nhẹ', 'Có giới hạn số lượt', 'Nên bắt đầu ở đây'] },
            { tieu: 'Pro', mau: 'lam', phu: '~20 USD/tháng', dong: ['Giới hạn cao hơn nhiều', 'Ưu tiên model mạnh', 'Hợp người dùng thường xuyên'] },
            { tieu: 'Max', mau: 'tim', phu: 'từ ~100 USD/tháng', dong: ['Gấp 5x hoặc 20x Pro', 'Cường độ rất cao', 'Có hai mức để chọn'] },
        ],
    },
];

const LO = [{ slug: 'cai-dat-claude', anh: anhSinh }];

async function chay() {
    let tong = 0;
    for (const spec of anhSinh) {
        const r = await sinhSoDo(spec, path.join(GOC, 'cai-dat-claude'));
        tong += r.nang;
        console.log(`  cai-dat-claude/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang / 1024).toFixed(0)} KB`);
    }
    console.log(`Tổng ${(tong / 1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
