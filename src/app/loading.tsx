export default function HomeLoading() {
    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 animate-pulse">
            {/* Hero */}
            <div className="h-[60vh] bg-surface-200 dark:bg-surface-800" />
            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden">
                            <div className="h-48 bg-surface-200 dark:bg-surface-800" />
                            <div className="p-5 space-y-3">
                                <div className="h-4 w-20 bg-surface-200 dark:bg-surface-800 rounded-full" />
                                <div className="h-5 w-full bg-surface-200 dark:bg-surface-800 rounded" />
                                <div className="h-4 w-5/6 bg-surface-200 dark:bg-surface-800 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
