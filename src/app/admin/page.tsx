'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Users, TrendingUp, Plus, Loader2, DollarSign, Calendar, AlertCircle } from 'lucide-react';

interface DashboardStats {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;

    totalUsers: number;
    totalSubscribers: number;
}

interface RecentPost {
    id: string;
    title: string;
    status: string;

    created_at: string;
    category: { name: string; icon: string | null } | null;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/dashboard`);
            const data = await res.json();
            if (data.stats) setStats(data.stats);
            if (data.recentPosts) setRecentPosts(data.recentPosts);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    };

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
        );
    }

    const statCards = [
        { label: 'Tổng bài viết', value: stats?.totalPosts || 0, icon: FileText, color: 'text-brand-600 bg-brand-50 dark:bg-brand-900/20' },
        { label: 'Người dùng', value: stats?.totalUsers || 0, icon: Users, color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20' },
        { label: 'Đăng ký NL', value: stats?.totalSubscribers || 0, icon: TrendingUp, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
    ];

    return (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-fg">Dashboard</h1>
                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        href="/admin/posts/new"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/25"
                    >
                        <Plus className="h-4 w-4" />
                        Viết bài mới
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-card rounded-2xl border border-line p-5 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-fg-subtle">{card.label}</span>
                            <div className={`p-2 rounded-xl ${card.color}`}>
                                <card.icon className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-fg">
                            {card.value.toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quick overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-card rounded-2xl border border-line p-5">
                    <h3 className="font-semibold text-fg mb-3">Trạng thái bài viết</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-fg-subtle">Đã xuất bản</span>
                            <span className="text-sm font-semibold text-emerald-600">{stats?.publishedPosts || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-fg-subtle">Nháp</span>
                            <span className="text-sm font-semibold text-amber-600">{stats?.draftPosts || 0}</span>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-card rounded-2xl border border-line p-5">
                    <h3 className="font-semibold text-fg mb-1">Liên kết nhanh</h3>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                        <Link href="/admin/posts" className="px-3 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">📝 Quản lý bài viết</Link>
                        <Link href="/admin/categories" className="px-3 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">📁 Quản lý chủ đề</Link>
                        <Link href="/admin/tags" className="px-3 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">🏷️ Quản lý tags</Link>
                        <Link href="/admin/media" className="px-3 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">🖼️ Thư viện ảnh</Link>
                    </div>
                </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-card rounded-2xl border border-line overflow-hidden">
                <div className="px-6 py-4 border-b border-line">
                    <h3 className="font-semibold text-fg">Bài viết gần đây</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-line bg-surface-50 dark:bg-surface-800/50">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-fg-subtle uppercase">Tiêu đề</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-fg-subtle uppercase">Trạng thái</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-fg-subtle uppercase">Ngày</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
                            {recentPosts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-fg-faint text-sm">
                                        Chưa có bài viết. <Link href="/admin/posts/new" className="text-brand-600 hover:underline">Viết bài đầu tiên →</Link>
                                    </td>
                                </tr>
                            ) : (
                                recentPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                                        <td className="px-6 py-3">
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="text-sm font-medium text-fg hover:text-brand-600 transition-colors"
                                            >
                                                {post.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${post.status === 'published'
                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                                                }`}>
                                                {post.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-sm text-fg-subtle">
                                            {formatDate(post.created_at)}
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
