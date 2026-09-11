// Sinh ảnh SƠ ĐỒ khái niệm cho bài viết (không phải bảng Excel).
// Dựng SVG rồi để sharp render ra PNG — không gọi API, không tốn quota.
// Nền SÁNG để đồng bộ với ảnh bảng tính đang dùng trong thân bài blog.
// Cần `npm i sharp`.
//
// Mỗi ảnh khai bằng một `spec` có `kieu` (loại sơ đồ):
//   - 'flow'    : các bước nối bằng mũi tên (hệ sinh thái, quy trình cài đặt)
//   - 'cards'   : nhiều thẻ so sánh cạnh nhau (model, gói giá, skills/connectors/plugins)
//   - 'stack'   : một khối lớn bao các "chip" bên trong (plugin = skills + connectors + ...)
//   - 'hub'     : một node trung tâm toả ra các node xung quanh (Claude + các connector)
// Xem ví dụ trong noi-dung/ai-*/anh-*.js.

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const CHU = "Calibri, 'Segoe UI', Arial, sans-serif";
const CHU_CT = "Consolas, 'Courier New', monospace";

// Bảng màu nền sáng, tông xanh thương hiệu Trà Đá Data
const MAU = {
    nen: '#f8fafc',        // slate-50
    the: '#ffffff',
    vien: '#e2e8f0',       // slate-200
    vienDam: '#cbd5e1',    // slate-300
    chu: '#0f172a',        // slate-900
    chuMo: '#64748b',      // slate-500
    brand: '#16a34a',
    brandNhat: '#dcfce7',
    // Màu nhấn cho từng nhóm ý (skills = xanh lá, connectors = xanh dương, plugins = tím)
    nhan: {
        luc:  { dam: '#16a34a', nhat: '#dcfce7', chu: '#166534' },
        lam:  { dam: '#2563eb', nhat: '#dbeafe', chu: '#1e40af' },
        tim:  { dam: '#7c3aed', nhat: '#ede9fe', chu: '#5b21b6' },
        cam:  { dam: '#ea580c', nhat: '#ffedd5', chu: '#9a3412' },
        hong: { dam: '#db2777', nhat: '#fce7f3', chu: '#9d174d' },
        xam:  { dam: '#475569', nhat: '#f1f5f9', chu: '#334155' },
    },
};

function thoat(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Ngắt dòng theo bề rộng ước lượng (px), cắt ở khoảng trắng
function nganDong(chuoi, coChu, rongToiDa, heSo = 0.52) {
    const tuArr = String(chuoi).split(' ');
    const dong = [];
    let hienTai = '';
    const rong = s => s.length * coChu * heSo;
    for (const tu of tuArr) {
        const thu = hienTai ? hienTai + ' ' + tu : tu;
        if (rong(thu) > rongToiDa && hienTai) { dong.push(hienTai); hienTai = tu; }
        else hienTai = thu;
    }
    if (hienTai) dong.push(hienTai);
    return dong;
}

// Vẽ nhiều dòng chữ căn giữa hoặc trái trong một hộp
function veChuNhieuDong(dong, x, y, coChu, mau, { canGiua = false, dam = false, cao = null, mono = false } = {}) {
    const lh = cao || coChu * 1.32;
    const font = mono ? CHU_CT : CHU;
    return dong.map((d, i) =>
        `<text x="${x}" y="${y + i * lh}" font-family="${font}" font-size="${coChu}" `
        + `font-weight="${dam ? 700 : 400}" fill="${mau}" `
        + `text-anchor="${canGiua ? 'middle' : 'start'}">${thoat(d)}</text>`
    ).join('');
}

function hopBoTron(x, y, w, h, { nen = MAU.the, vien = MAU.vien, rongVien = 1.5, r = 14 } = {}) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" `
        + `fill="${nen}" stroke="${vien}" stroke-width="${rongVien}"/>`;
}

function layNhan(ten) {
    return MAU.nhan[ten] || MAU.nhan.xam;
}

