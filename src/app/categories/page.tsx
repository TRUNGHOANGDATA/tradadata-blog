import { getCategories } from '@/lib/data/categories';
import { CategoryCard } from '@/components/blog/CategoryCard';
import { supabaseAdmin } from '@/lib/supabase/server';

export const metadata = {
    title: 'Chủ đề | Trà Đá Data',
    description: 'Khám phá bài viết theo từng chủ đề',
};

export const revalidate = 3600;

export default async function CategoriesPage() {
    const categories = await getCategories();

    // Count published posts per category via junction table
    const { data: publishedPosts } = await supabaseAdmin!
        .from('posts')
        .select('id')
        .eq('status', 'published');
    const publishedIds = new Set((publishedPosts || []).map((p: any) => p.id));

    const { data: pcData } = await supabaseAdmin!
        .from('post_categories')
        .select('category_id, post_id');
    const categoryCounts: Record<string, number> = {};
    (pcData || []).forEach((pc: any) => {
        if (pc.category_id && publishedIds.has(pc.post_id)) {
            categoryCounts[pc.category_id] = (categoryCounts[pc.category_id] || 0) + 1;
        }
    });

    return (
        <article className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-16">
            {/* Header */}
            <section className="bg-gradient-to-b from-brand-50 to-surface-50 dark:from-surface-900 dark:to-surface-950 py-12 md:py-20 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-4">
                        Tất cả Chủ đề
                    </h1>
                    <p className="text-fg-subtle text-lg md:text-xl max-w-2xl mx-auto">
                        Khám phá các bài viết theo từng lĩnh vực chuyên môn từ Data, AI đến Supply Chain.
                    </p>
                </div>
            </section>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => {
                        const postCount = categoryCounts[category.id] || 0;
                        return <CategoryCard key={category.id} category={category} postCount={postCount} />;
                    })}
                </div>
            </div>
        </article>
    );
}
