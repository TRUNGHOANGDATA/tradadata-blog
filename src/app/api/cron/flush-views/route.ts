import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { redis, isRedisConfigured, VIEW_KEYS } from '@/lib/redis';

// GET /api/cron/flush-views — Gộp lượt xem đang đệm trong Redis rồi ghi Postgres
// MỘT lần cho mỗi bài. Chạy bằng CronJob k8s mỗi vài phút (xem k8s/cronjobs.yaml).
//
// Nhờ đó số lần UPDATE hàng `posts` (hàng nặng vì chứa cột `content`) giảm từ
// "mỗi lượt xem" xuống "mỗi bài mỗi chu kỳ cron" — cắt gần hết Disk IO do đếm view.
//
// Cache KHÔNG bị xoá ở đây (cố ý): view_count không cần chính xác tức thì, để
// `getPostBySlug` tự làm mới theo revalidate của nó. Xoá cache mỗi lần flush là
// phản tác dụng — đúng lý do CLAUDE.md dặn không revalidate trong route đếm view.
export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!isRedisConfigured || !redis) {
            return NextResponse.json({ success: true, message: 'Redis chưa cấu hình — không có gì để gộp' });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 });
        }

        // Chụp toàn bộ số đang đệm. Lượt xem tới TRONG lúc flush vẫn cộng tiếp vào
        // hash này; cuối hàm ta chỉ trừ đi đúng phần đã chụp nên không mất đếm.
        const pending = await redis.hgetall<Record<string, number>>(VIEW_KEYS.pending);

        const updates = Object.entries(pending || {})
            .map(([slug, count]) => ({ slug, delta: Number(count) || 0 }))
            .filter(u => u.delta > 0);

        if (updates.length === 0) {
            return NextResponse.json({ success: true, message: 'Không có lượt xem nào để gộp' });
        }

        // Ghi Postgres MỘT round-trip, cộng dồn nguyên tử, qua hàm RPC
        // `increment_view_counts` (xem supabase/manual/disk-io-optimizations.sql).
        const { error } = await supabaseAdmin.rpc('increment_view_counts', { updates });

        if (error) {
            // Ghi hỏng thì KHÔNG trừ Redis — để chu kỳ sau gộp lại, không mất đếm.
            console.error('[flush-views] RPC lỗi:', error);
            return NextResponse.json({ error: 'Không ghi được view vào DB' }, { status: 500 });
        }

        // Đã ghi xong: trừ đúng phần vừa chụp khỏi hash. Field nào về 0 thì xoá
        // để hash không phình. Lượt xem mới tới trong lúc flush còn lại dạng số dương.
        for (const { slug, delta } of updates) {
            const remaining = await redis.hincrby(VIEW_KEYS.pending, slug, -delta);
            if (remaining <= 0) {
                await redis.hdel(VIEW_KEYS.pending, slug);
            }
        }

        const totalViews = updates.reduce((s, u) => s + u.delta, 0);
        return NextResponse.json({
            success: true,
            message: `Đã gộp ${totalViews} lượt xem vào ${updates.length} bài`,
        });
    } catch (error) {
        console.error('[flush-views] lỗi:', error);
        return NextResponse.json({ error: 'Đã có lỗi xảy ra' }, { status: 500 });
    }
}
