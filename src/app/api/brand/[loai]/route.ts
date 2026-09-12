import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getBrandAssets } from '@/lib/data/settings';
import { CHUAN_ANH, layUrlAnh, type LoaiAnhThuongHieu } from '@/lib/brand';

/**
 * Phục vụ ảnh thương hiệu TỪ DOMAIN NHÀ.
 *
 * Vì sao cần lớp này thay vì trỏ thẳng URL Google Drive:
 *
 * 1. `og:image` phải là đường dẫn CỐ ĐỊNH. Nếu metadata phải đọc DB để biết
 *    URL ảnh thì `metadata` tĩnh ở layout gốc buộc phải thành
 *    `generateMetadata()`. Trang `/blog/[slug]` đang là TĨNH (`revalidate =
 *    3600`) và có cảnh báo rõ trong file đó là đừng kéo thêm thứ động vào.
 *    Trỏ vào `/api/brand/og` thì metadata vẫn là hằng số, còn chuyện ảnh nào
 *    do route này lo lúc chạy.
 * 2. Bộ đọc preview của Zalo và vài crawler khác không lấy ảnh khác domain
 *    ổn định, và thường KHÔNG đi theo redirect cho `og:image` — nên ở đây
 *    phải stream lại bytes, không được `NextResponse.redirect`.
 * 3. Ảnh trong email cũng dùng đường dẫn này: link domain nhà sống lâu hơn
 *    và hiển thị chắc chắn hơn link Drive.
 *
 * Chưa cấu hình gì thì đọc file tĩnh trong `public/` — đó là lý do repo vẫn
 * giữ `LOGO_TRA_DA_DATA.jpg`, `banner-default.jpg`, `og-default.jpg`.
 */

const LOAI_HOP_LE: LoaiAnhThuongHieu[] = ['logo', 'logo-toi', 'banner', 'og'];

const MIME_THEO_DUOI: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
};

/**
 * Cache dài ở mọi tầng. Đổi ảnh trong admin thì URL không đổi, nên bộ nhớ đệm
 * của Facebook vẫn giữ ảnh cũ cho tới khi bạn bấm Scrape Again trong Sharing
 * Debugger — đánh đổi có chủ ý để giữ metadata ở dạng hằng số.
 */
const CACHE = 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800';

export async function GET(_request: Request, { params }: { params: Promise<{ loai: string }> }) {
    const { loai } = await params;
    if (!LOAI_HOP_LE.includes(loai as LoaiAnhThuongHieu)) {
        return NextResponse.json({ error: 'Loại ảnh không hợp lệ' }, { status: 404 });
    }
    const kieu = loai as LoaiAnhThuongHieu;

    let url = CHUAN_ANH[kieu].macDinh;
    try {
        url = layUrlAnh(await getBrandAssets(), kieu);
    } catch (error) {
        // DB lỗi thì vẫn phải trả được ảnh — mất logo còn tệ hơn ảnh cũ.
        console.error('[brand] Không đọc được cấu hình ảnh, dùng file tĩnh:', error);
    }

    try {
        const { body, mime } = url.startsWith('/') ? await docFileTinh(url) : await taiVe(url);
        return new NextResponse(new Uint8Array(body), {
            headers: { 'Content-Type': mime, 'Cache-Control': CACHE },
        });
    } catch (error) {
        console.error(`[brand] Không lấy được ảnh ${kieu}:`, error);
        // Ảnh đã cấu hình hỏng (Drive đổi quyền, file bị xoá) thì lùi về file
        // tĩnh trong repo thay vì trả 500 — thẻ chia sẻ vẫn có ảnh.
        const duPhong = CHUAN_ANH[kieu].macDinh;
        if (url !== duPhong) {
            try {
                const { body, mime } = await docFileTinh(duPhong);
                return new NextResponse(new Uint8Array(body), {
                    headers: { 'Content-Type': mime, 'Cache-Control': 'public, max-age=300' },
                });
            } catch { /* rơi xuống 502 bên dưới */ }
        }
        return NextResponse.json({ error: 'Không lấy được ảnh' }, { status: 502 });
    }
}

async function docFileTinh(duongDan: string) {
    // `public/` được copy sang cạnh `server.js` trong image standalone, và
    // WORKDIR là /app nên `process.cwd()` trỏ đúng chỗ.
    let an = duongDan;
    while (an.startsWith('/')) an = an.slice(1);
    const tuyetDoi = path.join(process.cwd(), 'public', path.normalize(an));
    const goc = path.join(process.cwd(), 'public');
    if (!tuyetDoi.startsWith(goc)) throw new Error('Đường dẫn nằm ngoài public/');
    return {
        body: await readFile(tuyetDoi),
        mime: MIME_THEO_DUOI[path.extname(tuyetDoi).toLowerCase()] || 'application/octet-stream',
    };
}

async function taiVe(url: string) {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Nguồn ảnh trả ${res.status}`);
    const mime = res.headers.get('content-type') || 'image/jpeg';
    if (!mime.startsWith('image/')) throw new Error(`Nguồn ảnh trả kiểu ${mime}`);
    return { body: Buffer.from(await res.arrayBuffer()), mime };
}
