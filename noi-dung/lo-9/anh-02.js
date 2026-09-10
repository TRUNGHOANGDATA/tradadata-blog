// Ảnh minh hoạ cho bài 2 — HOUR, MINUTE, SECOND
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'hms-01-cu-phap-co-ban',
        tieuDe: 'Tách giờ, phút, giây từ một ô thời gian',
        cot: [{ rong: 150 }, { rong: 100 }],
        hang: [
            [dauXanh('Công thức'), dauXanh('Kết quả')],
            [{ v: 'Giờ gốc: 08:45:30', canLe: 'trai' }, ''],
            [{ v: '=HOUR(A2)', mono: true }, { v: '8', nen: 'xanh' }],
            [{ v: '=MINUTE(A2)', mono: true }, { v: '45', canLe: 'giua' }],
            [{ v: '=SECOND(A2)', mono: true }, { v: '30', canLe: 'giua' }],
        ],
    },
    {
        ten: 'hms-02-datetime-day-va-gio',
        tieuDe: 'Phần ngày không ảnh hưởng tới HOUR/MINUTE/SECOND',
        cot: [{ rong: 170 }, { rong: 90 }],
        hang: [
            [dauXanh('Ô A'), dauXanh('=HOUR(A)')],
            [{ v: '08:45:30' }, { v: '8', nen: 'xanh' }],
            [{ v: '10/09/2026 08:45:30' }, { v: '8', nen: 'xanh' }],
        ],
    },
    {
        ten: 'hms-03-phan-ca-lam-viec',
        tieuDe: 'Phân ca làm việc từ thời điểm quét thẻ',
        congThuc: { o: 'C2', ct: '=IF(HOUR(B2)<12,"Ca sáng",IF(HOUR(B2)<18,"Ca chiều","Ngoài giờ"))' },
        cot: [{ rong: 80 }, { rong: 80 }, { rong: 100 }],
        hang: [
            [dauXanh('Nhân viên'), dauXanh('Quét thẻ'), dauXanh('Phân ca')],
            ['An', '07:50:00', { v: 'Ca sáng', nen: 'xanh' }],
            ['Bình', '14:05:00', 'Ca chiều'],
            ['Chi', '19:30:00', 'Ngoài giờ'],
        ],
        chon: 'C2',
    },
    {
        ten: 'hms-04-quy-doi-ra-phut',
        tieuDe: 'Quy đổi thời lượng cuộc gọi ra số phút thuần',
        congThuc: { o: 'B2', ct: '=HOUR(A2)*60+MINUTE(A2)' },
        cot: [{ rong: 100 }, { rong: 90 }],
        hang: [
            [dauXanh('Thời lượng'), dauXanh('Số phút')],
            ['01:35:00', { v: '95', nen: 'xanh' }],
            ['00:12:00', '12'],
        ],
        chon: 'B2',
    },
    {
        ten: 'hms-05-nham-am-pm',
        tieuDe: 'Quên gõ PM khiến HOUR trả về sai giờ',
        cot: [{ rong: 110 }, { rong: 90 }, { rong: 90 }],
        hang: [
            [dauXanh('Gõ vào'), dauXanh('Excel hiểu'), dauXanh('=HOUR')],
            [{ v: '3:00 PM' }, { v: '15:00:00' }, { v: '15', nen: 'xanh' }],
            [{ v: '3:00' }, { v: '03:00:00' }, { v: '3', nen: 'do' }],
        ],
    },
];

const LO = [{ slug: 'ham-hour-minute-second', anh: bai }];

async function chay() {
    let tong = 0;
    for (const b of LO) for (const spec of b.anh) {
        const r = await sinhAnh(spec, path.join(GOC, b.slug));
        tong += r.nang;
        console.log(`  ${b.slug}/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang / 1024).toFixed(0)} KB`);
    }
    console.log(`Tổng ${(tong / 1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
