const { execSync } = require('child_process');

const TOKEN = 'vcp_5kDZL3AsV3KwFMc6yrKxUft8nrc7TNOeTljwyYxgsuO67q64wr1Ry11K';

const envVars = {
    'NEXT_PUBLIC_SUPABASE_URL': 'https://ujwdhjtzmmflhfewqtid.supabase.co',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqd2RoanR6bW1mbGhmZXdxdGlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxOTYyMzAsImV4cCI6MjA4Nzc3MjIzMH0.s7RVWgLzGKjrC_HHDK58_jLGVmpeM1mpWcGwPOvaq8Y',
    'SUPABASE_SERVICE_ROLE_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqd2RoanR6bW1mbGhmZXdxdGlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE5NjIzMCwiZXhwIjoyMDg3NzcyMjMwfQ.HYb8Mg9v41RY7AF-ZJLrxx3AsRZQlb5mP136MPAPcno',
    'AUTH_SECRET': 'sOOKKOShXnYQXV3ehLWkz77imisco54CJtuP+hwyUY0=',
    'AUTH_GOOGLE_ID': '12337720040-ru10f13cdmgso5dv38am65eoc2pftl7h.apps.googleusercontent.com',
    'AUTH_GOOGLE_SECRET': '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',
    'NEXT_PUBLIC_APP_URL': 'https://tradadata.com',
    'EMAIL_USER': 'trung.h@erx.vn',
    'EMAIL_PASS': 'bsieumubcivofavn',
    'GOOGLE_DRIVE_FOLDER_ID': '1GxKzqqk_D2kIqFZa5Ise3V9iFgsYTHKU',
    'GOOGLE_OAUTH_CLIENT_ID': '112027517605-p5nr6mlbovi62co2dij72gffk7t8fguj.apps.googleusercontent.com',
    'GOOGLE_OAUTH_CLIENT_SECRET': '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',
    'GOOGLE_OAUTH_REFRESH_TOKEN': '1//0e8Q_xp5gnePeCgYIARAAGA4SNwF-L9IraF1AEYDfyDrPlQ1v-naWYo5rIBZaVPSDHsfmra85qXZMvos-ntm1Bd61jwtgBXR14dc',
    'GEMINI_API_KEY': 'AIzaSyCM0qaVLXJ2uHIL8roVsyGosNMTmY81u1I',
    'CRON_SECRET': 'tradadata-cron-secret-2026',
};

