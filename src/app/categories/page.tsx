import { getCategories, getCategoryPostCounts } from '@/lib/data/categories';
import { CategoryCard } from '@/components/blog/CategoryCard';
import { TaxonomyHero } from '@/components/blog/TaxonomyHero';

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
        <article className="min-h-screen bg-page pb-16">
            <TaxonomyHero
                title="Tất cả Chủ đề"
                description="Khám phá các bài viết theo từng lĩnh vực chuyên môn từ Data, AI đến Supply Chain."
                breadcrumb={[
                    { label: 'Trang chủ', href: '/' },
                    { label: 'Chủ đề' },
                ]}
                stat={`${categories.length} chủ đề`}
            />

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
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
