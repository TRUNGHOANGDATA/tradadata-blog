'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, Calendar, Pause, Play } from 'lucide-react';
import type { Post } from '@/types';
import { formatDate } from '@/lib/utils';

interface PinnedSliderProps {
    posts: Post[];
}

/**
 * Nhip tu chay, khop voi `--animate-progress: progress 5s linear` trong
 * globals.css. Truoc day la 2000ms trong khi thanh tien do ve theo 5s, nen
 * thanh do khong bao gio chay het mot vong.
 */
const NHIP_TU_CHAY = 5000;

export function PinnedSlider({ posts }: PinnedSliderProps) {
    const [current, setCurrent] = useState(0);
    /** Tam dung vi con tro hoac tieu diem ban phim dang o trong slider. */
    const [isPaused, setIsPaused] = useState(false);
    /** Nguoi dung tu bam nut dung — giu nguyen cho toi khi ho bam lai. */
    const [tuDung, setTuDung] = useState(false);
    /** He dieu hanh bao "giam chuyen dong" thi khong tu chay. */
    const [giamChuyenDong, setGiamChuyenDong] = useState(false);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [isAnimating, setIsAnimating] = useState(true);

    const total = posts.length;

    const goTo = useCallback((index: number, dir: 'next' | 'prev' = 'next') => {
        setDirection(dir);
        setIsAnimating(false);
        // Small delay to reset animation
        setTimeout(() => {
            setCurrent(index);
            setIsAnimating(true);
        }, 50);
    }, []);

    const next = useCallback(() => {
        goTo((current + 1) % total, 'next');
    }, [current, total, goTo]);

    const prev = useCallback(() => {
        goTo((current - 1 + total) % total, 'prev');
    }, [current, total, goTo]);

    /**
     * Ton trong "giam chuyen dong" cua he dieu hanh.
     *
     * Khoi `@media (prefers-reduced-motion: reduce)` trong globals.css KHONG
     * cuu duoc cho nay: no chi tat animation/transition cua CSS, con day la
     * `setInterval` cua JavaScript. Phai hoi rieng.
     */
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const dong = () => setGiamChuyenDong(mq.matches);
        dong();
        mq.addEventListener('change', dong);
        return () => mq.removeEventListener('change', dong);
    }, []);

    const dangChay = !isPaused && !tuDung && !giamChuyenDong && total > 1;

    useEffect(() => {
        if (!dangChay) return;
        const timer = setInterval(next, NHIP_TU_CHAY);
        return () => clearInterval(timer);
    }, [dangChay, next]);

    if (total === 0) return null;

    return (
        // KHONG dung `-mt-10` de thut len de hero nua. Cai am le do thiet ke cho
        // hero GRADIENT cu (khong co gi o goc phai duoi). Voi hero chia doi hien
        // tai, anh minh hoa tran toi mep man hinh con the slider bi bo trong
        // `max-w-7xl` => anh tho han ra BEN PHAI the, hai lop chong nhau trong vo
        // lan. Do 13/09/2026 tren production.
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-12">
            <div
                className="relative w-full overflow-hidden bg-surface-900 rounded-2xl shadow-e3"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                // Nguoi dung ban phim cung phai dung duoc bang tieu diem: truoc day
                // chi co chuot moi dung duoc, nen Tab vao giua slider la noi dung
                // truot mat duoi tay.
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
            >
                {/* Slides */}
                <div className="relative h-[380px] md:h-[420px]">
                    {posts.map((post, index) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === current
                                ? 'opacity-100 z-10 scale-100'
                                : direction === 'next'
                                    ? 'opacity-0 z-0 translate-x-8 scale-[1.02]'
                                    : 'opacity-0 z-0 -translate-x-8 scale-[1.02]'
                                }`}
                        >
                            {/* Background Image with parallax feel */}
                            <div className="absolute inset-0 overflow-hidden">
                                <Image
                                    src={post.cover_image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop'}
                                    alt={post.title}
                                    fill
                                    sizes="100vw"
                                    priority={index === 0}
                                    className={`object-cover transition-transform duration-[2000ms] ease-out ${index === current ? 'scale-110' : 'scale-100'
                                        }`}
                                />
                                {/* Multi-layer gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-surface-900/95 via-surface-900/70 to-surface-900/30" />
                                <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-transparent to-surface-900/20" />
                            </div>

                            {/* Content with staggered animations */}
                            <div className="relative z-10 h-full flex items-center">
                                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
                                    <div className="max-w-2xl space-y-3">
                                        {/* Badges */}
                                        <div className={`flex items-center gap-2 transition-all duration-500 ${index === current && isAnimating
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-4'
                                            }`} style={{ transitionDelay: '100ms' }}>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm shimmer-badge">
                                                📌 Bài ghim
                                            </span>
                                            {post.category && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-600/20 text-brand-300 border border-brand-500/30 text-sm font-medium backdrop-blur-sm">
                                                    {post.category.icon && <span>{post.category.icon}</span>}
                                                    {post.category.name}
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight line-clamp-3 transition-all duration-500 ${index === current && isAnimating
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-4'
                                            }`} style={{ transitionDelay: '200ms' }}>
                                            {post.title}
                                        </h2>

                                        {/* Excerpt */}
                                        {post.excerpt && (
                                            <p className={`text-sm md:text-base text-surface-300 leading-relaxed line-clamp-2 max-w-xl transition-all duration-500 ${index === current && isAnimating
                                                ? 'opacity-100 translate-y-0'
                                                : 'opacity-0 translate-y-4'
                                                }`} style={{ transitionDelay: '300ms' }}>
                                                {post.excerpt}
                                            </p>
                                        )}

                                        {/* Meta */}
                                        <div className={`flex items-center gap-5 text-sm text-fg-faint pt-1 transition-all duration-500 ${index === current && isAnimating
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-4'
                                            }`} style={{ transitionDelay: '400ms' }}>
                                            {post.author && (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-brand-600 border-2 border-surface-700 flex items-center justify-center text-white text-xs font-bold">
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
                                        <div className={`pt-1 transition-all duration-500 ${index === current && isAnimating
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-4'
                                            }`} style={{ transitionDelay: '500ms' }}>
                                            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors text-sm group">
                                                Đọc bài viết
                                                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 grid place-items-center min-h-11 min-w-11 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110 active:scale-95"
                            aria-label="Bài trước"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); next(); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 grid place-items-center min-h-11 min-w-11 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110 active:scale-95"
                            aria-label="Bài tiếp"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </>
                )}

                {/* Dots — bigger click area */}
                {total > 1 && (
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1">
                        {posts.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(index, index > current ? 'next' : 'prev'); }}
                                className="relative grid place-items-center min-h-11 min-w-11 group"
                                aria-label={`Bài ghim ${index + 1} trên ${total}`}
                                aria-current={index === current}
                            >
                                <div className={`rounded-full transition-all duration-300 ${index === current
                                    ? 'w-10 h-3 bg-brand-500 shadow-lg shadow-brand-600/25'
                                    : 'w-3 h-3 bg-white/30 group-hover:bg-white/60'
                                    }`} />
                                {/* Progress bar animation on active dot */}
                                {index === current && dangChay && (
                                    <div className="absolute inset-0 m-auto h-3 w-10 rounded-full bg-brand-400/40 origin-left animate-progress" />
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* Bo dem + nut tam dung. Noi dung tu doi cho BAT BUOC phai co nut
                    dung thay duoc bang chuot lan ban phim. */}
                {total > 1 && (
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                        <div className="px-3 py-1 rounded-full bg-black/30 text-white/70 text-xs font-medium backdrop-blur-sm tabular-nums">
                            {current + 1} / {total}
                        </div>
                        {!giamChuyenDong && (
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTuDung((t) => !t); }}
                                className="grid place-items-center min-h-11 min-w-11 rounded-full bg-black/30 text-white/80 hover:text-white hover:bg-black/50 backdrop-blur-sm transition-colors"
                                aria-label={tuDung ? 'Cho slider chạy tiếp' : 'Tạm dừng slider'}
                                aria-pressed={tuDung}
                            >
                                {tuDung ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
