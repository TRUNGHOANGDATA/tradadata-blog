import { google } from 'googleapis';
import { Readable } from 'stream';

// Google Drive API wrapper for blog image uploads
// Uses OAuth2 with Refresh Token (files owned by user's account, using their 15GB quota)

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

function getAuthClient() {
    // Method 1: OAuth2 with Refresh Token (RECOMMENDED - uses user's 15GB quota)
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

    if (clientId && clientSecret && refreshToken) {
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
        oauth2Client.setCredentials({ refresh_token: refreshToken });
        return oauth2Client;
    }

    // Method 2: Service Account (fallback - NOTE: has 0 storage quota!)
    const credentials = process.env.GOOGLE_DRIVE_CREDENTIALS;
    if (credentials) {
        try {
            const parsed = JSON.parse(credentials);
            console.warn('Using Service Account for Google Drive. Note: Service Accounts have 0 storage quota.');
            return new google.auth.JWT({
                email: parsed.client_email,
                key: parsed.private_key,
                scopes: SCOPES,
            });
        } catch (e) {
            console.error('Failed to parse Google Drive credentials:', e);
        }
    }

    console.warn('No Google Drive credentials configured. Image uploads will be disabled.');
    return null;
}

function getDriveClient() {
    const auth = getAuthClient();
    if (!auth) return null;
    return google.drive({ version: 'v3', auth });
}

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';

export interface UploadResult {
    id: string;
    url: string;
    name: string;
}

/**
 * Upload a file buffer to Google Drive
 */
export async function uploadToGoogleDrive(
    buffer: Buffer,
    fileName: string,
    mimeType: string
): Promise<UploadResult | null> {
    const drive = getDriveClient();

    if (!drive) {
        console.error('Google Drive client not available');
        return null;
    }

    try {
        // Create a readable stream from the buffer
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        // Upload file to Google Drive
        const response = await drive.files.create({
            requestBody: {
                name: `${Date.now()}_${fileName}`,
                parents: FOLDER_ID ? [FOLDER_ID] : undefined,
            },
            media: {
                mimeType,
                body: stream,
            },
            fields: 'id, name, webViewLink',
        });

        const fileId = response.data.id;
        if (!fileId) throw new Error('No file ID returned');

        // Set file to be publicly accessible
        await drive.permissions.create({
            fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Google Drive direct access URL
        const url = `https://lh3.googleusercontent.com/d/${fileId}=s0`;

        return {
            id: fileId,
            url,
            name: response.data.name || fileName,
        };
    } catch (error: any) {
        console.error('Error uploading to Google Drive:', error?.message || error);
        if (error?.response?.data) {
            console.error('Google Drive API Error Details:', JSON.stringify(error.response.data, null, 2));
        }
        return null;
    }
}

/**
 * Delete a file from Google Drive
 */
export async function deleteFromGoogleDrive(fileId: string): Promise<boolean> {
    const drive = getDriveClient();
    if (!drive) return false;

    try {
        await drive.files.delete({ fileId });
        return true;
    } catch (error) {
        console.error('Error deleting from Google Drive:', error);
        return false;
    }
}

/**
 * List all images in the blog folder
 */
export async function listGoogleDriveImages(pageSize = 50): Promise<Array<{
    id: string;
    name: string;
    url: string;
    thumbnailUrl: string;
    createdTime: string;
    size: string;
}>> {
    const drive = getDriveClient();
    if (!drive) return [];

    try {
        const query = FOLDER_ID
            ? `'${FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`
            : `mimeType contains 'image/' and trashed = false`;

        const response = await drive.files.list({
            q: query,
            pageSize,
            fields: 'files(id, name, createdTime, size, thumbnailLink)',
            orderBy: 'createdTime desc',
        });

        return (response.data.files || []).map(file => ({
            id: file.id || '',
            name: file.name || '',
            url: `https://lh3.googleusercontent.com/d/${file.id}=s0`,
            thumbnailUrl: `https://lh3.googleusercontent.com/d/${file.id}=s300`,
            createdTime: file.createdTime || '',
            size: file.size || '0',
        }));
    } catch (error) {
        console.error('Error listing Google Drive images:', error);
        return [];
    }
}
