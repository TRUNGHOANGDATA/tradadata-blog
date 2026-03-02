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

const newPosts = [
    { cover: 'ml_basics_cover_1772476482411.png', slug: 'machine-learning-co-ban-cho-data-analyst' },
    { cover: 'vba_speed_cover_1772476499350.png', slug: 'toi-uu-toc-do-vba-10-ky-thuat-macro-nhanh' },
    { cover: 'm_lang_advanced_cover_1772476516887.png', slug: 'm-language-nang-cao-custom-functions-error-handling' },
    { cover: 'gsheets_validation_cover_1772476539877.png', slug: 'data-validation-nang-cao-trong-google-sheets' },
    { cover: 'pbi_rls_cover_1772476560573.png', slug: 'row-level-security-trong-power-bi-phan-quyen' },
];

async function uploadAndUpdate(item) {
    try {
        const coverPath = path.join(ARTIFACT_DIR, item.cover);
        const res = await drive.files.create({
            requestBody: { name: `cover_${item.cover}`, parents: [folderId] },
            media: { mimeType: 'image/png', body: fs.createReadStream(coverPath) },
            fields: 'id',
        });
        await drive.permissions.create({ fileId: res.data.id, requestBody: { role: 'reader', type: 'anyone' } });
        const coverUrl = `https://lh3.googleusercontent.com/d/${res.data.id}=s0`;

        const { error } = await supabase.from('posts').update({ cover_image: coverUrl }).eq('slug', item.slug);
        if (error) { console.log(`DB ERROR: ${item.slug}`); return; }
        console.log(`OK: ${item.slug}`);
    } catch (err) { console.log(`ERROR: ${item.slug} - ${err.message}`); }
}

async function main() {
    console.log(`Uploading ${newPosts.length} covers...`);
    for (const item of newPosts) {
        await uploadAndUpdate(item);
        await new Promise(r => setTimeout(r, 300));
    }
    console.log('Done!');
}
main();
