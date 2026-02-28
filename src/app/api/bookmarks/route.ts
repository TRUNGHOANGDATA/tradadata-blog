import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { postId } = await request.json();

        if (!postId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
        }

        // Resolve user profile ID — verify it exists in DB (JWT token may be stale)
        let userId: string | undefined = session.user.profileId;
        if (userId) {
            const { data: profileCheck } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .single();
            if (!profileCheck) userId = undefined; // stale profileId, fall back to email lookup
        }

        if (!userId) {
            // Fall back: look up by email
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('email', session.user.email)
                .single();
            if (!profile) {
                return NextResponse.json({ error: 'Không tìm thấy hồ sơ người dùng. Vui lòng đăng xuất rồi đăng nhập lại.' }, { status: 400 });
            }
            userId = profile.id;
        }

        // Check if bookmark exists
        const { data: existing, error: checkError } = await supabaseAdmin
            .from('user_bookmarks')
            .select('id')
            .eq('user_id', userId)
            .eq('post_id', postId)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Bookmark toggle check error:', checkError);
            return NextResponse.json({ error: 'Failed to verify bookmark status' }, { status: 500 });
        }

        if (existing) {
            // Remove bookmark
            const { error: deleteError } = await supabaseAdmin
                .from('user_bookmarks')
                .delete()
                .eq('id', existing.id);

            if (deleteError) {
                console.error('Bookmark delete error:', deleteError);
                return NextResponse.json({ error: 'Failed to remove bookmark' }, { status: 500 });
            }

            return NextResponse.json({ isBookmarked: false });
        } else {
            // Add bookmark
            const { error: insertError } = await supabaseAdmin
                .from('user_bookmarks')
                .insert({ user_id: userId, post_id: postId });

            if (insertError) {
                console.error('Bookmark insert error:', insertError);
                return NextResponse.json({ error: 'Failed to add bookmark' }, { status: 500 });
            }

            return NextResponse.json({ isBookmarked: true });
        }
    } catch (error) {
        console.error('Bookmark toggle error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
