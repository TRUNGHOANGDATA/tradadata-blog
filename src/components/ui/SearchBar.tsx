'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SearchBar() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [isMac, setIsMac] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Detect OS on mount
    useEffect(() => {
        // Doc `navigator` chi co o trinh duyet. Tinh trong lan render dau se lech giua
        // server va client (hydration mismatch), nen BUOC phai doc sau khi mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform));
    }, []);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    // Keyboard shortcut: Ctrl+K or Cmd+K
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setOpen(false);
            setQuery('');
        }
    };

    const shortcutLabel = isMac ? '⌘K' : 'Ctrl+K';

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setOpen(true)}
                aria-label="Tìm kiếm"
                // `shrink-0` + `whitespace-nowrap`: nut nay nam trong mot hang flex
                // chat cho. Thieu hai class do thi flex bop nut lai va chu "Tim
                // kiem..." XUONG DONG, lam ca header cao gap doi.
                //
                // Nhan chu va phim tat chi hien tu `xl` (1280px) chu khong phai `sm`.
                // Do duoc: o 1409px ba cum trong header chiem 159 + 651 + 390 = 1200px
                // + 16px gap = dung bang be rong toi da cua container (1216px). Tuc
                // duoi 1280px la thieu cho, ma nav desktop lai bat tu 1024px — ca
                // khoang 1024-1279 deu vo. An nhan chu + phim tat tra lai ~96px.
                className="flex shrink-0 items-center gap-2 min-h-11 px-3 whitespace-nowrap rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-fg-subtle transition-all duration-300 text-sm border border-surface-200 dark:border-surface-700"
            >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span className="hidden xl:inline">Tìm kiếm...</span>
                <kbd className="hidden xl:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-white dark:bg-surface-700 text-[11px] font-semibold font-mono text-fg-muted border border-surface-300 dark:border-surface-600 shadow-sm">
                    {shortcutLabel}
                </kbd>
            </button>

            {/* Search Modal */}
            {open && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-surface-900/40 dark:bg-surface-900/60 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-xl mx-4 animate-scale-in z-10">
                        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                            <div className="flex items-center gap-3 px-4 py-3">
                                <Search className="h-5 w-5 text-fg-faint shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Tìm kiếm bài viết, chủ đề..."
                                    className="flex-1 bg-transparent outline-none text-fg placeholder:text-surface-400 text-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="p-1 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 transition-colors"
                                >
                                    <X className="h-5 w-5 text-fg-faint" />
                                </button>
                            </div>
                            <div className="px-4 py-2 bg-surface-50 dark:bg-surface-950 border-t border-line text-xs text-fg-subtle flex items-center justify-between">
                                <span>
                                    Nhấn <kbd className="px-1.5 py-0.5 rounded-md border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 font-mono text-surface-700 dark:text-surface-300 shadow-sm">Enter</kbd> để tìm kiếm
                                </span>
                                <span>
                                    <kbd className="px-1.5 py-0.5 rounded-md border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 font-mono text-surface-700 dark:text-surface-300 shadow-sm">Esc</kbd> để đóng
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

