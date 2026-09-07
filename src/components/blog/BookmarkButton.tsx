'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
    postId: string;
    className?: string;
    variant?: 'icon' | 'button'; // 'icon' for postcards, 'button' for detail page
}

export function BookmarkButton({ postId, className = '', variant = 'icon' }: BookmarkButtonProps) {
    const { data: session } = useSession();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch initial status
    useEffect(() => {
        if (!session?.user) return;

        const checkBookmark = async () => {
            try {
                const res = await fetch(`/api/bookmarks/check?postId=${postId}`);
                if (res.ok) {
                    const data = await res.json();
                    setIsBookmarked(data.isBookmarked);
                }
            } catch (error) {
                console.error('Failed to check bookmark status', error);
            }
        };

        checkBookmark();
    }, [postId, session]);

    const toggleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation if inside a PostCard
        e.stopPropagation();

        if (!session?.user) {
            alert('Vui lòng đăng nhập để lưu bài viết!');
            return;
        }

        if (isLoading) return;

        // Optimistic update
        setIsBookmarked((prev) => !prev);
        setIsLoading(true);

        try {
            const res = await fetch('/api/bookmarks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId }),
            });

            if (!res.ok) {
                // Revert if failed
                setIsBookmarked((prev) => !prev);
                const errData = await res.json().catch(() => ({}));
                if (res.status === 401) {
                    alert('Phiên đăng nhập không hợp lệ. Vui lòng đăng xuất rồi đăng nhập lại.');
                } else {
                    alert('Có lỗi xảy ra khi lưu bài viết: ' + (errData.error || 'Vui lòng thử lại'));
                }
            } else {
                const data = await res.json();
                setIsBookmarked(data.isBookmarked);
            }
        } catch (error) {
            setIsBookmarked((prev) => !prev);
            console.error('Failed to toggle bookmark', error);
        } finally {
            setIsLoading(false);
        }
    };

    // If not logged in and we only want to show to logged in users, we can return null.
    // However, showing it and prompting login is better UX. 
    // The user said "chỉ lưu bài viết cho các User đã đăng nhập thôi", which could mean functionality.
    if (!session?.user) {
        return null; // Don't even show the button if not logged in
    }

    if (variant === 'button') {
        return (
            <button
                onClick={toggleBookmark}
                disabled={isLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium border ${isBookmarked
                    ? 'bg-brand-50 border-brand-200 text-brand-700 dark:bg-brand-900/20 dark:border-brand-800 dark:text-brand-300'
                    : 'bg-white border-surface-200 text-surface-600 hover:bg-surface-50 dark:bg-surface-900 dark:border-surface-800 dark:text-surface-400 dark:hover:bg-surface-800'
                    } ${className}`}
                title={isBookmarked ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
            >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'Đã lưu' : 'Lưu bài viết'}</span>
            </button>
        );
    }

    // Default icon variant
    return (
        <button
            onClick={toggleBookmark}
            disabled={isLoading}
            className={`p-2 rounded-full transition-all backdrop-blur-md shadow-sm border ${isBookmarked
                ? 'bg-brand-100/90 border-brand-200 text-brand-600 dark:bg-brand-900/80 dark:border-brand-700 dark:text-brand-400'
                : 'bg-white/80 border-white/20 text-surface-600 hover:bg-card/80 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-800'
                } ${className}`}
            title={isBookmarked ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
        >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
    );
}
