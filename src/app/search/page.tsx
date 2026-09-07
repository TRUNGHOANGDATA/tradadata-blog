import Link from 'next/link';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';
import { searchPosts } from '@/lib/data/posts';
import { PostCard } from '@/components/blog/PostCard';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: Props) {
    const params = await searchParams;
    const q = typeof params.q === 'string' ? params.q : '';
    const query = q.trim();

    // Fetch search results from Supabase
    const results = query ? await searchPosts(query) : [];

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-16">
            {/* Header */}
            <section className="bg-gradient-to-b from-brand-50 to-surface-50 dark:from-surface-900 dark:to-surface-950 py-12 md:py-20 mt-16 text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 mb-6 shadow-sm border border-brand-200 dark:border-brand-800">
                        <SearchIcon className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-fg mb-4">
                        Kết quả tìm kiếm
                    </h1>
                    <p className="text-fg-subtle text-lg md:text-xl max-w-2xl mx-auto">
                        {query ? (
                            <>
                                Tìm thấy <span className="font-bold text-brand-600 dark:text-brand-400">{results.length}</span> kết quả cho từ khoá &quot;<span className="text-fg font-medium">{query}</span>&quot;
                            </>
                        ) : (
                            'Vui lòng nhập từ khoá để tìm kiếm bài viết.'
                        )}
                    </p>
                </div>
            </section>

            {/* List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-end mb-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm font-medium text-fg-subtle hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Tất cả bài viết
                    </Link>
                </div>

                {query ? (
                    results.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white/50 dark:bg-surface-900/50 rounded-2xl border border-line">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 text-fg-faint mb-4">
                                <SearchIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-medium text-fg mb-2">Không tìm thấy kết quả</h3>
                            <p className="text-fg-subtle text-sm max-w-sm mx-auto">Không có bài viết nào phù hợp với từ khoá của bạn. Thử tìm kiếm với từ khoá khác xem sao.</p>
                            <Link
                                href="/blog"
                                className="mt-6 inline-block px-6 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-colors"
                            >
                                Xem bài viết mới nhất
                            </Link>
                        </div>
                    )
                ) : null}
            </div>
        </div>
    );
}
