import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ isBookmarked: false });
        }

        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('postId');

        if (!postId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
        }

        // Resolve user profile ID — verify it exists in DB
        let userId: string | undefined = session.user.profileId;
        if (userId) {
            const { data: profileCheck } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .single();
            if (!profileCheck) userId = undefined;
        }
        if (!userId) {
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('email', session.user.email)
                .single();
            if (!profile) return NextResponse.json({ isBookmarked: false });
            userId = profile.id;
        }

        const { data, error } = await supabaseAdmin
            .from('user_bookmarks')
            .select('id')
            .eq('user_id', userId)
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
