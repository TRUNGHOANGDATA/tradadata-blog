'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';
import { FloatingActions } from './FloatingActions';

/**
 * Wraps Footer & FloatingActions so they are hidden on /admin pages
 * where the admin layout manages its own chrome.
 */
export function LayoutShell() {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

    if (isAdmin) return null;

    return (
        <>
            <Footer />
            <FloatingActions />
        </>
    );
}
