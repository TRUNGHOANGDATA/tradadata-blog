const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { Readable } = require('stream');
require('dotenv').config({ path: '.env.local' });

async function testUpload() {
    console.log('Testing Google Drive upload...');
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
    const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!clientId || !clientSecret || !refreshToken) {
        console.error('Missing Google OAuth credentials');
        return;
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    try {
        const buffer = Buffer.from('test file content');
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        console.log('Uploading to Google Drive...');
        const response = await drive.files.create({
            requestBody: {
                name: 'test_upload_' + Date.now() + '.txt',
                parents: FOLDER_ID ? [FOLDER_ID] : undefined,
            },
            media: {
                mimeType: 'text/plain',
                body: stream,
            },
            fields: 'id, name',
        });

        console.log('Upload successful! File ID:', response.data.id);

        await drive.files.delete({ fileId: response.data.id });
        console.log('Deleted test file.');

    } catch (error) {
        console.error('Error during upload:', error.message || error);
    }
}

testUpload();
