import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const title = searchParams.get('title');
        if (!title || title.trim().length < 2) {
            return NextResponse.json({ keyword: '' });
        }

        // Use MyMemory Translation API (free, no key needed)
        const res = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(title.trim())}&langpair=vi|en`,
            { next: { revalidate: 3600 } } // cache 1 hour
        );

        if (!res.ok) {
            // Fallback: strip diacritics
            const fallback = title
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D');
            return NextResponse.json({ keyword: fallback });
        }

        const data = await res.json();
        const translated = data?.responseData?.translatedText || '';

        // Clean up: remove quotes, trim, take first ~6 words for better search
        const keyword = translated
            .replace(/['"]/g, '')
            .split(' ')
            .slice(0, 6)
            .join(' ')
            .trim();

        return NextResponse.json({ keyword: keyword || title });
    } catch (error: any) {
        console.error('Translation error:', error);
        // Fallback: strip diacritics
        const { searchParams } = new URL(request.url);
        const title = searchParams.get('title') || '';
        const fallback = title
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
        return NextResponse.json({ keyword: fallback });
    }
}
