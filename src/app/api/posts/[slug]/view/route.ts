import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

type RouteParams = { params: Promise<{ slug: string }> };

// POST /api/posts/[slug]/view — Increment view count
export async function POST(_request: Request, { params }: RouteParams) {
    try {
        const { slug } = await params;

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        // Get current view count
        const { data: post, error: fetchError } = await supabaseAdmin
            .from('posts')
            .select('id, view_count')
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

        if (fetchError || !post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Increment view count
        const { error } = await supabaseAdmin
            .from('posts')
            .update({ view_count: (post.view_count || 0) + 1 })
            .eq('id', post.id);

        if (error) throw error;

        return NextResponse.json({ success: true, view_count: (post.view_count || 0) + 1 });
    } catch (error: any) {
        console.error('Error incrementing view:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
