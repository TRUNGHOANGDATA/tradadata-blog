'use client';

import { usePathname } from 'next/navigation';

/**
 * Client wrapper that hides its children on /admin pages.
 * Used to conditionally render Footer & FloatingActions
 * without importing them directly (they may be server components).
 */
export function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

    if (isAdmin) return null;

    return <>{children}</>;
}
