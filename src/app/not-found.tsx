import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* 404 Illustration */}
                <div className="relative mb-8">
                    <div className="text-[120px] md:text-[160px] font-black text-surface-100 dark:text-surface-900 leading-none select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl animate-bounce">🔍</div>
                    </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-3">
                    Không tìm thấy trang
                </h1>
                <p className="text-surface-500 dark:text-surface-400 mb-8 leading-relaxed">
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển. Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/25"
                    >
                        <Home className="w-4 h-4" />
                        Về trang chủ
                    </Link>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 font-medium hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                    >
                        <Search className="w-4 h-4" />
                        Tìm bài viết
                    </Link>
                </div>
            </div>
        </div>
    );
}
