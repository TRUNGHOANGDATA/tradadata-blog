'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart/CartContext';
import { Trash2, ShoppingBag, Tag, ArrowRight, X } from 'lucide-react';
import { CheckoutSteps } from '@/components/cart/CheckoutSteps';

export default function CartPage() {
    const {
        items,
        coupon,
        subTotal,
        discountAmount,
        total,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
    } = useCart();

    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        setCouponError('');

        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: couponCode.trim(),
                    order_amount: subTotal,
                    product_ids: items.map(i => i.product_id),
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setCouponError(data.error || 'Mã giảm giá không hợp lệ');
                return;
            }

            applyCoupon({
                code: data.code,
                discount_type: data.discount_type,
                discount_value: data.discount_value,
                max_discount: data.max_discount,
            });
            setCouponCode('');
        } catch {
            setCouponError('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setCouponLoading(false);
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-page py-20 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="w-24 h-24 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-12 h-12 text-fg-faint" />
                    </div>
                    <h1 className="text-3xl font-bold text-fg mb-4">Giỏ hàng trống</h1>
                    <p className="text-surface-600 dark:text-surface-400 mb-8">
                        Bạn chưa thêm sản phẩm nào vào giỏ hàng.
                    </p>
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40"
                    >
                        Khám phá khóa học
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-page py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <CheckoutSteps current={1} />

                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-fg">
                        Giỏ hàng ({items.length} sản phẩm)
                    </h1>
                    <button
                        onClick={clearCart}
                        className="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium flex items-center gap-1 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Xóa tất cả
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="flex-1 space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.product_id}
                                className="bg-card rounded-2xl border border-line p-6 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex items-start gap-5">
                                    <div className="w-20 h-20 shrink-0 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/20 dark:from-brand-500/5 dark:to-brand-600/10 border border-surface-200 dark:border-surface-700 flex items-center justify-center">
                                        <ShoppingBag className="w-8 h-8 text-brand-500/50 dark:text-brand-400/40" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-fg mb-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-fg-subtle mb-4">
                                            Đơn giá: {formatCurrency(item.price)}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            {/* Không còn bộ tăng/giảm số lượng: API tạo đơn không đọc
                                                số lượng nên nút đó chỉ làm tổng tiền lệch với số tiền
                                                thật phải chuyển. Xem chú thích trong CartContext. */}
                                            <span className="text-sm text-fg-subtle">1 gói</span>

                                            <div className="flex items-center gap-4">
                                                <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </p>
                                                <button
                                                    onClick={() => removeFromCart(item.product_id)}
                                                    className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-[380px]">
                        <div className="bg-card rounded-2xl border border-line p-6 shadow-sm sticky top-24">
                            <h2 className="text-lg font-bold text-fg mb-6 pb-4 border-b border-surface-100 dark:border-surface-800">
                                Tóm tắt đơn hàng
                            </h2>

                            {/* Coupon Input */}
                            <div className="mb-6">
                                {coupon ? (
                                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-3 border border-green-200 dark:border-green-800">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                                                {coupon.code}
                                            </span>
                                            <span className="text-xs text-green-600 dark:text-green-400">
                                                (-{coupon.discount_type === 'percent' ? `${coupon.discount_value}%` : formatCurrency(coupon.discount_value)})
                                            </span>
                                        </div>
                                        <button
                                            onClick={removeCoupon}
                                            className="text-green-500 hover:text-green-700 dark:hover:text-green-300"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                placeholder="Nhập mã giảm giá..."
                                                className="flex-1 px-4 py-2.5 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-fg placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={couponLoading || !couponCode.trim()}
                                                className="px-4 py-2.5 bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                            >
                                                {couponLoading ? '...' : 'Áp dụng'}
                                            </button>
                                        </div>
                                        {couponError && (
                                            <p className="text-xs text-red-500 mt-2">{couponError}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between">
                                    <span className="text-fg-subtle">Tạm tính</span>
                                    <span className="text-fg font-medium">{formatCurrency(subTotal)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600 dark:text-green-400">
                                        <span>Giảm giá</span>
                                        <span className="font-medium">-{formatCurrency(discountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-4 border-t border-surface-100 dark:border-surface-800 text-base">
                                    <span className="font-bold text-fg">Tổng cộng</span>
                                    <span className="font-extrabold text-2xl text-brand-600 dark:text-brand-400">
                                        {formatCurrency(total)}
                                    </span>
                                </div>
                            </div>

                            {/* Checkout button */}
                            <Link
                                href="/checkout/create"
                                className="flex items-center justify-center gap-2 w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-base font-bold shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 transition-all"
                            >
                                Tiến hành thanh toán
                                <ArrowRight className="w-5 h-5" />
                            </Link>

                            <Link
                                href="/courses"
                                className="flex items-center justify-center mt-4 text-sm text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 font-medium hover:underline"
                            >
                                ← Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
