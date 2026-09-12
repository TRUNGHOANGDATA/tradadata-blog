import { unstable_cache } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/server';
import { BRAND_ASSETS_KEY, type BrandAssets } from '@/lib/brand';
import { anToan, kiemLoiTruyVan } from '@/lib/data/an-toan';

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
        // Thiếu dòng cấu hình là chuyện bình thường -> null để nơi gọi dùng mặc định.
        // Lỗi hệ thống -> ném, để không cache `null` giả 10 phút.
        if (kiemLoiTruyVan(error, 'settings.getSetting', { boQuaKhongCoDong: true })) return null;
        return data?.value ?? null;
    },
    ['site-setting-v1'],
    { revalidate: 600, tags: ['settings'] }
);

const getSettingAnToan = anToan(getSettingCached, null);

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
    const value = await getSettingAnToan(key);
    return (value === null || value === undefined ? fallback : value) as T;
}

/**
 * Ảnh nhận diện thương hiệu (logo / banner / ảnh chia sẻ), CÓ CACHE.
 *
 * Dùng chung tag 'settings' với `getSetting` nên `revalidateSettings()` xoá
 * cả hai — admin lưu ảnh mới là hiện ngay, không phải deploy, không phải chờ
 * hết 10 phút.
 *
 * Header và Footer nằm trong layout gốc nên hàm này BẮT BUỘC phải cache:
 * layout mà `await` một truy vấn không cache thì React không render nổi shell
 * và mọi trang động đều trả giá TTFB.
 */
const getBrandAssetsCached = unstable_cache(
    async (): Promise<BrandAssets> => {
        if (!supabaseAdmin) return {};
        const { data, error } = await supabaseAdmin
            .from('site_settings')
            .select('value')
            .eq('key', BRAND_ASSETS_KEY)
            .single();
        if (kiemLoiTruyVan(error, 'settings.getBrandAssets', { boQuaKhongCoDong: true })) return {};
        return (data?.value as BrandAssets | null) ?? {};
    },
    ['brand-assets-v1'],
    { revalidate: 600, tags: ['settings'] }
);

// Nằm trong layout gốc (Header/Footer) -> phải có dự phòng; rỗng = dùng ảnh tĩnh.
export const getBrandAssets = anToan(getBrandAssetsCached, {} as BrandAssets);
