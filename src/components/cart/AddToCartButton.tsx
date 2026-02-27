'use client';

import { useCart } from '@/lib/cart/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

interface AddToCartButtonProps {
    productId: string;
    productName: string;
    productPrice: number;
    className?: string;
}

export function AddToCartButton({ productId, productName, productPrice, className }: AddToCartButtonProps) {
    const { addToCart, items } = useCart();
    const [justAdded, setJustAdded] = useState(false);

    const isInCart = items.some((i) => i.product_id === productId);

    const handleAdd = () => {
        addToCart({ product_id: productId, name: productName, price: productPrice });
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAdd}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${justAdded
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                    : isInCart
                        ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border-2 border-brand-200 dark:border-brand-800 hover:bg-brand-100 dark:hover:bg-brand-900/30'
                        : 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40'
                } ${className || 'w-full'}`}
        >
            {justAdded ? (
                <>
                    <Check className="w-4 h-4" />
                    Đã thêm vào giỏ!
                </>
            ) : isInCart ? (
                <>
                    <ShoppingCart className="w-4 h-4" />
                    Thêm lần nữa
                </>
            ) : (
                <>
                    <ShoppingCart className="w-4 h-4" />
                    Thêm vào giỏ hàng
                </>
            )}
        </button>
    );
}
