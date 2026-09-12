'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { LogIn } from 'lucide-react';

// Univer đụng `window` ngay lúc khởi tạo và vẽ bằng canvas -> KHÔNG render ở server.
const BangTinh = dynamic(() => import('./BangTinh'), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
            Đang tải bảng tính…
        </div>
    ),
});

// Dưới ngưỡng này thì grid canvas gần như không dùng được bằng ngón tay.
const NGUONG_MAN_HINH = 768;

export default function BangTinhLoader() {
    const { status } = useSession();
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
                    <p className="text-lg font-semibold">Hãy mở trên máy tính</p>
                    <p className="mt-2 text-sm text-gray-600">
                        Bảng tính cần chuột và bàn phím để thao tác. Trên điện thoại
                        thì gần như không dùng được, nên trang này chỉ chạy ở màn hình
                        từ {NGUONG_MAN_HINH}px trở lên.
                    </p>
                </div>
            </div>
        );
    }

    // Chưa đăng nhập: che bảng tính, mời đăng nhập (không tải bundle Univer).
    if (status !== 'authenticated') {
        return (
            <div className="flex h-full w-full items-center justify-center p-8">
                <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <p className="text-lg font-semibold text-gray-900">Đăng nhập để dùng bảng tính</p>
                    <p className="mt-2 text-sm text-gray-600">
                        Tính năng thực hành Excel yêu cầu đăng nhập. Đăng nhập nhanh bằng
                        tài khoản Google để bắt đầu luyện tập.
                    </p>
                    <button
                        type="button"
                        onClick={() => signIn('google', { callbackUrl: '/thuc-hanh' })}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                    >
                        <LogIn className="h-4 w-4" /> Đăng nhập với Google
                    </button>
                </div>
            </div>
        );
    }

    return <BangTinh />;
}
