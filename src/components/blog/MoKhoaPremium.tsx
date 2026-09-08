'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Lock, Loader2 } from 'lucide-react';
import { ArticleContent } from './ArticleContent';

/**
 * Thân bài của một bài Premium.
 *
 * Cách hoạt động: trang `/blog/[slug]` là TĨNH nên HTML nó trả về chỉ có vài
 * block đọc thử — giống nhau với mọi người, kể cả người đã mua. Component này
 * chạy ở trình duyệt, gọi `/api/posts/[slug]/noi-dung-premium` để lấy phần còn
 * lại; API đó mới là nơi kiểm đăng nhập và `is_subscribed`.
 *
 * Vì sao làm vòng vo vậy: trước đây trang tự gọi `auth()` để cắt nội dung ở
 * server, nên cả route bị ép render động và trả `no-store` — không cache được
 * ở đâu, mọi lượt đọc đều phải render lại. Đổi sang cách này thì HTML tĩnh
 * dùng chung, và nội dung trả phí KHÔNG hề nằm trong đó.
 *
 * Về bảo mật: cách này chặt hơn trước, không lỏng hơn. Trước đây bản đầy đủ có
 * mặt trong HTML của người đã mua, nên chỉ cần một lỗi cấu hình cache là rò
 * sang người khác. Giờ nội dung trả phí chỉ đi qua một phản hồi `no-store`
 * sau khi API đã kiểm quyền.
 *
 * Đánh đổi đã biết: bài Premium không có Mục lục. Mục lục dựng ở server, mà
 * server không được biết người xem có quyền hay không. Bài thường vẫn có
 * mục lục như cũ.
 */
type Props = {
    slug: string;
    /** Vài block đầu, đã cắt ở server — thứ duy nhất có trong HTML tĩnh. */
    htmlXemThu: string;
};

export function MoKhoaPremium({ slug, htmlXemThu }: Props) {
    const { status } = useSession();
    const [htmlDayDu, setHtmlDayDu] = useState<string | null>(null);
    const [daHoiXong, setDaHoiXong] = useState(false);

    useEffect(() => {
        // Chưa đăng nhập thì khỏi gọi API cho tốn một vòng chắc chắn 401.
        if (status !== 'authenticated') return;

        let conHieuLuc = true;

        // Mọi `setState` đều nằm trong callback bất đồng bộ, KHÔNG gọi thẳng
        // trong thân effect: gọi đồng bộ ở đây là ép React render lại dây chuyền
        // (eslint chặn đúng chỗ này). Trạng thái "đang chờ" vì vậy được SUY RA
        // từ `status` + `daHoiXong` chứ không giữ thành state riêng.
        fetch(`/api/posts/${encodeURIComponent(slug)}/noi-dung-premium`)
            .then(async (res) => {
                if (!res.ok) return null;          // 401/403 -> vẫn hiện lời mời nâng cấp
                const data = await res.json();
                return typeof data?.html === 'string' ? data.html : null;
            })
            .catch(() => null)                     // mất mạng -> giữ phần đọc thử
            .then((html) => {
                if (!conHieuLuc) return;
                setHtmlDayDu(html);
                setDaHoiXong(true);
            });

        return () => { conHieuLuc = false; };
    }, [slug, status]);

    // Đã mở khoá: hiện trọn bài, bỏ hẳn lớp mờ và lời mời.
    if (htmlDayDu) {
        return <ArticleContent htmlContent={htmlDayDu} className="prose max-w-[55ch]" />;
    }

    const dangCho = status === 'loading' || (status === 'authenticated' && !daHoiXong);

    return (
        <div className="mb-16">
            <div className="relative">
                <ArticleContent htmlContent={htmlXemThu} className="prose max-w-[55ch]" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface-50 dark:from-surface-950 to-transparent" />
            </div>

            {dangCho ? (
                // Đang chờ biết người xem là ai — CỐ Ý chưa hiện lời mời nâng cấp,
                // vì hiện rồi mới rút lại là nhá vào mắt người đã mua.
                <div className="mt-2 flex items-center justify-center gap-2 rounded-2xl border border-line bg-card p-8 text-fg-subtle">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span className="text-sm">Đang kiểm tra quyền đọc…</span>
                </div>
            ) : (
                <div className="mt-2 flex flex-col items-center justify-center rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-900/10 p-8 text-center">
                    <div className="p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full mb-4">
                        <Lock className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold text-fg mb-2">
                        Phần còn lại dành cho thành viên Premium
                    </h3>
                    <p className="text-fg-subtle max-w-md mb-8">
                        Đăng ký gói Premium để đọc trọn bài viết và toàn bộ nội dung chất lượng cao khác.
                    </p>
                    {status === 'authenticated' ? (
                        <a
                            href="/courses"
                            className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors shadow-lg"
                        >
                            Nâng cấp Premium
                        </a>
                    ) : (
                        <a
                            href={`/login?callbackUrl=/blog/${slug}`}
                            className="inline-flex items-center justify-center px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors shadow-lg"
                        >
                            Đăng nhập để tiếp tục
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