// GOOGLE_DRIVE_CREDENTIALS is special (long JSON)
const GOOGLE_DRIVE_CREDENTIALS = '{"type":"service_account","project_id":"tradadata-blog-auth","private_key_id":"32c37c2e663779dc3eb990bbaefc9a56212fa21e","private_key":"-----BEGINPRIVATEKEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDhmGlpKsIzbxGN\\n+dtZNGHhBYPHVQcQyIHirIfVDhP0jQH1jinzYEEsDhSaNaraoMzCk7DJJz9l8xVN\\nlE/trgtYJi1jlXj9ChMRBJkCAbrRqm7pmzGCk2C7b/F4IudTSeOkff7VTxv9FFn9\\nFeVCyh8CYk9fzpqA5U9d5XXnGF1axPlk7PcILWqZAVxz/GvEZBt5vWf2TkkEHs2r\\nq6Yo2jG0/aqMix+4Tk2cugWam7uznESfjn2c1Ne/fBvDyjrb2CvrLiwIgOy6l+T2\\ngzdDc4l1LEDRlJ4esnAiS9if8Y2eKZVlaRTiqtq4SkNNO9dKiDmVKt72ljiXeyFQ\\nRlxmhe59AgMBAAECggEAS++tq8TE0eNVGWE9QG2tdL0SeopYcoHLlq1Um5a9iNfe\\nDPXpkQ6ZYWbr8GyYMjdmNSjZnRwk7wA/73k43lxzXRycsqShsSsu98+AYXiLlf+0\\njdW7eKR7LxyjPzkgfJymj7wJh2u1lB7Bm7s/DJhUj8zfwvQcdb66VHTklwFQiziY\\nk/In+eoS+UEbNbLX/NAnQMA6Jo5wsbZA/mDMSfHh3jQxyXpRB2WVbXKN4i053Me+\\nRTxHPLNCxy54Rv34Cgw0mhBXFK/vawscEyPApilb6ZS384krKhH2YwghmMgYW1dN\\nX45iNECsRuCNBEqFjpbQ2ynTNAk3OS4sro8EbtxkUQKBgQD2bIbv8xbXvwpzRFJE\\n5hdaKqoumZGWjsjuhdw8u5JUSyP0m/KGkwsmdHx76aEzGopVgN7UK3gKwTDj1FNP\\nCZ9NgmFXaIkRAcKbiWy8TlhsxHyq52owKgWCbglZIlL55FR1qqlT0UjK7D8tQqvV\\nuqNUX2ztCjxwoUP7ufNPOGRZswKBgQDqXK2PXgjqi2BegCGRZ1Of1JTuXQ4f3aab\\n7QTm3X8PIIf3mmUjFR/pVqjR0VfJ4s+cztDwUCTfQQeXrjhQOZgW69RiMMKRdrQP\\np6ugZS8kFUSqSiWd9jG6QrCkhbkdjM9n+HFJLw7Htro5xiV/8p9pqpfyaYmZ4u90\\nWfu/0xgfDwKBgA/H8XhKZAsbA+tP08jvx00R8GYdlZJDwKBt2CXXiU52pW3T0ttF\\nbXBgA1zYIGeqanOBVkPWKNDfgGcGwPMN1bLcB6nWWvjI2RKm4VzJ06Xbi3RSb514\\nA3RP4a9goFm6gqIqdL+WZogASyd13pVIZ49OsSYZArffy//B79AB94M7AoGAJyAT\\nxZSATo+4Je6kK/8hAdTejDCy0/UQBIX8RIKD3MWkjVyUN9gl/LF/+49EZarc2CPa\\n09O9ZBwaJWNreVE0J9d1HHNheCFmDBsE1wEtbouya+92+jkIsjzB+qVscxd35Lag\\nSwR1JjhGPLDsv8CEhoJ5XXnrA+rT6QvAsJSQOVcCgYEAvnk86RdLSQlwU0T9masG\\nwdfLdvWUg05jha48iMSDg9f53KzvJjpOcLwewCaOPJZxCbL/N68pumczJvcFvehB\\nBw843EmuJjLdJGtB4U9pmwtxuKXTIrUVYeE+szwj2dsss6zbt30KaIylbvBechqo\\nq25dn0/lAy15B6TKYBaea8U=\\n-----ENDPRIVATEKEY-----\\n","client_email":"tradadata-bot@tradadata-blog-auth.iam.gserviceaccount.com","client_id":"115202838793424117246","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/tradadata-bot%40tradadata-blog-auth.iam.gserviceaccount.com","universe_domain":"googleapis.com"}';

envVars['GOOGLE_DRIVE_CREDENTIALS'] = GOOGLE_DRIVE_CREDENTIALS;

async function fixAll() {
    const total = Object.keys(envVars).length;
    let i = 0;
    for (const [key, value] of Object.entries(envVars)) {
        i++;
        // Remove existing
        try {
            execSync(`npx -y vercel env rm ${key} production --yes --token ${TOKEN}`, { stdio: 'pipe', timeout: 15000 });
        } catch (e) { /* may not exist */ }

        // Write value to temp file to avoid shell escaping issues
        const tmpFile = `${__dirname}/.env_tmp_val`;
        const fs = require('fs');
        fs.writeFileSync(tmpFile, value, { encoding: 'utf8' });

        try {
            execSync(`npx -y vercel env add ${key} production --token ${TOKEN} < ${tmpFile}`, {
                cwd: __dirname,
                stdio: 'pipe',
                timeout: 15000,
                shell: 'cmd.exe'  // Use cmd.exe which supports < redirect
            });
            console.log(`✅ [${i}/${total}] ${key}`);
        } catch (e) {
            console.error(`❌ [${i}/${total}] ${key}: ${e.stderr?.toString()?.substring(0, 100) || e.message}`);
        }

        // Cleanup
        try { fs.unlinkSync(tmpFile); } catch (e) { }
    }
    console.log('\n🎉 All env vars fixed!');
}

fixAll();
