'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Tag, X } from 'lucide-react';

interface TagItem {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export default function TagsPage() {
    const [tags, setTags] = useState<TagItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTag, setNewTag] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const res = await fetch('/api/admin/tags');
            const data = await res.json();
            if (data.tags) setTags(data.tags);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newTag.trim()) return;
        setAdding(true);
        try {
            const res = await fetch('/api/admin/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newTag.trim() }),
            });
            if (res.ok) {
                setNewTag('');
                fetchTags();
            } else {
                const data = await res.json();
                alert('Lỗi: ' + (data.error || 'Unknown'));
            }
        } catch {
            alert('Có lỗi xảy ra');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Xoá tag này?')) return;
        try {
            await fetch(`/api/admin/tags?id=${id}`, { method: 'DELETE' });
            setTags(prev => prev.filter(t => t.id !== id));
        } catch {
            alert('Có lỗi xảy ra');
        }
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
                <h1 className="text-2xl font-bold text-fg">Quản lý Tags</h1>
            </div>

            {/* Add tag */}
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="Nhập tên tag mới..."
                    className="flex-1 max-w-sm px-4 py-2.5 rounded-xl bg-card border border-surface-200 dark:border-surface-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
                <button
                    onClick={handleAdd}
                    disabled={adding || !newTag.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
                >
                    {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Thêm
                </button>
            </div>

            {/* Tags grid */}
            <div className="bg-card rounded-2xl border border-line p-5">
                {tags.length === 0 ? (
                    <div className="text-center py-12 text-fg-faint">
                        Chưa có tag nào. Hãy thêm tag đầu tiên!
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <div
                                key={tag.id}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 group hover:border-red-300 dark:hover:border-red-700 transition-colors"
                            >
                                <Tag className="h-3.5 w-3.5 text-brand-500" />
                                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{tag.name}</span>
                                <button
                                    onClick={() => handleDelete(tag.id)}
                                    className="p-0.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                                    title="Xoá"
                                >
                                    <X className="h-3.5 w-3.5 text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
