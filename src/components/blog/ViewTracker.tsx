'use client';

import { useEffect, useRef } from 'react';

export function ViewTracker({ slug }: { slug: string }) {
    const tracked = useRef(false);

    useEffect(() => {
        // Only track once per page load
        if (tracked.current) return;
        tracked.current = true;

        // Small delay to avoid counting quick bounces
        const timer = setTimeout(() => {
            fetch(`/api/posts/${slug}/view`, { method: 'POST' }).catch(() => {
                // Silently fail — view tracking is not critical
            });
        }, 3000); // Track after 3 seconds on page

        return () => clearTimeout(timer);
    }, [slug]);

    return null; // This component renders nothing
}
