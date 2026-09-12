import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { SITE_CONFIG, DEFAULT_CATEGORIES } from '@/lib/constants';
import { LogoThuongHieu } from '@/components/layout/LogoThuongHieu';
import { getBrandAssets } from '@/lib/data/settings';
import { coLogoRiengChoNenToi, duongDanAnh } from '@/lib/brand';
import { anToan, kiemLoiTruyVan } from '@/lib/data/an-toan';
import { unstable_cache } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * BẮT BUỘC giữ trong `unstable_cache`.
 *
 * Footer nằm trong layout gốc. Layout mà `await` một truy vấn không cache thì
 * React không render nổi shell, nên server không gửi được byte nào cho tới khi
 * truy vấn xong — mọi trang render động đều trả giá, và `loading.tsx` cũng
 * không có cơ hội hiện ra (đo được: TTFB /blog là 1343ms).
 *
 * Tag 'settings' — `revalidateSettings()` trong src/lib/cache.ts xoá ngay khi
 * admin lưu cài đặt.
 */
const LIEN_HE_MAC_DINH = { email: 'trunghoangdata101091@gmail.com', phone: '' };

// Bản cũ bọc try/catch BÊN TRONG cache và trả mặc định — tức cache luôn cái mặc
// định 10 phút mỗi khi DB nghẹn. Giờ lỗi ném ra, `anToan` bên ngoài trả mặc định
// KHÔNG cache. Xem src/lib/data/an-toan.ts.
const getFooterSettings = anToan(unstable_cache(
    async () => {
        if (!supabaseAdmin) return LIEN_HE_MAC_DINH;
        const { data, error } = await supabaseAdmin
            .from('site_settings')
            .select('key, value')
            .eq('key', 'social_links')
            .single();
        if (kiemLoiTruyVan(error, 'footer.social_links', { boQuaKhongCoDong: true })) return LIEN_HE_MAC_DINH;
        const links = data?.value as { email?: string; phone?: string } | null;
        return {
            email: links?.email || LIEN_HE_MAC_DINH.email,
            phone: links?.phone || '',
        };
    },
    ['footer-settings-v1'],
    { revalidate: 600, tags: ['settings'] }
), LIEN_HE_MAC_DINH);

export async function Footer() {
    // Ca hai deu di qua `unstable_cache` tag 'settings' — bat buoc, vi Footer
    // nam trong layout goc.
    const [settings, brand] = await Promise.all([getFooterSettings(), getBrandAssets()]);

    return (
        <footer className="bg-sunken text-fg-muted border-t border-line mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
                            {/* Lien ket nay KHONG co chu nao ben trong, nen alt bat buoc
                                phai co noi dung — de trong la lien ket khong co ten. */}
                            <LogoThuongHieu
                                src={duongDanAnh('logo', brand)}
                                srcToi={coLogoRiengChoNenToi(brand) ? duongDanAnh('logo-toi', brand) : undefined}
                                canh={48}
                                alt={`${SITE_CONFIG.name} — trang chủ`}
                                className="h-12 w-12 transition-transform group-hover:scale-105 shadow-sm"
                            />
                        </Link>
                        <p className="text-sm leading-relaxed">
                            {SITE_CONFIG.description}. Nơi chia sẻ kiến thức thực tế, bài viết chất lượng cho cộng đồng.
                        </p>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-fg font-semibold mb-4">Chủ đề</h3>
                        <ul className="space-y-2">
                            {DEFAULT_CATEGORIES.slice(0, 6).map((cat) => (
                                <li key={cat.slug}>
                                    <Link
                                        href={`/category/${cat.slug}`}
                                        className="text-sm py-1.5 hover:text-fg transition-colors flex items-center gap-2"
                                    >
                                        <span>{cat.icon}</span>
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-fg font-semibold mb-4">Liên kết</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/blog" className="text-sm py-1.5 hover:text-fg transition-colors">
                                    Tất cả bài viết
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-sm py-1.5 hover:text-fg transition-colors">
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link href="/courses" className="text-sm py-1.5 hover:text-fg transition-colors flex items-center gap-1">
                                    Khóa học
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-sm py-1.5 hover:text-fg transition-colors">
                                    Điều khoản sử dụng
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-sm py-1.5 hover:text-fg transition-colors">
                                    Chính sách bảo mật
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-fg font-semibold mb-4">Liên hệ</h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href={`mailto:${settings.email}`}
                                    className="text-sm py-1.5 hover:text-fg transition-colors flex items-center gap-2"
                                >
                                    <Mail className="h-4 w-4" />
                                    {settings.email}
                                </a>
                            </li>
                            {settings.phone && (
                                <li>
                                    <a
                                        href={`tel:${settings.phone}`}
                                        className="text-sm py-1.5 hover:text-fg transition-colors flex items-center gap-2"
                                    >
                                        <Phone className="h-4 w-4" />
                                        {settings.phone}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-line-strong flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm">
                        © {new Date().getFullYear()} {SITE_CONFIG.author}. All rights reserved.
                    </p>
                    <p className="text-xs text-fg-subtle">
                        Built with Next.js, TailwindCSS & Supabase
                    </p>
                </div>
            </div>
        </footer>
    );
}
