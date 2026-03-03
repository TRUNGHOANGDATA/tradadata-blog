import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { PostCard } from '@/components/blog/PostCard';
import { getCategoryBySlug, getCategories } from '@/lib/data/categories';
import { getPosts } from '@/lib/data/posts';
import { SITE_CONFIG } from '@/lib/constants';

// Enable ISR if needed, or dynamic rendering
export const revalidate = 3600; // revalidate every hour

const POSTS_PER_PAGE = 9;

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Pre-build all category pages at build time
export async function generateStaticParams() {
    const categories = await getCategories();
    return categories.map((cat: { slug: string }) => ({ slug: cat.slug }));
}

// Dynamic SEO Metadata for Category pages
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        return { title: 'Không tìm thấy danh mục' };
    }

    const description = category.description || `Tuyển tập bài viết về ${category.name} — kiến thức thực tế giúp nâng cao kỹ năng Data & AI.`;

    return {
        title: `${category.name} — Bài viết về ${category.name}`,
        description,
        openGraph: {
            title: `${category.name} | ${SITE_CONFIG.name}`,
            description,
            url: `${SITE_CONFIG.url}/category/${category.slug}`,
            siteName: SITE_CONFIG.name,
            locale: 'vi_VN',
            type: 'website',
        },
        twitter: {
            card: 'summary',
            title: `${category.name} | ${SITE_CONFIG.name}`,
            description,
        },
        alternates: {
            canonical: `${SITE_CONFIG.url}/category/${category.slug}`,
        },
    };
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

export default async function CategoryPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const currentPage = Math.max(1, parseInt(resolvedSearchParams.page as string) || 1);

    const category = await getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    // Fetch posts for this category with pagination
    const { data: categoryPosts, count: totalPosts } = await getPosts({
        categoryId: category.id,
        limit: POSTS_PER_PAGE,
        page: currentPage,
    });

    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

    const buildUrl = (page: number) => {
        if (page === 1) return `/category/${slug}`;
        return `/category/${slug}?page=${page}`;
    };

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-16">
            {/* Header */}
            <section className="bg-gradient-to-b from-brand-50 to-surface-50 dark:from-surface-900 dark:to-surface-950 py-12 md:py-20 mt-16 text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 text-3xl mb-6 shadow-sm border border-brand-200 dark:border-brand-800">
                        {category.icon}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-4">
                        {category.name}
                    </h1>
                    <p className="text-surface-500 text-lg md:text-xl max-w-2xl mx-auto">
                        {category.description || `Tuyển tập các bài viết chia sẻ về ${category.name} giúp nâng cao kỹ năng Data & AI của bạn.`}
                    </p>
                </div>
            </section>

            {/* List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <p className="text-surface-600 dark:text-surface-400 font-medium">
                        Có <span className="font-bold text-brand-600 dark:text-brand-400">{totalPosts}</span> bài viết trong danh mục này.
                        {totalPages > 1 && (
                            <span className="text-surface-400 text-sm ml-2">
                                (Trang {currentPage}/{totalPages})
                            </span>
                        )}
                    </p>
                    <Link
                        href="/categories"
                        className="inline-flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Danh mục khác
                    </Link>
                </div>

                {categoryPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white/50 dark:bg-surface-900/50 rounded-2xl border border-surface-200 dark:border-surface-800">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-400 mb-4">
                            <Filter className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">Chưa có bài viết</h3>
                        <p className="text-surface-500 text-sm max-w-sm mx-auto">Chúng tôi đang cập nhật các bài viết mới cho chủ đề này. Vui lòng quay lại sau nhé!</p>
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
                                className="px-4 py-2 rounded-xl text-sm font-medium border bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors inline-flex items-center gap-1"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Trước
                            </Link>
                        )}

                        {/* Page numbers */}
                        {getPageNumbers(currentPage, totalPages).map((page, i) =>
                            page === '...' ? (
                                <span key={`ellipsis-${i}`} className="px-2 py-2 text-surface-400 text-sm">…</span>
                            ) : (
                                <Link
                                    key={page}
                                    href={buildUrl(page)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${currentPage === page
                                        ? 'bg-brand-600 text-white border-brand-600'
                                        : 'bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800'
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
                                className="px-4 py-2 rounded-xl text-sm font-medium border bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors inline-flex items-center gap-1"
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
