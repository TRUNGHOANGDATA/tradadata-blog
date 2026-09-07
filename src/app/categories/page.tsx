import { getCategories, getCategoryPostCounts } from '@/lib/data/categories';
import { CategoryCard } from '@/components/blog/CategoryCard';

export const metadata = {
    title: 'Chủ đề',
    description: 'Khám phá bài viết theo từng chủ đề',
};

export const revalidate = 3600;

export default async function CategoriesPage() {
    const categories = await getCategories();

    // Dem bai theo danh muc: dung chung ham co cache voi trang chu
    const categoryCounts = await getCategoryPostCounts();

    return (
        <article className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-16">
            {/* Header */}
            <section className="bg-gradient-to-b from-brand-50 to-surface-50 dark:from-surface-900 dark:to-surface-950 py-12 md:py-20 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-fg mb-4">
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
