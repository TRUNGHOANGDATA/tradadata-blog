import { supabaseAdmin } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import CheckoutClient from './CheckoutClient';
import { CheckoutSteps } from '@/components/cart/CheckoutSteps';

export const metadata = {
    title: 'Thanh toán đơn hàng',
};

export default async function CheckoutPage(props: { params: Promise<{ order_code: string }> }) {
    if (!supabaseAdmin) return notFound();

    const { order_code } = await props.params;

    // Fetch order
    const { data: order } = await supabaseAdmin
        .from('orders')
        .select('*, products(name, description, price)')
        .eq('order_code', order_code)
        .single();

    if (!order) return notFound();

    // Nếu đã thanh toán
    if (order.status === 'paid') {
        return (
            <div className="min-h-screen bg-page py-20 px-4 flex flex-col items-center justify-center">
                <div className="w-full max-w-md">
                    <CheckoutSteps current={4} />
                </div>
                <div className="w-full max-w-md bg-card rounded-2xl shadow-e2 border border-line overflow-hidden text-center p-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-fg mb-2">
                        Thanh toán thành công!
                    </h1>
                    <p className="text-surface-600 dark:text-surface-400 mb-8">
                        Đơn hàng <strong>{order.order_code}</strong> đã được kích hoạt.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors"
                    >
                        Quay lại trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    // Lấy thông tin ngân hàng từ admin settings
    const { data: bankSetting } = await supabaseAdmin
        .from('site_settings')
        .select('value')
        .eq('key', 'bank_info')
        .single();

    // Lấy thông tin liên hệ (zalo, facebook)
    const { data: socialSetting } = await supabaseAdmin
        .from('site_settings')
        .select('value')
        .eq('key', 'social_links')
        .single();

    const socialLinks = socialSetting?.value || {};
    const bankInfoBase = bankSetting?.value || {};
    const bankInfo = {
        bankId: '970422',
        accountNo: '0123456',
        accountName: 'ADMIN',
        contactUrl: 'https://zalo.me/',
        ...bankInfoBase,
        zaloUrl: socialLinks.zalo || '',
        facebookUrl: socialLinks.facebook || '',
    };

    return (
        <div className="min-h-screen bg-page py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <CheckoutSteps current={3} />
            </div>
            <CheckoutClient
                order={{
                    order_code: order.order_code,
                    full_name: order.full_name,
                    email: order.email,
                    amount: order.amount,
                    original_amount: order.original_amount || (order.products as any)?.price || order.amount,
                    coupon_code: order.coupon_code || null,
                    product_id: order.product_id,
                    status: order.status,
                }}
                productName={(order.products as any)?.name || 'Gói kích hoạt'}
                bankInfo={bankInfo}
            />
        </div>
    );
}
