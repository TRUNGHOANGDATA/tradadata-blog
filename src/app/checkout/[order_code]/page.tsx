import { supabaseAdmin } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import CheckoutClient from './CheckoutClient';

export const metadata = {
    title: 'Thanh toán đơn hàng | Trà Đá Data',
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
            <div className="min-h-screen bg-surface-50 dark:bg-surface-950 py-20 px-4 flex items-center justify-center">
                <div className="w-full max-w-md bg-white dark:bg-surface-900 rounded-2xl shadow-xl shadow-brand-500/5 border border-brand-100 dark:border-surface-800 overflow-hidden text-center p-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
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

    const bankInfo = bankSetting?.value || {
        bankId: '970422',
        accountNo: '0123456',
        accountName: 'ADMIN',
        contactUrl: 'https://zalo.me/',
    };

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 py-12 px-4">
            <CheckoutClient
                order={{
                    order_code: order.order_code,
                    full_name: order.full_name,
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
