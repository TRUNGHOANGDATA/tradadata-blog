'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

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
    // `null` = chưa đo xong. Phải đo ở client vì server không biết bề rộng màn hình.
    const [duManHinh, setDuManHinh] = useState<boolean | null>(null);

    useEffect(() => {
        const mq = window.matchMedia(`(min-width: ${NGUONG_MAN_HINH}px)`);
        const capNhat = () => setDuManHinh(mq.matches);
        capNhat();
        mq.addEventListener('change', capNhat);
        return () => mq.removeEventListener('change', capNhat);
    }, []);

    if (duManHinh === null) {
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

    return <BangTinh />;
}
