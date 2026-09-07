import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Post } from '@/types';

interface InternalLinksProps {
    relatedPosts: Post[];
}

export function InternalLinks({ relatedPosts }: InternalLinksProps) {
    if (relatedPosts.length === 0) return null;

    return (
        <div className="my-10 p-6 bg-gradient-to-br from-brand-50/80 to-surface-50 dark:from-brand-950/30 dark:to-surface-900/60 rounded-2xl border border-brand-200/50 dark:border-brand-800/30">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📚</span>
                <h3 className="text-lg font-bold text-fg">
                    Bài viết liên quan
                </h3>
            </div>
            <div className="space-y-3">
                {relatedPosts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group flex items-center gap-3 p-3 rounded-xl bg-white/70 dark:bg-surface-800/50 hover:bg-white dark:hover:bg-surface-800 border border-surface-200/50 dark:border-surface-700/50 hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-200 hover:shadow-sm"
                    >
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                                {post.title}
                            </p>
                            {post.category && (
                                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                                    {post.category.icon} {post.category.name} · {post.reading_time} phút đọc
                                </p>
                            )}
                        </div>
                        <ArrowRight className="h-4 w-4 text-fg-faint group-hover:text-brand-500 transition-colors shrink-0" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
