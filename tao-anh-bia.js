// Sinh ảnh bìa bài viết (1200x630, đúng khổ Open Graph) bằng SVG -> PNG.
// Màu lấy từ token trong src/app/globals.css để bìa cùng hệ với giao diện site.
// Cần `npm i sharp`.

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const CHU = "Calibri, 'Segoe UI', Arial, sans-serif";
const CHU_CT = "Consolas, 'Courier New', monospace";

// Token màu — trùng với globals.css
const MAU = {
    nen: '#0f172a',        // surface-900
    nenDam: '#020617',     // surface-950
    brand400: '#4ade80',
    brand600: '#16a34a',
    excel: '#217346',
    trang: '#ffffff',
    mo: '#94a3b8',         // surface-400
    do: '#f87171',
};

const RONG = 1200;
const CAO = 630;
const LE = 88;

function thoat(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Ngắt dòng theo bề rộng ước lượng, cắt ở khoảng trắng
function nganDong(chuoi, coChu, rongToiDa, heSo) {
    const tuArr = String(chuoi).split(' ');
    const dong = [];
    let hienTai = '';
    const rong = s => s.length * coChu * heSo;
    for (const tu of tuArr) {
        const thu = hienTai ? hienTai + ' ' + tu : tu;
        if (rong(thu) > rongToiDa && hienTai) {
            dong.push(hienTai);
            hienTai = tu;
        } else {
            hienTai = thu;
        }
    }
    if (hienTai) dong.push(hienTai);
    return dong;
}

function dungSvgBia(spec) {
    const p = [];
    p.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${RONG}" height="${CAO}" viewBox="0 0 ${RONG} ${CAO}">`);

    // Nền + chuyển sắc nhẹ về góc phải dưới
    p.push('<defs>');
    p.push(`<linearGradient id="nen" x1="0" y1="0" x2="1" y2="1">`
        + `<stop offset="0%" stop-color="${MAU.nen}"/>`
        + `<stop offset="100%" stop-color="${MAU.nenDam}"/></linearGradient>`);
    p.push(`<linearGradient id="vien" x1="0" y1="0" x2="0" y2="1">`
        + `<stop offset="0%" stop-color="${MAU.brand400}"/>`
        + `<stop offset="100%" stop-color="${MAU.excel}"/></linearGradient>`);
    p.push('</defs>');
    p.push(`<rect width="${RONG}" height="${CAO}" fill="url(#nen)"/>`);

    // Lưới bảng tính mờ làm nền, gợi Excel mà không ồn
    const oRong = 60;
    const oCao = 42;
    for (let x = oRong; x < RONG; x += oRong) {
        p.push(`<line x1="${x}" y1="0" x2="${x}" y2="${CAO}" stroke="#ffffff" stroke-opacity="0.035"/>`);
    }
    for (let y = oCao; y < CAO; y += oCao) {
        p.push(`<line x1="0" y1="${y}" x2="${RONG}" y2="${y}" stroke="#ffffff" stroke-opacity="0.035"/>`);
    }

    // Dải màu thương hiệu bên trái
    p.push(`<rect x="0" y="0" width="10" height="${CAO}" fill="url(#vien)"/>`);

    // Dòng nhỏ trên cùng
    const eyebrow = (spec.eyebrow || 'EXCEL').toUpperCase();
    p.push(`<text x="${LE}" y="108" font-family="${CHU}" font-size="19" font-weight="700" `
        + `letter-spacing="3.4" fill="${MAU.brand400}">${thoat(eyebrow)}</text>`);

    // Chuỗi công thức / mã lỗi làm điểm nhấn thị giác
    const hookCo = spec.hook.length > 14 ? 60 : spec.hook.length > 10 ? 72 : 88;
    p.push(`<text x="${LE}" y="220" font-family="${CHU_CT}" font-size="${hookCo}" font-weight="700" `
        + `fill="${spec.hookMau || MAU.brand400}">${thoat(spec.hook)}</text>`);

    // Tiêu đề bài, ngắt dòng tay
    const tdCo = 50;
    const dong = nganDong(spec.tieuDe, tdCo, RONG - LE * 2, 0.475);
    dong.slice(0, 3).forEach((d, i) => {
        p.push(`<text x="${LE}" y="${310 + i * 64}" font-family="${CHU}" font-size="${tdCo}" `
            + `font-weight="700" fill="${MAU.trang}">${thoat(d)}</text>`);
    });

    // Dòng mô tả ngắn, lấp khoảng trống giữa tiêu đề và chân bìa
    if (spec.phu) {
        const soDongTd = Math.min(dong.length, 3);
        const yPhu = 310 + soDongTd * 64 + 16;
        const dongPhu = nganDong(spec.phu, 25, RONG - LE * 2, 0.5);
        dongPhu.slice(0, 2).forEach((d, i) => {
            p.push(`<text x="${LE}" y="${yPhu + i * 36}" font-family="${CHU}" font-size="25" `
                + `fill="${MAU.mo}">${thoat(d)}</text>`);
        });
    }

    // Chân bìa
    p.push(`<line x1="${LE}" y1="${CAO - 92}" x2="${RONG - LE}" y2="${CAO - 92}" `
        + `stroke="#ffffff" stroke-opacity="0.12"/>`);
    p.push(`<text x="${LE}" y="${CAO - 52}" font-family="${CHU}" font-size="23" font-weight="700" `
        + `fill="${MAU.trang}">Trà Đá Data</text>`);
    p.push(`<text x="${RONG - LE}" y="${CAO - 52}" font-family="${CHU}" font-size="21" `
        + `fill="${MAU.mo}" text-anchor="end">tradadata.com</text>`);

    p.push('</svg>');
    return p.join('');
}

async function sinhAnhBia(spec, thuMuc) {
    const svg = dungSvgBia(spec);
    const duong = path.join(thuMuc, (spec.ten || 'cover') + '.png');
    fs.mkdirSync(thuMuc, { recursive: true });
    const info = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(duong);
    return { duong, rong: info.width, cao: info.height, nang: info.size };
}

module.exports = { sinhAnhBia, dungSvgBia, MAU };
