import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Load .env.local credentials
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const credLine = envContent.split('\n').find(l => l.startsWith('GOOGLE_DRIVE_CREDENTIALS='));
const CREDENTIALS = JSON.parse(credLine.replace('GOOGLE_DRIVE_CREDENTIALS=', ''));
const SITE_URL = 'https://tradadata.com';

const URLS = [
    `${SITE_URL}/blog/machine-learning-co-ban-cho-data-analyst`,
    `${SITE_URL}/blog/toi-uu-toc-do-vba-10-ky-thuat-macro-nhanh`,
    `${SITE_URL}/blog/indirect-offset-tham-chieu-dong-excel`,
    `${SITE_URL}/blog/m-language-nang-cao-custom-functions-error-handling`,
    `${SITE_URL}/blog/data-validation-nang-cao-trong-google-sheets`,
    `${SITE_URL}/blog/row-level-security-trong-power-bi-phan-quyen`,
    `${SITE_URL}/blog/if-nang-cao-ifs-switch-lambda-let-excel`,
    `${SITE_URL}/blog/stored-procedure-trong-sql-thu-tuc-luu-tru`,
    `${SITE_URL}/blog/power-bi-conditional-formatting-custom-visual`,
    `${SITE_URL}/blog/regular-expressions-trong-python-xu-ly-chuoi`,
];

function base64url(data) {
    return Buffer.from(data).toString('base64')
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getAccessToken() {
    const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const now = Math.floor(Date.now() / 1000);
    const claimSet = base64url(JSON.stringify({
        iss: CREDENTIALS.client_email,
        scope: 'https://www.googleapis.com/auth/indexing',
        aud: CREDENTIALS.token_uri,
        exp: now + 3600,
        iat: now,
    }));

    const signInput = `${header}.${claimSet}`;
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signInput);
    const signature = base64url(sign.sign(CREDENTIALS.private_key));
    const jwt = `${signInput}.${signature}`;

    const res = await fetch(CREDENTIALS.token_uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });

    const data = await res.json();
    if (!data.access_token) {
        throw new Error(`Auth failed: ${JSON.stringify(data)}`);
    }
    return data.access_token;
}

async function submitUrl(url, accessToken) {
    const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ url, type: 'URL_UPDATED' }),
    });
    const data = await res.json();
    return { status: res.status, data };
}

async function pingSitemap() {
    try {
        await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(`${SITE_URL}/sitemap.xml`)}`);
        console.log('Ping sitemap thanh cong');
    } catch (e) {
        console.log('Ping sitemap that bai');
    }
}

async function main() {
    console.log('=== Google Indexing - Submit 10 URLs ===');
    console.log('Domain:', SITE_URL);
    console.log('Service Account:', CREDENTIALS.client_email);
    console.log('');

    let accessToken;
    try {
        accessToken = await getAccessToken();
        console.log('Xac thuc Google thanh cong!\n');
    } catch (error) {
        console.error('Xac thuc that bai:', error.message);
        console.log('Fallback: Ping sitemap...');
        await pingSitemap();
        return;
    }

    let success = 0;
    let fail = 0;

    for (let i = 0; i < URLS.length; i++) {
        const url = URLS[i];
        try {
            const result = await submitUrl(url, accessToken);
            if (result.status === 200) {
                console.log(`[${i + 1}/10] OK: ${url}`);
                success++;
            } else {
                console.log(`[${i + 1}/10] FAIL: ${url}`);
                console.log(`  Error: ${result.data.error?.message || JSON.stringify(result.data).substring(0, 200)}`);
                fail++;
            }
        } catch (error) {
            console.log(`[${i + 1}/10] ERROR: ${url} - ${error.message}`);
            fail++;
        }
        await new Promise(r => setTimeout(r, 300));
    }

    console.log(`\n=== Ket qua ===`);
    console.log(`Thanh cong: ${success}/10`);
    console.log(`That bai: ${fail}/10`);
    await pingSitemap();
}

main().catch(console.error);
