import Link from 'next/link';
import { Clock, Lock } from 'lucide-react';
import type { Post } from '@/types';
import { formatDate } from '@/lib/utils';
import { BookmarkButton } from './BookmarkButton';

interface PostCardProps {
    post: Post;
    variant?: 'default' | 'featured' | 'compact';
}

export function PostCard({ post, variant = 'default' }: PostCardProps) {
    if (variant === 'featured') {
        return <FeaturedCard post={post} />;
    }

    if (variant === 'compact') {
        return <CompactCard post={post} />;
    }

    return (
        <Link href={`/blog/${post.slug}`} className="group block animate-fade-in relative">
            <article className="h-full rounded-2xl overflow-hidden bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:border-brand-300 dark:hover:border-brand-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative">
                {/* Bookmark Button (Absolute overlay) */}
                <div className="absolute top-3 right-3 z-10">
                    <BookmarkButton postId={post.id} variant="icon" />
                </div>
                {/* Cover Image */}
                {post.cover_image && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {post.is_premium && (
                            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/90 text-white text-xs font-medium backdrop-blur-sm">
                                <Lock className="h-3 w-3" />
                                Premium
                            </div>
                        )}
                    </div>
                )}

                <div className="p-5">
                    {/* Category */}
                    {post.category && (
                        <span
                            className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg mb-3"
                            style={{
                                backgroundColor: `${post.category.color}15`,
                                color: post.category.color || undefined,
                            }}
                        >
                            {post.category.icon} {post.category.name}
                        </span>
                    )}

                    {/* Title */}
                    <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 mb-2">
                        {post.title}
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="text-sm text-surface-600 dark:text-surface-300 line-clamp-2 mb-4">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-surface-500 dark:text-surface-300">
                        {post.published_at && (
                            <span>{formatDate(post.published_at)}</span>
                        )}
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.reading_time} phút đọc
                        </span>

                    </div>
                </div>
            </article>
        </Link>
    );
}

function FeaturedCard({ post }: { post: Post }) {
    return (
        <Link href={`/blog/${post.slug}`} className="group block relative">
            <div className="absolute top-6 right-6 z-20">
                <BookmarkButton postId={post.id} variant="icon" />
            </div>
            <article className="relative rounded-2xl overflow-hidden h-[400px] md:h-[480px]">
                {post.cover_image && (
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    {post.is_premium && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/90 text-white text-xs font-medium mb-3 backdrop-blur-sm">
                            <Lock className="h-3 w-3" />
                            Premium
                        </span>
                    )}
                    {post.category && (
                        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/20 text-white backdrop-blur-sm mb-3 ml-2">
                            {post.category.icon} {post.category.name}
                        </span>
                    )}
                    <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-brand-200 transition-colors mb-3 line-clamp-2">
                        {post.title}
                    </h2>
                    {post.excerpt && (
                        <p className="text-white/80 text-sm mb-4 line-clamp-2 max-w-2xl">
                            {post.excerpt}
                        </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-white/70">
                        {post.author && (
                            <div className="flex items-center gap-2">
                                {post.author.avatar_url && (
                                    <img src={post.author.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                                )}
                                <span>{post.author.full_name}</span>
                            </div>
                        )}
                        {post.published_at && <span>{formatDate(post.published_at)}</span>}
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.reading_time} phút
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}

function CompactCard({ post }: { post: Post }) {
    return (
        <Link href={`/blog/${post.slug}`} className="group flex gap-3 items-start relative pr-8">
            <div className="absolute top-0 right-0 z-10">
                <BookmarkButton postId={post.id} variant="icon" className="scale-75 origin-top-right" />
            </div>
            {post.cover_image && (
                <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden">
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 mb-1">
                    {post.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-300">
                    {post.published_at && <span>{formatDate(post.published_at)}</span>}
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.reading_time}m
                    </span>
                </div>
            </div>
        </Link>
    );
}
