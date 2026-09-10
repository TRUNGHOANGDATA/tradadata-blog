import { NextResponse } from 'next/server';
import { loiThanhChu } from '@/lib/errors';
import { google } from 'googleapis';
import { auth } from '@/lib/auth';

// Sinh lại refresh token Google Drive khi token cũ bị `invalid_grant`.
// Bước 1: GET /api/oauth-refresh → chuyển sang trang đồng ý của Google
// Bước 2: Google trả về kèm ?code=XXX → đổi code lấy refresh token
//
// Dùng chính AUTH_GOOGLE_ID/SECRET — cùng cặp mà `src/lib/storage/google-drive.ts`
// ưu tiên đọc — nên token sinh ra khớp client theo cấu tạo. Đó là lý do nên xoay
// token bằng route này chứ không bằng `get-google-token.js` (script đó xin scope
// `drive.file`, hẹp hơn `drive`, sẽ làm chết demo-download/revoke-public-access).

// Phải là www: middleware 301 non-www sang www. Cả hai bản đã được khai trong
// Authorized redirect URIs của OAuth client, nhưng dùng www thì luồng không phải
// đi qua một cú 301 nữa.
const REDIRECT_URI = process.env.NODE_ENV === 'production'
    ? 'https://www.tradadata.com/api/oauth-refresh'
    : 'http://localhost:3000/api/oauth-refresh';

export async function GET(request: Request) {
    // Route này in refresh_token — chìa khoá full scope `drive` vào Drive của chủ
    // site — thẳng ra trình duyệt, nên KHÔNG được để public. Middleware loại trừ
    // `api/` khỏi `auth()` nên phải tự chốt ở đây.
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    // Use AUTH_GOOGLE_ID/SECRET (the correct GCP project client)
    const clientId = process.env.AUTH_GOOGLE_ID;
    const clientSecret = process.env.AUTH_GOOGLE_SECRET;

    if (!clientId || !clientSecret) {
        return NextResponse.json({ error: 'Missing AUTH_GOOGLE_ID or AUTH_GOOGLE_SECRET' }, { status: 500 });
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

    if (!code) {
        // Step 1: Redirect to Google consent
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: ['https://www.googleapis.com/auth/drive'],
        });
        return NextResponse.redirect(authUrl);
    }

    // Step 2: Exchange code for tokens
    try {
        const { tokens } = await oauth2Client.getToken(code);
        return NextResponse.json({
            success: true,
            refresh_token: tokens.refresh_token,
            access_token: tokens.access_token,
            message: 'Copy the refresh_token and set it as GOOGLE_OAUTH_REFRESH_TOKEN in your env vars',
        });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}
