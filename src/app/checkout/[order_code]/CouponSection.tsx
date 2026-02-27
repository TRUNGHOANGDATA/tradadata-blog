'use client';

import { useState } from 'react';
import { Ticket, X, Loader2, CheckCircle2, Tag } from 'lucide-react';

interface CouponSectionProps {
    orderCode: string;
    currentCoupon: string | null;
    currentAmount: number;
    originalAmount: number;
    onAmountChange: (newAmount: number, couponCode: string | null) => void;
}

export default function CouponSection({
    orderCode,
    currentCoupon,
    currentAmount,
    originalAmount,
    onAmountChange,
}: CouponSectionProps) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(currentCoupon);
    const [discount, setDiscount] = useState(originalAmount - currentAmount);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const handleApply = async () => {
        if (!code.trim()) return;
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await fetch('/api/orders/apply-coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_code: orderCode, coupon_code: code.trim(), action: 'apply' }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setAppliedCoupon(data.coupon_code);
                setDiscount(originalAmount - data.new_amount);
                setCode('');
                setSuccess(`Đã áp dụng mã ${data.coupon_code} — giảm ${formatCurrency(originalAmount - data.new_amount)}`);
                onAmountChange(data.new_amount, data.coupon_code);
                setTimeout(() => setSuccess(''), 4000);
            } else {
                setError(data.error || 'Mã không hợp lệ');
            }
        } catch {
            setError('Có lỗi xảy ra');
        }
        setLoading(false);
    };

    const handleRemove = async () => {
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await fetch('/api/orders/apply-coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_code: orderCode, action: 'remove' }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setAppliedCoupon(null);
                setDiscount(0);
                setSuccess('Đã bỏ mã giảm giá');
                onAmountChange(data.new_amount, null);
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.error || 'Lỗi xử lý');
            }
        } catch {
            setError('Có lỗi xảy ra');
        }
        setLoading(false);
    };

    return (
        <div className="bg-white dark:bg-surface-900 rounded-2xl p-5 shadow-sm border border-surface-200 dark:border-surface-800">
            <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-3">
                <Ticket className="w-4 h-4 text-brand-500" />
                Mã giảm giá
            </h3>

            {/* Applied coupon */}
            {appliedCoupon ? (
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/15 border border-green-200 dark:border-green-800/50 rounded-xl">
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="font-mono font-bold text-sm text-green-700 dark:text-green-300">{appliedCoupon}</span>
                            <span className="text-xs text-green-600 dark:text-green-400">−{formatCurrency(discount)}</span>
                        </div>
                        <button
                            onClick={handleRemove}
                            disabled={loading}
                            className="p-1.5 text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Bỏ mã giảm giá"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Option to replace with a different code */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={code}
                            onChange={e => setCode(e.target.value.toUpperCase())}
                            onKeyDown={e => e.key === 'Enter' && handleApply()}
                            placeholder="Đổi mã khác..."
                            className="flex-1 px-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm font-mono placeholder:font-sans outline-none focus:ring-2 focus:ring-brand-500"
                        />
                        <button
                            onClick={handleApply}
                            disabled={loading || !code.trim()}
                            className="px-3 py-2 text-xs font-medium bg-brand-600 hover:bg-brand-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white rounded-xl transition-colors"
                        >
                            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Đổi'}
                        </button>
                    </div>
                </div>
            ) : (
                /* No coupon applied — show input */
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={code}
                        onChange={e => setCode(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && handleApply()}
                        placeholder="Nhập mã giảm giá..."
                        className="flex-1 px-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm font-mono placeholder:font-sans outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <button
                        onClick={handleApply}
                        disabled={loading || !code.trim()}
                        className="px-4 py-2 text-sm font-medium bg-brand-600 hover:bg-brand-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white rounded-xl transition-colors whitespace-nowrap"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Áp dụng'}
                    </button>
                </div>
            )}

            {/* Feedback messages */}
            {error && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/15 text-red-600 dark:text-red-400 text-xs rounded-lg border border-red-200 dark:border-red-800/50">
                    {error}
                </div>
            )}
            {success && (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/15 text-green-600 dark:text-green-400 text-xs rounded-lg border border-green-200 dark:border-green-800/50 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {success}
                </div>
            )}
        </div>
    );
}
