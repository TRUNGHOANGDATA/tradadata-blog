'use client';

import { useEffect } from 'react';
import { RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* Error Illustration */}
                <div className="relative mb-8">
                    <div className="text-[120px] md:text-[160px] font-black text-surface-100 dark:text-surface-900 leading-none select-none">
                        500
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl">⚠️</div>
                    </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-fg mb-3">
                    Đã xảy ra lỗi
                </h1>
                <p className="text-surface-500 dark:text-surface-400 mb-8 leading-relaxed">
                    Hệ thống gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại hoặc quay về trang chủ.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/25"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Thử lại
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 font-medium hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}
