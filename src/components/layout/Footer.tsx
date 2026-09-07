import Link from 'next/link';
import { Mail, ExternalLink, Phone } from 'lucide-react';
import { SITE_CONFIG, DEFAULT_CATEGORIES } from '@/lib/constants';
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
const getFooterSettings = unstable_cache(
    async () => {
        if (!supabaseAdmin) return { email: 'trunghoangdata101091@gmail.com', phone: '' };
        try {
            const { data } = await supabaseAdmin
                .from('site_settings')
                .select('key, value')
                .eq('key', 'social_links')
                .single();
            const links = data?.value as any;
            return {
                email: links?.email || 'trunghoangdata101091@gmail.com',
                phone: links?.phone || '',
            };
        } catch {
            return { email: 'trunghoangdata101091@gmail.com', phone: '' };
        }
    },
    ['footer-settings-v1'],
    { revalidate: 600, tags: ['settings'] }
);

export async function Footer() {
    const settings = await getFooterSettings();

    return (
        <footer className="bg-surface-900 dark:bg-surface-950 text-fg-faint mt-20">
            {/* Wave Separator */}
            <div className="relative -mt-px">
                <svg
                    viewBox="0 0 1440 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-12 text-surface-900 dark:text-surface-950"
                >
                    <path
                        d="M0 48h1440V16c-120 10-240 16-360 16S840 22 720 12 480 0 360 0 120 6 0 16v32z"
                        fill="currentColor"
                    />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
                            <img src="/LOGO_TRA_DA_DATA.jpg" alt={SITE_CONFIG.name} className="h-12 w-12 object-cover transition-transform group-hover:scale-105 rounded-full shadow-sm" />
                        </Link>
                        <p className="text-sm leading-relaxed">
                            {SITE_CONFIG.description}. Nơi chia sẻ kiến thức thực tế, bài viết chất lượng cho cộng đồng.
                        </p>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Chủ đề</h3>
                        <ul className="space-y-2">
                            {DEFAULT_CATEGORIES.slice(0, 6).map((cat) => (
                                <li key={cat.slug}>
                                    <Link
                                        href={`/category/${cat.slug}`}
                                        className="text-sm py-1.5 hover:text-white transition-colors flex items-center gap-2"
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
                        <h3 className="text-white font-semibold mb-4">Liên kết</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/blog" className="text-sm py-1.5 hover:text-white transition-colors">
                                    Tất cả bài viết
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-sm py-1.5 hover:text-white transition-colors">
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link href="/courses" className="text-sm py-1.5 hover:text-white transition-colors flex items-center gap-1">
                                    Khóa học
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-sm py-1.5 hover:text-white transition-colors">
                                    Điều khoản sử dụng
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-sm py-1.5 hover:text-white transition-colors">
                                    Chính sách bảo mật
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href={`mailto:${settings.email}`}
                                    className="text-sm py-1.5 hover:text-white transition-colors flex items-center gap-2"
                                >
                                    <Mail className="h-4 w-4" />
                                    {settings.email}
                                </a>
                            </li>
                            {settings.phone && (
                                <li>
                                    <a
                                        href={`tel:${settings.phone}`}
                                        className="text-sm py-1.5 hover:text-white transition-colors flex items-center gap-2"
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
                <div className="mt-12 pt-6 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
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
