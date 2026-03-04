import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

// Extract Google Drive file ID from various URL formats
function extractFileId(url: string): string | null {
    // Format: https://drive.google.com/file/d/FILE_ID/view
    const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) return fileMatch[1];

    // Format: https://drive.google.com/uc?export=download&id=FILE_ID
    // Format: https://drive.google.com/open?id=FILE_ID
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) return idMatch[1];

    return null;
}

// GET — check demo existence + verify auth/phone
export async function GET(request: Request) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    // 1. Check slug + demo existence first (no auth required)
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) {
        return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const { data: post } = await supabaseAdmin
        .from('posts')
        .select('demo_url, demo_filename')
        .eq('slug', slug)
        .single();

    if (!post?.demo_url) {
        return NextResponse.json({ error: 'File demo không tồn tại' }, { status: 404 });
    }

    // 2. Auth check
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json(
            { error: 'Vui lòng đăng nhập để tải file demo', hasDemo: true },
            { status: 401 }
        );
    }

    // 3. Phone check
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('phone')
        .eq('email', session.user.email)
        .single();

    if (!profile?.phone) {
        return NextResponse.json(
            { error: 'Vui lòng cập nhật số điện thoại trước khi tải file', hasDemo: true },
            { status: 403 }
        );
    }


    return NextResponse.json({ success: true, filename: post.demo_filename });
}

// POST — share file to user's email via Google Drive API + return view URL
export async function POST(request: Request) {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json(
            { error: 'Vui lòng đăng nhập để tải file demo' },
            { status: 401 }
        );
    }

    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    // 2. Phone check
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('phone')
        .eq('email', session.user.email)
        .single();

    if (!profile?.phone) {
        return NextResponse.json(
            { error: 'Vui lòng cập nhật số điện thoại trước khi tải file' },
            { status: 403 }
        );
    }

    // 3. Get slug from request body or URL
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) {
        return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const { data: post } = await supabaseAdmin
        .from('posts')
        .select('demo_url, demo_filename')
        .eq('slug', slug)
        .single();

    if (!post?.demo_url) {
        return NextResponse.json({ error: 'File demo không tồn tại' }, { status: 404 });
    }

    // 4. Share file with user's email via Google Drive API
    try {
        const fileId = extractFileId(post.demo_url);
        if (!fileId) {
            throw new Error('Invalid Google Drive URL: ' + post.demo_url);
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_OAUTH_CLIENT_ID,
            process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        );
        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
        });

        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        // Share file with user's email (reader access, no notification email)
        await drive.permissions.create({
            fileId,
            sendNotificationEmail: false,
            requestBody: {
                type: 'user',
                role: 'reader',
                emailAddress: session.user.email,
            },
        });

        console.log('[demo-download] Shared file', fileId, 'with', session.user.email);

        // Return Google Drive view URL
        const driveUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;

        return NextResponse.json({
            success: true,
            driveUrl,
            filename: post.demo_filename,
        });
    } catch (err: any) {
        // If permission already exists, still return the URL
        if (err?.code === 409 || err?.message?.includes('already has access')) {
            const fileId = extractFileId(post.demo_url);
            const driveUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
            return NextResponse.json({
                success: true,
                driveUrl,
                filename: post.demo_filename,
            });
        }

        console.error('Demo download error:', err?.message || err);
        return NextResponse.json(
            { error: 'Không thể chia sẻ file. Vui lòng thử lại sau.' },
            { status: 502 }
        );
    }
}
