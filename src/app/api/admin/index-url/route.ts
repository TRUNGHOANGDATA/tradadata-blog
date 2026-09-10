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

type KetQuaToken = { token: string } | { loi: string };

/**
 * Lấy access token cho Google Indexing API từ service account.
 *
 * Trả về lý do CỤ THỂ khi thất bại. Trước đây mọi thất bại ở bước này đều báo
 * chung một câu "cần thêm service account vào Search Console" — câu đó luôn sai,
 * vì bước lấy token chạy TRƯỚC khi gọi Google Indexing, Search Console không thể
 * là nguyên nhân. Thiếu quyền Search Console chỉ hiện ra ở từng URL, dạng 403.
 */
async function layAccessToken(): Promise<KetQuaToken> {
    const raw = process.env.GOOGLE_DRIVE_CREDENTIALS;
    if (!raw) {
        return { loi: 'thiếu GOOGLE_DRIVE_CREDENTIALS trong env của môi trường đang chạy' };
    }

    let creds: { client_email?: string; private_key?: string };
    try {
        creds = JSON.parse(raw);
    } catch {
        return { loi: 'GOOGLE_DRIVE_CREDENTIALS không phải JSON hợp lệ' };
    }

    if (!creds.client_email || !creds.private_key) {
        return { loi: 'GOOGLE_DRIVE_CREDENTIALS thiếu client_email hoặc private_key' };
    }

    try {
        const client = new google.auth.JWT({
            email: creds.client_email,
            key: creds.private_key,
            scopes: ['https://www.googleapis.com/auth/indexing'],
        });
        const res = await client.authorize();
        const token = (res as { access_token?: string }).access_token;
        if (!token) {
            return { loi: 'Google không trả về access_token' };
        }
        return { token };
    } catch (error) {
        return {
            loi: `không lấy được access token (${loiThanhChu(error)}) — kiểm tra "Web Search Indexing API" đã bật trong project của service account chưa, và private_key trong JSON có còn nguyên các ký tự \\n không`,
        };
    }
}

/** Gửi một URL lên Google Indexing API. */
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
        }

        let message = data.error?.message || `Lỗi: ${res.status}`;
        if (res.status === 403) {
            // Lỗi hay gặp nhất và khó đoán nhất: token hợp lệ nhưng service
            // account không phải Owner của property chứa URL này.
            message += ' — service account phải là Owner của property trong Google Search Console (Full/Restricted không đủ)';
        }
        return { success: false, message };
    } catch (error) {
        return { success: false, message: loiThanhChu(error) };
    }
}

/**
 * Đẩy danh sách URL sang IndexNow (Bing, Yandex, Seznam, Naver).
 *
 * Thay cho `https://www.google.com/ping?sitemap=` — endpoint đó Google đã tắt từ
 * tháng 6/2023 và chỉ trả 404, nên hàm ping cũ là no-op nuốt lỗi rồi báo về
 * "Đã ping sitemap", tức báo thành công cho một việc không hề xảy ra.
 *
 * Cần `INDEXNOW_KEY` (chuỗi hex 8-128 ký tự, tự sinh) và key đó phải đọc được
 * công khai tại `${SITE_URL}/indexnow-key.txt` — do route
 * `src/app/indexnow-key.txt/route.ts` trả về, đọc cùng biến env.
 */
async function guiIndexNow(urls: string[]): Promise<{ ok: boolean; message: string }> {
    const key = process.env.INDEXNOW_KEY;
    if (!key) {
        return { ok: false, message: 'Bỏ qua IndexNow (thiếu INDEXNOW_KEY)' };
    }

    try {
        const res = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({
                host: new URL(SITE_URL).host,
                key,
                keyLocation: `${SITE_URL}/indexnow-key.txt`,
                urlList: urls,
            }),
        });

        // 200 = nhận, 202 = nhận nhưng đang chờ xác thực key.
        if (res.ok) {
            return { ok: true, message: `IndexNow đã nhận ${urls.length} URL` };
        }
        if (res.status === 403) {
            return { ok: false, message: 'IndexNow từ chối key (403) — kiểm tra /indexnow-key.txt có trả đúng key không' };
        }
        return { ok: false, message: `IndexNow trả ${res.status}` };
    } catch (error) {
        return { ok: false, message: `IndexNow lỗi: ${loiThanhChu(error)}` };
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

        const ketQuaToken = await layAccessToken();

        if ('loi' in ketQuaToken) {
            // Không gửi được lên Google. Vẫn đẩy IndexNow, nhưng KHÔNG ghi
            // `indexed_at`: đánh dấu "đã index" khi chưa gửi gì làm nút "index
            // bài chưa index" bỏ qua các bài này vĩnh viễn.
            const indexNow = await guiIndexNow(urlsToIndex.map((u) => u.url));
            console.error('Indexing API không dùng được:', ketQuaToken.loi);

            return NextResponse.json({
                message: `Chưa gửi lên Google được: ${ketQuaToken.loi}. ${indexNow.message}. ${postSlugs.length} bài vẫn ở trạng thái chưa index.`,
                results: urlsToIndex.map((u: { slug: string; url: string }) => ({
                    ...u,
                    success: false,
                    message: ketQuaToken.loi,
                })),
                successCount: 0,
                failCount: postSlugs.length,
                indexNow: indexNow.message,
                note: ketQuaToken.loi,
            });
        }

        // Use Indexing API
        const results = [];
        const now = new Date().toISOString();

        for (const { slug, url } of urlsToIndex) {
            const result = await submitToGoogleIndexing(url, ketQuaToken.token);
            results.push({ slug, url, ...result });

            if (result.success) {
                await supabase
                    .from('posts')
                    .update({ indexed_at: now })
                    .eq('slug', slug);
            }

            await new Promise((resolve) => setTimeout(resolve, 200));
        }

        const indexNow = await guiIndexNow(urlsToIndex.map((u) => u.url));

        const successCount = results.filter((r) => r.success).length;
        const failCount = results.filter((r) => !r.success).length;

        return NextResponse.json({
            message: `Đã gửi ${successCount}/${postSlugs.length} URL lên Google (domain: ${SITE_URL}). ${indexNow.message}.`,
            results,
            successCount,
            failCount,
            indexNow: indexNow.message,
        });
    } catch (error) {
        console.error('Index URL error:', error);
        return NextResponse.json(
            { error: loiThanhChu(error) || 'Lỗi hệ thống' },
            { status: 500 }
        );
    }
}
