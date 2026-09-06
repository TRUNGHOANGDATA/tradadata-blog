/**
 * Đẩy toàn bộ biến môi trường từ .env.local lên Vercel (môi trường production).
 *
 * KHÔNG hardcode secret vào file này — repo là public.
 * Giá trị đọc từ .env.local, token Vercel đọc từ biến VERCEL_TOKEN.
 *
 * Cách chạy:
 *   VERCEL_TOKEN=xxx node add-vercel-env.js
 * hoặc để VERCEL_TOKEN trong chính .env.local rồi:
 *   node add-vercel-env.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const { requireEnv } = require('./scripts-env');

const [TOKEN] = requireEnv('VERCEL_TOKEN');

// Các key cần đẩy lên Vercel. Giá trị lấy từ .env.local.
const KEYS = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'AUTH_SECRET',
    'AUTH_GOOGLE_ID',
    'AUTH_GOOGLE_SECRET',
    'NEXT_PUBLIC_APP_URL',
    'EMAIL_USER',
    'EMAIL_PASS',
    'GOOGLE_DRIVE_FOLDER_ID',
    'GOOGLE_DRIVE_FILES_FOLDER_ID',
    'GOOGLE_DRIVE_VIDEOS_FOLDER_ID',
    'GOOGLE_OAUTH_CLIENT_ID',
    'GOOGLE_OAUTH_CLIENT_SECRET',
    'GOOGLE_OAUTH_REFRESH_TOKEN',
    'GOOGLE_DRIVE_CREDENTIALS',
    'GEMINI_API_KEY',
    'CRON_SECRET',
    'BATCH_UPLOAD_API_KEY',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
];

async function fixAll() {
    const present = KEYS.filter((k) => process.env[k]);
    const skipped = KEYS.filter((k) => !process.env[k]);

    if (skipped.length) {
        console.log(`Bỏ qua (không có trong .env.local): ${skipped.join(', ')}\n`);
    }

    const total = present.length;
    let i = 0;

    for (const key of present) {
        i++;
        const value = process.env[key];

        // Xoá bản cũ nếu có
        try {
            execSync(`npx -y vercel env rm ${key} production --yes --token ${TOKEN}`, {
                stdio: 'pipe',
                timeout: 15000,
            });
        } catch (e) { /* chưa tồn tại thì thôi */ }

        // Ghi giá trị ra file tạm để tránh lỗi escape khi truyền qua shell
        const tmpFile = `${__dirname}/.env_tmp_val`;
        fs.writeFileSync(tmpFile, value, { encoding: 'utf8' });

        try {
            execSync(`npx -y vercel env add ${key} production --token ${TOKEN} < ${tmpFile}`, {
                cwd: __dirname,
                stdio: 'pipe',
                timeout: 15000,
                shell: 'cmd.exe', // cmd.exe hỗ trợ redirect <
            });
            console.log(`✅ [${i}/${total}] ${key}`);
        } catch (e) {
            console.error(`❌ [${i}/${total}] ${key}: ${e.stderr?.toString()?.substring(0, 100) || e.message}`);
        } finally {
            try { fs.unlinkSync(tmpFile); } catch (e) { }
        }
    }

    console.log('\n🎉 Xong.');
}

fixAll();
