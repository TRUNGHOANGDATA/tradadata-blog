'use client';

import { useEffect, useRef } from 'react';

export default function CopyProtection({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleCopy = (e: ClipboardEvent) => {
            // Allow copy from code blocks (they have data-copy-btn or are inside .code-block-wrapper)
            const target = e.target as HTMLElement;
            if (target.closest('.code-block-wrapper') || target.closest('pre') || target.closest('code')) {
                return;
            }
            e.preventDefault();
        };

        const handleContextMenu = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.code-block-wrapper') || target.closest('pre') || target.closest('code')) {
                return;
            }
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Block Ctrl+C, Ctrl+A on non-code content
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'a' || e.key === 'u')) {
                const selection = window.getSelection();
                const anchorNode = selection?.anchorNode as HTMLElement | null;
                if (anchorNode?.closest?.('.code-block-wrapper') || anchorNode?.closest?.('pre')) {
                    return;
                }
                // For Ctrl+A, check if focus is in code block
                const activeEl = document.activeElement as HTMLElement | null;
                if (activeEl?.closest?.('.code-block-wrapper') || activeEl?.closest?.('pre')) {
                    return;
                }
                e.preventDefault();
            }
        };

        el.addEventListener('copy', handleCopy);
        el.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            el.removeEventListener('copy', handleCopy);
            el.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div ref={ref} className="copy-protected">
            {children}
        </div>
    );
}
