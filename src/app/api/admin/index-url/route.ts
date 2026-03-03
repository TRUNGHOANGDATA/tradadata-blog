import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Google Service Account credentials
const CREDENTIALS = JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS || '{}');
const SCOPES = ['https://www.googleapis.com/auth/indexing'];
const SITE_URL = 'https://www.tradadata.com';

// Get access token using service account
async function getAccessToken(): Promise<string> {
    const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const now = Math.floor(Date.now() / 1000);
    const claimSet = btoa(JSON.stringify({
        iss: CREDENTIALS.client_email,
        scope: SCOPES.join(' '),
        aud: CREDENTIALS.token_uri,
        exp: now + 3600,
        iat: now,
    }));

    const signInput = `${header}.${claimSet}`;
    const key = await crypto.subtle.importKey(
        'pkcs8',
        pemToArrayBuffer(CREDENTIALS.private_key),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(signInput));
    const jwt = `${signInput}.${arrayBufferToBase64Url(signature)}`;

    const tokenRes = await fetch(CREDENTIALS.token_uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
        throw new Error(`Failed to get access token: ${JSON.stringify(tokenData)}`);
    }
    return tokenData.access_token;
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
    const b64 = pem
        .replace(/-----BEGIN PRIVATE KEY-----/, '')
        .replace(/-----END PRIVATE KEY-----/, '')
        .replace(/\n/g, '');
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Submit URL to Google Indexing API
async function submitToGoogleIndexing(url: string, accessToken: string): Promise<{ success: boolean; message: string }> {
    try {
        const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                url,
                type: 'URL_UPDATED',
            }),
        });

        const data = await res.json();

        if (res.ok) {
            return { success: true, message: `Đã gửi yêu cầu index: ${url}` };
        } else {
            return { success: false, message: data.error?.message || `Lỗi: ${res.status}` };
        }
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// Ping Google with sitemap
async function pingSitemap(): Promise<void> {
    try {
        await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(`${SITE_URL}/sitemap.xml`)}`);
    } catch (e) {
        // Ignore
    }
}

// POST: Submit URL(s) for indexing
export async function POST(req: NextRequest) {
    try {
        const { postSlugs } = await req.json();

        if (!postSlugs || !Array.isArray(postSlugs) || postSlugs.length === 0) {
            return NextResponse.json({ error: 'postSlugs là bắt buộc' }, { status: 400 });
        }

        // Always use production domain
        const urlsToIndex = postSlugs.map((slug: string) => ({
            slug,
            url: `${SITE_URL}/blog/${slug}`,
        }));

        let accessToken: string;
        try {
            accessToken = await getAccessToken();
        } catch (authError: any) {
            // If auth fails, fallback to sitemap ping only
            console.error('Google auth failed:', authError.message);

            // Still mark as indexed (sitemap ping)
            await pingSitemap();

            // Update indexed_at for all posts
            const now = new Date().toISOString();
            for (const { slug } of urlsToIndex) {
                await supabase
                    .from('posts')
                    .update({ indexed_at: now })
                    .eq('slug', slug);
            }

            return NextResponse.json({
                message: `Đã ping sitemap cho ${postSlugs.length} bài. Google Indexing API chưa được cấu hình (cần thêm service account vào Search Console).`,
                results: urlsToIndex.map(u => ({ ...u, success: true, message: 'Đã ping sitemap' })),
                successCount: postSlugs.length,
                failCount: 0,
                note: 'Chỉ ping sitemap. Để dùng Indexing API, cần thêm service account làm owner trong Google Search Console.'
            });
        }

        const results = [];
        const now = new Date().toISOString();

        for (const { slug, url } of urlsToIndex) {
            const result = await submitToGoogleIndexing(url, accessToken);
            results.push({ slug, url, ...result });

            // Mark as indexed in database if successful
            if (result.success) {
                await supabase
                    .from('posts')
                    .update({ indexed_at: now })
                    .eq('slug', slug);
            }

            await new Promise(resolve => setTimeout(resolve, 200));
        }

        await pingSitemap();

        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        return NextResponse.json({
            message: `Đã gửi ${successCount}/${postSlugs.length} URL lên Google (domain: ${SITE_URL})`,
            results,
            successCount,
            failCount
        });
    } catch (error: any) {
        console.error('Index URL error:', error);
        return NextResponse.json({ error: error.message || 'Lỗi hệ thống' }, { status: 500 });
    }
}
