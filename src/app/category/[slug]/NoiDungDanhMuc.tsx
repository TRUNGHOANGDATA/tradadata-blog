import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { PostCard } from '@/components/blog/PostCard';
import { TaxonomyHero } from '@/components/blog/TaxonomyHero';
import { getCategoryBySlug, getCategories, getCategoryPostCounts } from '@/lib/data/categories';
import { getPosts } from '@/lib/data/posts';

export const POSTS_PER_PAGE = 9;

/** Số trang của một danh mục — dùng cho `generateStaticParams`. */
export async function demSoTrangDanhMuc(categoryId: string): Promise<number> {
    const { count } = await getPosts({ categoryId, limit: POSTS_PER_PAGE, page: 1 });
    return Math.max(1, Math.ceil(count / POSTS_PER_PAGE));
}

function getPageNumbers(currentPage: number, totalPages: number): (number | '...')[] {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push('...');
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push('...');
        pages.push(totalPages);
    }
    return pages;
}

export async function NoiDungDanhMuc({ slug, trang }: { slug: string; trang: number }) {
    const currentPage = trang;

    const category = await getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    // Bai trong danh muc (co phan trang) + du lieu cho hang chip dieu huong.
    // getCategories / getCategoryPostCounts deu co unstable_cache nen khong pha cache route.
    const [{ data: categoryPosts, count: totalPosts }, allCategories, categoryCounts] = await Promise.all([
        getPosts({ categoryId: category.id, limit: POSTS_PER_PAGE, page: currentPage }),
        getCategories(),
        getCategoryPostCounts(),
    ]);

    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

    // Route segment thay vi query string: `?page=` lam Next ep render dong moi
    // request nen trang khong bao gio duoc cache. URL cu van song nho redirect
    // khai trong next.config.ts.
    const buildUrl = (page: number) =>
        page === 1 ? `/category/${slug}` : `/category/${slug}/trang/${page}`;

    const statLabel = totalPages > 1
        ? `${totalPosts} bài viết · Trang ${currentPage}/${totalPages}`
        : `${totalPosts} bài viết`;

    return (
        <div className="min-h-screen bg-page pb-16">
            <TaxonomyHero
                icon={category.icon}
                title={category.name}
                description={category.description || `Tuyển tập các bài viết chia sẻ về ${category.name} giúp nâng cao kỹ năng Data & AI của bạn.`}
                accentColor={category.color}
                breadcrumb={[
                    { label: 'Trang chủ', href: '/' },
                    { label: 'Chủ đề', href: '/categories' },
                    { label: category.name },
                ]}
                categories={allCategories}
                categoryCounts={categoryCounts}
                activeSlug={category.slug}
                stat={statLabel}
            />

            {/* List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
                {categoryPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white/50 dark:bg-surface-900/50 rounded-2xl border border-line">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 text-fg-faint mb-4">
                            <Filter className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-medium text-fg mb-2">Chưa có bài viết</h3>
                        <p className="text-fg-subtle text-sm max-w-sm mx-auto">Chúng tôi đang cập nhật các bài viết mới cho chủ đề này. Vui lòng quay lại sau nhé!</p>
                        <Link
                            href="/categories"
                            className="mt-6 inline-block px-6 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-colors"
                        >
                            Khám phá chủ đề khác
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        {/* Previous */}
                        {currentPage > 1 && (
                            <Link
                                href={buildUrl(currentPage - 1)}
                                className="px-4 py-2 rounded-xl text-sm font-medium border bg-card text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors inline-flex items-center gap-1"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Trước
                            </Link>
                        )}

                        {/* Page numbers */}
                        {getPageNumbers(currentPage, totalPages).map((page, i) =>
                            page === '...' ? (
                                <span key={`ellipsis-${i}`} className="px-2 py-2 text-fg-faint text-sm">…</span>
                            ) : (
                                <Link
                                    key={page}
                                    href={buildUrl(page)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${currentPage === page
                                        ? 'bg-brand-600 text-white border-brand-600'
                                        : 'bg-card text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800'
                                        }`}
                                >
                                    {page}
                                </Link>
                            )
                        )}

                        {/* Next */}
                        {currentPage < totalPages && (
                            <Link
                                href={buildUrl(currentPage + 1)}
                                className="px-4 py-2 rounded-xl text-sm font-medium border bg-card text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors inline-flex items-center gap-1"
                            >
                                Tiếp
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
