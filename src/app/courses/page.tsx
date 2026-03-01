import { supabaseAdmin } from '@/lib/supabase/server';
import { BookOpen, CheckCircle } from 'lucide-react';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata = {
    title: 'Khóa học | Trà Đá Data',
    description: 'Nâng cấp kỹ năng với các khóa học thực chiến từ Trà Đá Data. Hệ thống kiến thức Data, AI & Supply Chain.',
    openGraph: {
        title: 'Khóa học & Premium | Trà Đá Data',
        description: 'Hệ thống kiến thức được đóng gói chuẩn mực, giúp bạn làm chủ Data, AI và Supply Chain.',
        url: `${SITE_CONFIG.url}/courses`,
    },
};

interface Section {
    id: string;
    name: string;
    description: string | null;
    sort_order: number;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    duration_days: number | null;
    product_type: string;
    features: string[] | null;
    image_url: string | null;
    section_id: string | null;
    sort_order: number;
}

export default async function CoursesPage() {
    // Fetch active sections
    const { data: sections } = await supabaseAdmin
        .from('course_sections')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    // Fetch active products
    const { data: products } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('price', { ascending: true });

    // Group products by section
    const sectionGroups: { section: Section | null; products: Product[] }[] = [];

    // Products with a section
    (sections || []).forEach((section: Section) => {
        const sectionProducts = (products || []).filter((p: Product) => p.section_id === section.id);
        if (sectionProducts.length > 0) {
            sectionGroups.push({ section, products: sectionProducts });
        }
    });

    // Products without a section
    const unsectionedProducts = (products || []).filter((p: Product) => !p.section_id);
    if (unsectionedProducts.length > 0) {
        sectionGroups.push({ section: null, products: unsectionedProducts });
    }

    // JSON-LD structured data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Khóa học & Premium - Trà Đá Data',
        itemListElement: (products || []).map((p: Product, i: number) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.name,
                description: p.description,
                image: p.image_url,
                offers: {
                    '@type': 'Offer',
                    price: p.price,
                    priceCurrency: 'VND',
                    availability: 'https://schema.org/InStock',
                },
            },
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="min-h-screen bg-surface-50 dark:bg-surface-950 py-16 px-4 layout-pt">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-6">
                            Khóa học & <span className="text-brand-600 dark:text-brand-400">Premium</span>
                        </h1>
                        <p className="text-lg text-surface-600 dark:text-surface-400">
                            Hệ thống kiến thức được đóng gói chuẩn mực, giúp bạn làm chủ Data, AI và Supply Chain.
                        </p>
                    </div>

                    {/* Sections */}
                    {sectionGroups.map((group, groupIdx) => (
                        <div key={group.section?.id || 'unsectioned'} className={groupIdx > 0 ? 'mt-16' : ''}>
                            {/* Section Header */}
                            {group.section && (
                                <div className="mb-8">
                                    <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100 uppercase tracking-wide">
                                        {group.section.name}
                                    </h2>
                                    {group.section.description && (
                                        <p className="text-surface-500 dark:text-surface-400 mt-2 text-lg">
                                            {group.section.description}
                                        </p>
                                    )}
                                    <div className="mt-4 h-1 w-20 bg-brand-500 rounded-full" />
                                </div>
                            )}
                            {!group.section && sectionGroups.length > 1 && (
                                <div className="mb-8">
                                    <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100 uppercase tracking-wide">
                                        Khác
                                    </h2>
                                    <div className="mt-4 h-1 w-20 bg-surface-300 dark:bg-surface-700 rounded-full" />
                                </div>
                            )}

                            {/* Products Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {group.products.map((product: Product) => (
                                    <div
                                        key={product.id}
                                        className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 overflow-hidden shadow-xl shadow-surface-200/20 dark:shadow-none hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col group relative"
                                    >
                                        {product.slug === 'premium-blog' && (
                                            <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl z-10 shadow-md">
                                                ĐỀ XUẤT
                                            </div>
                                        )}

                                        <div className="relative aspect-video bg-surface-100 dark:bg-surface-800 overflow-hidden">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/20 to-transparent dark:from-brand-500/10"></div>
                                                    <BookOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-surface-200 dark:text-surface-700/50 group-hover:scale-110 transition-transform duration-500" />
                                                </>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                                                <h3 className="text-2xl font-bold text-white mb-1 leading-tight drop-shadow-lg">
                                                    {product.name}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-1">
                                            <p className="text-surface-600 dark:text-surface-300 mb-6 line-clamp-2 text-sm">
                                                {product.description}
                                            </p>

                                            <div className="flex-1 space-y-3 mb-8">
                                                {(product.features || []).map((feature: string, idx: number) => (
                                                    <div key={idx} className="flex items-start gap-2.5">
                                                        <div className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                                                            <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                                        </div>
                                                        <span className="text-sm text-surface-700 dark:text-surface-300">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="pt-6 border-t border-surface-100 dark:border-surface-800 mt-auto">
                                                <div className="flex items-end gap-2 mb-4">
                                                    <p className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                    </p>
                                                    <p className="text-sm font-medium text-surface-500 mb-1">
                                                        {product.duration_days ? `/ ${product.duration_days} ngày` : '/ Vĩnh viễn'}
                                                    </p>
                                                </div>
                                                <AddToCartButton
                                                    productId={product.id}
                                                    productName={product.name}
                                                    productPrice={product.price}
                                                    productImage={product.image_url}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {(!products || products.length === 0) && (
                        <div className="col-span-full py-20 text-center">
                            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 mb-4">
                                <BookOpen className="w-8 h-8 text-surface-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">Đang cập nhật khóa học</h3>
                            <p className="text-surface-500">Vui lòng quay lại sau nhé!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
