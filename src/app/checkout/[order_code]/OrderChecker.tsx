'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useCart } from '@/lib/cart/CartContext';

export default function OrderChecker({ orderCode, isPaid }: { orderCode: string; isPaid: boolean }) {
    const router = useRouter();
    const { clearCart } = useCart();
    const cartCleared = useRef(false);

    useEffect(() => {
        // When order is paid, clear cart once
        if (isPaid && !cartCleared.current) {
            cartCleared.current = true;
            clearCart();
            return;
        }

        if (isPaid) return;

        // Auto-refresh the page every 15 seconds to check if Admin paid it
        const interval = setInterval(() => {
            router.refresh();
        }, 15000);

        return () => clearInterval(interval);
    }, [isPaid, router, clearCart]);

    if (isPaid) return null;

    return (
        <div className="mt-6 text-sm text-fg-subtle flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-brand-500 animate-pulse"></div>
            Đang chờ Admin duyệt đơn...
        </div>
    );
}
