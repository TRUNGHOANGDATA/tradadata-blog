import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { BRAND_ASSETS_KEY } from '@/lib/brand';

/**
 * Cấu hình site cho phía trình duyệt. KHÔNG kiểm quyền — ai cũng gọi được.
 *
 * ⚠️ Vì thế phải LỌC THEO DANH SÁCH TRẮNG. Trước đây route này `select('key, value')`
 * toàn bộ bảng `site_settings` rồi trả nguyên xi, nghĩa là bất kỳ ai mở
 * `/api/settings` cũng đọc được `google_sheet_id` (ID bảng tính log doanh thu) và
 * `bank_info`. Chỉ có hai nơi gọi nó — `FloatingActions` và `ContactBlock` — và cả
 * hai chỉ cần `social_links`.
 *
 * Thêm khoá mới vào đây CHỈ khi khoá đó vốn đã công khai trên trang.
 */
const KHOA_CONG_KHAI = [
    // Zalo / Facebook / SĐT / email — vốn hiện sẵn ở footer và nút liên hệ.
    'social_links',
    // Đường dẫn logo, banner — vốn hiện sẵn trên mọi trang.
    BRAND_ASSETS_KEY,
] as const;

export async function GET() {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json({ settings: {} });
        }

        const { data, error } = await supabaseAdmin
            .from('site_settings')
            .select('key, value')
            .in('key', KHOA_CONG_KHAI as unknown as string[]);
        if (error) throw error;

        const settings = data?.reduce((acc: Record<string, unknown>, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return NextResponse.json({ settings: settings || {} });
    } catch {
        return NextResponse.json({ settings: {} });
    }
}
