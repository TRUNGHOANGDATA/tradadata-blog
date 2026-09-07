import { unstable_cache } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * Đọc một dòng cấu hình trong bảng `site_settings`, CÓ CACHE.
 *
 * Trước đây mỗi trang cần cấu hình lại tự viết một truy vấn `site_settings`
 * thẳng trong page component — `/blog` đọc `posts_per_page`, trang thanh toán
 * đọc `bank_info` và `social_links`, footer đọc `social_links`. Không chỗ nào
 * cache, nên mỗi lượt xem là thêm một vòng gọi Supabase cho một giá trị gần như
 * không bao giờ đổi.
 *
 * Tag 'settings' — `revalidateSettings()` trong src/lib/cache.ts xoá ngay khi
 * admin lưu cài đặt, nên không phải chờ hết 10 phút.
 *
 * ĐỪNG dùng hàm này cho dữ liệu theo người dùng hoặc theo đơn hàng: cache dùng
 * chung cho mọi khách nên sẽ rò dữ liệu của người này sang người khác.
 */
const getSettingCached = unstable_cache(
    async (key: string): Promise<unknown> => {
        if (!supabaseAdmin) return null;
        const { data, error } = await supabaseAdmin
            .from('site_settings')
            .select('value')
            .eq('key', key)
            .single();
        if (error) {
            // Thiếu dòng cấu hình là chuyện bình thường -> để nơi gọi dùng giá trị mặc định
            return null;
        }
        return data?.value ?? null;
    },
    ['site-setting-v1'],
    { revalidate: 600, tags: ['settings'] }
);

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
    const value = await getSettingCached(key);
    return (value === null || value === undefined ? fallback : value) as T;
}
