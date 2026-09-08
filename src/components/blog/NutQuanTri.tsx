'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { PinButton } from './PinButton';

/**
 * Nút "Sửa bài viết" + ghim, chỉ hiện với admin/editor.
 *
 * Vì sao là Client Component: trang bài viết đã chuyển sang TĨNH, nên server
 * không còn biết người xem là ai. Nếu vẫn kiểm quyền ở server thì chỉ một lần
 * gọi `auth()` là cả route bị ép render động lại — đúng thứ vừa bỏ đi.
 *
 * Đây chỉ là lối đi nhanh cho người biên tập, KHÔNG phải rào bảo mật: mọi
 * API thật (`/api/admin/*`) đều tự kiểm `session.user.role` ở server. Người
 * lạ có sửa DOM để nút hiện ra thì bấm vào vẫn bị API chặn.
 */
export function NutQuanTri({ postId, daGhim }: { postId: string; daGhim: boolean }) {
    const { data: session } = useSession();
    const role = session?.user?.role;

    if (role !== 'admin' && role !== 'editor') return null;

    return (
        <div className="flex items-center gap-2 mb-4">
            <Link
                href={`/admin/posts/${postId}/edit`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/25 text-xs font-medium hover:bg-white/25 transition-colors backdrop-blur-sm"
            >
                <Pencil className="h-3 w-3" />
                Sửa bài viết
            </Link>
            <PinButton postId={postId} initialPinned={daGhim} />
        </div>
    );
}
