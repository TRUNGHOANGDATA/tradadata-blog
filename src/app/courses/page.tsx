import { supabaseAdmin } from '@/lib/supabase/server';
import Image from 'next/image';
import { BookOpen, CheckCircle, ShoppingCart, FileText, Landmark, KeyRound } from 'lucide-react';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata = {
    // KHÔNG viết "| Trà Đá Data" ở đây: layout gốc đã có
    // `template: '%s | Trà Đá Data'` nên viết thêm là ra "| Trà Đá Data | Trà Đá Data".
    title: 'Khóa học & Premium',
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

const formatPrice = (v: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

/**
 * Lưới phải tự co theo SỐ sản phẩm thực có.
 * Trước đây luôn cố định `lg:grid-cols-3`, nên khi chỉ bán 1 gói (tình trạng
 * hiện tại) thì có đúng một thẻ nằm lệch sang trái trong khung rộng 1280px,
 * trông như trang bị lỗi. Đừng đổi lại thành cột cố định.
 */
function gridClass(count: number) {
    if (count === 1) return 'grid-cols-1 max-w-md mx-auto';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
}

const BUOC_MUA = [
    { icon: ShoppingCart, title: 'Chọn gói', desc: 'Thêm gói bạn cần vào giỏ hàng.' },
    { icon: FileText, title: 'Điền thông tin', desc: 'Nhận mã đơn và số tài khoản qua email.' },
    { icon: Landmark, title: 'Chuyển khoản', desc: 'Chuyển đúng số tiền, ghi mã đơn ở nội dung.' },
    { icon: KeyRound, title: 'Mở khoá', desc: 'Đối chiếu xong là tài khoản được kích hoạt.' },
];

export default async function CoursesPage() {
    const { data: sections } = await supabaseAdmin
        .from('course_sections')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    const { data: products } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('price', { ascending: true });

    const sectionGroups: { section: Section | null; products: Product[] }[] = [];

    (sections || []).forEach((section: Section) => {
        const sectionProducts = (products || []).filter((p: Product) => p.section_id === section.id);
        if (sectionProducts.length > 0) {
            sectionGroups.push({ section, products: sectionProducts });
        }
    });

    const unsectionedProducts = (products || []).filter((p: Product) => !p.section_id);
    if (unsectionedProducts.length > 0) {
        sectionGroups.push({ section: null, products: unsectionedProducts });
    }

    const coSanPham = !!products && products.length > 0;

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

            <div className="min-h-screen bg-page py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <h1 className="text-4xl md:text-5xl text-fg mb-5">
                            Khóa học &amp; <span className="text-brand-600 dark:text-brand-400">Premium</span>
                        </h1>
                        <p className="text-lg text-fg-muted">
                            Hệ thống kiến thức được đóng gói chuẩn mực, giúp bạn làm chủ Data, AI và Supply Chain.
                        </p>
                    </div>

                    {sectionGroups.map((group, groupIdx) => (
                        <div key={group.section?.id || 'unsectioned'} className={groupIdx > 0 ? 'mt-16' : ''}>
                            {(group.section || sectionGroups.length > 1) && (
                                <div className="mb-8">
                                    <h2 className="text-2xl md:text-3xl text-fg">
                                        {group.section ? group.section.name : 'Khác'}
                                    </h2>
                                    {group.section?.description && (
                                        <p className="text-fg-muted mt-2 text-lg">{group.section.description}</p>
                                    )}
                                    <div className={`mt-4 h-1 w-20 rounded-full ${group.section ? 'bg-brand-500' : 'bg-line-strong'}`} />
                                </div>
                            )}

                            <div className={`grid gap-8 ${gridClass(group.products.length)}`}>
                                {group.products.map((product: Product) => (
                                    <div
                                        key={product.id}
                                        className="bg-card rounded-2xl border border-line overflow-hidden shadow-e1 hover:shadow-e3 hover:border-brand-300 dark:hover:border-brand-800 hover:-translate-y-1 transition-all duration-300 flex flex-col group relative"
                                    >
                                        {product.slug === 'premium-blog' && (
                                            <div className="absolute top-3 right-3 z-10 bg-brand-600 text-white text-2xs font-bold uppercase px-2.5 py-1 rounded-md shadow-e1">
                                                Đề xuất
                                            </div>
                                        )}

                                        {/* Ảnh chỉ là ảnh — KHÔNG chồng tiêu đề lên nữa. Trước đây tiêu đề
                                            đặt trên ảnh với lớp phủ đen mờ nên gặp ảnh sáng là không đọc được. */}
                                        <div className="relative aspect-[16/9] bg-sunken overflow-hidden">
                                            {product.image_url ? (
                                                <Image
                                                    src={product.image_url}
                                                    alt=""
                                                    fill
                                                    // Khung that: 3 cot trong max-w-7xl ~= 389px; khi chi
                                                    // ban 1 goi thi max-w-md = 448px. Lay 420px la du.
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/20 to-transparent dark:from-brand-500/10" />
                                                    <BookOpen
                                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-line-strong group-hover:scale-110 transition-transform duration-500"
                                                        aria-hidden="true"
                                                    />
                                                </>
                                            )}
                                        </div>

                                        <div className="p-6 flex flex-col flex-1">
                                            <h3 className="text-xl text-fg mb-2">{product.name}</h3>

                                            {product.description && (
                                                <p className="text-sm text-fg-muted mb-6">{product.description}</p>
                                            )}

                                            {!!product.features?.length && (
                                                <ul className="flex-1 space-y-3 mb-8">
                                                    {product.features.map((feature: string, idx: number) => (
                                                        <li key={idx} className="flex items-start gap-2.5">
                                                            <CheckCircle
                                                                className="mt-0.5 w-4 h-4 shrink-0 text-brand-600 dark:text-brand-400"
                                                                aria-hidden="true"
                                                            />
                                                            <span className="text-sm text-fg-muted">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            <div className="pt-6 border-t border-line mt-auto">
                                                <div className="flex items-baseline gap-2 mb-4">
                                                    <p className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                                                        {formatPrice(product.price)}
                                                    </p>
                                                    <p className="text-sm font-medium text-fg-subtle">
                                                        {product.duration_days ? `/ ${product.duration_days} ngày` : '/ vĩnh viễn'}
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

                    {!coSanPham && (
                        <div className="py-20 text-center">
                            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-sunken mb-4">
                                <BookOpen className="w-8 h-8 text-fg-faint" aria-hidden="true" />
                            </div>
                            <h2 className="text-xl text-fg mb-2">Đang cập nhật khóa học</h2>
                            <p className="text-fg-subtle">Vui lòng quay lại sau nhé!</p>
                        </div>
                    )}

                    {/* Nói rõ cách thanh toán NGAY trên trang bán.
                        Site không có cổng thanh toán — khách chuyển khoản tay rồi admin duyệt.
                        Không nói trước thì khách bấm mua xong mới biết, và bỏ giữa đường. */}
                    {coSanPham && (
                        <section className="mt-20 rounded-2xl border border-line bg-card p-8 shadow-e1">
                            <h2 className="text-2xl text-fg text-center mb-2">Mua thế nào?</h2>
                            <p className="text-sm text-fg-subtle text-center mb-8">
                                Thanh toán bằng chuyển khoản ngân hàng. Đơn được giữ trong 24 giờ kể từ lúc tạo.
                            </p>
                            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {BUOC_MUA.map((buoc, i) => (
                                    <li key={buoc.title} className="flex gap-4">
                                        <span className="grid place-items-center h-10 w-10 shrink-0 rounded-lg bg-brand-50 dark:bg-brand-900/30">
                                            <buoc.icon className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-fg">
                                                <span className="text-fg-faint">{i + 1}.</span> {buoc.title}
                                            </p>
                                            <p className="text-sm text-fg-muted mt-1">{buoc.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    )}
                </div>
            </div>
        </>
    );
}
