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
        // Chiếm hết bề rộng để ribbon đủ chỗ bày nhóm định dạng ô, không bị dồn
        // vào menu tràn. Cao = viewport trừ header (~4rem).
        //
        // Dòng nhắn xám trước đây nằm ở đây đã chuyển vào nút "?" trên thanh công
        // cụ của bảng tính: nó chiếm nguyên một thanh cho ba câu ai cũng chỉ đọc
        // một lần, và là thanh thứ 5 xếp chồng trước khi tới ô tính.
        <div className="flex h-[calc(100vh-4rem)] flex-col bg-sunken">
            <div className="min-h-0 flex-1">
                <BangTinhLoader />
            </div>
        </div>
    );
}
