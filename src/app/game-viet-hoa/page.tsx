import type { Metadata } from 'next';
import { Gamepad2 } from 'lucide-react';
import { getDanhSachGame } from '@/lib/data/game-viet-hoa';
import { DanhSachGame } from '@/components/game/DanhSachGame';
import { CHU_PHU } from '@/components/game/kieu';

// Trang tĩnh: không đọc searchParams, không gọi auth(). Lọc/tìm chạy ở client
// trên danh sách đã nạp. Cache xoá bằng revalidateGameVietHoa() khi admin sửa.
export const metadata: Metadata = {
    title: 'Game Việt hoá — bản dịch tiếng Việt cho game hay',
    description: 'Tải patch Việt hoá cho các tựa game hay, cài vào game bản quyền của bạn. Kèm hướng dẫn cài đặt chi tiết.',
    alternates: { canonical: '/game-viet-hoa' },
};

export const revalidate = 3600;

export default async function TrangGameVietHoa() {
    const games = await getDanhSachGame();
    return (
        <DanhSachGame games={games}>
            <h1 className="flex items-center gap-3 text-2xl font-bold sm:text-3xl">
                <Gamepad2 className="h-8 w-8 text-[#60a5fa]" aria-hidden="true" /> Game Việt hoá
            </h1>
            <p className={`mt-1.5 ${CHU_PHU}`}>Bản dịch tiếng Việt cho game hay. Tải patch, cài vào game bản quyền của bạn.</p>
        </DanhSachGame>
    );
}
