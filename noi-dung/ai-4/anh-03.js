// Sơ đồ cho bài 10 — "So sánh Claude và ChatGPT"
const path = require('path');
const { sinhSoDo } = require('../../tao-so-do.js');
const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const anh = [
    {
        ten: 'cmp-01-diem-manh',
        tieuDe: 'Điểm mạnh thường thấy của mỗi bên',
        kieu: 'cards',
        the: [
            { tieu: 'Claude', mau: 'luc', phu: 'Anthropic', dong: ['Viết văn mạch lạc, tự nhiên', 'Đọc tài liệu dài', 'Lập trình + Claude Code'] },
            { tieu: 'ChatGPT', mau: 'lam', phu: 'OpenAI', dong: ['Hệ sinh thái rộng', 'Mạnh đa phương tiện (ảnh, giọng nói)', 'GPT Store hàng triệu GPT'] },
        ],
    },
    {
        ten: 'cmp-02-chon-cai-nao',
        tieuDe: 'Nên nghiêng về cái nào cho việc gì',
        kieu: 'cards',
        the: [
            { tieu: 'Nghiêng Claude', mau: 'luc', dong: ['Viết & biên tập nhiều', 'Xử lý tài liệu dài', 'Làm mã theo dự án'] },
            { tieu: 'Nghiêng ChatGPT', mau: 'lam', dong: ['Cần đa phương tiện', 'Muốn hệ sinh thái rộng', 'Tìm GPT cộng đồng có sẵn'] },
            { tieu: 'Dùng cả hai', mau: 'cam', dong: ['Cả hai đều có gói free', 'Thử cùng việc ở hai bên', 'Giữ cái hợp gu hơn'] },
        ],
    },
];

const LO = [{ slug: 'claude-vs-chatgpt', anh }];
async function chay() {
    let tong = 0;
    for (const spec of anh) { const r = await sinhSoDo(spec, path.join(GOC, 'claude-vs-chatgpt')); tong += r.nang;
        console.log(`  claude-vs-chatgpt/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang/1024).toFixed(0)} KB`); }
    console.log(`Tổng ${(tong/1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
