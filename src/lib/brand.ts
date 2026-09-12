/**
 * Hằng số nhận diện thương hiệu — logo, banner, ảnh chia sẻ mạng xã hội.
 *
 * File này KHÔNG import gì từ server (không Supabase, không sharp) để cả
 * Client Component trong `/admin/settings` lẫn route API đều dùng chung được
 * MỘT nguồn số đo. Trước đây kích thước chuẩn chỉ nằm trong đầu người sửa
 * code; ghi ở đây thì text hướng dẫn trong admin và logic nén ảnh không bao
 * giờ lệch nhau.
 *
 * Kích thước lấy từ đo đạc thật, không phải ước lượng:
 *   - logo hiện ở 44px (header) / 48px (footer) -> 512px đủ cho cả màn 3x
 *   - banner gốc là 16:9 (1672x941), KHÔNG phải 1.91:1 -> khung hero phải
 *     theo 16:9, và ảnh OG được CẮT GIỮA ra 1.91:1 chứ không bóp méo
 *   - ảnh OG 1200x630 là chuẩn Facebook/Zalo cho thẻ lớn. Ảnh VUÔNG làm
 *     Facebook hiện thumbnail bé thay vì thẻ lớn — đúng lỗi của
 *     `og-default.png` 640x640 cũ.
 */

export type LoaiAnhThuongHieu = 'logo' | 'logo-toi' | 'banner' | 'og';

export type ChuanAnhThuongHieu = {
    nhan: string;
    /** Câu mô tả ngắn hiện dưới ô trong admin. */
    moTa: string;
    rong: number;
    cao: number;
    /** Định dạng khuyến nghị, chỉ để hiển thị. */
    dinhDang: string;
    /** Ngưỡng cảnh báo dung lượng (KB) — cảnh báo, không chặn. */
    kbToiDa: number;
    /** Tự sinh được từ ảnh khác nên không bắt buộc upload. */
    tuyChon: boolean;
    /** File tĩnh dùng khi chưa cấu hình gì. */
    macDinh: string;
};

export const CHUAN_ANH: Record<LoaiAnhThuongHieu, ChuanAnhThuongHieu> = {
    logo: {
        nhan: 'Logo',
        moTa: 'Hiện ở header (44px) và footer (48px), luôn được bo tròn.',
        rong: 512,
        cao: 512,
        dinhDang: 'PNG hoặc JPG, vuông 1:1',
        kbToiDa: 150,
        tuyChon: false,
        macDinh: '/LOGO_TRA_DA_DATA.jpg',
    },
    'logo-toi': {
        nhan: 'Logo cho nền tối',
        moTa: 'Chỉ cần khi logo chính chìm ở chế độ tối. Bỏ trống thì dùng logo chính.',
        rong: 512,
        cao: 512,
        dinhDang: 'PNG nền trong suốt, vuông 1:1',
        kbToiDa: 150,
        tuyChon: true,
        macDinh: '/LOGO_TRA_DA_DATA.jpg',
    },
    banner: {
        nhan: 'Banner trang chủ',
        moTa: 'Hiện ở đầu trang chủ trên màn hình từ 768px trở lên, và ở đầu email gửi khách.',
        rong: 1600,
        cao: 900,
        dinhDang: 'PNG hoặc JPG, tỉ lệ 16:9',
        kbToiDa: 400,
        tuyChon: false,
        macDinh: '/images/banner-default.jpg',
    },
    og: {
        nhan: 'Ảnh chia sẻ mạng xã hội',
        moTa: 'Tự cắt từ banner khi bạn tải banner lên. Chỉ tải riêng nếu muốn ảnh chia sẻ khác banner.',
        rong: 1200,
        cao: 630,
        dinhDang: 'PNG hoặc JPG, tỉ lệ 1.91:1',
        kbToiDa: 300,
        tuyChon: true,
        macDinh: '/images/og-default.jpg',
    },
};

/** Thứ tự hiện các ô trong tab "Thương hiệu" của trang cài đặt. */
export const THU_TU_O_ANH: LoaiAnhThuongHieu[] = ['logo', 'banner', 'logo-toi', 'og'];

/** Hình dạng object lưu ở `site_settings.brand_assets`. */
export type BrandAssets = {
    logo_url?: string | null;
    logo_dark_url?: string | null;
    banner_url?: string | null;
    og_image_url?: string | null;
};

export const BRAND_ASSETS_KEY = 'brand_assets';

/** Tên khoá trong `brand_assets` ứng với từng ô. */
export const KHOA_THEO_LOAI: Record<LoaiAnhThuongHieu, keyof BrandAssets> = {
    logo: 'logo_url',
    'logo-toi': 'logo_dark_url',
    banner: 'banner_url',
    og: 'og_image_url',
};

/**
 * URL thật của một tài sản, kèm chuỗi rơi lui.
 *
 * `logo-toi` rơi về logo chính, `og` rơi về file tĩnh (bản tự sinh từ banner
 * đã được ghi thẳng vào `og_image_url` lúc upload nên không cần suy ra ở đây).
 */
export function layUrlAnh(assets: BrandAssets | null | undefined, loai: LoaiAnhThuongHieu): string {
    const truc = assets?.[KHOA_THEO_LOAI[loai]];
    if (truc) return truc;
    if (loai === 'logo-toi' && assets?.logo_url) return assets.logo_url;
    return CHUAN_ANH[loai].macDinh;
}

/**
 * Đường dẫn dùng để HIỂN THỊ một tài sản thương hiệu.
 *
 * Luôn trỏ vào `/api/brand/...` chứ không trỏ thẳng URL Google Drive, vì hai lý do:
 *
 * 1. `next/image` chỉ nhận host đã khai trong `next.config.ts` →
 *    `images.remotePatterns`. Admin dán một URL ngoài danh sách đó là ảnh NÉM LỖI
 *    lúc render, mà logo nằm trong layout gốc nên hỏng cả site. Đường dẫn nội bộ
 *    thì không bao giờ vướng luật đó.
 * 2. Một nguồn duy nhất cho cả trang web, thẻ chia sẻ và email.
 *
 * `?v=` là bắt buộc: Next cache ảnh đã tối ưu theo URL với sàn `minimumCacheTTL`
 * đang đặt 30 ngày. URL cố định mà đổi ảnh bên dưới thì người đọc vẫn thấy logo cũ
 * suốt 30 ngày. Đổi ảnh ⇒ đổi `v` ⇒ Next coi là ảnh khác.
 */
export function duongDanAnh(loai: LoaiAnhThuongHieu, assets: BrandAssets | null | undefined): string {
    return `/api/brand/${loai}?v=${bamNgan(layUrlAnh(assets, loai))}`;
}

/**
 * Có thật sự cấu hình một logo RIÊNG cho nền tối hay không.
 *
 * Phải so sánh ảnh GỐC, không so sánh đường dẫn `/api/brand/...`: hai đường dẫn
 * đó luôn khác nhau (khác `loai`) nên so ở đó thì lúc nào cũng ra "có riêng",
 * và mọi trang render thừa một thẻ ảnh cùng một lượt tải.
 */
export function coLogoRiengChoNenToi(assets: BrandAssets | null | undefined): boolean {
    return Boolean(assets?.logo_dark_url) && assets?.logo_dark_url !== assets?.logo_url;
}

/** Băm djb2 rút gọn — chỉ để phân biệt phiên bản ảnh, không phải mục đích bảo mật. */
function bamNgan(chuoi: string): string {
    let h = 5381;
    for (let i = 0; i < chuoi.length; i++) h = ((h << 5) + h + chuoi.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
}
