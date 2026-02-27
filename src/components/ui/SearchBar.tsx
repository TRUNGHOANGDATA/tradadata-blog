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
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-500 transition-all duration-300 text-sm border border-surface-200 dark:border-surface-700"
            >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Tìm kiếm...</span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-white dark:bg-surface-700 text-[11px] font-semibold font-mono text-surface-600 dark:text-surface-300 border border-surface-300 dark:border-surface-600 shadow-sm">
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
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                            <div className="flex items-center gap-3 px-4 py-3">
                                <Search className="h-5 w-5 text-surface-400 shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Tìm kiếm bài viết, chủ đề..."
                                    className="flex-1 bg-transparent outline-none text-surface-900 dark:text-surface-100 placeholder:text-surface-400 text-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="p-1 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 transition-colors"
                                >
                                    <X className="h-5 w-5 text-surface-400" />
                                </button>
                            </div>
                            <div className="px-4 py-2 bg-surface-50 dark:bg-surface-950 border-t border-surface-200 dark:border-surface-800 text-xs text-surface-500 flex items-center justify-between">
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

