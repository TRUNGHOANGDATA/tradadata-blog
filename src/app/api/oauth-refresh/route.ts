import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Temporary endpoint to generate a new OAuth refresh token
// Step 1: GET /api/oauth-refresh → redirects to Google consent
// Step 2: Google redirects back with ?code=XXX → exchanges for refresh token

const REDIRECT_URI = process.env.NODE_ENV === 'production'
    ? 'https://tradadata.com/api/oauth-refresh'
    : 'http://localhost:3000/api/oauth-refresh';

export async function GET(request: Request) {
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
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
