// KHÔNG hardcode secret vào file này — repo là public.
// Token Vercel đọc từ biến VERCEL_TOKEN (env hoặc .env.local).
const { execSync } = require('child_process');
const fs = require('fs');
const { requireEnv } = require('./scripts-env');

const [TOKEN] = requireEnv('VERCEL_TOKEN');
const envVars = {
    'AUTH_URL': process.env.NEXT_PUBLIC_APP_URL || 'https://www.tradadata.com'
};

const tmpFile = `${__dirname}/.env_tmp_val`;

for (const [key, value] of Object.entries(envVars)) {
    try {
        execSync(`npx -y vercel env rm ${key} production --yes --token ${TOKEN}`, { stdio: 'pipe' });
    } catch (e) { }

    fs.writeFileSync(tmpFile, value, { encoding: 'utf8' });
    try {
        execSync(`npx -y vercel env add ${key} production --token ${TOKEN} < ${tmpFile}`, {
            cwd: __dirname,
            stdio: 'pipe',
            shell: 'cmd.exe'
        });
        console.log(`✅ Added ${key}`);
    } catch (e) {
        console.error(`❌ Error adding ${key}`);
    }
}
try { fs.unlinkSync(tmpFile); } catch (e) { }
