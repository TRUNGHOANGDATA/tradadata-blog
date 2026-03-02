import { getPosts, getPinnedPosts } from '@/lib/data/posts';
import { getCategories, getCategoryBySlug } from '@/lib/data/categories';
import { BlogListClient } from './BlogListClient';
import { Newsletter } from '@/components/blog/Newsletter';
import { PinnedSlider } from '@/components/blog/PinnedSlider';
import { supabaseAdmin } from '@/lib/supabase/server';

export const metadata = {
    title: 'Bài viết | Trà Đá Data',
    description: 'Khám phá tất cả các bài viết về Data & AI',
};

export const revalidate = 3600;

type Props = {
    searchParams: Promise<{ page?: string; category?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
    const params = await searchParams;
    const currentPage = Math.max(1, parseInt(params.page || '1', 10) || 1);

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

    // Resolve category slug to ID (if filtering by category)
    let categoryId: string | undefined;
    if (params.category) {
        const cat = await getCategoryBySlug(params.category);
        if (cat) categoryId = cat.id;
    }

    // Fetch pinned posts, page of posts, and categories in parallel
    const [pinnedPosts, { data: posts, count }, categories] = await Promise.all([
        getPinnedPosts(5),
        getPosts({ page: currentPage, limit: postsPerPage, categoryId }),
        getCategories()
    ]);

    // Exclude pinned posts from the main grid (page 1 only, no category filter)
    const pinnedIds = new Set(pinnedPosts.map(p => p.id));
    const filteredPosts = (!categoryId && currentPage === 1)
        ? posts.filter(p => !pinnedIds.has(p.id))
        : posts;

    const totalPages = Math.max(1, Math.ceil(count / postsPerPage));

    return (
        <>
            {/* Pinned Posts Slider — only on page 1 with no category filter */}
            {pinnedPosts.length > 0 && currentPage === 1 && !categoryId && (
                <PinnedSlider posts={pinnedPosts} />
            )}

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

            <BlogListClient
                initialPosts={filteredPosts}
                categories={categories}
                currentPage={currentPage}
                totalPages={totalPages}
                currentCategory={params.category || ''}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <Newsletter />
            </div>
        </>
    );
}
