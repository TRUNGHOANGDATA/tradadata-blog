'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';
import type { Post } from '@/types';
import { formatDate } from '@/lib/utils';

interface PinnedSliderProps {
    posts: Post[];
}

export function PinnedSlider({ posts }: PinnedSliderProps) {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');

    const total = posts.length;

    const goTo = useCallback((index: number, dir: 'next' | 'prev' = 'next') => {
        setDirection(dir);
        setCurrent(index);
    }, []);

    const next = useCallback(() => {
        goTo((current + 1) % total, 'next');
    }, [current, total, goTo]);

    const prev = useCallback(() => {
        goTo((current - 1 + total) % total, 'prev');
    }, [current, total, goTo]);

    // Auto-play every 5 seconds
    useEffect(() => {
        if (isPaused || total <= 1) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [isPaused, next, total]);

    if (total === 0) return null;

    return (
        <div
            className="relative w-full overflow-hidden bg-surface-900"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides */}
            <div className="relative h-[420px] md:h-[480px]">
                {posts.map((post, index) => (
                    <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === current
                                ? 'opacity-100 z-10 scale-100'
                                : direction === 'next'
                                    ? 'opacity-0 z-0 scale-105'
                                    : 'opacity-0 z-0 scale-95'
                            }`}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src={post.cover_image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop'}
                                alt={post.title}
                                className="w-full h-full object-cover"
                                loading={index === 0 ? 'eager' : 'lazy'}
                            />
                            {/* Multi-layer gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-surface-900/95 via-surface-900/70 to-surface-900/30" />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-transparent to-surface-900/20" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 h-full flex items-center">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                                <div className="max-w-2xl space-y-4">
                                    {/* Pinned badge */}
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
                                        📌 Bài ghim
                                    </div>

                                    {/* Category */}
                                    {post.category && (
                                        <div className="inline-flex ml-2 items-center gap-1.5 px-3 py-1 rounded-full bg-brand-600/20 text-brand-300 border border-brand-500/30 text-sm font-medium backdrop-blur-sm">
                                            {post.category.icon && <span>{post.category.icon}</span>}
                                            {post.category.name}
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight line-clamp-2">
                                        {post.title}
                                    </h2>

                                    {/* Excerpt */}
                                    {post.excerpt && (
                                        <p className="text-base md:text-lg text-surface-300 leading-relaxed line-clamp-2 max-w-xl">
                                            {post.excerpt}
                                        </p>
                                    )}

                                    {/* Meta */}
                                    <div className="flex items-center gap-5 text-sm text-surface-400 pt-2">
                                        {post.author && (
                                            <div className="flex items-center gap-2">
                                                <div className="h-7 w-7 rounded-full bg-brand-600 border-2 border-surface-700 flex items-center justify-center text-white text-xs font-bold">
                                                    {post.author.full_name?.charAt(0) || 'T'}
                                                </div>
                                                <span className="font-medium text-surface-300">{post.author.full_name || 'Trà Đá Data'}</span>
                                            </div>
                                        )}
                                        {post.published_at && (
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>{formatDate(post.published_at)}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>{post.reading_time} phút đọc</span>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="pt-2">
                                        <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors text-sm">
                                            Đọc bài viết
                                            <ChevronRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Navigation Arrows */}
            {total > 1 && (
                <>
                    <button
                        onClick={(e) => { e.preventDefault(); prev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10 transition-all hover:scale-110"
                        aria-label="Bài trước"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); next(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10 transition-all hover:scale-110"
                        aria-label="Bài tiếp"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </>
            )}

            {/* Dots + Progress */}
            {total > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                    {posts.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => { e.preventDefault(); goTo(index, index > current ? 'next' : 'prev'); }}
                            className="relative group"
                            aria-label={`Slide ${index + 1}`}
                        >
                            <div className={`h-2 rounded-full transition-all duration-300 ${index === current
                                    ? 'w-8 bg-brand-500'
                                    : 'w-2 bg-white/30 group-hover:bg-white/60'
                                }`} />
                            {/* Progress bar animation on active dot */}
                            {index === current && !isPaused && (
                                <div className="absolute inset-0 h-2 rounded-full bg-brand-400/50 origin-left animate-progress" />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Slide counter */}
            {total > 1 && (
                <div className="absolute top-6 right-6 z-20 px-3 py-1 rounded-full bg-black/30 text-white/70 text-xs font-medium backdrop-blur-sm">
                    {current + 1} / {total}
                </div>
            )}
        </div>
    );
}
