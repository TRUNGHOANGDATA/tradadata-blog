import Link from 'next/link';
import { ChevronRight, LayoutGrid } from 'lucide-react';
import type { Category } from '@/types';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface TaxonomyHeroProps {
    /** Emoji/icon cua danh muc; bo trong o trang danh sach tong. */
    icon?: string | null;
    title: string;
    description?: string | null;
    /** Mau nhan dien danh muc — nhuom nhe nen hero + chip active. */
    accentColor?: string | null;
    breadcrumb: BreadcrumbItem[];
    /** Chip cuon ngang cac danh muc anh em; bo trong thi khong hien hang chip. */
    categories?: Category[];
    categoryCounts?: Record<string, number>;
    /** Slug danh muc dang xem — de to dam chip tuong ung. */
    activeSlug?: string;
    /** Vung thong ke ben phai tieu de (vd: "188 bài viết"). */
    stat?: React.ReactNode;
}

/**
 * Hero dung chung cho cac trang taxonomy (/categories, /category/[slug]).
 *
 * Thay cho khoi hero canh giua `py-20` cu — von de lai mot dai trang menh mong.
 * Bo cuc o day nen chat: breadcrumb -> icon + tieu de + thong ke tren mot hang
 * -> mo ta -> hang chip dieu huong sang danh muc khac (lap dung cho trong bang
 * dieu huong thay vi khoang trong).
 *
 * Nhuom nen bang mau rieng cua danh muc (`accentColor`) qua inline style de van
 * doi dung theo sang/toi: nen goc dung token `bg-page`, gradient chi la lop mau
 * mong phu len, phan trong suot van lo mau token ben duoi.
 */
export function TaxonomyHero({
    icon,
    title,
    description,
    accentColor,
    breadcrumb,
    categories = [],
    categoryCounts = {},
    activeSlug,
    stat,
}: TaxonomyHeroProps) {
    const accent = accentColor || '#16a34a';

    return (
        <section
            className="relative border-b border-line bg-page"
            style={{
                backgroundImage: `radial-gradient(60rem 20rem at 15% -10%, ${accent}1f, transparent 70%)`,
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6 md:pt-10 md:pb-8">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="mb-5">
                    <ol className="flex flex-wrap items-center gap-1 text-sm text-fg-subtle">
                        {breadcrumb.map((item, i) => (
                            <li key={i} className="flex items-center gap-1">
                                {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-fg-faint" />}
                                {item.href ? (
                                    <Link href={item.href} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span className="text-fg-muted font-medium">{item.label}</span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>

                {/* Tieu de + icon + thong ke */}
                <div className="flex items-start gap-4">
                    {icon && (
                        <span
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-e1 ring-1 ring-line"
                            style={{ backgroundColor: `${accent}1a` }}
                        >
                            {icon}
                        </span>
                    )}
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-fg">{title}</h1>
                            {stat && (
                                <span className="inline-flex items-center rounded-full bg-card border border-line px-3 py-1 text-sm font-medium text-fg-muted shadow-e1">
                                    {stat}
                                </span>
                            )}
                        </div>
                        {description && (
                            <p className="mt-2 text-fg-muted text-base md:text-lg max-w-2xl">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Hang chip dieu huong danh muc */}
                {categories.length > 0 && (
                    <div className="mt-6 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <Link
                            href="/categories"
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${!activeSlug
                                ? 'bg-brand-600 border-brand-600 text-white'
                                : 'bg-card border-line text-fg-muted hover:text-fg hover:border-line-strong'
                                }`}
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                            Tất cả
                        </Link>
                        {categories.map((cat) => {
                            const isActive = cat.slug === activeSlug;
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/category/${cat.slug}`}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${isActive
                                        ? 'text-white'
                                        : 'bg-card border-line text-fg-muted hover:text-fg hover:border-line-strong'
                                        }`}
                                    style={isActive ? { backgroundColor: cat.color || '#16a34a', borderColor: cat.color || '#16a34a' } : undefined}
                                >
                                    <span className="text-base leading-none">{cat.icon}</span>
                                    {cat.name}
                                    <span className={isActive ? 'text-white/80' : 'text-fg-faint'}>
                                        {categoryCounts[cat.id] || 0}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
