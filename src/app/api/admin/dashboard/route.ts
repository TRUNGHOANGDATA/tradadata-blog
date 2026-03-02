import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

// GET /api/admin/dashboard — Dashboard stats
export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const fromDate = searchParams.get('from');
        const toDate = searchParams.get('to');

        // Fetch counts in parallel
        const [
            postsResult,
            usersResult,
            subscribersResult
        ] = await Promise.all([
            supabaseAdmin.from('posts').select('id, status, view_count'),
            supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
            supabaseAdmin.from('subscribers').select('id', { count: 'exact', head: true }).eq('is_active', true)
        ]);

        const posts = postsResult.data || [];
        const publishedPosts = posts.filter(p => p.status === 'published');
        const draftPosts = posts.filter(p => p.status === 'draft');
        const totalViews = posts.reduce((sum, p) => sum + (p.view_count || 0), 0);

        // Recent posts
        const { data: recentPosts } = await supabaseAdmin
            .from('posts')
            .select('id, title, status, view_count, created_at, category:categories!category_id(name, icon)')
            .order('created_at', { ascending: false })
            .limit(5);

        return NextResponse.json({
            stats: {
                totalPosts: posts.length,
                publishedPosts: publishedPosts.length,
                draftPosts: draftPosts.length,
                totalViews,
                totalUsers: usersResult.count || 0,
                totalSubscribers: subscribersResult.count || 0
            },
            recentPosts: recentPosts || [],
        });
    } catch (error: any) {
        console.error('Error fetching dashboard:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
