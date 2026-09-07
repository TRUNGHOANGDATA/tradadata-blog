'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, X } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    created_at: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCat, setEditingCat] = useState<Category | null>(null);
    const [form, setForm] = useState({ name: '', description: '', icon: '', color: '#3B82F6' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            if (data.categories) setCategories(data.categories);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingCat(null);
        setForm({ name: '', description: '', icon: '', color: '#3B82F6' });
        setShowModal(true);
    };

    const openEditModal = (cat: Category) => {
        setEditingCat(cat);
        setForm({
            name: cat.name,
            description: cat.description || '',
            icon: cat.icon || '',
            color: cat.color || '#3B82F6',
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.name.trim()) return alert('Vui lòng nhập tên chủ đề');
        setSaving(true);

        try {
            const method = editingCat ? 'PUT' : 'POST';
            const body = editingCat ? { id: editingCat.id, ...form } : form;

            const res = await fetch('/api/admin/categories', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setShowModal(false);
                fetchCategories();
            } else {
                const data = await res.json();
                alert('Lỗi: ' + (data.error || 'Unknown'));
            }
        } catch (error) {
            alert('Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Xoá chủ đề này? Các bài viết thuộc chủ đề sẽ mất liên kết.')) return;
        try {
            const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCategories(prev => prev.filter(c => c.id !== id));
            }
        } catch (error) {
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
                <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Quản lý chủ đề</h1>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/25"
                >
                    <Plus className="h-4 w-4" />
                    Thêm chủ đề
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-5 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{cat.icon || '📁'}</span>
                                <div>
                                    <h3 className="font-semibold text-surface-900 dark:text-surface-100">{cat.name}</h3>
                                    <p className="text-xs text-fg-faint">/{cat.slug}</p>
                                </div>
                            </div>
                            {cat.color && (
                                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                            )}
                        </div>
                        {cat.description && (
                            <p className="text-sm text-fg-subtle mb-3 line-clamp-2">{cat.description}</p>
                        )}
                        <div className="flex items-center gap-2 pt-3 border-t border-surface-100 dark:border-surface-800">
                            <button
                                onClick={() => openEditModal(cat)}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                            >
                                <Edit className="h-3.5 w-3.5" />
                                Sửa
                            </button>
                            <button
                                onClick={() => handleDelete(cat.id)}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Xoá
                            </button>
                        </div>
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="col-span-full text-center py-12 text-fg-faint">
                        Chưa có chủ đề nào. Hãy thêm chủ đề đầu tiên!
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100">
                                {editingCat ? 'Sửa chủ đề' : 'Thêm chủ đề mới'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Tên chủ đề *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Ví dụ: Python"
                                    className="w-full px-3 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Mô tả</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                    rows={2}
                                    className="w-full px-3 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Icon (emoji)</label>
                                    <input
                                        type="text"
                                        value={form.icon}
                                        onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))}
                                        placeholder="🐍"
                                        className="w-full px-3 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Màu sắc</label>
                                    <input
                                        type="color"
                                        value={form.color}
                                        onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))}
                                        className="w-full h-[42px] rounded-xl border border-surface-200 dark:border-surface-700 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 text-sm font-medium hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                            >
                                Huỷ
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Đang lưu...' : editingCat ? 'Cập nhật' : 'Tạo mới'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
