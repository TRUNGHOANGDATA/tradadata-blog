import type { Metadata } from 'next';
import BangTinhLoader from '@/components/excel/BangTinhLoader';
import { getDanhMucHam } from '@/lib/data/vi-du-ham';

// Trang tĩnh: không đọc searchParams, không gọi auth(). Truy vấn DUY NHẤT là
// danh mục hàm, đi qua `unstable_cache` (tag 'vi-du-ham') nên không phá tính
// tĩnh; `revalidateViDuHam()` xoá cache khi admin sửa.
// ĐỪNG thêm loading.tsx cho segment này — xem CLAUDE.md, nó gây soft 404.
// Chọn hàm từ bài viết đi bằng hash (#ham=XLOOKUP), KHÔNG dùng searchParams.
export const metadata: Metadata = {
    title: 'Thực hành Excel online — thử hàm Excel 365 không cần cài Excel',
    description:
        'Thử XLOOKUP, FILTER, LAMBDA, TEXTSPLIT… ngay trên trình duyệt với ví dụ nạp sẵn. Không cần tài khoản Microsoft, không cần cài đặt.',
};

export const revalidate = 3600;

export default async function TrangThucHanh() {
    const danhMuc = await getDanhMucHam();
    return (
        // Chiếm hết bề rộng để ribbon đủ chỗ bày nhóm định dạng ô, không bị dồn
        // vào menu tràn. Cao = viewport trừ header (~4rem).
        //
        // Dòng nhắn xám trước đây nằm ở đây đã chuyển vào nút "?" trên thanh công
        // cụ của bảng tính: nó chiếm nguyên một thanh cho ba câu ai cũng chỉ đọc
        // một lần, và là thanh thứ 5 xếp chồng trước khi tới ô tính.
        <div className="flex h-[calc(100vh-4rem)] flex-col bg-sunken">
            <div className="min-h-0 flex-1">
                <BangTinhLoader danhMuc={danhMuc} />
            </div>
        </div>
    );
}
