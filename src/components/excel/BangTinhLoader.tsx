'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { LogIn } from 'lucide-react';
import type { ViDuHam } from '@/lib/data/vi-du-ham';

// Univer đụng `window` ngay lúc khởi tạo và vẽ bằng canvas -> KHÔNG render ở server.
const BangTinh = dynamic(() => import('./BangTinh'), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center text-sm text-fg-subtle">
            Đang tải bảng tính…
        </div>
    ),
});

// Dưới ngưỡng này thì grid canvas gần như không dùng được bằng ngón tay.
const NGUONG_MAN_HINH = 768;

/**
 * Hàm 365 hiện ở cửa đăng nhập — để người chưa đăng nhập THẤY mình sắp được thử
 * gì. Thẻ trắng "Đăng nhập để dùng bảng tính" trước đây không nói được điều đó.
 * Danh sách này đã đối chiếu với engine công thức của Univer 0.25.1 (grep thẳng
 * bundle, 13/09/2026): tất cả đều có và có tràn mảng (spill).
 */
const HAM_365_NOI_BAT = [
    'XLOOKUP', 'FILTER', 'UNIQUE', 'SORT', 'SEQUENCE', 'LET', 'LAMBDA',
    'TEXTSPLIT', 'TEXTJOIN', 'VSTACK', 'MAP', 'REDUCE', 'IFS', 'MAXIFS',
];

export default function BangTinhLoader({ danhMuc = [] }: { danhMuc?: ViDuHam[] }) {
    const { status, data: session } = useSession();
    const laAdmin = session?.user?.role === 'admin';
    // `null` = chưa đo xong. Phải đo ở client vì server không biết bề rộng màn hình.
    const [duManHinh, setDuManHinh] = useState<boolean | null>(null);

    useEffect(() => {
        const mq = window.matchMedia(`(min-width: ${NGUONG_MAN_HINH}px)`);
        const capNhat = () => setDuManHinh(mq.matches);
        capNhat();
        mq.addEventListener('change', capNhat);
        return () => mq.removeEventListener('change', capNhat);
    }, []);

    // Đang xác định phiên đăng nhập hoặc chưa đo màn hình -> chờ, tránh nháy.
    if (status === 'loading' || duManHinh === null) {
        return <div className="h-full w-full" />;
    }

    // Màn hình nhỏ: KHÔNG tải bundle Univer (nặng), chỉ hiện lời nhắn.
    if (!duManHinh) {
        return (
            <div className="flex h-full w-full items-center justify-center p-8">
                <div className="max-w-md text-center">
                    <p className="text-lg font-semibold text-fg">Hãy mở trên máy tính</p>
                    <p className="mt-2 text-sm text-fg-muted">
                        Bảng tính cần chuột và bàn phím để thao tác. Trên điện thoại
                        thì gần như không dùng được, nên trang này chỉ chạy ở màn hình
                        từ {NGUONG_MAN_HINH}px trở lên.
                    </p>
                </div>
            </div>
        );
    }

    // Chưa đăng nhập: che bảng tính, mời đăng nhập (không tải bundle Univer).
    // Bắt đăng nhập là CỐ Ý — chủ site cần danh sách người dùng. Nhưng cửa này
    // phải cho thấy bên trong có gì, không thì ít ai bấm.
    if (status !== 'authenticated') {
        return (
            <div className="flex h-full w-full items-center justify-center p-6">
                <div className="w-full max-w-xl rounded-2xl border border-line bg-card p-8 shadow-e2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                        Thực hành Excel
                    </p>
                    <h2 className="mt-2 text-2xl font-bold leading-tight text-fg">
                        Thử hàm Excel 365 ngay trên trình duyệt
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                        Chưa có Excel 365 vẫn gõ được XLOOKUP, FILTER, LAMBDA… và xem kết quả
                        tràn ra nhiều ô như bản thật. Không cần cài đặt, không cần tài khoản
                        Microsoft — chỉ cần đăng nhập Google để giữ bài của bạn.
                    </p>

                    <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Hàm Excel 365 hỗ trợ">
                        {(danhMuc.length > 0
                            ? danhMuc.filter((h) => h.ho_tro).slice(0, 14).map((h) => h.ten_ham)
                            : HAM_365_NOI_BAT
                        ).map((ham) => (
                            <li
                                key={ham}
                                className="rounded-md bg-sunken px-2 py-1 font-mono text-xs font-medium text-fg-muted ring-1 ring-line"
                            >
                                {ham}
                            </li>
                        ))}
                        <li className="rounded-md px-2 py-1 text-xs text-fg-subtle">và hơn 400 hàm khác</li>
                    </ul>

                    <button
                        type="button"
                        onClick={() => signIn('google', { callbackUrl: '/thuc-hanh' })}
                        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-e2 transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-e3"
                    >
                        <LogIn className="h-4 w-4" aria-hidden="true" /> Đăng nhập với Google để bắt đầu
                    </button>
                </div>
            </div>
        );
    }

    return <BangTinh danhMuc={danhMuc} laAdmin={laAdmin} />;
}
