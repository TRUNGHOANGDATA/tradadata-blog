'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, Send, Loader2, ChevronLeft, ChevronRight, Globe, CheckCircle2, XCircle } from 'lucide-react';

const POSTS_PER_PAGE = 15;

interface AdminPost {
    id: string;
    title: string;
    slug: string;
    status: string;
    created_at: string;
    published_at: string | null;
    indexed_at: string | null;
    category: { name: string; icon: string | null } | null;
    author: { full_name: string } | null;
}

export default function PostsPage() {
    const [posts, setPosts] = useState<AdminPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sendingState, setSendingState] = useState<Record<string, string>>({});
    const [indexingState, setIndexingState] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [bulkIndexing, setBulkIndexing] = useState(false);
    const [bulkResult, setBulkResult] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/admin/posts');
            const data = await res.json();
            if (data.posts) setPosts(data.posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xoá bài viết này?')) return;
        try {
            const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPosts(prev => prev.filter(p => p.id !== id));
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi xoá');
        }
    };

    const handleSendNewsletter = async (postId: string) => {
        if (!confirm('Gửi email thông báo bài viết này đến tất cả người đăng ký?')) return;
        setSendingState(prev => ({ ...prev, [postId]: 'loading' }));
        try {
            const res = await fetch('/api/newsletter/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId }),
            });
            const data = await res.json();
            if (res.ok) {
                setSendingState(prev => ({ ...prev, [postId]: 'success' }));
                alert('Đã gửi newsletter thành công!');
            } else {
                throw new Error(data.error || 'Error');
            }
        } catch (error: any) {
            setSendingState(prev => ({ ...prev, [postId]: 'error' }));
            alert('Lỗi: ' + error.message);
        } finally {
            setTimeout(() => setSendingState(prev => ({ ...prev, [postId]: 'idle' })), 3000);
        }
    };

    const handleIndexSingle = async (slug: string) => {
        setIndexingState(prev => ({ ...prev, [slug]: 'loading' }));
        try {
            const res = await fetch('/api/admin/index-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postSlugs: [slug] }),
            });
            const data = await res.json();
            if (res.ok && data.successCount > 0) {
                setIndexingState(prev => ({ ...prev, [slug]: 'success' }));
                // Update local state to mark as indexed
                setPosts(prev => prev.map(p =>
                    p.slug === slug ? { ...p, indexed_at: new Date().toISOString() } : p
                ));
            } else {
                setIndexingState(prev => ({ ...prev, [slug]: 'error' }));
                const errMsg = data.results?.[0]?.message || data.error || 'Lỗi không xác định';
                alert(`Lỗi index: ${errMsg}`);
            }
        } catch (error: any) {
            setIndexingState(prev => ({ ...prev, [slug]: 'error' }));
            alert(`Lỗi: ${error.message}`);
        } finally {
            setTimeout(() => setIndexingState(prev => ({ ...prev, [slug]: 'idle' })), 5000);
        }
    };

    const handleBulkIndex = async () => {
        // Only index published posts that haven't been indexed yet
        const postsToIndex = paginatedPosts.filter(p => p.status === 'published' && !p.indexed_at);
        if (postsToIndex.length === 0) {
            alert('Tất cả bài viết trên trang này đã được index rồi! 🎉');
            return;
        }
        if (!confirm(`Gửi yêu cầu index cho ${postsToIndex.length} bài viết chưa index trên trang này?`)) return;

        setBulkIndexing(true);
        setBulkResult(null);
        try {
            const res = await fetch('/api/admin/index-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postSlugs: postsToIndex.map(p => p.slug),
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setBulkResult({ message: data.message, type: 'success' });
                // Update local state
                const now = new Date().toISOString();
                setPosts(prev => prev.map(p =>
                    postsToIndex.some(pi => pi.slug === p.slug) ? { ...p, indexed_at: now } : p
                ));
            } else {
                setBulkResult({ message: data.error || 'Có lỗi xảy ra', type: 'error' });
            }
        } catch (error: any) {
            setBulkResult({ message: error.message, type: 'error' });
        } finally {
            setBulkIndexing(false);
            setTimeout(() => setBulkResult(null), 8000);
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    };

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchSearch = post.title.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === 'all' || post.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [posts, search, statusFilter]);

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );
    const indexedCount = posts.filter(p => p.indexed_at).length;
    const publishedCount = posts.filter(p => p.status === 'published').length;

    const getPageNumbers = (): (number | '...')[] => {
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Quản lý bài viết</h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleBulkIndex}
                        disabled={bulkIndexing}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Gửi yêu cầu index tất cả bài viết chưa index trên trang hiện tại"
                    >
                        {bulkIndexing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Globe className="h-4 w-4" />
                        )}
                        {bulkIndexing ? 'Đang gửi...' : 'Index trang này'}
                    </button>
                    <Link
                        href="/admin/posts/new"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/25"
                    >
                        <Plus className="h-4 w-4" />
                        Viết bài mới
                    </Link>
                </div>
            </div>

            {/* Bulk index result */}
            {bulkResult && (
                <div className={`flex items-center gap-2 mb-4 px-4 py-3 rounded-xl text-sm font-medium ${bulkResult.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                    {bulkResult.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    {bulkResult.message}
                </div>
            )}

            {/* Filter */}
            <div className="flex gap-3 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-faint" />
                    <input
                        type="text"
                        placeholder="Tìm bài viết..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-sm"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm"
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="published">Đã xuất bản</option>
                    <option value="draft">Nháp</option>
                </select>
            </div>

            {/* Info bar */}
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-fg-subtle">
                    Hiển thị <span className="font-semibold text-surface-700 dark:text-surface-300">{paginatedPosts.length}</span> / <span className="font-semibold text-surface-700 dark:text-surface-300">{filteredPosts.length}</span> bài viết
                    {totalPages > 1 && <span className="ml-1">(Trang {currentPage}/{totalPages})</span>}
                </p>
                <p className="text-sm text-fg-subtle">
                    <Globe className="h-3.5 w-3.5 inline-block mr-1 text-blue-500" />
                    Đã index: <span className="font-semibold text-blue-600 dark:text-blue-400">{indexedCount}</span>/<span className="font-semibold">{publishedCount}</span> bài xuất bản
                </p>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-fg-subtle uppercase">Tiêu đề</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-fg-subtle uppercase">Chủ đề</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-fg-subtle uppercase">Trạng thái</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-fg-subtle uppercase">Ngày</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-fg-subtle uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
                            {paginatedPosts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-fg-faint">
                                        {posts.length === 0 ? 'Chưa có bài viết nào. Hãy viết bài đầu tiên!' : 'Không tìm thấy bài viết phù hợp.'}
                                    </td>
                                </tr>
                            ) : (
                                paginatedPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/posts/${post.id}/edit`}
                                                    className="text-sm font-medium text-surface-900 dark:text-surface-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                                                >
                                                    {post.title}
                                                </Link>
                                                {/* Indexed badge */}
                                                {post.indexed_at && (
                                                    <span
                                                        className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50"
                                                        title={`Đã index lúc: ${formatDate(post.indexed_at)}`}
                                                    >
                                                        <Globe className="h-2.5 w-2.5" />
                                                        Indexed
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-400">
                                            {post.category ? `${post.category.icon || ''} ${post.category.name}` : '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${post.status === 'published'
                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                                                }`}>
                                                {post.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-fg-subtle">
                                            {formatDate(post.published_at || post.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {/* Google Index button */}
                                                {post.status === 'published' && (
                                                    <button
                                                        onClick={() => handleIndexSingle(post.slug)}
                                                        disabled={indexingState[post.slug] === 'loading'}
                                                        className={`p-2 rounded-lg transition-colors ${post.indexed_at
                                                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                                                : indexingState[post.slug] === 'loading'
                                                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                                                                    : indexingState[post.slug] === 'error'
                                                                        ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                                                        : 'hover:bg-blue-50 text-fg-faint hover:text-blue-600 dark:hover:bg-blue-900/20'
                                                            }`}
                                                        title={post.indexed_at
                                                            ? `Đã index lúc ${formatDate(post.indexed_at)} — Bấm để index lại`
                                                            : 'Yêu cầu Google index bài viết này'
                                                        }
                                                    >
                                                        {indexingState[post.slug] === 'loading' ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : post.indexed_at ? (
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        ) : (
                                                            <Globe className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                )}
                                                {/* Newsletter button */}
                                                {post.status === 'published' && (
                                                    <button
                                                        onClick={() => handleSendNewsletter(post.id)}
                                                        disabled={sendingState[post.id] === 'loading'}
                                                        className={`p-2 rounded-lg transition-colors ${sendingState[post.id] === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' :
                                                            'hover:bg-brand-50 text-fg-faint hover:text-brand-600 dark:hover:bg-brand-900/20'}`}
                                                        title="Gửi Newsletter"
                                                    >
                                                        <Send className={`h-4 w-4 ${sendingState[post.id] === 'loading' ? 'animate-pulse' : ''}`} />
                                                    </button>
                                                )}
                                                {post.status === 'published' && (
                                                    <Link
                                                        href={`/blog/${post.slug}`}
                                                        target="_blank"
                                                        className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                                                        title="Xem"
                                                    >
                                                        <Eye className="h-4 w-4 text-fg-faint" />
                                                    </Link>
                                                )}
                                                <Link
                                                    href={`/admin/posts/${post.id}/edit`}
                                                    className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                                                    title="Sửa"
                                                >
                                                    <Edit className="h-4 w-4 text-fg-faint" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    title="Xoá"
                                                >
                                                    <Trash2 className="h-4 w-4 text-fg-faint hover:text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-xl text-sm font-medium border bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Trước
                    </button>

                    {getPageNumbers().map((page, i) =>
                        page === '...' ? (
                            <span key={`ellipsis-${i}`} className="px-2 py-2 text-fg-faint text-sm">…</span>
                        ) : (
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
                        )
                    )}

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-xl text-sm font-medium border bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1"
                    >
                        Tiếp
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </>
    );
}
