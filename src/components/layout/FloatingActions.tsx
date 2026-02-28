'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { useCart } from '@/lib/cart/CartContext';

export function FloatingActions() {
    const [isVisible, setIsVisible] = useState(false);
    const { isCartOpen } = useCart();
    const [zaloLink, setZaloLink] = useState('');
    const [messengerLink, setMessengerLink] = useState('');

    // Fetch social links from site settings
    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.settings) {
                    const s = data.settings;
                    // social_links is stored as a JSON object { zalo, facebook, phone, email }
                    const links = typeof s.social_links === 'string'
                        ? JSON.parse(s.social_links)
                        : s.social_links;
                    if (links?.zalo) setZaloLink(links.zalo);
                    if (links?.facebook) setMessengerLink(links.facebook);
                }
            })
            .catch(() => { /* silently fail */ });
    }, []);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

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
            {zaloLink && (
                <Link
                    href={zaloLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden"
                    aria-label="Liên hệ qua Zalo"
                >
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        <img src="/zalo.svg" alt="Zalo" className="w-full h-full object-contain" />
                    </div>
                </Link>
            )}

            {/* Messenger Button */}
            {messengerLink && (
                <Link
                    href={messengerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden"
                    aria-label="Liên hệ qua Messenger"
                >
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        <img src="/messenger.svg" alt="Messenger" className="w-full h-full object-contain" />
                    </div>
                </Link>
            )}

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
