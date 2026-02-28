const fs = require('fs');
const { execSync } = require('child_process');
const crypto = require('crypto');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const lines = envContent.split('\n');

const envs = ['production', 'preview', 'development'];

const keys = [];

for (const line of lines) {
    if (!line || line.trim().startsWith('#') || !line.includes('=')) continue;
    const splitIdx = line.indexOf('=');
    const key = line.substring(0, splitIdx).trim();
    keys.push(key);
}
keys.push('CRON_SECRET');

// Remove all keys first to clean up the bad ones
for (const key of keys) {
    console.log('Removing ' + key + '...');
    for (const env of envs) {
        try {
            execSync(`npx vercel env rm ${key} ${env} -y`, { stdio: 'ignore' });
        } catch (e) { }
    }
}

for (const line of lines) {
    if (!line || line.trim().startsWith('#') || !line.includes('=')) continue;
    const splitIdx = line.indexOf('=');
    const key = line.substring(0, splitIdx).trim();
    let val = line.substring(splitIdx + 1).trim();

    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);

    if (key === 'NEXT_PUBLIC_APP_URL') {
        val = 'https://blog.erx.vn';
    }

    console.log('Adding ' + key + '...');
    for (const env of envs) {
        try {
            // DONT append \n to input. 
            execSync(`npx vercel env add ${key} ${env}`, {
                input: val, // Just the exact value, Vercel will read until EOF
                stdio: ['pipe', 'ignore', 'ignore'],
                shell: true
            });
        } catch (err) {
            console.error('Error adding ' + key + ' to ' + env);
        }
    }
}

const cronSecret = crypto.randomBytes(32).toString('hex');
console.log('Adding CRON_SECRET...');
for (const env of envs) {
    try {
        execSync(`npx vercel env add CRON_SECRET ${env}`, {
            input: cronSecret,
            stdio: ['pipe', 'ignore', 'ignore'],
            shell: true
        });
    } catch (err) {
        console.error('Error adding CRON_SECRET to ' + env);
    }
}

console.log('Done uploading clean env vars');
