'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, Phone, Trash2, RefreshCw, Inbox } from 'lucide-react';

interface Lead {
    id: string;
    full_name: string;
    phone: string;
    company: string | null;
    note: string | null;
    source: string | null;
    status: string;
    created_at: string;
}

const STATUS_META: Record<string, { label: string; cls: string }> = {
    new: { label: 'Mới', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    contacted: { label: 'Đã liên hệ', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    won: { label: 'Chốt được', cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    lost: { label: 'Không chốt', cls: 'bg-surface-200 text-surface-600 dark:bg-surface-800 dark:text-surface-400' },
};
const STATUS_ORDER = ['new', 'contacted', 'won', 'lost'];

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<string>('all');
    const [busyId, setBusyId] = useState<string | null>(null);

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/leads');
            const data = await res.json();
            setLeads(data.leads || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function changeStatus(id: string, status: string) {
        setBusyId(id);
        // Cập nhật lạc quan để bấm thấy phản hồi ngay, hỏng thì tải lại
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
        try {
            const res = await fetch('/api/admin/leads', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            if (!res.ok) throw new Error();
        } catch {
            alert('Không đổi được trạng thái, thử lại giúp mình.');
            load();
        } finally {
            setBusyId(null);
        }
    }

    async function remove(id: string, name: string) {
        if (!confirm(`Xoá lead "${name}"? Không khôi phục lại được.`)) return;
        setBusyId(id);
        try {
            const res = await fetch(`/api/admin/leads?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            setLeads((prev) => prev.filter((l) => l.id !== id));
        } catch {
            alert('Không xoá được, thử lại giúp mình.');
        } finally {
            setBusyId(null);
        }
    }

    const counts = useMemo(() => {
        const c: Record<string, number> = { all: leads.length };
        STATUS_ORDER.forEach((s) => { c[s] = leads.filter((l) => l.status === s).length; });
        return c;
    }, [leads]);

    const shown = useMemo(() => {
        const q = search.trim().toLowerCase();
        return leads.filter((l) => {
            if (filter !== 'all' && l.status !== filter) return false;
            if (!q) return true;
            return [l.full_name, l.phone, l.company, l.note].some((v) => (v || '').toLowerCase().includes(q));
        });
    }, [leads, search, filter]);

    const fmt = (s: string) => {
        const d = new Date(s);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Khách quan tâm phần mềm</h1>
                    <p className="text-sm text-fg-subtle mt-1">Thông tin gửi từ trang /phan-mem-ban-hang</p>
                </div>
                <button
                    onClick={load}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-300 dark:border-surface-700 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                    <RefreshCw className="h-4 w-4" />
                    Tải lại
                </button>
            </div>

            {/* Bộ lọc theo trạng thái */}
            <div className="flex flex-wrap gap-2 mb-4">
                {['all', ...STATUS_ORDER].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s
                            ? 'bg-brand-600 text-white'
                            : 'bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-800 hover:bg-surface-100 dark:hover:bg-surface-800'
                            }`}
                    >
                        {s === 'all' ? 'Tất cả' : STATUS_META[s].label} ({counts[s] || 0})
                    </button>
                ))}
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-faint" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm theo tên, số điện thoại, công ty, nội dung..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
            </div>

            {shown.length === 0 ? (
                <div className="text-center py-20 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
                    <Inbox className="h-10 w-10 text-surface-300 dark:text-surface-700 mx-auto mb-3" />
                    <p className="text-fg-subtle">
                        {leads.length === 0 ? 'Chưa có ai để lại thông tin.' : 'Không có kết quả khớp bộ lọc.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {shown.map((l) => (
                        <div
                            key={l.id}
                            className="p-4 md:p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-bold text-surface-900 dark:text-surface-100">{l.full_name}</span>
                                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${STATUS_META[l.status]?.cls || STATUS_META.new.cls}`}>
                                            {STATUS_META[l.status]?.label || l.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-surface-600 dark:text-surface-400">
                                        <a href={`tel:${l.phone.replace(/[^0-9+]/g, '')}`} className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 hover:underline font-medium">
                                            <Phone className="h-3.5 w-3.5" />
                                            {l.phone}
                                        </a>
                                        {l.company && <span>{l.company}</span>}
                                        <span className="text-fg-faint">{fmt(l.created_at)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <select
                                        value={l.status}
                                        disabled={busyId === l.id}
                                        onChange={(e) => changeStatus(l.id, e.target.value)}
                                        className="px-3 py-1.5 rounded-lg text-sm bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-700 text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                                    >
                                        {STATUS_ORDER.map((s) => (
                                            <option key={s} value={s}>{STATUS_META[s].label}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => remove(l.id, l.full_name)}
                                        disabled={busyId === l.id}
                                        title="Xoá"
                                        className="p-2 rounded-lg text-fg-faint hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            {l.note && (
                                <p className="text-sm text-surface-600 dark:text-surface-400 whitespace-pre-line bg-surface-50 dark:bg-surface-950 rounded-xl p-3 mt-2">
                                    {l.note}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
