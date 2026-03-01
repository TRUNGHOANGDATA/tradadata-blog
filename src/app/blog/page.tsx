import { getPosts } from '@/lib/data/posts';
import { getCategories } from '@/lib/data/categories';
import { BlogListClient } from './BlogListClient';
import { Newsletter } from '@/components/blog/Newsletter';
import { supabaseAdmin } from '@/lib/supabase/server';

export const metadata = {
    title: 'Bài viết | Trà Đá Data',
    description: 'Khám phá tất cả các bài viết về Data & AI',
};

export const revalidate = 3600;

export default async function BlogPage() {
    // Fetch all published posts and categories
    const [{ data: posts }, categories] = await Promise.all([
        getPosts({ limit: 1000 }),
        getCategories()
    ]);

    // Get posts_per_page setting from DB
    let postsPerPage = 12;
    try {
        const { data } = await supabaseAdmin
            .from('site_settings')
            .select('value')
            .eq('key', 'posts_per_page')
            .single();
        if (data?.value) postsPerPage = Number(data.value) || 12;
    } catch { /* use default */ }

    return (
        <>
            {/* Header */}
            <section className="bg-gradient-to-b from-brand-50 to-surface-50 dark:from-surface-900 dark:to-surface-950 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                        Bài viết
                    </h1>
                    <p className="text-surface-500 text-lg">
                        Khám phá kiến thức mới mỗi ngày
                    </p>
                </div>
            </section>

            <BlogListClient initialPosts={posts} categories={categories} postsPerPage={postsPerPage} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <Newsletter />
            </div>
        </>
    );
}
