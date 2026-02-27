'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { PostCard } from '@/components/blog/PostCard';
import type { Post, Category } from '@/types';

interface BlogListClientProps {
    initialPosts: Post[];
    categories: Category[];
    postsPerPage?: number;
}

export function BlogListClient({ initialPosts, categories, postsPerPage = 12 }: BlogListClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Reset page to 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    const filterCategories = [
        { name: 'Tất cả', slug: '' },
        ...categories.map(cat => ({
            name: cat.name,
            slug: cat.slug,
            icon: cat.icon
        }))
    ];

    const filteredPosts = useMemo(() => {
        return initialPosts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = selectedCategory === '' || post.category?.slug === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory, initialPosts]);

    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));
    const paginatedPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all text-sm"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <SlidersHorizontal className="h-4 w-4 text-surface-400 shrink-0" />
                    {filterCategories.map((cat) => (
                        <button
                            key={cat.slug}
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${selectedCategory === cat.slug
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
            {paginatedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white/50 dark:bg-surface-900/50 rounded-2xl border border-surface-200 dark:border-surface-800">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100 mb-1">Không tìm thấy kết quả</h3>
                    <p className="text-surface-500 text-sm">Vui lòng thử lại với từ khóa hoặc chủ đề khác.</p>
                    <button
                        onClick={() => { setSearchQuery(''); setSelectedCategory(''); }}
                        className="mt-4 px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${currentPage === page
                                ? 'bg-brand-600 text-white border-brand-600'
                                : 'bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
