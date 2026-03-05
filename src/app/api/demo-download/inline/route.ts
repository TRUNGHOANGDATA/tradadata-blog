import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

// Extract Google Drive file ID from various URL formats
function extractFileId(url: string): string | null {
    const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) return fileMatch[1];
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) return idMatch[1];
    return null;
}

// POST — share a specific Drive file with authenticated user
export async function POST(request: Request) {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json(
            { error: 'Vui lòng đăng nhập để tải file' },
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

    // 3. Get Drive URL from request body
    const body = await request.json();
    const { driveUrl } = body;

    if (!driveUrl) {
        return NextResponse.json({ error: 'Missing Drive URL' }, { status: 400 });
    }

    const fileId = extractFileId(driveUrl);
    if (!fileId) {
        return NextResponse.json({ error: 'Invalid Google Drive URL' }, { status: 400 });
    }

    // 4. Share file with user's email via Google Drive API
    try {
        const clientId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_OAUTH_CLIENT_ID;
        const clientSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_OAUTH_CLIENT_SECRET;
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
        });

        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        // Share file with user's email (reader access, no notification)
        await drive.permissions.create({
            fileId,
            sendNotificationEmail: false,
            requestBody: {
                type: 'user',
                role: 'reader',
                emailAddress: session.user.email,
            },
        });

        console.log('[inline-download] Shared file', fileId, 'with', session.user.email);

        const viewUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
        return NextResponse.json({ success: true, driveUrl: viewUrl });
    } catch (err: any) {
        // If permission already exists, still return the URL
        if (err?.code === 409 || err?.message?.includes('already has access')) {
            const viewUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
            return NextResponse.json({ success: true, driveUrl: viewUrl });
        }

        console.error('Inline download error:', err?.message || err);
        return NextResponse.json(
            { error: 'Không thể chia sẻ file. Vui lòng thử lại sau.' },
            { status: 502 }
        );
    }
}
