'use client';

import { useState } from 'react';
import CouponSection from './CouponSection';

interface OrderInfoClientProps {
    orderCode: string;
    productName: string;
    fullName: string;
    amount: number;
    originalAmount: number;
    couponCode: string | null;
    bankInfo: {
        bankId: string;
        accountNo: string;
        accountName: string;
        contactUrl: string;
    };
}

export default function OrderInfoClient({
    orderCode,
    productName,
    fullName,
    amount: initialAmount,
    originalAmount,
    couponCode,
    bankInfo,
}: OrderInfoClientProps) {
    const [amount, setAmount] = useState(initialAmount);
    const [activeCoupon, setActiveCoupon] = useState(couponCode);

    const formatCurrency = (a: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(a);

    const handleAmountChange = (newAmount: number, newCoupon: string | null) => {
        setAmount(newAmount);
        setActiveCoupon(newCoupon);
    };

    // Dynamic QR url
    const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNo}-compact.png?amount=${amount}&addInfo=${orderCode}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

    return { amount, activeCoupon, formatCurrency, handleAmountChange, qrUrl };
}
