import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { revalidatePost } from '@/lib/cache';

type RouteParams = { params: Promise<{ id: string }> };

const MAX_PINNED = 5;

// PATCH /api/admin/posts/[id]/pin — Toggle pin/unpin
export async function PATCH(_request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        // Get current pin status
        const { data: post, error: fetchError } = await supabaseAdmin
            .from('posts')
            .select('id, is_pinned, slug')
            .eq('id', id)
            .single();

        if (fetchError || !post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const newPinned = !post.is_pinned;

        // If pinning, check max limit
        if (newPinned) {
            const { count } = await supabaseAdmin
                .from('posts')
                .select('id', { count: 'exact', head: true })
                .eq('is_pinned', true)
                .eq('status', 'published');

            if ((count || 0) >= MAX_PINNED) {
                return NextResponse.json(
                    { error: `Đã đạt giới hạn ${MAX_PINNED} bài ghim. Bỏ ghim bài khác trước.` },
                    { status: 400 }
                );
            }
        }

        // Toggle pin
        const { error: updateError } = await supabaseAdmin
            .from('posts')
            .update({
                is_pinned: newPinned,
                pinned_at: newPinned ? new Date().toISOString() : null,
            })
            .eq('id', id);

        if (updateError) throw updateError;

        // Get updated count
        const { count: pinnedCount } = await supabaseAdmin
            .from('posts')
            .select('id', { count: 'exact', head: true })
            .eq('is_pinned', true)
            .eq('status', 'published');

        // Slider bài ghim nằm ở trang chủ — phải xoá cache thì mới thấy đổi
        revalidatePost([post.slug], id);

        return NextResponse.json({
            is_pinned: newPinned,
            pinned_count: pinnedCount || 0,
        });
    } catch (error: any) {
        console.error('Error toggling pin:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
