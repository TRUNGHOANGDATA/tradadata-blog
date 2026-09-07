import { NextRequest, NextResponse } from 'next/server';
import { loiThanhChu } from '@/lib/errors';
import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';
import { auth } from '@/lib/auth';
import { SITE_CONFIG } from '@/lib/constants';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Phải dùng đúng domain chuẩn (www) — middleware 301 non-www sang www,
// nếu submit non-www thì Google báo lỗi redirect và không index.
const SITE_URL = SITE_CONFIG.url;

// Build auth client from service account credentials
function getAuthClient() {
    const creds = JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS || '{}');
    if (!creds.client_email || !creds.private_key) {
        return null;
    }
    return new google.auth.JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: ['https://www.googleapis.com/auth/indexing'],
    });
}

// Submit URL to Google Indexing API
async function submitToGoogleIndexing(
    url: string,
    accessToken: string
): Promise<{ success: boolean; message: string }> {
    try {
        const res = await fetch(
            'https://indexing.googleapis.com/v3/urlNotifications:publish',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ url, type: 'URL_UPDATED' }),
            }
        );

        const data = await res.json();

        if (res.ok) {
            return { success: true, message: `Đã gửi yêu cầu index: ${url}` };
        } else {
            return {
                success: false,
                message: data.error?.message || `Lỗi: ${res.status}`,
            };
        }
    } catch (error) {
        return { success: false, message: loiThanhChu(error) };
    }
}

// Ping Google with sitemap
async function pingSitemap(): Promise<void> {
    try {
        await fetch(
            `https://www.google.com/ping?sitemap=${encodeURIComponent(`${SITE_URL}/sitemap.xml`)}`
        );
    } catch {
        // Ignore
    }
}

// POST: Submit URL(s) for indexing
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { postSlugs } = await req.json();

        if (!postSlugs || !Array.isArray(postSlugs) || postSlugs.length === 0) {
            return NextResponse.json(
                { error: 'postSlugs là bắt buộc' },
                { status: 400 }
            );
        }

        // Always use production domain
        const urlsToIndex = postSlugs.map((slug: string) => ({
            slug,
            url: `${SITE_URL}/blog/${slug}`,
        }));

        // Try to get auth token via google-auth-library JWT
        const authClient = getAuthClient();
        let accessToken: string | null = null;

        if (authClient) {
            try {
                const tokenRes = await authClient.authorize();
                accessToken = (tokenRes as { access_token?: string }).access_token || null;
            } catch (authError) {
                console.error('Google auth failed:', loiThanhChu(authError));
            }
        }

        if (!accessToken) {
            // Fallback: sitemap ping only
            await pingSitemap();

            const now = new Date().toISOString();
            for (const { slug } of urlsToIndex) {
                await supabase
                    .from('posts')
                    .update({ indexed_at: now })
                    .eq('slug', slug);
            }

            return NextResponse.json({
                message: `Đã ping sitemap cho ${postSlugs.length} bài. Google Indexing API chưa được cấu hình (cần thêm service account vào Search Console).`,
                results: urlsToIndex.map((u: { slug: string; url: string }) => ({
                    ...u,
                    success: true,
                    message: 'Đã ping sitemap',
                })),
                successCount: postSlugs.length,
                failCount: 0,
                note: 'Chỉ ping sitemap. Để dùng Indexing API, cần thêm service account làm owner trong Google Search Console.',
            });
        }

        // Use Indexing API
        const results = [];
        const now = new Date().toISOString();

        for (const { slug, url } of urlsToIndex) {
            const result = await submitToGoogleIndexing(url, accessToken);
            results.push({ slug, url, ...result });

            if (result.success) {
                await supabase
                    .from('posts')
                    .update({ indexed_at: now })
                    .eq('slug', slug);
            }

            await new Promise((resolve) => setTimeout(resolve, 200));
        }

        await pingSitemap();

        const successCount = results.filter((r) => r.success).length;
        const failCount = results.filter((r) => !r.success).length;

        return NextResponse.json({
            message: `Đã gửi ${successCount}/${postSlugs.length} URL lên Google (domain: ${SITE_URL})`,
            results,
            successCount,
            failCount,
        });
    } catch (error) {
        console.error('Index URL error:', error);
        return NextResponse.json(
            { error: loiThanhChu(error) || 'Lỗi hệ thống' },
            { status: 500 }
        );
    }
}
