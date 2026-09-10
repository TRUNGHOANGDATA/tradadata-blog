// Sinh ảnh minh hoạ dạng bảng tính Excel cho bài viết blog.
// Dựng SVG rồi để sharp render ra PNG — không gọi API, không tốn quota.
// Cần `npm i sharp` (giống create-favicon.js).

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const CHU = "Calibri, 'Segoe UI', Arial, sans-serif";
const CHU_CT = "Consolas, 'Courier New', monospace";

// Màu lấy theo giao diện Excel 365
const MAU = {
    vien: '#d4d4d4',
    dauCot: '#f3f3f3',
    chuDauCot: '#616161',
    xanhExcel: '#217346',
    loi: '#c0392b',
    chu: '#1a1a1a',
    vangNhan: '#fff2cc',
    xanhNhan: '#e2efda',
    doNhan: '#fce4e4',
};

const CAO_TIEU_DE = 32;
const CAO_THANH_CT = 30;
const CAO_DAU_COT = 22;
const CAO_HANG = 25;
const RONG_LE = 36; // cột số hàng bên trái
const CO_CHU = 13;

function thoat(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Ước lượng bề rộng chữ để cắt bớt khi tràn ô
function beRong(s, coChu, mono) {
    return String(s).length * coChu * (mono ? 0.6 : 0.5);
}

function catChu(s, rongO, coChu, mono) {
    if (beRong(s, coChu, mono) <= rongO) return s;
    let t = String(s);
    while (t.length > 1 && beRong(t + '…', coChu, mono) > rongO) t = t.slice(0, -1);
    return t + '…';
}

const LA_LOI = /^#(N\/A|REF!|VALUE!|DIV\/0!|NAME\?|NUM!|NULL!)$/;

// Chuẩn hoá một ô: chuỗi thô -> object đầy đủ
function chuanHoaO(o) {
    const c = (typeof o === 'object' && o !== null) ? { ...o } : { v: o == null ? '' : o };
    c.v = c.v == null ? '' : String(c.v);
    if (c.mono == null) c.mono = c.v.startsWith('=');
    if (LA_LOI.test(c.v.trim())) {
        if (c.mau == null) c.mau = MAU.loi;
        if (c.dam == null) c.dam = true;
    }
    if (c.canLe == null) {
        // số và phần trăm căn phải như Excel
        c.canLe = (c.v.trim() !== '' && /^-?[\d.,]+%?$/.test(c.v.trim())) ? 'phai' : 'trai';
    }
    return c;
}

// 'D2' -> { cot: 3, hang: 2 }  (cot đếm từ 0, hang đếm từ 1)
function raViTri(diaChi) {
    const m = /^([A-Z]+)(\d+)$/.exec(String(diaChi).toUpperCase());
    if (!m) return null;
    let cot = 0;
    for (const ch of m[1]) cot = cot * 26 + (ch.charCodeAt(0) - 64);
    return { cot: cot - 1, hang: parseInt(m[2], 10) };
}

function tenCot(i) {
    let s = '';
    let n = i + 1;
    while (n > 0) {
        const r = (n - 1) % 26;
        s = String.fromCharCode(65 + r) + s;
        n = Math.floor((n - 1) / 26);
    }
    return s;
}

function dungSvg(spec) {
    const cot = spec.cot.map(c => (typeof c === 'number' ? { rong: c } : c));
    const hang = spec.hang.map(h => h.map(chuanHoaO));
    const rongO = i => (cot[i] ? (cot[i].rong || 100) : 100);

    const rongBang = RONG_LE + cot.reduce((s, c) => s + (c.rong || 100), 0);
    const coTieuDe = !!spec.tieuDe;
    const coCT = !!spec.congThuc;
    const yDauCot = (coTieuDe ? CAO_TIEU_DE : 0) + (coCT ? CAO_THANH_CT : 0);
    const yBang = yDauCot + CAO_DAU_COT;
    const cao = yBang + hang.length * CAO_HANG + 1;

    const p = [];
    p.push('<svg xmlns="http://www.w3.org/2000/svg" width="' + rongBang + '" height="' + cao
        + '" viewBox="0 0 ' + rongBang + ' ' + cao + '">');
    p.push('<rect width="' + rongBang + '" height="' + cao + '" fill="#ffffff"/>');

    // Thanh tiêu đề xanh — tự co cỡ chữ, rồi cắt bớt kèm dấu "…" nếu bảng quá hẹp
    // so với tiêu đề dài. Không có bước này, tiêu đề dài sẽ tràn ra ngoài canvas
    // và bị cắt cụt giữa chữ mà không có dấu hiệu gì.
    if (coTieuDe) {
        const rongChoChu = rongBang - 24; // trừ lề 12px hai bên
        let coTd = 14;
        while (coTd > 10 && beRong(spec.tieuDe, coTd, false) > rongChoChu) coTd -= 1;
        const tieuDeHienThi = catChu(spec.tieuDe, rongChoChu, coTd, false);
        p.push('<rect x="0" y="0" width="' + rongBang + '" height="' + CAO_TIEU_DE + '" fill="' + MAU.xanhExcel + '"/>');
        p.push('<text x="12" y="21" font-family="' + CHU + '" font-size="' + coTd + '" font-weight="600" fill="#ffffff">'
            + thoat(tieuDeHienThi) + '</text>');
    }

    // Thanh công thức: [ô đang chọn]  fx  =CÔNG THỨC
    if (coCT) {
        const y = coTieuDe ? CAO_TIEU_DE : 0;
        p.push('<rect x="0" y="' + y + '" width="' + rongBang + '" height="' + CAO_THANH_CT + '" fill="#fbfbfb"/>');
        p.push('<line x1="0" y1="' + (y + CAO_THANH_CT) + '" x2="' + rongBang + '" y2="' + (y + CAO_THANH_CT)
            + '" stroke="' + MAU.vien + '"/>');
        p.push('<rect x="6" y="' + (y + 4) + '" width="52" height="' + (CAO_THANH_CT - 9)
            + '" fill="#ffffff" stroke="' + MAU.vien + '"/>');
        p.push('<text x="32" y="' + (y + 19) + '" font-family="' + CHU + '" font-size="12" fill="' + MAU.chu
            + '" text-anchor="middle">' + thoat(spec.congThuc.o || '') + '</text>');
        p.push('<text x="68" y="' + (y + 19) + '" font-family="Georgia, serif" font-size="12" font-style="italic" fill="'
            + MAU.chuDauCot + '">fx</text>');
        p.push('<text x="90" y="' + (y + 19) + '" font-family="' + CHU_CT + '" font-size="12.5" fill="' + MAU.chu + '">'
            + thoat(spec.congThuc.ct || '') + '</text>');
    }

    // Dải đầu cột A B C...
    p.push('<rect x="0" y="' + yDauCot + '" width="' + rongBang + '" height="' + CAO_DAU_COT + '" fill="' + MAU.dauCot + '"/>');
    let x = RONG_LE;
    cot.forEach((c, i) => {
        const r = c.rong || 100;
        p.push('<text x="' + (x + r / 2) + '" y="' + (yDauCot + 15) + '" font-family="' + CHU
            + '" font-size="11" fill="' + MAU.chuDauCot + '" text-anchor="middle">' + tenCot(i) + '</text>');
        x += r;
    });

    // Nền ô có tô màu — vẽ trước lưới để viền không bị phủ
    hang.forEach((h, ri) => {
        let cx = RONG_LE;
        h.forEach((o, ci) => {
            if (o.nen) {
                const nen = o.nen === 'vang' ? MAU.vangNhan
                    : o.nen === 'xanh' ? MAU.xanhNhan
                        : o.nen === 'do' ? MAU.doNhan : o.nen;
                p.push('<rect x="' + cx + '" y="' + (yBang + ri * CAO_HANG) + '" width="' + rongO(ci)
                    + '" height="' + CAO_HANG + '" fill="' + nen + '"/>');
            }
            cx += rongO(ci);
        });
    });

    // Lưới + số hàng
    p.push('<rect x="0" y="' + yBang + '" width="' + RONG_LE + '" height="' + (hang.length * CAO_HANG)
        + '" fill="' + MAU.dauCot + '"/>');
    hang.forEach((h, ri) => {
        const y = yBang + ri * CAO_HANG;
        p.push('<text x="' + (RONG_LE / 2) + '" y="' + (y + 17) + '" font-family="' + CHU
            + '" font-size="11" fill="' + MAU.chuDauCot + '" text-anchor="middle">' + (ri + 1) + '</text>');
        p.push('<line x1="0" y1="' + y + '" x2="' + rongBang + '" y2="' + y + '" stroke="' + MAU.vien + '"/>');
    });
    p.push('<line x1="0" y1="' + (cao - 1) + '" x2="' + rongBang + '" y2="' + (cao - 1) + '" stroke="' + MAU.vien + '"/>');
    x = 0;
    [RONG_LE].concat(cot.map(c => c.rong || 100)).forEach(r => {
        x += r;
        p.push('<line x1="' + x + '" y1="' + yDauCot + '" x2="' + x + '" y2="' + (cao - 1) + '" stroke="' + MAU.vien + '"/>');
    });
    p.push('<line x1="0" y1="' + yDauCot + '" x2="0" y2="' + (cao - 1) + '" stroke="' + MAU.vien + '"/>');
    p.push('<line x1="0" y1="' + yBang + '" x2="' + rongBang + '" y2="' + yBang + '" stroke="' + MAU.vien + '"/>');

    // Chữ trong ô
    hang.forEach((h, ri) => {
        let cx = RONG_LE;
        h.forEach((o, ci) => {
            const r = rongO(ci);
            if (o.v !== '') {
                const co = o.mono ? CO_CHU - 1 : CO_CHU;
                const chuoi = catChu(o.v, r - 12, co, o.mono);
                const y = yBang + ri * CAO_HANG + 17;
                let tx = cx + 6;
                let neo = 'start';
                if (o.canLe === 'phai') { tx = cx + r - 6; neo = 'end'; }
                else if (o.canLe === 'giua') { tx = cx + r / 2; neo = 'middle'; }
                p.push('<text x="' + tx + '" y="' + y + '" font-family="' + (o.mono ? CHU_CT : CHU)
                    + '" font-size="' + co + '"' + (o.dam ? ' font-weight="700"' : '')
                    + ' fill="' + (o.mau || MAU.chu) + '" text-anchor="' + neo + '">' + thoat(chuoi) + '</text>');
            }
            cx += r;
        });
    });

    // Viền ô đang chọn
    for (const dc of [].concat(spec.chon || [])) {
        const vt = raViTri(dc);
        if (!vt) continue;
        const cx = RONG_LE + cot.slice(0, vt.cot).reduce((s, c) => s + (c.rong || 100), 0);
        p.push('<rect x="' + cx + '" y="' + (yBang + (vt.hang - 1) * CAO_HANG) + '" width="' + rongO(vt.cot)
            + '" height="' + CAO_HANG + '" fill="none" stroke="' + MAU.xanhExcel + '" stroke-width="2"/>');
    }

    p.push('</svg>');
    return p.join('');
}

async function sinhAnh(spec, thuMuc) {
    const svg = dungSvg(spec);
    const duong = path.join(thuMuc, spec.ten + '.png');
    fs.mkdirSync(thuMuc, { recursive: true });
    // density 192 => render ở 2x cho nét trên màn hình mật độ cao
    const info = await sharp(Buffer.from(svg), { density: 192 }).png({ compressionLevel: 9 }).toFile(duong);
    return { duong, rong: info.width, cao: info.height, nang: info.size };
}

module.exports = { sinhAnh, dungSvg, MAU };
