'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, Plus, Save, Trash2, CheckCircle2, AlertCircle, ExternalLink, FunctionSquare } from 'lucide-react';

/**
 * Soạn danh mục hàm Excel 365 + ví dụ nạp sẵn cho /thuc-hanh.
 *
 * Snapshot là JSON `IWorkbookData` của Univer. Cách lấy nhanh nhất: mở
 * /thuc-hanh, dựng ví dụ trong bảng tính, bấm "Sao chép snapshot" (nút chỉ admin
 * thấy) rồi dán vào ô bên dưới. Không cần viết JSON tay.
 */

interface ViDuHamAdmin {
    id: string;
    ten_ham: string;
    nhom: string;
    mo_ta: string | null;
    cong_thuc_mau: string | null;
    post_slug: string | null;
    ho_tro: boolean;
    thu_tu: number;
    snapshot: unknown;
    updated_at: string;
}

type Form = Omit<ViDuHamAdmin, 'id' | 'updated_at' | 'snapshot'> & { id?: string; snapshotText: string };

const FORM_TRONG: Form = {
    ten_ham: '', nhom: '', mo_ta: '', cong_thuc_mau: '', post_slug: '', ho_tro: true, thu_tu: 0, snapshotText: '',
};

const oInput =
    'w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-fg focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-surface-700 dark:bg-surface-800';

