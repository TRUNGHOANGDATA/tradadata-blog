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

interface NutTiptap {
    text?: string;
    content?: NutTiptap[];
}

// Utility: bóc văn bản thuần từ Tiptap JSON (chuỗi hoặc object).
// `posts.content` lưu dạng text (chuỗi JSON) nên phải parse trước; chuỗi không
// phải JSON thì coi luôn là văn bản thô.
export function extractTextFromContent(content: unknown): string {
    if (!content) return '';
    let json: unknown = content;
    if (typeof json === 'string') {
        try { json = JSON.parse(json); } catch { return json as string; }
    }
    if (!json || typeof json !== 'object') return '';
    let text = '';
    const walk = (node: NutTiptap) => {
        if (node.text) text += node.text + ' ';
        if (node.content) node.content.forEach(walk);
    };
    walk(json as NutTiptap);
    return text.trim();
}

// Utility: tính reading time (200 từ/phút), tối thiểu 1 phút
export function calculateReadingTime(text: string): number {
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

// Utility: truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + '...';
}