// Khung chung: nền + tiêu đề trên cùng + chân "Trà Đá Data"
function khung(rong, cao, tieuDe, veThan) {
    const p = [];
    p.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${rong}" height="${cao}" viewBox="0 0 ${rong} ${cao}">`);
    p.push(`<rect width="${rong}" height="${cao}" fill="${MAU.nen}"/>`);
    // Định nghĩa mũi tên
    p.push('<defs>'
        + `<marker id="mt" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">`
        + `<path d="M0,0 L9,4.5 L0,9 Z" fill="${MAU.vienDam}"/></marker>`
        + `<marker id="mtL" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">`
        + `<path d="M0,0 L9,4.5 L0,9 Z" fill="${MAU.brand}"/></marker>`
        + '</defs>');
    // Tiêu đề
    let yThan = 30;
    if (tieuDe) {
        p.push(`<text x="36" y="42" font-family="${CHU}" font-size="24" font-weight="700" fill="${MAU.chu}">${thoat(tieuDe)}</text>`);
        p.push(`<rect x="36" y="56" width="52" height="4" rx="2" fill="${MAU.brand}"/>`);
        yThan = 92;
    }
    p.push(veThan(yThan));
    // Chân
    p.push(`<text x="${rong - 28}" y="${cao - 20}" font-family="${CHU}" font-size="15" fill="${MAU.chuMo}" text-anchor="end">Trà Đá Data · tradadata.com</text>`);
    p.push('</svg>');
    return p.join('');
}

// ── Loại 'flow': các bước nối mũi tên, tự xuống hàng ───────────────
function dungFlow(spec) {
    const rong = spec.rong || 960;
    const buoc = spec.buoc;
    const moiHang = spec.moiHang || buoc.length;   // số bước mỗi hàng
    const wBox = spec.wBox || Math.floor((rong - 72 - (moiHang - 1) * 46) / moiHang);
    const hBox = spec.hBox || 116;
    const gx = 46, gy = 40;
    const soHang = Math.ceil(buoc.length / moiHang);
    const cao = (spec.tieuDe ? 92 : 30) + soHang * hBox + (soHang - 1) * gy + 44;

    return khung(rong, cao, spec.tieuDe, (y0) => {
        const p = [];
        buoc.forEach((b, i) => {
            const hang = Math.floor(i / moiHang);
            const cot = i % moiHang;
            const soTrenHang = Math.min(moiHang, buoc.length - hang * moiHang);
            const tongRong = soTrenHang * wBox + (soTrenHang - 1) * gx;
            const xBd = (rong - tongRong) / 2;
            const x = xBd + cot * (wBox + gx);
            const y = y0 + hang * (hBox + gy);
            const nh = layNhan(b.mau || 'luc');
            // Hộp
            p.push(hopBoTron(x, y, wBox, hBox, { nen: MAU.the, vien: nh.dam, rongVien: 2 }));
            p.push(`<rect x="${x}" y="${y}" width="6" height="${hBox}" rx="3" fill="${nh.dam}"/>`);
            // Số thứ tự
            if (b.so !== false) {
                p.push(`<circle cx="${x + 30}" cy="${y + 30}" r="15" fill="${nh.nhat}"/>`);
                p.push(`<text x="${x + 30}" y="${y + 36}" font-family="${CHU}" font-size="17" font-weight="700" fill="${nh.chu}" text-anchor="middle">${b.so || (i + 1)}</text>`);
            }
            // Nhãn chính
            const dongNhan = nganDong(b.nhan, 17, wBox - 60);
            p.push(veChuNhieuDong(dongNhan.slice(0, 2), x + 54, y + 30, 17, MAU.chu, { dam: true }));
            // Phụ đề
            if (b.phu) {
                const yPhu = y + 30 + Math.min(dongNhan.length, 2) * 22 + 4;
                const dongPhu = nganDong(b.phu, 14, wBox - 40);
                p.push(veChuNhieuDong(dongPhu.slice(0, 3), x + 22, yPhu, 14, MAU.chuMo));
            }
            // Mũi tên sang bước kế (cùng hàng)
            if (cot < soTrenHang - 1 && i < buoc.length - 1) {
                const x1 = x + wBox + 6, x2 = x + wBox + gx - 6, yc = y + hBox / 2;
                p.push(`<line x1="${x1}" y1="${yc}" x2="${x2}" y2="${yc}" stroke="${MAU.vienDam}" stroke-width="2.5" marker-end="url(#mt)"/>`);
            }
        });
        return p.join('');
    });
}

