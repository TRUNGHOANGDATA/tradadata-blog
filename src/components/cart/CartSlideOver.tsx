'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Tag } from 'lucide-react';
import { useCart } from '@/lib/cart/CartContext';
import Link from 'next/link';

export function CartSlideOver() {
    const { isCartOpen, setCartOpen, items, updateQuantity, removeFromCart, subTotal, coupon, applyCoupon, removeCoupon, discountAmount, total } = useCart();
    const panelRef = useRef<HTMLDivElement>(null);
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setCartOpen(false);
        };
        if (isCartOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isCartOpen, setCartOpen]);

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
                setCouponError(data.error || 'Mã không hợp lệ');
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
            setCouponError('Có lỗi xảy ra');
        } finally {
            setCouponLoading(false);
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-50 bg-surface-900/40 dark:bg-surface-900/60 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setCartOpen(false)}
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex h-full flex-col bg-white dark:bg-surface-900 shadow-2xl">
                    {/* Header */}
                    <div className="flex items-start justify-between px-6 py-5 border-b border-surface-200 dark:border-surface-800">
                        <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                            <ShoppingBag className="w-6 h-6 text-brand-600 dark:text-brand-500" />
                            Giỏ hàng
                            {items.length > 0 && (
                                <span className="text-sm font-normal text-fg-subtle">({items.length} sản phẩm)</span>
                            )}
                        </h2>
                        <button
                            type="button"
                            className="p-2 text-fg-faint hover:text-surface-500 dark:hover:text-surface-300 transition-colors rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800"
                            onClick={() => setCartOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        {items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-4">
                                    <ShoppingBag className="w-10 h-10 text-fg-faint" />
                                </div>
                                <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Giỏ hàng rỗng</h3>
                                <p className="text-fg-subtle mb-6">Hãy khám phá các khóa học của chúng tôi!</p>
                                <Link
                                    href="/courses"
                                    onClick={() => setCartOpen(false)}
                                    className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors"
                                >
                                    Xem khóa học
                                </Link>
                            </div>
                        ) : (
                            <ul role="list" className="-my-6 divide-y divide-surface-200 dark:divide-surface-800">
                                {items.map((item) => (
                                    <li key={item.product_id} className="flex py-6">
                                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/20 dark:from-brand-500/5 dark:to-brand-600/10 border border-surface-200 dark:border-surface-700 flex items-center justify-center">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <ShoppingBag className="w-8 h-8 text-brand-500/50 dark:text-brand-400/40" />
                                            )}
                                        </div>

                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div className="flex justify-between mb-1">
                                                <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 line-clamp-2 pr-2">
                                                    {item.name}
                                                </h3>
                                            </div>
                                            <p className="text-sm font-bold text-brand-600 dark:text-brand-400 mb-3">
                                                {formatCurrency(item.price * item.quantity)}
                                            </p>
                                            <div className="flex items-end justify-between mt-auto">
                                                <div className="flex items-center border border-surface-200 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-950">
                                                    <button
                                                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                        className="p-1.5 text-fg-subtle hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-200 dark:hover:bg-surface-800 rounded-l-lg transition-colors"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium text-surface-900 dark:text-surface-100">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                        className="p-1.5 text-fg-subtle hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-200 dark:hover:bg-surface-800 rounded-r-lg transition-colors"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeFromCart(item.product_id)}
                                                    className="text-xs font-medium text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition-colors p-1"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="border-t border-surface-200 dark:border-surface-800 px-6 py-5">
                            {/* Coupon Section */}
                            <div className="mb-4">
                                {coupon ? (
                                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2.5 border border-green-200 dark:border-green-800">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            <span className="text-sm font-semibold text-green-700 dark:text-green-300">{coupon.code}</span>
                                            <span className="text-xs text-green-600 dark:text-green-400">
                                                (-{coupon.discount_type === 'percent' ? `${coupon.discount_value}%` : formatCurrency(coupon.discount_value)})
                                            </span>
                                        </div>
                                        <button onClick={removeCoupon} className="text-green-500 hover:text-green-700 dark:hover:text-green-300">
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
                                                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                                placeholder="Nhập mã giảm giá..."
                                                className="flex-1 px-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={couponLoading || !couponCode.trim()}
                                                className="px-3 py-2 bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                            >
                                                {couponLoading ? '...' : 'Áp dụng'}
                                            </button>
                                        </div>
                                        {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
                                    </div>
                                )}
                            </div>

                            {/* Price Summary */}
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between">
                                    <span className="text-fg-subtle">Tạm tính</span>
                                    <span className="text-surface-900 dark:text-surface-100 font-medium">{formatCurrency(subTotal)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600 dark:text-green-400">
                                        <span>Giảm giá</span>
                                        <span className="font-medium">-{formatCurrency(discountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-surface-100 dark:border-surface-800">
                                    <span className="font-bold text-surface-900 dark:text-surface-100">Tổng cộng</span>
                                    <span className="font-extrabold text-xl text-brand-600 dark:text-brand-400">{formatCurrency(total)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/cart"
                                    onClick={() => setCartOpen(false)}
                                    className="flex items-center justify-center rounded-xl border-2 border-surface-200 dark:border-surface-700 px-4 py-3 text-sm font-medium text-surface-900 dark:text-surface-100 hover:border-surface-300 dark:hover:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-800 transition-all"
                                >
                                    Xem giỏ hàng
                                </Link>
                                <Link
                                    href="/checkout/create"
                                    onClick={() => setCartOpen(false)}
                                    className="flex items-center justify-center rounded-xl bg-brand-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:bg-brand-700 transition-all"
                                >
                                    Thanh toán
                                </Link>
                            </div>
                            <div className="mt-3 text-center text-sm text-fg-subtle">
                                <button
                                    type="button"
                                    className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 hover:underline"
                                    onClick={() => setCartOpen(false)}
                                >
                                    Tiếp tục mua sắm &rarr;
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
