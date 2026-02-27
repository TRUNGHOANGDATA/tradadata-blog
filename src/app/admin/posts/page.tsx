'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, Send, Loader2 } from 'lucide-react';

interface AdminPost {
    id: string;
    title: string;
    slug: string;
    status: string;
    created_at: string;
    published_at: string | null;
    category: { name: string; icon: string | null } | null;
    author: { full_name: string } | null;
}

export default function PostsPage() {
    const [posts, setPosts] = useState<AdminPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sendingState, setSendingState] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchPosts();
    }, []);

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

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    };

    const filteredPosts = posts.filter(post => {
        const matchSearch = post.title.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || post.status === statusFilter;
        return matchSearch && matchStatus;
    });

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
                <Link
                    href="/admin/posts/new"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/25"
                >
                    <Plus className="h-4 w-4" />
                    Viết bài mới
                </Link>
            </div>

            {/* Filter */}
            <div className="flex gap-3 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
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

            {/* Table */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Tiêu đề</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Chủ đề</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Trạng thái</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Ngày</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
                            {filteredPosts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-surface-400">
                                        {posts.length === 0 ? 'Chưa có bài viết nào. Hãy viết bài đầu tiên!' : 'Không tìm thấy bài viết phù hợp.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="text-sm font-medium text-surface-900 dark:text-surface-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                                            >
                                                {post.title}
                                            </Link>
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
                                        <td className="px-6 py-4 text-sm text-surface-500">
                                            {formatDate(post.published_at || post.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {post.status === 'published' && (
                                                    <button
                                                        onClick={() => handleSendNewsletter(post.id)}
                                                        disabled={sendingState[post.id] === 'loading'}
                                                        className={`p-2 rounded-lg transition-colors ${sendingState[post.id] === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' :
                                                            'hover:bg-brand-50 text-surface-400 hover:text-brand-600 dark:hover:bg-brand-900/20'}`}
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
                                                        <Eye className="h-4 w-4 text-surface-400" />
                                                    </Link>
                                                )}
                                                <Link
                                                    href={`/admin/posts/${post.id}/edit`}
                                                    className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                                                    title="Sửa"
                                                >
                                                    <Edit className="h-4 w-4 text-surface-400" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    title="Xoá"
                                                >
                                                    <Trash2 className="h-4 w-4 text-surface-400 hover:text-red-600" />
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
        </>
    );
}
