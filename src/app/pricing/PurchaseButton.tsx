'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PurchaseButton({ productId }: { productId: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handlePurchase = () => {
        setIsLoading(true);
        router.push(`/checkout/create?product_id=${productId}`);
    };

    return (
        <button
            onClick={handlePurchase}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all 
                ${isLoading
                    ? 'bg-brand-400 cursor-not-allowed'
                    : 'bg-brand-600 hover:bg-brand-700 active:scale-[0.98]'
                }`}
        >
            {isLoading ? 'Đang xử lý...' : 'Mua ngay'}
        </button>
    );
}
