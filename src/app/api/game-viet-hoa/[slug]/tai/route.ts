import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getGameBySlug } from '@/lib/data/game-viet-hoa';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

type RouteParams = { params: Promise<{ slug: string }> };

/**
 * Tải patch game qua hộp nhắc ủng hộ có ĐẾM NGƯỢC BẮT BUỘC.
 *
 *   POST ?i=<chỉ số link>  -> cấp "vé" ký HMAC, ghi thời điểm cấp.
 *   GET  ?i=&ve=           -> vé hợp lệ VÀ đã đủ CHO_GIAY giây thì +1 lượt tải
 *                             rồi 302 sang link thật; chưa đủ thì quay về trang game.
 *
 * Vì sao phải kiểm ở server: link thật KHÔNG còn nằm trong HTML/RSC (trang chỉ gửi
 * nhãn nút), nên sửa trang hay tắt JS cũng không lấy được link mà không chờ.
 * Đây là rào THỜI GIAN, không phải rào thanh toán — tải vẫn miễn phí sau khi chờ.
 */
const CHO_GIAY = 15;
const VE_SONG_GIAY = 60 * 60; // vé cũ hơn 1 giờ thì phải mở hộp lại
const DEM_LAI_SAU_GIAY = 6 * 60 * 60; // một IP tải lại cùng game trong 6 giờ chỉ tính 1 lượt

function ky(slug: string, i: number, t: number): string | null {
    const khoa = process.env.AUTH_SECRET;
    if (!khoa) return null;
    // Tiền tố riêng để chữ ký này không bao giờ trùng mục đích với NextAuth.
    return createHmac('sha256', `game-tai:${khoa}`).update(`${slug}\n${i}\n${t}`).digest('base64url');
}

function chiSo(url: URL): number | null {
    const i = Number(url.searchParams.get('i'));
    return Number.isInteger(i) && i >= 0 && i < 20 ? i : null;
}

async function linkCua(slug: string, i: number): Promise<string | null> {
    const g = await getGameBySlug(slug);
    const url = g?.link_tai?.[i]?.url;
    // Admin đã chặn javascript: lúc lưu; kiểm lại vì đây là đích redirect.
    return url && /^https?:\/\//i.test(url) ? url : null;
}

export async function POST(request: Request, { params }: RouteParams) {
    const { slug } = await params;
    const i = chiSo(new URL(request.url));
    if (i === null || !(await linkCua(slug, i))) {
        return NextResponse.json({ error: 'Không tìm thấy link tải' }, { status: 404 });
    }
    const t = Date.now();
    const chuKy = ky(slug, i, t);
    if (!chuKy) {
        console.error('[game-tai] Thiếu AUTH_SECRET — không cấp được vé tải');
        return NextResponse.json({ error: 'Máy chủ chưa cấu hình' }, { status: 500 });
    }
    return NextResponse.json({ ve: `${t}.${chuKy}`, choGiay: CHO_GIAY }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function GET(request: Request, { params }: RouteParams) {
    const { slug } = await params;
    const url = new URL(request.url);
    const veLai = NextResponse.redirect(new URL(`/game-viet-hoa/${encodeURIComponent(slug)}`, url), 303);

    const i = chiSo(url);
    const [tStr, chuKy] = (url.searchParams.get('ve') ?? '').split('.');
    const t = Number(tStr);
    const dung = i !== null && Number.isFinite(t) ? ky(slug, i, t) : null;
    if (!dung || !chuKy || dung.length !== chuKy.length || !timingSafeEqual(Buffer.from(dung), Buffer.from(chuKy))) {
        return veLai;
    }
    const tuoi = (Date.now() - t) / 1000;
    // 0.5 giây du di cho đồng hồ trình duyệt đếm nhanh hơn server một nhịp.
    if (tuoi < CHO_GIAY - 0.5 || tuoi > VE_SONG_GIAY) return veLai;

    const dich = await linkCua(slug, i!);
    if (!dich) return veLai;

    // Đếm là phụ: lỗi đếm KHÔNG được chặn người đã chờ đủ.
    try {
        const { success } = await rateLimit(`game-tai:${getClientIp(request)}:${slug}`, {
            maxRequests: 1,
            windowSizeSeconds: DEM_LAI_SAU_GIAY,
        });
        if (success && supabaseAdmin) {
            const { error } = await supabaseAdmin.rpc('tang_luot_tai_game', { p_slug: slug });
            if (error) console.error('[game-tai] Không tăng được lượt tải:', error.message);
        }
    } catch (e) {
        console.error('[game-tai] Lỗi đếm lượt tải:', e);
    }
    return NextResponse.redirect(dich, 302);
}
