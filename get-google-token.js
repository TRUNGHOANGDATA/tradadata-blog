/**
 * One-time script to get a Google OAuth2 Refresh Token.
 * 
 * STEPS:
 * 1. Go to Google Cloud Console → APIs & Services → Credentials
 * 2. Create OAuth 2.0 Client ID (type: "Desktop app")
 * 3. Download the JSON or copy Client ID and Client Secret
 * 4. Run this script: node get-google-token.js
 * 5. Paste the Client ID and Client Secret when asked
 * 6. Open the URL in the browser, authorize, copy the code
 * 7. Paste the authorization code
 * 8. You'll get a Refresh Token → copy it into .env.local
 */

const readline = require('readline');
const https = require('https');
const http = require('http');
const url = require('url');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
    console.log('==============================================');
    console.log('  Google OAuth2 Refresh Token Generator');
    console.log('==============================================\n');
    console.log('Pre-requisites:');
    console.log('1. Google Cloud Console → APIs & Services → Credentials');
    console.log('2. Create OAuth 2.0 Client ID (type: "Desktop app")');
    console.log('3. Enable Google Drive API\n');

    const clientId = await ask('Enter your OAuth Client ID: ');
    const clientSecret = await ask('Enter your OAuth Client Secret: ');

    const REDIRECT_URI = 'http://localhost:3333/callback';
    const SCOPES = 'https://www.googleapis.com/auth/drive.file';

    const authParams = new URLSearchParams({
        client_id: clientId.trim(),
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: SCOPES,
        access_type: 'offline',
        prompt: 'consent'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams.toString()}`;

    console.log('\n--- Step 1: Authorize in your browser ---');
    console.log('Open this URL in your browser:\n');
    console.log(authUrl);
    console.log('\nWaiting for authorization callback on http://localhost:3333 ...\n');

    // Start a temporary local server to catch the callback
    const code = await new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            const parsed = url.parse(req.url, true);
            if (parsed.pathname === '/callback' && parsed.query.code) {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>✅ Authorization successful!</h1><p>You can close this tab and go back to the terminal.</p>');
                server.close();
                resolve(parsed.query.code);
            } else {
                res.writeHead(400);
                res.end('Error: No authorization code received.');
            }
        });
        server.listen(3333, () => {
            console.log('Local server started on port 3333...');
        });
        server.on('error', (err) => {
            console.error('Server error:', err.message);
            reject(err);
        });
    });

    console.log('\n--- Step 2: Exchanging code for tokens ---\n');

    // Exchange code for tokens
    const postData = new URLSearchParams({
        code: code,
        client_id: clientId.trim(),
        client_secret: clientSecret.trim(),
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
    }).toString();

    const tokenResponse = await new Promise((resolve, reject) => {
        const req = https.request({
            hostname: 'oauth2.googleapis.com',
            path: '/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData),
            },
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });

    if (tokenResponse.error) {
        console.error('Error:', tokenResponse.error, tokenResponse.error_description);
        rl.close();
        return;
    }

    console.log('✅ Success! Here are your tokens:\n');
    console.log('==============================================');
    console.log('REFRESH TOKEN (copy this to .env.local):');
    console.log('==============================================');
    console.log(tokenResponse.refresh_token);
    console.log('\n==============================================');
    console.log('\nAdd these to your .env.local file:');
    console.log('==============================================');
    console.log(`GOOGLE_OAUTH_CLIENT_ID=${clientId.trim()}`);
    console.log(`GOOGLE_OAUTH_CLIENT_SECRET=${clientSecret.trim()}`);
    console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${tokenResponse.refresh_token}`);
    console.log('==============================================\n');

    rl.close();
}

main().catch(console.error);
