import { type ClassValue, clsx } from 'clsx';

// Utility: merge class names (works well with Tailwind)
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

// Utility: format date for Vietnamese locale
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

// Utility: estimate reading time from Tiptap JSON content
export function estimateReadingTime(content: Record<string, unknown> | null): number {
    if (!content) return 1;
    const text = JSON.stringify(content);
    const wordCount = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
}

// Utility: truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + '...';
}
