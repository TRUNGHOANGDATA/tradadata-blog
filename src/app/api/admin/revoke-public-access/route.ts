import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Extract Google Drive file ID from various URL formats
function extractFileId(url: string): string | null {
    const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) return fileMatch[1];
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) return idMatch[1];
    return null;
}

// POST — revoke 'Anyone with the link' permission from demo files (batched)
// Query params: ?offset=0&limit=20
export async function POST(request: Request) {
    // Auth check — admin only
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    // Check admin role
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('email', session.user.email)
        .single();

    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    // Parse batch params
    const { searchParams } = new URL(request.url);
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = parseInt(searchParams.get('limit') || '15');

    // Get demo URLs with pagination
    const { data: allPosts, count } = await supabaseAdmin
        .from('posts')
        .select('slug, demo_url', { count: 'exact' })
        .not('demo_url', 'is', null)
        .range(offset, offset + limit - 1);

    if (!allPosts || allPosts.length === 0) {
        return NextResponse.json({ message: 'No more files to process', total: count, offset, done: true });
    }

    // Build Drive client
    const clientId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const results: { slug: string; status: string; details?: string }[] = [];

    for (const post of allPosts) {
        const fileId = extractFileId(post.demo_url);
        if (!fileId) {
            results.push({ slug: post.slug, status: 'error', details: 'Invalid URL' });
            continue;
        }

        try {
            // List permissions
            const perms = await drive.permissions.list({
                fileId,
                fields: 'permissions(id,type,role)',
            });

            const anyonePerms = (perms.data.permissions || []).filter(
                (p) => p.type === 'anyone'
            );

            if (anyonePerms.length === 0) {
                results.push({ slug: post.slug, status: 'already_private' });
                continue;
            }

            // Delete each 'anyone' permission
            for (const perm of anyonePerms) {
                if (perm.id) {
                    await drive.permissions.delete({ fileId, permissionId: perm.id });
                }
            }

            results.push({
                slug: post.slug,
                status: 'revoked',
                details: `Removed ${anyonePerms.length} public permission(s)`,
            });
        } catch (err: any) {
            results.push({
                slug: post.slug,
                status: 'error',
                details: err?.message || 'Unknown error',
            });
        }
    }

    const hasMore = offset + limit < (count || 0);

    return NextResponse.json({
        batch: { offset, limit, processed: allPosts.length },
        total: count,
        hasMore,
        nextOffset: hasMore ? offset + limit : null,
        revoked: results.filter((r) => r.status === 'revoked').length,
        already_private: results.filter((r) => r.status === 'already_private').length,
        errors: results.filter((r) => r.status === 'error').length,
        details: results,
    });
}
