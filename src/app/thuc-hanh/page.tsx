import type { Metadata } from 'next';
import BangTinhLoader from '@/components/excel/BangTinhLoader';

// Trang tĩnh: không đọc searchParams, không gọi auth(), không truy vấn DB.
// ĐỪNG thêm loading.tsx cho segment này — xem CLAUDE.md, nó gây soft 404.
export const metadata: Metadata = {
    title: 'Thực hành Excel online — không cần cài Excel',
    description:
        'Bảng tính chạy thẳng trong trình duyệt để luyện công thức Excel. Không cần tài khoản Microsoft, không cần cài đặt.',
};

export default function TrangThucHanh() {
    return (
        // Chiếm hết bề rộng để thanh công cụ đủ chỗ bày nhóm định dạng ô,
        // không bị dồn vào menu tràn. Cao = viewport trừ header (~4rem).
        <div className="flex h-[calc(100vh-4rem)] flex-col">
            <div className="border-b bg-white px-4 py-1.5 text-center text-xs text-gray-500">
                Môi trường luyện tập chạy trong trình duyệt. Giao diện tiếng Anh như Excel;
                một vài hàm mới của Microsoft 365 có thể chưa có. Mỗi người một phiên riêng —
                nhớ bấm <span className="font-medium">Tải về máy</span> nếu muốn giữ bài.
            </div>
            <div className="min-h-0 flex-1">
                <BangTinhLoader />
            </div>
        </div>
    );
}
