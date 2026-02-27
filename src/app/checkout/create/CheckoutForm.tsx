'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/lib/cart/CartContext';
import { ShoppingBag } from 'lucide-react';

export default function CheckoutForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const productIdFromUrl = searchParams.get('product_id');
    const { data: session } = useSession();
    const { items, coupon, subTotal, discountAmount, total, setPendingOrder } = useCart();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [savedName, setSavedName] = useState('');
    const [savedPhone, setSavedPhone] = useState('');

    // Fetch previous order info for auto-fill
    useEffect(() => {
        if (!session?.user?.email) return;
        fetch(`/api/orders/last-info?email=${encodeURIComponent(session.user.email)}`)
            .then(res => res.json())
            .then(data => {
                if (data.full_name) setSavedName(data.full_name);
                if (data.phone) setSavedPhone(data.phone);
            })
            .catch(() => { });
    }, [session?.user?.email]);

    // Determine checkout mode: single product (from URL) or cart
    const isCartCheckout = !productIdFromUrl && items.length > 0;
    const hasValidCheckout = !!productIdFromUrl || isCartCheckout;

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const phone = formData.get('phone') as string;

        // Strict phone validation before API call
        const phoneRegex = /^0[35789][0-9]{8}$/;
        if (!phoneRegex.test(phone)) {
            setError('Vui lòng nhập đúng định dạng số điện thoại 10 số (VD: 0984456710)');
            setIsLoading(false);
            return;
        }

        try {
            if (isCartCheckout) {
                // Cart checkout: create order for each item (or first item for now)
                // We'll use the first product_id for the order, amount = total after discount
                const data = {
                    product_id: items[0].product_id,
                    email: formData.get('email') || session?.user?.email,
                    full_name: formData.get('full_name'),
                    phone: phone,
                    coupon_code: coupon?.code || null,
                };

                const res = await fetch('/api/orders/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await res.json();

                if (!res.ok) {
                    throw new Error(result.error || 'Có lỗi xảy ra');
                }

                setPendingOrder(result.order_code);
                router.push(`/checkout/${result.order_code}`);
            } else {
                // Single product checkout via URL
                const data = {
                    product_id: productIdFromUrl,
                    email: formData.get('email') || session?.user?.email,
                    full_name: formData.get('full_name'),
                    phone: phone,
                };

                const res = await fetch('/api/orders/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await res.json();

                if (!res.ok) {
                    throw new Error(result.error || 'Có lỗi xảy ra');
                }

                setPendingOrder(result.order_code);
                router.push(`/checkout/${result.order_code}`);
            }
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    if (!hasValidCheckout) {
        return (
            <div className="text-center py-4">
                <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-surface-400" />
                </div>
                <p className="text-surface-600 dark:text-surface-400 mb-4">Giỏ hàng trống hoặc thiếu thông tin gói đăng ký.</p>
                <div className="flex justify-center gap-3">
                    <button type="button" onClick={() => router.push('/courses')} className="px-4 py-2 text-sm bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors">
                        Xem khóa học
                    </button>
                    <button type="button" onClick={() => router.push('/pricing')} className="px-4 py-2 text-sm border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                        Bảng giá
                    </button>
                </div>
            </div>
        );
    }

    const hasEmail = !!session?.user?.email;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Cart summary */}
            {isCartCheckout && (
                <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4 space-y-2 border border-surface-200 dark:border-surface-700">
                    <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Đơn hàng</p>
                    {items.map(item => (
                        <div key={item.product_id} className="flex justify-between text-sm">
                            <span className="text-surface-700 dark:text-surface-300">{item.name} × {item.quantity}</span>
                            <span className="font-medium text-surface-900 dark:text-surface-100">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                    ))}
                    {coupon && discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-green-600 dark:text-green-400 pt-1 border-t border-surface-200 dark:border-surface-700">
                            <span>Mã: {coupon.code}</span>
                            <span>-{formatCurrency(discountAmount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-base pt-2 border-t border-surface-200 dark:border-surface-700">
                        <span className="text-surface-900 dark:text-surface-100">Tổng cộng</span>
                        <span className="text-brand-600 dark:text-brand-400">{formatCurrency(total)}</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-800">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Họ và tên
                </label>
                <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    defaultValue={savedName || session?.user?.name || ''}
                    key={`name-${savedName}`}
                    required
                    className="w-full px-4 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors text-surface-900 dark:text-surface-100"
                    placeholder="Nguyễn Văn A"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={session?.user?.email || ''}
                    readOnly={hasEmail}
                    required
                    className={`w-full px-4 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg outline-none transition-colors text-surface-900 dark:text-surface-100 ${hasEmail
                        ? 'opacity-70 cursor-not-allowed border-none bg-surface-100 dark:bg-surface-800 focus:ring-0'
                        : 'focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
                        }`}
                    placeholder="email@example.com"
                />
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Số điện thoại
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultValue={savedPhone}
                    key={`phone-${savedPhone}`}
                    required
                    pattern="0[35789][0-9]{8}"
                    title="Vui lòng nhập đúng định dạng số điện thoại 10 số (VD: 0984456710)"
                    className="w-full px-4 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors text-surface-900 dark:text-surface-100"
                    placeholder="09..."
                />
                <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
                    VD: 0984456710 (10 chữ số, bắt đầu bằng số 0)
                </p>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-xl font-medium text-white transition-all
                    ${isLoading
                        ? 'bg-brand-400 cursor-not-allowed'
                        : 'bg-brand-600 hover:bg-brand-700 active:scale-[0.98]'
                    }`}
            >
                {isLoading ? 'Đang tạo đơn hàng...' : 'Tiếp tục thanh toán'}
            </button>
            <p className="text-center text-xs text-surface-500 mt-4">
                Thông tin của bạn được bảo mật tuyệt đối.
            </p>
        </form>
    );
}
