import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

// GET /api/comments?post_id=xxx — Get all comments for a post
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('post_id');

        if (!postId) {
            return NextResponse.json({ error: 'post_id is required' }, { status: 400 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { data: comments, error } = await supabaseAdmin
            .from('comments')
            .select('*, user:profiles(id, full_name, avatar_url, email)')
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        return NextResponse.json({ comments: comments || [] });
    } catch (error: any) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/comments — Create a new comment
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.profileId) {
            return NextResponse.json({ error: 'Đăng nhập để bình luận' }, { status: 401 });
        }

        // Rate limit: 10 comments per minute per IP
        const ip = getClientIp(request);
        const limiter = rateLimit(`comment:${ip}`, { maxRequests: 10, windowSizeSeconds: 60 });
        if (!limiter.success) {
            return NextResponse.json(
                { error: 'Quá nhiều bình luận, vui lòng thử lại sau.' },
                { status: 429, headers: { 'Retry-After': String(limiter.resetIn) } }
            );
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { post_id, content, parent_id } = body;

        if (!post_id || !content?.trim()) {
            return NextResponse.json({ error: 'post_id and content are required' }, { status: 400 });
        }

        // Validate content length
        if (content.trim().length > 2000) {
            return NextResponse.json({ error: 'Bình luận tối đa 2000 ký tự' }, { status: 400 });
        }

        // If replying, verify parent comment exists and belongs to same post
        if (parent_id) {
            const { data: parentComment } = await supabaseAdmin
                .from('comments')
                .select('id, post_id')
                .eq('id', parent_id)
                .single();

            if (!parentComment || parentComment.post_id !== post_id) {
                return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
            }
        }

        const { data: comment, error } = await supabaseAdmin
            .from('comments')
            .insert({
                post_id,
                user_id: session.user.profileId,
                parent_id: parent_id || null,
                content: content.trim(),
            })
            .select('*, user:profiles(id, full_name, avatar_url, email)')
            .single();

        if (error) throw error;

        return NextResponse.json({ comment }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
