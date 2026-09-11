import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { redis, isRedisConfigured, VIEW_KEYS } from '@/lib/redis';

// GET /api/cron/flush-views — Gộp lượt xem đang đệm trong Redis rồi ghi Postgres.
// Chạy bằng CronJob k8s mỗi vài phút (xem k8s/cronjobs.yaml).
//
// Nhờ đó số lần UPDATE `posts` giảm từ "mỗi lượt đọc" xuống "mỗi bài mỗi chu kỳ
// cron" — cắt gần hết Disk IO do đếm view (mỗi commit là một fsync WAL).
//
// KHÔNG cần hàm RPC / thay đổi schema: cộng dồn bằng read-modify-write qua
// service role key. An toàn không cần khoá vì cron này là NGƯỜI GHI DUY NHẤT vào
// `view_count` (route /view chỉ ghi Redis) và CronJob khai `concurrencyPolicy:
// Forbid` nên mỗi lúc chỉ một lần flush chạy — không có ai ghi tranh.
//
// Cache KHÔNG bị xoá ở đây (cố ý): view_count không cần chính xác tức thì, để
// `getPostBySlug` tự làm mới theo revalidate của nó — đúng lý do CLAUDE.md dặn
// không revalidate trong route đếm view.
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
        const deltas = Object.entries(pending || {})
            .map(([slug, count]) => ({ slug, delta: Number(count) || 0 }))
            .filter(u => u.delta > 0);

        if (deltas.length === 0) {
            return NextResponse.json({ success: true, message: 'Không có lượt xem nào để gộp' });
        }

        // Đọc view_count hiện tại của đúng các bài có lượt xem — MỘT truy vấn.
        const slugs = deltas.map(d => d.slug);
        const { data: rows, error: selErr } = await supabaseAdmin
            .from('posts')
            .select('id, slug, view_count')
            .in('slug', slugs);

        if (selErr) {
            console.error('[flush-views] đọc view_count lỗi:', selErr);
            return NextResponse.json({ error: 'Không đọc được view_count' }, { status: 500 });
        }

        const bySlug = new Map((rows || []).map(r => [r.slug, r]));

        // toClear = phần sẽ trừ khỏi Redis (đã ghi xong HOẶC slug không còn bài).
        // UPDATE lỗi thì GIỮ lại trong Redis để chu kỳ sau thử lại — không mất đếm.
        const toClear: { slug: string; delta: number }[] = [];

        for (const { slug, delta } of deltas) {
            const row = bySlug.get(slug);
            if (!row) {
                // Bài đã xoá / đổi slug — dọn khỏi Redis cho hash khỏi kẹt rác.
                toClear.push({ slug, delta });
                continue;
            }
            const { error: updErr } = await supabaseAdmin
                .from('posts')
                .update({ view_count: (row.view_count || 0) + delta })
                .eq('id', row.id);
            if (updErr) {
                console.error(`[flush-views] cập nhật ${slug} lỗi:`, updErr);
                continue; // giữ lại trong Redis, thử lại chu kỳ sau
            }
            toClear.push({ slug, delta });
        }

        // Trừ đúng phần đã xử lý khỏi hash. Field về 0 thì xoá để hash không phình.
        for (const { slug, delta } of toClear) {
            const remaining = await redis.hincrby(VIEW_KEYS.pending, slug, -delta);
            if (remaining <= 0) {
                await redis.hdel(VIEW_KEYS.pending, slug);
            }
        }

        const totalViews = toClear.reduce((s, u) => s + u.delta, 0);
        return NextResponse.json({
            success: true,
            message: `Đã gộp ${totalViews} lượt xem vào ${toClear.length} bài`,
        });
    } catch (error) {
        console.error('[flush-views] lỗi:', error);
        return NextResponse.json({ error: 'Đã có lỗi xảy ra' }, { status: 500 });
    }
}
