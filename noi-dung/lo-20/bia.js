// Ảnh bìa cho 5 bài của lô 20 — nhóm hàm kỹ thuật (Engineering)
const path = require('path');
const { sinhAnhBia, MAU } = require('../../tao-anh-bia.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');

const BIA = [
    {
        thuMuc: 'ham-dec2bin-bin2dec',
        ten: 'cover',
        eyebrow: 'Excel · Hàm kỹ thuật',
        hook: 'DEC2BIN',
        tieuDe: 'DEC2BIN, BIN2DEC: chuyển đổi nhị phân',
        phu: 'Hỗ trợ số âm bằng bù hai — khả năng BASE/DECIMAL không có.',
    },
    {
        thuMuc: 'ham-dec2hex-hex2dec',
        ten: 'cover',
        eyebrow: 'Excel · Hàm kỹ thuật',
        hook: 'DEC2HEX',
        tieuDe: 'DEC2HEX, HEX2DEC: chuyển đổi thập lục phân',
        phu: 'Cùng nguyên lý bù hai, phạm vi rộng hơn nhị phân rất nhiều.',
    },
    {
        thuMuc: 'ham-dec2oct-oct2dec',
        ten: 'cover',
        eyebrow: 'Excel · Hàm kỹ thuật',
        hook: 'DEC2OCT',
        tieuDe: 'DEC2OCT, OCT2DEC: hệ bát phân và quyền file Unix',
        phu: 'Con số 755 quen thuộc trong chmod thực ra là một số bát phân.',
    },
    {
        thuMuc: 'ham-bin2hex-hex2bin',
        ten: 'cover',
        eyebrow: 'Excel · Hàm kỹ thuật',
        hook: 'BIN2HEX',
        tieuDe: 'BIN2HEX, HEX2BIN: chuyển đổi trực tiếp',
        phu: 'Không cần đi qua bước trung gian thập phân.',
    },
    {
        thuMuc: 'ham-delta-gestep',
        ten: 'cover',
        eyebrow: 'Excel · Hàm kỹ thuật',
        hook: 'DELTA·GESTEP',
        hookMau: MAU.do,
        tieuDe: 'DELTA, GESTEP: cờ hiệu 0 và 1',
        phu: 'So sánh trả về số thay vì TRUE/FALSE — nhân thẳng vào công thức.',
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
