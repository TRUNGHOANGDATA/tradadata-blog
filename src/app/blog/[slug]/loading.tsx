export default function BlogPostLoading() {
    return (
        <article className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-16 animate-pulse">
            {/* Hero Skeleton */}
            <div className="relative w-full h-[50vh] min-h-[400px] max-h-[600px] mt-16 md:mt-20 bg-surface-300 dark:bg-surface-800">
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/60 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
                        {/* Breadcrumb skeleton */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-4 w-16 bg-surface-600 rounded" />
                            <div className="h-4 w-4 bg-surface-600 rounded" />
                            <div className="h-4 w-16 bg-surface-600 rounded" />
                        </div>
                        {/* Category badge */}
                        <div className="h-7 w-24 bg-surface-600/30 rounded-full mb-4" />
                        {/* Title */}
                        <div className="h-10 w-3/4 bg-surface-600 rounded mb-3" />
                        <div className="h-10 w-1/2 bg-surface-600 rounded mb-4" />
                        {/* Meta */}
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-8 rounded-full bg-surface-600" />
                            <div className="h-4 w-32 bg-surface-600 rounded" />
                            <div className="h-4 w-24 bg-surface-600 rounded" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left sidebar */}
                    <div className="hidden lg:block lg:col-span-2">
                        <div className="space-y-4">
                            <div className="h-4 w-20 bg-surface-200 dark:bg-surface-800 rounded" />
                            <div className="h-10 w-full bg-surface-200 dark:bg-surface-800 rounded-lg" />
                            <div className="space-y-3 mt-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-10 w-10 bg-surface-200 dark:bg-surface-800 rounded-lg mx-auto" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="col-span-1 lg:col-span-7 space-y-4">
                        {/* Excerpt */}
                        <div className="h-6 w-full bg-surface-200 dark:bg-surface-800 rounded border-l-4 border-brand-500 pl-6" />
                        <div className="h-6 w-3/4 bg-surface-200 dark:bg-surface-800 rounded" />
                        {/* Paragraphs */}
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="space-y-2 mt-6">
                                {i === 1 && <div className="h-8 w-2/3 bg-surface-200 dark:bg-surface-800 rounded" />}
                                <div className="h-4 w-full bg-surface-200 dark:bg-surface-800 rounded" />
                                <div className="h-4 w-full bg-surface-200 dark:bg-surface-800 rounded" />
                                <div className="h-4 w-5/6 bg-surface-200 dark:bg-surface-800 rounded" />
                                <div className="h-4 w-4/5 bg-surface-200 dark:bg-surface-800 rounded" />
                            </div>
                        ))}
                    </div>

                    {/* Right sidebar - TOC */}
                    <div className="col-span-1 lg:col-span-3">
                        <div className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800">
                            <div className="h-5 w-20 bg-surface-200 dark:bg-surface-800 rounded mb-4" />
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="h-4 bg-surface-200 dark:bg-surface-800 rounded" style={{ width: `${85 - i * 8}%` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
