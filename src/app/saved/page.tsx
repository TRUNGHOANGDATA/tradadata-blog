import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { PostCard } from '@/components/blog/PostCard';
import { Bookmark, Search } from 'lucide-react';
import Link from 'next/link';
import type { Post } from '@/types';

// Compute reading time (same logic as posts.ts)
function calculateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s/g).length;
    return Math.ceil(noOfWords / wordsPerMinute);
}

function formatPost(post: any): Post {
    let textForReadingTime = post.excerpt || '';
    if (post.content && typeof post.content === 'object') {
        textForReadingTime += JSON.stringify(post.content);
    }
    return {
        ...post,
        reading_time: calculateReadingTime(textForReadingTime) || 3,
    } as Post;
}

export const metadata = {
    title: 'Bài viết đã lưu',
    description: 'Danh sách các bài viết bạn đã lưu',
};

export default async function SavedPostsPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/login?callbackUrl=/saved');
    }

    // Fetch saved posts — use full select with joins like posts.ts
    let savedPosts: Post[] = [];
    if (supabaseAdmin) {
        // Resolve user profile ID from DB (JWT profileId may be stale)
        let userId: string | undefined = session.user.profileId;
        if (userId) {
            const { data: check } = await supabaseAdmin
                .from('profiles').select('id').eq('id', userId).single();
            if (!check) userId = undefined;
        }
        if (!userId) {
            const { data: profile } = await supabaseAdmin
                .from('profiles').select('id').eq('email', session.user.email).single();
            if (profile) userId = profile.id;
        }

        if (userId) {
            const { data: bookmarks, error } = await supabaseAdmin
                .from('user_bookmarks')
                .select('post_id')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching bookmarks:', error);
            } else if (bookmarks && bookmarks.length > 0) {
                // Fetch the actual posts with full data (author, category, etc.)
                const postIds = bookmarks.map(b => b.post_id);
                const { data: posts, error: postsError } = await supabaseAdmin
                    .from('posts')
                    .select('*, author:profiles(*), category:categories!category_id(*)')
                    .in('id', postIds)
                    .eq('status', 'published');

                if (postsError) {
                    console.error('Error fetching saved post details:', postsError);
                } else if (posts) {
                    // Preserve bookmark order (most recently saved first)
                    const postMap = new Map(posts.map(p => [p.id, p]));
                    savedPosts = postIds
                        .map(id => postMap.get(id))
                        .filter(Boolean)
                        .map(formatPost);
                }
            }
        }
    }

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-brand-100 dark:bg-brand-900/40 rounded-xl text-brand-600 dark:text-brand-400">
                            <Bookmark className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-bold text-fg">
                            Bài viết đã lưu
                        </h1>
                    </div>
                    <p className="text-fg-subtle text-lg max-w-2xl">
                        Danh sách các bài viết bạn đã đánh dấu để đọc lại sau này.
                    </p>
                </div>

                {/* Content */}
                {savedPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-card rounded-2xl border border-line shadow-sm">
                        <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bookmark className="h-8 w-8 text-fg-faint" />
                        </div>
                        <h3 className="text-xl font-bold text-fg mb-2">
                            Chưa có bài viết nào
                        </h3>
                        <p className="text-fg-subtle max-w-md mx-auto mb-8">
                            Bạn chưa lưu bài viết nào. Hãy lướt qua các bài viết trên blog và nhấn nút lưu để dễ dàng tìm lại sau này.
                        </p>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors shadow-sm"
                        >
                            <Search className="h-4 w-4" />
                            Khám phá bài viết
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
