import { supabaseAdmin } from '@/lib/supabase/server';
import PurchaseButton from './PurchaseButton';

export const metadata = {
    title: 'Bảng giá | Trà Đá Data',
    description: 'Nâng cấp tài khoản rxx.vn để truy cập toàn bộ nội dung chất lượng cao.',
};

export default async function PricingPage() {
    // Fetch products
    const { data: products } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 py-20 px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-4">
                    Nâng cấp trải nghiệm học tập
                </h1>
                <p className="text-lg text-surface-600 dark:text-surface-400">
                    Truy cập không giới hạn vào các bài viết chuyên sâu, tài liệu nội bộ và mã nguồn thực tế.
                </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
                {products?.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white dark:bg-surface-900 border border-brand-200 dark:border-brand-900/50 rounded-2xl shadow-xl overflow-hidden relative"
                    >
                        {/* Ảnh sản phẩm */}
                        {product.image_url && (
                            <div className="w-full h-48 overflow-hidden">
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        {/* Biểu tượng "Phổ biến" nếu là Premium Blog */}
                        {product.slug === 'premium-blog' && (
                            <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                Phổ biến nhất
                            </div>
                        )}

                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                                {product.name}
                            </h3>
                            <p className="text-surface-600 dark:text-surface-400 mb-6 h-12">
                                {product.description}
                            </p>
                            <div className="mb-6">
                                <span className="text-4xl font-extrabold text-surface-900 dark:text-surface-100">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                </span>
                                {product.duration_days ? (
                                    <span className="text-surface-500 dark:text-surface-400"> / {product.duration_days} ngày</span>
                                ) : (
                                    <span className="text-surface-500 dark:text-surface-400"> / vĩnh viễn</span>
                                )}
                            </div>

                            <ul className="space-y-4 mb-8">
                                {product.features?.map((feature: string, idx: number) => (
                                    <li key={idx} className="flex items-start text-surface-700 dark:text-surface-300">
                                        <svg className="h-6 w-6 text-brand-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <PurchaseButton productId={product.id} />
                        </div>
                    </div>
                ))}

                {(!products || products.length === 0) && (
                    <div className="col-span-full text-center text-fg-subtle py-10">
                        Đang cập nhật các gói sản phẩm. Vui lòng quay lại sau!
                    </div>
                )}
            </div>
        </div>
    );
}
