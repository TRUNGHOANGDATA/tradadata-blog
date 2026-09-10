import sharp from 'sharp';
import { loiThanhChu } from '@/lib/errors';

/**
 * Thu nhỏ + nén lại ảnh TRƯỚC khi đẩy lên Google Drive.
 *
 * Vì sao cần (đo trên cụm 10/09/2026): ảnh cover đang lưu nguyên bản gốc ~500KB,
 * mà Google Drive KHÔNG resize theo tham số — URL `/d/<id>` trả về nguyên kích cỡ.
 * Nên mỗi lần cache ảnh của Next lạnh, pod phải tải cả file gốc rồi tự encode WebP:
 * 1,0-1,8s mỗi ảnh ở `/blog`, tới ~5s ở `/courses`. Một trang `/blog` có 108 biến
 * thể ảnh, 82 cái lạnh, tổng 222s encode dồn vào những người đọc đầu tiên.
 * Đầu vào nhỏ đi thì mọi lần encode lạnh về sau đều rẻ hơn, và đỡ cả băng thông
 * tải từ Drive. Trả giá một lần lúc upload, thay vì trả mãi lúc đọc.
 *
 * KHÔNG đổi sang WebP: URL ảnh cover được dùng trực tiếp làm `og:image` /
 * `twitter:image` trong `src/app/blog/[slug]/page.tsx`, mà mấy bộ đọc preview
 * (LinkedIn, Zalo) đọc WebP không ổn định. Ảnh hiển thị trên site thì đã đi qua
 * Next Image optimizer và được chuyển WebP ở đó rồi.
 *
 * NHƯNG PNG KHÔNG ALPHA thì phải đổi sang JPEG. Ảnh cover đang lưu trên Drive
 * hầu hết là PNG, và nén lại PNG làm file TO HƠN — đo trên cover thật:
 *     1672x941, gốc PNG 1662KB → PNG nén lại 2275KB → JPEG q88 199KB
 *      640x640, gốc PNG  572KB → PNG nén lại  820KB → JPEG q82  70KB
 * Tức giữ nguyên định dạng thì không tiết kiệm được gì cả. JPEG lại là định dạng
 * an toàn nhất cho og:image nên đổi sang nó không mất gì.
 * PNG CÓ alpha thì giữ PNG — JPEG không có kênh trong suốt, đổi là nền hoá đen.
 *
 * KHÔNG throw: lỗi ở đây không được phép làm hỏng việc upload. Có chuyện gì thì
 * trả lại buffer gốc kèm ghi chú, upload vẫn chạy.
 */

/** Hero rộng tối đa ~1216px (max-w-7xl trừ padding); chừa dư cho màn 2x. */
const RONG_TOI_DA = 1600;

/** SVG là vector; GIF có thể là ảnh động — thu nhỏ sẽ làm mất khung. */
const BO_QUA = ['image/svg+xml', 'image/gif'];

export type KetQuaToiUu = {
    buffer: Buffer;
    ten: string;
    mime: string;
    /** Câu ngắn để log, cho biết đã tiết kiệm được gì hay vì sao bỏ qua. */
    ghiChu: string;
};

export async function toiUuAnh(goc: Buffer, ten: string, mime: string): Promise<KetQuaToiUu> {
    const giuNguyen = (ghiChu: string): KetQuaToiUu => ({ buffer: goc, ten, mime, ghiChu });

    if (BO_QUA.includes(mime)) {
        return giuNguyen(`giữ nguyên (${mime} không xử lý)`);
    }

    try {
        const anh = sharp(goc, { failOn: 'none' });
        const meta = await anh.metadata();

        // `rotate()` không tham số = áp orientation trong EXIF rồi ghi thẳng vào pixel.
        // Cần, vì `resize` bỏ qua EXIF nên ảnh chụp dọc từ điện thoại sẽ bị quay ngang.
        const ong = anh.rotate().resize({ width: RONG_TOI_DA, withoutEnlargement: true });

        // PNG có alpha: giữ PNG. Mọi trường hợp còn lại về JPEG.
        // Chất lượng 88 chứ không phải 82: PNG thường là ảnh chụp màn hình có CHỮ,
        // q82 làm chữ hơi nhoè. Đo được q88 vẫn giảm 88% (1662KB → 199KB) nên
        // 13KB thêm là rẻ so với chữ đọc được.
        const giuPng = meta.format === 'png' && meta.hasAlpha;
        let mimeMoi = mime;
        let tenMoi = ten;

        if (giuPng) {
            ong.png({ compressionLevel: 9 });
        } else if (meta.format === 'webp') {
            ong.webp({ quality: 82 });
        } else {
            ong.jpeg({ quality: meta.format === 'png' ? 88 : 82, mozjpeg: true });
            mimeMoi = 'image/jpeg';
            tenMoi = ten.replace(/\.[^.]+$/, '') + '.jpg';
        }

        const moi = await ong.toBuffer();

        // Ảnh đã nhỏ/đã nén tốt thì bản "tối ưu" có thể phình ra. Lúc đó giữ bản gốc.
        if (moi.length >= goc.length) {
            return giuNguyen(`giữ nguyên (nén lại không nhỏ hơn: ${kb(goc.length)} → ${kb(moi.length)})`);
        }

        const kichCo = meta.width && meta.height ? `${meta.width}x${meta.height}` : 'không rõ cỡ';
        const doiDinhDang = mimeMoi !== mime ? ` (${meta.format} → jpeg)` : '';
        return {
            buffer: moi,
            ten: tenMoi,
            mime: mimeMoi,
            ghiChu: `${kichCo}${doiDinhDang}, ${kb(goc.length)} → ${kb(moi.length)}`,
        };
    } catch (error) {
        return giuNguyen(`giữ nguyên (sharp lỗi: ${loiThanhChu(error)})`);
    }
}

function kb(byte: number): string {
    return `${Math.round(byte / 1024)}KB`;
}
