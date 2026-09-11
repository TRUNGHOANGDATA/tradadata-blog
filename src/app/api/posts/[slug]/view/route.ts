import { NextResponse } from 'next/server';
import { loiThanhChu } from '@/lib/errors';
import { supabaseAdmin } from '@/lib/supabase/server';
import { redis, isRedisConfigured, VIEW_KEYS } from '@/lib/redis';
import { getClientIp } from '@/lib/rate-limit';

type RouteParams = { params: Promise<{ slug: string }> };

// POST /api/posts/[slug]/view — Đếm một lượt xem.
//
// KHÔNG ghi thẳng Postgres nữa. Mỗi lượt xem chỉ +1 vào một hash trong Redis;
// cron `/api/cron/flush-views` mỗi vài phút gộp lại và ghi Postgres MỘT lần cho
// mỗi bài. Lý do: hàng `posts` chứa cột `content` (JSON cả bài, vài chục KB), mà
// Postgres theo MVCC ghi lại NGUYÊN hàng mỗi lần UPDATE ⇒ đếm view thẳng vào DB
// là mỗi lượt đọc viết lại vài chục KB WAL + heap tuple mới + rác cho autovacuum
// dọn. Đó là nguồn đốt Disk IO lớn nhất của project. Đệm qua Redis cắt ~99%
// lượng ghi đó.
export async function POST(request: Request, { params }: RouteParams) {
    try {
        const { slug } = await params;

        // Đường Redis (production): chỉ chạm Redis, 0 ghi Postgres.
        if (isRedisConfigured && redis) {
            // Chống đếm trùng: một IP xem cùng một bài trong 6 giờ chỉ tính 1 lượt.
            // `set ... nx` trả null nếu khoá đã tồn tại ⇒ bỏ qua, không +1.
            // Vừa cho số đếm sạch hơn, vừa giảm số lệnh ghi Redis khi bị F5 liên tục.
            const ip = getClientIp(request);
            const seenKey = `${VIEW_KEYS.seenPrefix}:${ip}:${slug}`;
            const firstView = await redis.set(seenKey, 1, { nx: true, ex: 6 * 60 * 60 });

            if (firstView) {
                await redis.hincrby(VIEW_KEYS.pending, slug, 1);
            }

            return NextResponse.json({ success: true });
        }

        // Fallback (local dev, không có Upstash): ghi thẳng như cũ để tính năng
        // vẫn chạy được khi phát triển. Trên cụm luôn có Redis nên nhánh này
        // KHÔNG chạy ở production.
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { data: post, error: fetchError } = await supabaseAdmin
            .from('posts')
            .select('id, view_count')
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

        if (fetchError || !post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const { error } = await supabaseAdmin
            .from('posts')
            .update({ view_count: (post.view_count || 0) + 1 })
            .eq('id', post.id);

        if (error) throw error;

        return NextResponse.json({ success: true, view_count: (post.view_count || 0) + 1 });
    } catch (error) {
        console.error('Error incrementing view:', error);
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}
