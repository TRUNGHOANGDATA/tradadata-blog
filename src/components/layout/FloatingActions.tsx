'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { useCart } from '@/lib/cart/CartContext';

export function FloatingActions() {
    const [isVisible, setIsVisible] = useState(false);
    const { isCartOpen } = useCart();

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top coordinate to 0
    // Make behavior smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <div className={`fixed z-40 flex flex-col gap-3 transition-all duration-500 ease-in-out ${isCartOpen
                ? 'bottom-6 right-[calc(28rem+1.5rem)]'
                : 'bottom-6 right-6'
            }`}>
            {/* Zalo Button */}
            <Link
                href="https://zalo.me/231855364228509068"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden"
                aria-label="Liên hệ qua Zalo"
            >
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <img src="/zalo.svg" alt="Zalo" className="w-full h-full object-contain" />
                </div>
            </Link>

            {/* Messenger Button */}
            <Link
                href="https://m.me/ERXVIETNAM"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden"
                aria-label="Liên hệ qua Messenger"
            >
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <img src="/messenger.svg" alt="Messenger" className="w-full h-full object-contain" />
                </div>
            </Link>

            {/* Scroll to top */}
            <button
                onClick={scrollToTop}
                aria-label="Cuộn lên đầu trang"
                className={`w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-brand-700 hover:shadow-xl hover:-translate-y-1 transition-all ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'
                    }`}
            >
                <ArrowUp className="h-6 w-6" />
            </button>
        </div>
    );
}
