import { NextResponse } from 'next/server';
import { getDanhMucHam, getViDuHam } from '@/lib/data/vi-du-ham';

/**
 * Công khai, chỉ đọc, đi qua tầng data có cache.
 *
 *   GET /api/vi-du-ham            -> danh mục (không snapshot)
 *   GET /api/vi-du-ham?ten=XLOOKUP -> một ví dụ kèm snapshot để nạp vào Univer
 *
 * Snapshot chỉ là dữ liệu mẫu do admin soạn — không có gì riêng tư nên không
 * cần đăng nhập để đọc. Việc DÙNG bảng tính mới bắt đăng nhập (ở BangTinhLoader).
 */
export async function GET(request: Request) {
    const ten = new URL(request.url).searchParams.get('ten');

    if (ten) {
        const viDu = await getViDuHam(ten);
        if (!viDu) return NextResponse.json({ error: 'Không có ví dụ cho hàm này' }, { status: 404 });
        return NextResponse.json({ item: viDu }, {
            headers: { 'Cache-Control': 'public, max-age=60, s-maxage=600, stale-while-revalidate=3600' },
        });
    }

    const danhMuc = await getDanhMucHam();
    return NextResponse.json({ items: danhMuc }, {
        headers: { 'Cache-Control': 'public, max-age=60, s-maxage=600, stale-while-revalidate=3600' },
    });
}
