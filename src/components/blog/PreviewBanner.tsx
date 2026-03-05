'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PreviewBannerProps {
    postId: string;
    postStatus: string;
}

export function PreviewBanner({ postId, postStatus }: PreviewBannerProps) {
    const [publishing, setPublishing] = useState(false);
    const router = useRouter();
    const isDraft = postStatus !== 'published';

    const handlePublish = async () => {
        if (!confirm('Bạn có chắc chắn muốn xuất bản bài viết này?')) return;

        setPublishing(true);
        try {
            const res = await fetch(`/api/admin/posts/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'published' }),
            });

            if (res.ok) {
                // Reload the page to show the published state
                router.refresh();
                window.location.reload();
            } else {
                const data = await res.json();
                alert('Lỗi: ' + (data.error || 'Không thể xuất bản'));
            }
        } catch {
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className={`border-b ${isDraft ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                <div className={`flex items-center gap-2 text-sm font-medium ${isDraft ? 'text-amber-700 dark:text-amber-400' : 'text-blue-700 dark:text-blue-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                    {isDraft
                        ? 'Chế độ xem trước — Bài viết này chưa được xuất bản'
                        : 'Chế độ xem trước — Bài viết đã xuất bản'}
                </div>
                <div className="flex items-center gap-2">
                    {isDraft && (
                        <button
                            onClick={handlePublish}
                            disabled={publishing}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors bg-emerald-500 dark:bg-emerald-600 text-white hover:bg-emerald-600 dark:hover:bg-emerald-500 disabled:opacity-50"
                        >
                            {publishing ? 'Đang xuất bản...' : '🚀 Xuất bản ngay'}
                        </button>
                    )}
                    <a
                        href={`/admin/posts/${postId}/edit`}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${isDraft ? 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 hover:bg-amber-300 dark:hover:bg-amber-700' : 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 hover:bg-blue-300 dark:hover:bg-blue-700'}`}
                    >
                        ← Quay lại chỉnh sửa
                    </a>
                </div>
            </div>
        </div>
    );
}
