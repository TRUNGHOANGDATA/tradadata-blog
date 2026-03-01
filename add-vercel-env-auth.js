const { execSync } = require('child_process');
const fs = require('fs');

const TOKEN = 'vcp_5kDZL3AsV3KwFMc6yrKxUft8nrc7TNOeTljwyYxgsuO67q64wr1Ry11K';
const envVars = {
    'AUTH_URL': 'https://tradadata.com'
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
