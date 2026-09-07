'use client';

import { useState } from 'react';
import { Pin } from 'lucide-react';

interface PinButtonProps {
    postId: string;
    initialPinned: boolean;
}

export function PinButton({ postId, initialPinned }: PinButtonProps) {
    const [isPinned, setIsPinned] = useState(initialPinned);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/posts/${postId}/pin`, {
                method: 'PATCH',
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.error || 'Có lỗi xảy ra');
                return;
            }

            setIsPinned(data.is_pinned);
        } catch {
            alert('Không thể kết nối server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all backdrop-blur-sm border ${isPinned
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-card/15 text-white border-white/25 hover:bg-white/25'
                } ${loading ? 'opacity-50 cursor-wait' : ''}`}
            title={isPinned ? 'Bỏ ghim bài viết' : 'Ghim bài viết lên đầu trang'}
        >
            <Pin className={`h-3 w-3 ${isPinned ? 'fill-amber-300' : ''}`} />
            {loading ? '...' : isPinned ? 'Đã ghim' : 'Ghim'}
        </button>
    );
}
