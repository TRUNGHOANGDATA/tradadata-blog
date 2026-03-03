import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Load .env.local credentials
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const credLine = envContent.split('\n').find(l => l.startsWith('GOOGLE_DRIVE_CREDENTIALS='));
const CREDENTIALS = JSON.parse(credLine.replace('GOOGLE_DRIVE_CREDENTIALS=', ''));

const supabaseUrl = envContent.split('\n').find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL=')).replace('NEXT_PUBLIC_SUPABASE_URL=', '').trim();
const supabaseKey = envContent.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY=')).replace('SUPABASE_SERVICE_ROLE_KEY=', '').trim();

const SITE_URL = 'https://tradadata.com';
const BATCH_SIZE = 100; // Google allows 200/day, stay safe

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
    if (!data.access_token) throw new Error(`Auth failed: ${JSON.stringify(data)}`);
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

async function supabaseFetch(endpoint, options = {}) {
    const res = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
        ...options,
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': options.method === 'PATCH' ? 'return=minimal' : 'return=representation',
            ...options.headers,
        },
    });
    if (options.method === 'PATCH') return { ok: res.ok };
    return res.json();
}

async function main() {
    console.log('=== Google Indexing - Submit All Unindexed Posts ===');
    console.log('Domain:', SITE_URL);
    console.log('');

    // Fetch unindexed published posts from Supabase
    const posts = await supabaseFetch(
        'posts?select=slug,title&status=eq.published&indexed_at=is.null&order=published_at.desc&limit=' + BATCH_SIZE
    );

    if (!Array.isArray(posts) || posts.length === 0) {
        console.log('Tat ca bai viet da duoc index! Khong con bai nao can submit.');
        return;
    }

    console.log(`Tim thay ${posts.length} bai chua index. Bat dau submit...\n`);

    // Auth
    let accessToken;
    try {
        accessToken = await getAccessToken();
        console.log('Xac thuc Google thanh cong!\n');
    } catch (error) {
        console.error('Xac thuc that bai:', error.message);
        return;
    }

    let success = 0;
    let fail = 0;

    for (let i = 0; i < posts.length; i++) {
        const { slug, title } = posts[i];
        const url = `${SITE_URL}/blog/${slug}`;
        try {
            const result = await submitUrl(url, accessToken);
            if (result.status === 200) {
                console.log(`[${i + 1}/${posts.length}] OK: ${slug}`);
                success++;

                // Mark as indexed in database
                await supabaseFetch(
                    `posts?slug=eq.${slug}`,
                    {
                        method: 'PATCH',
                        body: JSON.stringify({ indexed_at: new Date().toISOString() }),
                    }
                );
            } else {
                console.log(`[${i + 1}/${posts.length}] FAIL: ${slug}`);
                console.log(`  Error: ${result.data.error?.message || JSON.stringify(result.data).substring(0, 150)}`);
                fail++;
            }
        } catch (error) {
            console.log(`[${i + 1}/${posts.length}] ERROR: ${slug} - ${error.message}`);
            fail++;
        }
        await new Promise(r => setTimeout(r, 300));
    }

    console.log(`\n=== Ket qua ===`);
    console.log(`Thanh cong: ${success}/${posts.length}`);
    console.log(`That bai: ${fail}/${posts.length}`);

    // Ping sitemap
    try {
        await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(`${SITE_URL}/sitemap.xml`)}`);
        console.log('Ping sitemap thanh cong');
    } catch (e) {
        console.log('Ping sitemap that bai');
    }
}

main().catch(console.error);
