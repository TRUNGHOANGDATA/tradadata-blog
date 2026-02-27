'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface CartItem {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface CouponState {
    code: string;
    discount_type: 'percent' | 'fixed';
    discount_value: number;
    max_discount: number | null;
}

interface CartContextType {
    items: CartItem[];
    coupon: CouponState | null;
    cartCount: number;
    subTotal: number;
    discountAmount: number;
    total: number;
    addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeFromCart: (product_id: string) => void;
    updateQuantity: (product_id: string, quantity: number) => void;
    clearCart: () => void;
    applyCoupon: (coupon: CouponState) => void;
    removeCoupon: () => void;
    isCartOpen: boolean;
    setCartOpen: (isOpen: boolean) => void;
    setPendingOrder: (orderCode: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);
    const [items, setItems] = useState<CartItem[]>([]);
    const [coupon, setCoupon] = useState<CouponState | null>(null);
    const [isCartOpen, setCartOpen] = useState(false);
    const [pendingOrderCode, setPendingOrderCode] = useState<string | null>(null);

    // Khởi tạo từ localStorage
    useEffect(() => {
        setIsMounted(true);
        try {
            const savedCart = localStorage.getItem('erx-cart');
            if (savedCart) {
                setItems(JSON.parse(savedCart));
            }
            const savedCoupon = localStorage.getItem('erx-cart-coupon');
            if (savedCoupon) {
                setCoupon(JSON.parse(savedCoupon));
            }
            const savedOrder = localStorage.getItem('erx-pending-order');
            if (savedOrder) {
                setPendingOrderCode(savedOrder);
            }
        } catch (error) {
            console.error('Lỗi khi parse cart từ localStorage:', error);
        }
    }, []);

    // Lưu vào localStorage khi có thay đổi
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('erx-cart', JSON.stringify(items));
        }
    }, [items, isMounted]);

    useEffect(() => {
        if (isMounted) {
            if (coupon) {
                localStorage.setItem('erx-cart-coupon', JSON.stringify(coupon));
            } else {
                localStorage.removeItem('erx-cart-coupon');
            }
        }
    }, [coupon, isMounted]);

    // Các hàm tính toán
    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    const subTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    let discountAmount = 0;
    if (coupon) {
        if (coupon.discount_type === 'percent') {
            discountAmount = (subTotal * coupon.discount_value) / 100;
            if (coupon.max_discount && discountAmount > coupon.max_discount) {
                discountAmount = coupon.max_discount;
            }
        } else {
            discountAmount = coupon.discount_value;
        }
        // Đảm bảo giảm không vượt quá tổng tiền
        if (discountAmount > subTotal) {
            discountAmount = subTotal;
        }
    }

    const total = subTotal - discountAmount;

    // Các actions
    const addToCart = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        setItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex((i) => i.product_id === newItem.product_id);
            const quantityToAdd = newItem.quantity || 1;

            if (existingItemIndex > -1) {
                // Đã có trong giỏ -> Tăng số lượng
                const newItems = [...prevItems];
                newItems[existingItemIndex] = {
                    ...newItems[existingItemIndex],
                    quantity: newItems[existingItemIndex].quantity + quantityToAdd,
                };
                return newItems;
            } else {
                // Chưa có -> Thêm mới
                return [...prevItems, { ...newItem, quantity: quantityToAdd }];
            }
        });
        setCartOpen(true); // Tự động mở slide-out khi thêm
    };

    const removeFromCart = (product_id: string) => {
        setItems((prevItems) => prevItems.filter((i) => i.product_id !== product_id));
    };

    const updateQuantity = (product_id: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(product_id);
            return;
        }
        setItems((prevItems) =>
            prevItems.map((i) => (i.product_id === product_id ? { ...i, quantity } : i))
        );
    };

    const clearCart = useCallback(() => {
        setItems([]);
        setCoupon(null);
        setPendingOrderCode(null);
        localStorage.removeItem('erx-pending-order');
    }, []);

    const setPendingOrder = useCallback((orderCode: string) => {
        setPendingOrderCode(orderCode);
        localStorage.setItem('erx-pending-order', orderCode);
    }, []);

    // Poll pending order status — clear cart when approved
    useEffect(() => {
        if (!isMounted || !pendingOrderCode || items.length === 0) return;

        const checkOrderStatus = async () => {
            try {
                const res = await fetch(`/api/orders/status?order_code=${pendingOrderCode}`);
                const data = await res.json();
                if (data.status === 'paid' || data.status === 'cancelled') {
                    clearCart();
                }
            } catch { /* ignore network errors */ }
        };

        // Check immediately, then every 15 seconds
        checkOrderStatus();
        const interval = setInterval(checkOrderStatus, 15000);
        return () => clearInterval(interval);
    }, [isMounted, pendingOrderCode, items.length, clearCart]);

    const applyCoupon = (newCoupon: CouponState) => {
        setCoupon(newCoupon);
    };

    const removeCoupon = () => {
        setCoupon(null);
    };

    // Prevent hydration error bằng cách return default rỗng nếu chưa mount
    if (!isMounted) {
        return <>{children}</>;
    }

    return (
        <CartContext.Provider
            value={{
                items,
                coupon,
                cartCount,
                subTotal,
                discountAmount,
                total,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                applyCoupon,
                removeCoupon,
                isCartOpen,
                setCartOpen,
                setPendingOrder,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

const noop = () => { };

const defaultCart: CartContextType = {
    items: [],
    coupon: null,
    cartCount: 0,
    subTotal: 0,
    discountAmount: 0,
    total: 0,
    addToCart: noop,
    removeFromCart: noop,
    updateQuantity: noop,
    clearCart: noop,
    applyCoupon: noop,
    removeCoupon: noop,
    isCartOpen: false,
    setCartOpen: noop,
    setPendingOrder: noop,
};

export function useCart() {
    const context = useContext(CartContext);
    return context ?? defaultCart;
}
