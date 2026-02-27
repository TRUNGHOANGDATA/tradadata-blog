'use client';

import { useState } from 'react';
import CouponSection from './CouponSection';
import CopyButton from './CopyButton';
import OrderChecker from './OrderChecker';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface CheckoutClientProps {
    order: {
        order_code: string;
        full_name: string;
        amount: number;
        original_amount: number | null;
        coupon_code: string | null;
        product_id: string;
        status: string;
    };
    productName: string;
    bankInfo: {
        bankId: string;
        accountNo: string;
        accountName: string;
        contactUrl: string;
    };
}

export default function CheckoutClient({ order, productName, bankInfo }: CheckoutClientProps) {
    const originalAmount = order.original_amount || order.amount;
    const [amount, setAmount] = useState(order.amount);
    const [couponCode, setCouponCode] = useState(order.coupon_code);

    const formatCurrency = (a: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(a);

    const handleAmountChange = (newAmount: number, newCoupon: string | null) => {
        setAmount(newAmount);
        setCouponCode(newCoupon);
    };

    const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNo}-compact.png?amount=${amount}&addInfo=${order.order_code}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

    return (
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Left column */}
            <div className="flex-1 space-y-6">
                {/* Order Info */}
                <div className="bg-white dark:bg-surface-900 rounded-2xl p-6 shadow-sm border border-surface-200 dark:border-surface-800">
                    <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4 pb-4 border-b border-surface-100 dark:border-surface-800">
                        Thông tin đơn hàng
                    </h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-surface-500">Mã đơn hàng:</span>
                            <span className="font-bold text-surface-900 dark:text-surface-100">{order.order_code}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-surface-500">Sản phẩm:</span>
                            <span className="font-medium text-surface-900 dark:text-surface-100 text-right max-w-[200px] truncate">
                                {productName}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-surface-500">Khách hàng:</span>
                            <span className="font-medium text-surface-900 dark:text-surface-100">{order.full_name}</span>
                        </div>

                        {/* Price breakdown */}
                        {couponCode && amount !== originalAmount ? (
                            <div className="pt-2 border-t border-surface-100 dark:border-surface-800 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-surface-500">Giá gốc:</span>
                                    <span className="text-surface-400 line-through text-sm">{formatCurrency(originalAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-surface-500">Giảm giá:</span>
                                    <span className="text-green-600 dark:text-green-400 font-medium">−{formatCurrency(originalAmount - amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-surface-500">Thanh toán:</span>
                                    <span className="font-bold text-brand-600 dark:text-brand-500 text-lg">{formatCurrency(amount)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between">
                                <span className="text-surface-500">Số tiền:</span>
                                <span className="font-bold text-brand-600 dark:text-brand-500 text-lg">{formatCurrency(amount)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Coupon Section */}
                <CouponSection
                    orderCode={order.order_code}
                    currentCoupon={couponCode}
                    currentAmount={amount}
                    originalAmount={originalAmount}
                    onAmountChange={handleAmountChange}
                />

                {/* Payment instructions */}
                <div className="bg-brand-50 dark:bg-brand-900/10 rounded-2xl p-6 shadow-sm border border-brand-100 dark:border-brand-900/30">
                    <h3 className="font-bold text-brand-800 dark:text-brand-300 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-brand-200 dark:bg-brand-800 text-brand-700 dark:text-brand-200 flex items-center justify-center text-sm">i</span>
                        Hướng dẫn thanh toán
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-surface-700 dark:text-surface-300 text-sm">
                        <li>Mở ứng dụng ngân hàng và <strong>Quét mã QR</strong> bên cạnh.</li>
                        <li>Đảm bảo số tiền và nội dung chuyển khoản chính xác: <strong>{order.order_code}</strong>.</li>
                        <li>Hoàn tất chuyển khoản và chụp lại màn hình biên lai.</li>
                        <li>
                            Gửi biên lai cho Admin qua Zalo/Facebook để được duyệt đơn:{' '}
                            <a
                                href={bankInfo.contactUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-brand-600 font-medium hover:underline inline-flex items-center mt-2 group"
                            >
                                Liên hệ Admin <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </li>
                    </ol>
                </div>
            </div>

            {/* Right column — QR */}
            <div className="w-full md:w-[400px]">
                <div className="bg-white dark:bg-surface-900 rounded-2xl p-8 shadow-sm border border-surface-200 dark:border-surface-800 text-center sticky top-24">
                    <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-6">
                        Quét mã QR để thanh toán
                    </h2>

                    <div className="bg-white p-2 rounded-xl mb-6 mx-auto inline-block border border-surface-100">
                        <img
                            key={qrUrl}
                            src={qrUrl}
                            alt="VietQR Payment Code"
                            className="w-64 h-64 object-contain"
                        />
                    </div>

                    <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4 text-left border border-surface-100 dark:border-surface-700 mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-surface-500 uppercase font-semibold">Ngân hàng</span>
                            <span className="font-medium text-surface-900 dark:text-surface-100">{bankInfo.bankId}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-surface-500 uppercase font-semibold">Chủ TK</span>
                            <span className="font-medium text-surface-900 dark:text-surface-100 uppercase">{bankInfo.accountName}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-surface-500 uppercase font-semibold">Số TK</span>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-brand-600 dark:text-brand-400">{bankInfo.accountNo}</span>
                                <CopyButton text={bankInfo.accountNo} />
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                            <span className="text-xs text-surface-500 uppercase font-semibold">Nội dung CK</span>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-green-600 dark:text-green-500 text-lg">{order.order_code}</span>
                                <CopyButton text={order.order_code} />
                            </div>
                        </div>
                    </div>

                    {/* Polling Checker */}
                    <OrderChecker orderCode={order.order_code} isPaid={order.status === 'paid'} />
                </div>
            </div>
        </div>
    );
}