export default function ViDuHamPage() {
    const [items, setItems] = useState<ViDuHamAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<Form>(FORM_TRONG);
    const [dangLuu, setDangLuu] = useState(false);
    const [ketQua, setKetQua] = useState<{ ok: boolean; loi: string } | null>(null);
    const [loiTai, setLoiTai] = useState<string | null>(null);

    const tai = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/vi-du-ham');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Không tải được');
            setItems(data.items ?? []);
            setLoiTai(null);
        } catch (e) {
            // Bảng chưa tạo là trường hợp thường gặp ở môi trường mới.
            setLoiTai(e instanceof Error ? e.message : 'Không tải được danh mục');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { tai(); }, [tai]);

    const nhomList = useMemo(() => {
        const m = new Map<string, ViDuHamAdmin[]>();
        for (const it of items) m.set(it.nhom, [...(m.get(it.nhom) ?? []), it]);
        return [...m.entries()];
    }, [items]);

    const chon = (it: ViDuHamAdmin) => {
        setKetQua(null);
        setForm({
            id: it.id, ten_ham: it.ten_ham, nhom: it.nhom, mo_ta: it.mo_ta ?? '', cong_thuc_mau: it.cong_thuc_mau ?? '',
            post_slug: it.post_slug ?? '', ho_tro: it.ho_tro, thu_tu: it.thu_tu,
            snapshotText: it.snapshot ? JSON.stringify(it.snapshot, null, 2) : '',
        });
    };

    const jsonHopLe = useMemo(() => {
        if (!form.snapshotText.trim()) return { ok: true, thongBao: 'Chưa có ví dụ — hàm vẫn hiện trong danh mục, chỉ không nạp được bảng mẫu.' };
        try {
            const v = JSON.parse(form.snapshotText);
            const soSheet = v && typeof v === 'object' && v.sheets ? Object.keys(v.sheets).length : 0;
            return soSheet > 0
                ? { ok: true, thongBao: `JSON hợp lệ — ${soSheet} sheet, ${(form.snapshotText.length / 1024).toFixed(1)} KB.` }
                : { ok: false, thongBao: 'JSON đọc được nhưng không có `sheets` — đây không phải snapshot Univer.' };
        } catch {
            return { ok: false, thongBao: 'JSON không hợp lệ. Dán lại từ nút "Sao chép snapshot" ở /thuc-hanh.' };
        }
    }, [form.snapshotText]);

    const luu = async () => {
        if (!jsonHopLe.ok) return;
        setDangLuu(true);
        setKetQua(null);
        try {
            const body = {
                id: form.id, ten_ham: form.ten_ham, nhom: form.nhom, mo_ta: form.mo_ta, cong_thuc_mau: form.cong_thuc_mau,
                post_slug: form.post_slug, ho_tro: form.ho_tro, thu_tu: form.thu_tu,
                snapshot: form.snapshotText.trim() ? JSON.parse(form.snapshotText) : null,
            };
            const res = await fetch('/api/admin/vi-du-ham', {
                method: form.id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || 'Máy chủ từ chối lưu');
            setKetQua({ ok: true, loi: '' });
            await tai();
            if (!form.id && data.item?.id) setForm((f) => ({ ...f, id: data.item.id }));
        } catch (e) {
            setKetQua({ ok: false, loi: e instanceof Error ? e.message : 'Lỗi không rõ' });
        } finally {
            setDangLuu(false);
        }
    };

    const xoa = async () => {
        if (!form.id) return;
        if (!window.confirm(`Xoá hàm ${form.ten_ham} khỏi danh mục?`)) return;
        setDangLuu(true);
        try {
            const res = await fetch(`/api/admin/vi-du-ham?id=${form.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Không xoá được');
            setForm(FORM_TRONG);
            await tai();
        } catch (e) {
            setKetQua({ ok: false, loi: e instanceof Error ? e.message : 'Lỗi không rõ' });
        } finally {
            setDangLuu(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-fg">Ví dụ hàm Excel 365</h1>
                    <p className="mt-1 text-sm text-fg-muted">
                        Danh mục hiện ở <Link href="/thuc-hanh" className="text-brand-600 hover:underline">/thuc-hanh</Link>. Bấm một hàm để sửa, hoặc thêm mới.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => { setKetQua(null); setForm(FORM_TRONG); }}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                >
                    <Plus className="h-4 w-4" aria-hidden="true" /> Thêm hàm
                </button>
            </div>

            {loiTai && (
                <div role="alert" className="mb-6 flex items-start gap-2 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>
                        Không đọc được bảng <code>vi_du_ham</code>: {loiTai}. Nếu bảng chưa tạo, chạy <code>supabase/manual/vi-du-ham.sql</code> trên SQL Editor của Supabase.
                    </span>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
                {/* Danh mục */}
                <div className="rounded-2xl border border-line bg-card p-4">
                    {items.length === 0 ? (
                        <p className="py-8 text-center text-sm text-fg-faint">Chưa có hàm nào. File SQL mồi sẵn ~50 hàm.</p>
                    ) : (
                        <div className="space-y-4">
                            {nhomList.map(([nhom, ds]) => (
                                <div key={nhom}>
                                    <p className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">{nhom}</p>
                                    <ul className="space-y-0.5">
                                        {ds.map((it) => (
                                            <li key={it.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => chon(it)}
                                                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-sunken ${form.id === it.id ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' : 'text-fg'}`}
                                                >
                                                    <FunctionSquare className="h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden="true" />
                                                    <span className="font-mono font-medium">{it.ten_ham}</span>
                                                    <span className="ml-auto flex items-center gap-1.5 text-[11px]">
                                                        {it.snapshot ? <span className="rounded bg-brand-100 px-1.5 py-0.5 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">ví dụ</span> : null}
                                                        {!it.ho_tro ? <span className="rounded bg-surface-200 px-1.5 py-0.5 text-fg-muted dark:bg-surface-700">chưa hỗ trợ</span> : null}
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Form */}
                <form
                    onSubmit={(e) => { e.preventDefault(); luu(); }}
                    className="space-y-4 rounded-2xl border border-line bg-card p-5"
                >
                    <div className="grid gap-4 sm:grid-cols-[1fr_1fr_88px]">
                        <label className="block text-sm">
                            <span className="mb-1 block font-medium text-fg-muted">Tên hàm</span>
                            <input required value={form.ten_ham} onChange={(e) => setForm({ ...form, ten_ham: e.target.value.toUpperCase() })} placeholder="XLOOKUP" className={`${oInput} font-mono`} />
                        </label>
                        <label className="block text-sm">
                            <span className="mb-1 block font-medium text-fg-muted">Nhóm</span>
                            <input required list="nhom-list" value={form.nhom} onChange={(e) => setForm({ ...form, nhom: e.target.value })} placeholder="Tra cứu & mảng động" className={oInput} />
                            <datalist id="nhom-list">{nhomList.map(([n]) => <option key={n} value={n} />)}</datalist>
                        </label>
                        <label className="block text-sm">
                            <span className="mb-1 block font-medium text-fg-muted">Thứ tự</span>
                            <input type="number" value={form.thu_tu} onChange={(e) => setForm({ ...form, thu_tu: Number(e.target.value) || 0 })} className={oInput} />
                        </label>
                    </div>

                    <label className="block text-sm">
                        <span className="mb-1 block font-medium text-fg-muted">Công thức mẫu</span>
                        <input value={form.cong_thuc_mau ?? ''} onChange={(e) => setForm({ ...form, cong_thuc_mau: e.target.value })} placeholder="=XLOOKUP(E2, A2:A7, C2:C7)" className={`${oInput} font-mono`} />
                    </label>

                    <label className="block text-sm">
                        <span className="mb-1 block font-medium text-fg-muted">Mô tả (3–5 dòng, tiếng Việt)</span>
                        <textarea rows={3} value={form.mo_ta ?? ''} onChange={(e) => setForm({ ...form, mo_ta: e.target.value })} className={oInput} />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                        <label className="block text-sm">
                            <span className="mb-1 block font-medium text-fg-muted">Slug bài viết liên quan</span>
                            <div className="flex gap-2">
                                <input value={form.post_slug ?? ''} onChange={(e) => setForm({ ...form, post_slug: e.target.value })} placeholder="ham-xlookup-thay-vlookup" className={oInput} />
                                {form.post_slug ? (
                                    <a href={`/blog/${form.post_slug}`} target="_blank" rel="noreferrer" className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg text-fg-muted hover:bg-sunken hover:text-fg" aria-label="Mở bài viết">
                                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                    </a>
                                ) : null}
                            </div>
                        </label>
                        <label className="flex items-center gap-2 self-end pb-2 text-sm text-fg">
                            <input type="checkbox" checked={form.ho_tro} onChange={(e) => setForm({ ...form, ho_tro: e.target.checked })} className="h-4 w-4 rounded border-surface-300 text-brand-600" />
                            Engine hỗ trợ
                        </label>
                    </div>

                    <label className="block text-sm">
                        <span className="mb-1 flex items-center justify-between font-medium text-fg-muted">
                            <span>Snapshot ví dụ (JSON Univer)</span>
                            <span className={`text-xs font-normal ${jsonHopLe.ok ? 'text-fg-subtle' : 'text-red-600 dark:text-red-400'}`}>{jsonHopLe.thongBao}</span>
                        </span>
                        <textarea
                            rows={10}
                            value={form.snapshotText}
                            onChange={(e) => setForm({ ...form, snapshotText: e.target.value })}
                            placeholder='Mở /thuc-hanh, dựng ví dụ, bấm "Sao chép snapshot" rồi dán vào đây.'
                            spellCheck={false}
                            className={`${oInput} font-mono text-xs`}
                        />
                    </label>

                    <div className="flex items-center justify-between gap-3 pt-1">
                        <div aria-live="polite" className="min-h-5 text-sm">
                            {ketQua?.ok && <span className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Đã lưu, /thuc-hanh đã cập nhật.</span>}
                            {ketQua && !ketQua.ok && <span role="alert" className="text-red-600 dark:text-red-400">{ketQua.loi}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                            {form.id && (
                                <button type="button" onClick={xoa} disabled={dangLuu} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20">
                                    <Trash2 className="h-4 w-4" aria-hidden="true" /> Xoá
                                </button>
                            )}
                            <button type="submit" disabled={dangLuu || !jsonHopLe.ok} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50">
                                {dangLuu ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
                                {form.id ? 'Lưu thay đổi' : 'Thêm vào danh mục'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
