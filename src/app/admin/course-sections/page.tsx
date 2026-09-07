'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, GripVertical, Eye, EyeOff, Save, X } from 'lucide-react';

interface Section {
    id: string;
    name: string;
    description: string | null;
    sort_order: number;
    is_active: boolean;
    products: [{ count: number }];
}

export default function AdminCourseSectionsPage() {
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<string | null>(null);
    const [form, setForm] = useState({ name: '', description: '', sort_order: 0, is_active: true });
    const [saving, setSaving] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const fetchSections = async () => {
        const res = await fetch('/api/admin/course-sections');
        if (res.ok) {
            const data = await res.json();
            setSections(data);
        }
        setLoading(false);
    };

    useEffect(() => { fetchSections(); }, []);

    const handleSave = async () => {
        setSaving(true);
        const payload = editing
            ? { id: editing, ...form }
            : form;

        const res = await fetch('/api/admin/course-sections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            setEditing(null);
            setShowAdd(false);
            setForm({ name: '', description: '', sort_order: 0, is_active: true });
            fetchSections();
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Xoá đầu mục này? Các sản phẩm thuộc đầu mục sẽ được gỡ nhóm.')) return;

        await fetch(`/api/admin/course-sections?id=${id}`, { method: 'DELETE' });
        fetchSections();
    };

    const startEdit = (s: Section) => {
        setEditing(s.id);
        setShowAdd(false);
        setForm({ name: s.name, description: s.description || '', sort_order: s.sort_order, is_active: s.is_active });
    };

    const startAdd = () => {
        setEditing(null);
        setShowAdd(true);
        setForm({ name: '', description: '', sort_order: sections.length, is_active: true });
    };

    const cancelEdit = () => {
        setEditing(null);
        setShowAdd(false);
        setForm({ name: '', description: '', sort_order: 0, is_active: true });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                        Đầu mục Khoá học
                    </h1>
                    <p className="text-sm text-fg-subtle mt-1">
                        Nhóm các sản phẩm/khoá học theo đầu mục trên trang Khoá học
                    </p>
                </div>
                <button
                    onClick={startAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Thêm đầu mục
                </button>
            </div>

            {/* Add Form */}
            {showAdd && (
                <div className="bg-white dark:bg-surface-900 rounded-xl border border-brand-200 dark:border-brand-800 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-surface-900 dark:text-surface-100">
                        Thêm đầu mục mới
                    </h3>
                    <EditForm form={form} setForm={setForm} onSave={handleSave} onCancel={cancelEdit} saving={saving} />
                </div>
            )}

            {/* Sections List */}
            <div className="space-y-3">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 overflow-hidden"
                    >
                        {editing === section.id ? (
                            <div className="p-6">
                                <EditForm form={form} setForm={setForm} onSave={handleSave} onCancel={cancelEdit} saving={saving} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 p-4">
                                <GripVertical className="w-5 h-5 text-fg-faint shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-surface-900 dark:text-surface-100 truncate">
                                            {section.name}
                                        </h3>
                                        {!section.is_active && (
                                            <span className="px-2 py-0.5 text-xs rounded-full bg-surface-100 dark:bg-surface-800 text-fg-subtle">
                                                Ẩn
                                            </span>
                                        )}
                                    </div>
                                    {section.description && (
                                        <p className="text-sm text-fg-subtle truncate mt-0.5">{section.description}</p>
                                    )}
                                    <p className="text-xs text-fg-faint mt-1">
                                        {section.products?.[0]?.count || 0} sản phẩm · Thứ tự: {section.sort_order}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => startEdit(section)}
                                        className="p-2 text-fg-subtle hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                                        title="Sửa"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(section.id)}
                                        className="p-2 text-fg-subtle hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Xoá"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {sections.length === 0 && !showAdd && (
                    <div className="text-center py-12 text-fg-subtle">
                        <p className="text-lg font-medium mb-1">Chưa có đầu mục nào</p>
                        <p className="text-sm">Thêm đầu mục để nhóm các sản phẩm trên trang Khoá học</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function EditForm({
    form,
    setForm,
    onSave,
    onCancel,
    saving,
}: {
    form: { name: string; description: string; sort_order: number; is_active: boolean };
    setForm: (f: any) => void;
    onSave: () => void;
    onCancel: () => void;
    saving: boolean;
}) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Tên đầu mục *
                    </label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="VD: Data Visualization & Reporting"
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-brand-500"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                            Thứ tự
                        </label>
                        <input
                            type="number"
                            value={form.sort_order}
                            onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-surface-300 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-brand-500"
                        />
                    </div>
                    <div className="flex items-end pb-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
                            />
                            <span className="text-sm text-surface-700 dark:text-surface-300">Hiện</span>
                        </label>
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Mô tả
                </label>
                <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Mô tả ngắn cho đầu mục này"
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-brand-500"
                />
            </div>
            <div className="flex gap-2 justify-end">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4 inline mr-1" />
                    Huỷ
                </button>
                <button
                    onClick={onSave}
                    disabled={saving || !form.name.trim()}
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Lưu
                </button>
            </div>
        </div>
    );
}
