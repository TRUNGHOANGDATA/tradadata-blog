'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PostCard } from '@/components/blog/PostCard';
import type { Post, Category } from '@/types';

interface BlogListClientProps {
    initialPosts: Post[];
    categories: Category[];
    currentPage: number;
    totalPages: number;
    currentCategory: string;
}

export function BlogListClient({
    initialPosts,
    categories,
    currentPage,
    totalPages,
    currentCategory,
}: BlogListClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const filterCategories = [
        { name: 'Tất cả', slug: '' },
        ...categories.map(cat => ({
            name: cat.name,
            slug: cat.slug,
            icon: cat.icon
        }))
    ];

    // Client-side search filter (instant UX on current page)
    const filteredPosts = useMemo(() => {
        if (!searchQuery) return initialPosts;
        return initialPosts.filter(post => {
            return post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
        });
    }, [searchQuery, initialPosts]);

    // Build URL with params
    const buildUrl = (page: number, category?: string) => {
        const params = new URLSearchParams();
        if (page > 1) params.set('page', String(page));
        const cat = category !== undefined ? category : currentCategory;
        if (cat) params.set('category', cat);
        const qs = params.toString();
        return qs ? `/blog?${qs}` : '/blog';
    };

    const handleCategoryChange = (slug: string) => {
        // Reset to page 1 when changing category
        router.push(buildUrl(1, slug));
    };

    // Generate page numbers with ellipsis for large page counts
    const getPageNumbers = () => {
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
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-faint" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-surface-200 dark:border-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all text-sm"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <SlidersHorizontal className="h-4 w-4 text-fg-faint shrink-0" />
                    {filterCategories.map((cat) => (
                        <button
                            key={cat.slug}
                            onClick={() => handleCategoryChange(cat.slug)}
                            className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${currentCategory === cat.slug
                                ? 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-900/30 dark:text-brand-300 dark:border-brand-800'
                                : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 border-surface-200 dark:border-surface-700'
                                }`}
                        >
                            {'icon' in cat && cat.icon && <span className="mr-1">{cat.icon}</span>}
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Posts Grid */}
            {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white/50 dark:bg-surface-900/50 rounded-2xl border border-line">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-fg mb-1">Không tìm thấy kết quả</h3>
                    <p className="text-fg-subtle text-sm">Vui lòng thử lại với từ khóa hoặc chủ đề khác.</p>
                    <button
                        onClick={() => { setSearchQuery(''); handleCategoryChange(''); }}
                        className="mt-4 px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            )}

            {/* Server-side Pagination */}
            {totalPages > 1 && !searchQuery && (
                <div className="flex items-center justify-center gap-2 mt-12">
                    {/* Previous */}
                    {currentPage > 1 && (
                        <Link
                            href={buildUrl(currentPage - 1)}
                            className="px-4 py-2 rounded-xl text-sm font-medium border bg-card text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                        >
                            ← Trước
                        </Link>
                    )}

                    {/* Page numbers */}
                    {getPageNumbers().map((page, i) =>
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
                            className="px-4 py-2 rounded-xl text-sm font-medium border bg-card text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                        >
                            Tiếp →
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
