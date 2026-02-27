import { getCategories } from '@/lib/data/categories';
import { getPosts } from '@/lib/data/posts';
import { CategoryCard } from '@/components/blog/CategoryCard';

export const metadata = {
    title: 'Chủ đề | ERX Blog',
    description: 'Khám phá bài viết theo từng chủ đề',
};

export default async function CategoriesPage() {
    // Fetch all categories and posts
    const [categories, { data: posts }] = await Promise.all([
        getCategories(),
        getPosts({ limit: 1000 })
    ]);

    return (
        <article className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-16">
            {/* Header */}
            <section className="bg-gradient-to-b from-brand-50 to-surface-50 dark:from-surface-900 dark:to-surface-950 py-12 md:py-20 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-4">
                        Tất cả Chủ đề
                    </h1>
                    <p className="text-surface-500 text-lg md:text-xl max-w-2xl mx-auto">
                        Khám phá các bài viết theo từng lĩnh vực chuyên môn từ Data, AI đến Supply Chain.
                    </p>
                </div>
            </section>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => {
                        const postCount = posts.filter(p => p.category_id === category.id).length;
                        return <CategoryCard key={category.id} category={category} postCount={postCount} />;
                    })}
                </div>
            </div>
        </article>
    );
}