// ── Loại 'cards': các thẻ so sánh cạnh nhau ────────────────────────
function dungCards(spec) {
    const rong = spec.rong || 960;
    const the = spec.the;
    const n = the.length;
    const gx = 28;
    const wCard = Math.floor((rong - 72 - (n - 1) * gx) / n);
    // Chiều cao thẻ = header + số dòng nhiều nhất
    const maxDong = Math.max(...the.map(t => (t.dong || []).length));
    const hHeader = 88;
    const hCard = hHeader + 20 + maxDong * 30 + 20;
    const cao = (spec.tieuDe ? 92 : 30) + hCard + 44;

    return khung(rong, cao, spec.tieuDe, (y0) => {
        const p = [];
        the.forEach((t, i) => {
            const nh = layNhan(t.mau || ['luc', 'lam', 'tim', 'cam'][i % 4]);
            const x = 36 + i * (wCard + gx);
            const y = y0;
            p.push(hopBoTron(x, y, wCard, hCard, { nen: MAU.the, vien: MAU.vien, rongVien: 1.5 }));
            // Dải header màu
            p.push(`<path d="M${x},${y + 16} Q${x},${y} ${x + 16},${y} L${x + wCard - 16},${y} Q${x + wCard},${y} ${x + wCard},${y + 16} L${x + wCard},${y + hHeader} L${x},${y + hHeader} Z" fill="${nh.nhat}"/>`);
            p.push(`<rect x="${x}" y="${y}" width="${wCard}" height="6" rx="3" fill="${nh.dam}"/>`);
            // Tiêu đề thẻ
            const dongTieu = nganDong(t.tieu, 21, wCard - 32);
            p.push(veChuNhieuDong(dongTieu.slice(0, 2), x + wCard / 2, y + (dongTieu.length > 1 ? 38 : 46), 21, nh.chu, { canGiua: true, dam: true }));
            // Nhãn phụ (vd giá tiền)
            if (t.phu) {
                p.push(`<text x="${x + wCard / 2}" y="${y + 74}" font-family="${CHU}" font-size="15" fill="${nh.chu}" text-anchor="middle">${thoat(t.phu)}</text>`);
            }
            // Các dòng nội dung
            (t.dong || []).forEach((d, j) => {
                const yd = y + hHeader + 30 + j * 30;
                p.push(`<circle cx="${x + 22}" cy="${yd - 5}" r="3" fill="${nh.dam}"/>`);
                const dongD = nganDong(d, 15, wCard - 48);
                p.push(veChuNhieuDong(dongD.slice(0, 1), x + 36, yd, 15, MAU.chu));
            });
        });
        return p.join('');
    });
}

// ── Loại 'stack': khối lớn bao các chip bên trong ──────────────────
function dungStack(spec) {
    const rong = spec.rong || 820;
    const chip = spec.trong;
    const nhNgoai = layNhan(spec.mauNgoai || 'tim');
    const wChip = spec.wChip || 220;
    const hChip = 78;
    const moiHang = spec.moiHang || 2;
    const gx = 28, gy = 22;
    const soHang = Math.ceil(chip.length / moiHang);
    const padTop = 84;                 // chừa chỗ cho nhãn khối ngoài
    const hNgoai = padTop + soHang * hChip + (soHang - 1) * gy + 28;
    const wNgoai = moiHang * wChip + (moiHang - 1) * gx + 56;
    const xNgoai = (rong - wNgoai) / 2;
    const cao = (spec.tieuDe ? 92 : 30) + hNgoai + 44;

    return khung(rong, cao, spec.tieuDe, (y0) => {
        const p = [];
        // Khối ngoài
        p.push(hopBoTron(xNgoai, y0, wNgoai, hNgoai, { nen: nhNgoai.nhat, vien: nhNgoai.dam, rongVien: 2, r: 18 }));
        p.push(`<text x="${xNgoai + 28}" y="${y0 + 42}" font-family="${CHU}" font-size="20" font-weight="700" fill="${nhNgoai.chu}">${thoat(spec.nhanNgoai)}</text>`);
        if (spec.phuNgoai) {
            p.push(`<text x="${xNgoai + 28}" y="${y0 + 66}" font-family="${CHU}" font-size="14" fill="${nhNgoai.chu}">${thoat(spec.phuNgoai)}</text>`);
        }
        // Các chip
        chip.forEach((c, i) => {
            const hang = Math.floor(i / moiHang);
            const cot = i % moiHang;
            const soTrenHang = Math.min(moiHang, chip.length - hang * moiHang);
            const tongRong = soTrenHang * wChip + (soTrenHang - 1) * gx;
            const xBd = xNgoai + (wNgoai - tongRong) / 2;
            const x = xBd + cot * (wChip + gx);
            const y = y0 + padTop + hang * (hChip + gy);
            const nh = layNhan(c.mau || 'luc');
            p.push(hopBoTron(x, y, wChip, hChip, { nen: MAU.the, vien: nh.dam, rongVien: 1.8, r: 12 }));
            const dongTieu = nganDong(c.nhan, 17, wChip - 32);
            p.push(veChuNhieuDong(dongTieu.slice(0, 1), x + 18, y + 30, 17, nh.chu, { dam: true }));
            if (c.phu) {
                const dongPhu = nganDong(c.phu, 13.5, wChip - 32);
                p.push(veChuNhieuDong(dongPhu.slice(0, 2), x + 18, y + 52, 13.5, MAU.chuMo));
            }
        });
        return p.join('');
    });
}

