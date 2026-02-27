'use client';

import { useEffect } from 'react';

export function CodeBlockClient() {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const btn = target.closest('[data-copy-btn]') as HTMLElement | null;
            if (!btn) return;

            const codeBlock = btn.closest('.code-block-wrapper');
            const code = codeBlock?.querySelector('code');
            if (!code) return;

            navigator.clipboard.writeText(code.textContent || '').then(() => {
                const icon = btn.querySelector('.copy-icon');
                const check = btn.querySelector('.check-icon');
                if (icon) icon.classList.add('hidden');
                if (check) check.classList.remove('hidden');
                setTimeout(() => {
                    if (icon) icon.classList.remove('hidden');
                    if (check) check.classList.add('hidden');
                }, 2000);
            });
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return null;
}
