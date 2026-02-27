import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.profileId) {
            return NextResponse.json({ isBookmarked: false }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('postId');

        if (!postId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database connection not string available' }, { status: 500 });
        }

        const { data, error } = await supabaseAdmin
            .from('user_bookmarks')
            .select('id')
            .eq('user_id', session.user.profileId)
            .eq('post_id', postId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Bookmark check error:', error);
            return NextResponse.json({ error: 'Failed to check bookmark' }, { status: 500 });
        }

        return NextResponse.json({ isBookmarked: !!data });
    } catch (error) {
        console.error('Bookmark checking error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