// ── Loại 'hub': node trung tâm toả ra các node quanh ───────────────
function dungHub(spec) {
    const rong = spec.rong || 900;
    const cao = spec.cao || 520;
    const cx = rong / 2, cy = (spec.tieuDe ? 92 : 30) + (cao - (spec.tieuDe ? 92 : 30)) / 2;
    const quanh = spec.quanh;
    const n = quanh.length;
    const R = spec.R || 190;
    const rNode = 66;

    return khung(rong, cao, spec.tieuDe, () => {
        const p = [];
        const nhTt = layNhan(spec.mauTrung || 'luc');
        // Đường nối trước (nằm dưới node)
        const goc = [];
        for (let i = 0; i < n; i++) {
            const a = (-90 + i * (360 / n)) * Math.PI / 180;
            goc.push({ x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) });
            p.push(`<line x1="${cx}" y1="${cy}" x2="${goc[i].x}" y2="${goc[i].y}" stroke="${MAU.vienDam}" stroke-width="2" stroke-dasharray="5 5"/>`);
        }
        // Node trung tâm
        p.push(`<circle cx="${cx}" cy="${cy}" r="${rNode + 6}" fill="${nhTt.nhat}"/>`);
        p.push(`<circle cx="${cx}" cy="${cy}" r="${rNode}" fill="${nhTt.dam}"/>`);
        const dongTt = nganDong(spec.trung, 19, rNode * 1.7);
        p.push(veChuNhieuDong(dongTt.slice(0, 2), cx, cy - (dongTt.length > 1 ? 4 : -6), 19, '#ffffff', { canGiua: true, dam: true }));
        // Các node quanh
        quanh.forEach((q, i) => {
            const nh = layNhan(q.mau || 'lam');
            const g = goc[i];
            const w = 168, h = 54;
            p.push(hopBoTron(g.x - w / 2, g.y - h / 2, w, h, { nen: MAU.the, vien: nh.dam, rongVien: 2, r: 12 }));
            const dong = nganDong(q.nhan, 15.5, w - 24);
            p.push(veChuNhieuDong(dong.slice(0, 2), g.x, g.y - (dong.length > 1 ? 4 : -5), 15.5, nh.chu, { canGiua: true, dam: true }));
        });
        return p.join('');
    });
}

