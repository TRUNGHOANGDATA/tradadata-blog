import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';

    // Redirect .vn domain and non-www to www.tradadata.com
    if (hostname.includes('tradadata.vn') || hostname === 'tradadata.com') {
        const url = new URL(request.url);
        url.hostname = 'www.tradadata.com';
        url.port = '';
        return NextResponse.redirect(url, 301);
    }

    // Run auth middleware for /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        return (auth as any)(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
