// Ảnh bìa cho batch 6 series AI — AI cho việc giấy tờ văn phòng
const path = require('path');
const { sinhAnhBia } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ai-email-cong-viec',
        ten: 'cover',
        eyebrow: 'AI · Email',
        hook: 'Bớt ngại',
        tieuDe: 'Dùng AI soạn và trả lời email công việc',
        phu: 'Công thức prompt bốn phần, giữ giọng văn của bạn, và ranh giới không được vượt.',
    },
    {
        thuMuc: 'ai-tom-tat-tai-lieu',
        ten: 'cover',
        eyebrow: 'AI · Tóm tắt',
        hook: 'Đọc nhanh',
        tieuDe: 'Dùng AI tóm tắt tài liệu dài và biên bản cuộc họp',
        phu: 'Tóm theo mục đích, biến biên bản họp thành đầu việc, và đối chiếu bản gốc.',
    },
    {
        thuMuc: 'ai-trich-xuat-du-lieu',
        ten: 'cover',
        eyebrow: 'AI · Trích xuất',
        hook: 'Hết gõ tay',
        tieuDe: 'Trích xuất dữ liệu từ hoá đơn, PDF và ảnh chụp thành bảng',
        phu: 'Khai đúng cột, nhập theo lô, và bắt lỗi đọc nhầm số tiền.',
    },
];

async function chay() {
    let tong = 0;
    for (const spec of BIA) {
        const r = await sinhAnhBia(spec, path.join(GOC, spec.thuMuc));
        tong += r.nang;
        console.log(`  ${spec.thuMuc}/cover.png  ${r.rong}x${r.cao}  ${(r.nang / 1024).toFixed(0)} KB`);
    }
    console.log(`Tổng ${(tong / 1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { BIA };