// ── Loại 'mockup': khung cửa sổ trình duyệt + tiêu đề + các nút ─────
// Dùng để minh hoạ trang tải/đăng ký mà không chụp nguyên trang gốc.
function dungMockup(spec) {
    const rong = spec.rong || 900;
    const nut = spec.nut || [];
    const moiHang = spec.moiHang || 2;
    const gx = 20, gy = 16;
    const wNut = Math.floor((rong - 2 * 40 - 2 * 36 - (moiHang - 1) * gx) / moiHang);
    const hNut = 56;
    const soHang = Math.ceil(nut.length / moiHang);
    const yTitle = spec.tieuDeChinh ? 132 : 0;
    const yPhu = spec.phu ? 40 : 0;
    const hBody = 40 + (yTitle ? 62 : 20) + yPhu + soHang * hNut + (soHang - 1) * gy + 40;
    const hWin = 44 + hBody;
    const cao = (spec.tieuDe ? 92 : 30) + hWin + 44;
    const xWin = 40, wWin = rong - 80;

    return khung(rong, cao, spec.tieuDe, (y0) => {
        const p = [];
        // Cửa sổ trình duyệt
        p.push(hopBoTron(xWin, y0, wWin, hWin, { nen: MAU.the, vien: MAU.vienDam, rongVien: 1.5, r: 14 }));
        // Thanh tiêu đề
        p.push(`<path d="M${xWin},${y0 + 14} Q${xWin},${y0} ${xWin + 14},${y0} L${xWin + wWin - 14},${y0} Q${xWin + wWin},${y0} ${xWin + wWin},${y0 + 14} L${xWin + wWin},${y0 + 44} L${xWin},${y0 + 44} Z" fill="#f1f5f9"/>`);
        ['#f87171', '#fbbf24', '#34d399'].forEach((c, i) =>
            p.push(`<circle cx="${xWin + 24 + i * 20}" cy="${y0 + 22}" r="6" fill="${c}"/>`));
        // Thanh địa chỉ
        const xUrl = xWin + 96, wUrl = wWin - 96 - 24;
        p.push(`<rect x="${xUrl}" y="${y0 + 11}" width="${wUrl}" height="22" rx="11" fill="#ffffff" stroke="${MAU.vien}"/>`);
        p.push(`<text x="${xUrl + 16}" y="${y0 + 26}" font-family="${CHU_CT}" font-size="13" fill="${MAU.chuMo}">${thoat(spec.url || 'claude.ai/download')}</text>`);
        // Thân
        const xB = xWin + 36;
        let y = y0 + 44 + 40;
        if (spec.tieuDeChinh) {
            p.push(`<text x="${xB}" y="${y + 8}" font-family="${CHU}" font-size="30" font-weight="700" fill="${MAU.chu}">${thoat(spec.tieuDeChinh)}</text>`);
            y += 46;
        }
        if (spec.phu) {
            const dongPhu = nganDong(spec.phu, 16, wWin - 72);
            p.push(veChuNhieuDong(dongPhu.slice(0, 2), xB, y + 6, 16, MAU.chuMo));
            y += 20 + Math.min(dongPhu.length, 2) * 22;
        }
        y += 12;
        // Các nút tải
        nut.forEach((nu, i) => {
            const hang = Math.floor(i / moiHang);
            const cot = i % moiHang;
            const x = xB + cot * (wNut + gx);
            const yn = y + hang * (hNut + gy);
            const chinh = nu.chinh;
            const nen = chinh ? MAU.chu : '#ffffff';
            const vien = chinh ? MAU.chu : MAU.vienDam;
            const chuMau = chinh ? '#ffffff' : MAU.chu;
            p.push(hopBoTron(x, yn, wNut, hNut, { nen, vien, rongVien: 1.5, r: 10 }));
            p.push(`<text x="${x + wNut / 2}" y="${yn + hNut / 2 + 6}" font-family="${CHU}" font-size="17" font-weight="700" fill="${chuMau}" text-anchor="middle">${thoat(nu.nhan)}</text>`);
        });
        return p.join('');
    });
}

function dungSvg(spec) {
    switch (spec.kieu) {
        case 'flow':   return dungFlow(spec);
        case 'cards':  return dungCards(spec);
        case 'stack':  return dungStack(spec);
        case 'hub':    return dungHub(spec);
        case 'mockup': return dungMockup(spec);
        default: throw new Error(`Không rõ kiểu sơ đồ: ${spec.kieu}`);
    }
}

async function sinhSoDo(spec, thuMuc) {
    const svg = dungSvg(spec);
    const duong = path.join(thuMuc, spec.ten + '.png');
    fs.mkdirSync(thuMuc, { recursive: true });
    const info = await sharp(Buffer.from(svg), { density: 168 }).png({ compressionLevel: 9 }).toFile(duong);
    return { duong, rong: info.width, cao: info.height, nang: info.size };
}

module.exports = { sinhSoDo, dungSvg, MAU };
