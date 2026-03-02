import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { PostCard } from '@/components/blog/PostCard';
import { Tag } from 'lucide-react';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

type Props = {
    params: Promise<{ slug: string }>;
};

// Format post into the shape PostCard expects
function formatPost(raw: any) {
    return {
        id: raw.id,
        title: raw.title,
        slug: raw.slug,
        excerpt: raw.excerpt,
        content: raw.content,
        cover_image: raw.cover_image,
        published_at: raw.published_at,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
        reading_time: raw.reading_time || 1,
        view_count: raw.view_count || 0,
        status: raw.status,
        is_premium: raw.is_premium,
        category_id: raw.category_id,
        author_id: raw.author_id,
        author: raw.author,
        category: raw.category,
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    if (!supabaseAdmin) return { title: 'Tag' };

    const { data: tag } = await supabaseAdmin
        .from('tags')
        .select('name')
        .eq('slug', slug)
        .single();

    return {
        title: tag ? `${tag.name} — ${SITE_CONFIG.name}` : 'Tag',
        description: tag ? `Tất cả bài viết được gắn tag "${tag.name}"` : '',
    };
}

export default async function TagPage({ params }: Props) {
    const { slug } = await params;

    if (!supabaseAdmin) return notFound();

    // Get the tag
    const { data: tag, error } = await supabaseAdmin
        .from('tags')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !tag) return notFound();

    // Get posts for this tag
    const { data: postTagRows } = await supabaseAdmin
        .from('post_tags')
        .select('post_id')
        .eq('tag_id', tag.id);

    let posts: any[] = [];
    if (postTagRows && postTagRows.length > 0) {
        const postIds = postTagRows.map(r => r.post_id);
        const { data: postsData } = await supabaseAdmin
            .from('posts')
            .select('*, author:profiles(full_name, avatar_url), category:categories!category_id(name, slug, icon)')
            .in('id', postIds)
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (postsData) {
            posts = postsData.map(formatPost);
        }
    }

    return (
        <main className="min-h-screen bg-surface-50 dark:bg-surface-950 pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10">
                    <Link href="/blog" className="text-sm text-brand-600 hover:underline mb-4 inline-block">
                        ← Quay lại Blog
                    </Link>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400">
                            <Tag className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100">
                            {tag.name}
                        </h1>
                    </div>
                    <p className="text-surface-500 dark:text-surface-400">
                        {posts.length} bài viết được gắn tag này
                    </p>
                </div>

                {/* Posts Grid */}
                {posts.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-surface-400 text-lg">Chưa có bài viết nào với tag này.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
