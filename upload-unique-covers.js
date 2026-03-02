const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
try { require('@dotenvx/dotenvx').config({ path: '.env.local' }); } catch { require('dotenv').config({ path: '.env.local' }); }
const { createClient } = require('@supabase/supabase-js');

const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_OAUTH_CLIENT_ID, process.env.GOOGLE_OAUTH_CLIENT_SECRET);
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth: oauth2Client });
const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ARTIFACT_DIR = 'C:\\Users\\trung\\.gemini\\antigravity\\brain\\aa338dd6-6f65-43e9-a9ca-04a0c070207c';

const imagePostMap = [
    { file: 'ai_supplychain_cover_1772470159630.png', slug: 'ai-trong-supply-chain-du-bao-nhu-cau-toi-uu-ton-kho' },
    { file: 'vba_errorhandling_cover_1772470175602.png', slug: 'xu-ly-loi-trong-vba-on-error-err-object-debug' },
    { file: 'gsheets_tips_cover_1772470195009.png', slug: 'google-sheets-20-phim-tat-va-meo-hay' },
    { file: 'python_webscraping_cover_1772470219386.png', slug: 'web-scraping-bang-python-beautifulsoup-requests' },
    { file: 'powerbi_service_cover_1772470233604.png', slug: 'power-bi-service-publish-chia-se-dashboard-auto-refresh' },
    { file: 'sql_index_cover_1772470248943.png', slug: 'index-trong-sql-tang-toc-truy-van-va-sai-lam-can-tranh' },
];

async function main() {
    console.log(`Uploading ${imagePostMap.length} images...`);
    for (const item of imagePostMap) {
        const filePath = path.join(ARTIFACT_DIR, item.file);
        if (!fs.existsSync(filePath)) { console.log(`SKIP: ${item.file}`); continue; }
        try {
            const res = await drive.files.create({
                requestBody: { name: item.file, parents: [folderId] },
                media: { mimeType: 'image/png', body: fs.createReadStream(filePath) },
                fields: 'id',
            });
            await drive.permissions.create({ fileId: res.data.id, requestBody: { role: 'reader', type: 'anyone' } });
            const url = `https://lh3.googleusercontent.com/d/${res.data.id}=s0`;
            const { error } = await supabase.from('posts').update({ cover_image: url }).eq('slug', item.slug);
            console.log(error ? `DB ERROR: ${item.slug}` : `OK: ${item.slug} -> ${url}`);
        } catch (err) { console.log(`ERROR: ${item.file} - ${err.message}`); }
    }
    console.log('Done!');
}
main();
