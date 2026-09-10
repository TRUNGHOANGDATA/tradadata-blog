import { google } from 'googleapis';
import { loiThanhChu, thuocTinhLoi } from '@/lib/errors';
import { Readable } from 'stream';

// Google Drive API wrapper for blog uploads
// Uses OAuth2 with Refresh Token (files owned by user's account, using their 15GB quota)
// Fallback to Service Account if OAuth2 not configured

const SCOPES = ['https://www.googleapis.com/auth/drive'];

function getAuthClient() {
    // Method 1: OAuth2 with Refresh Token (uses user's 15GB quota)
    // Try AUTH_GOOGLE_* first (correct GCP project), then GOOGLE_OAUTH_* as fallback
    const clientId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

    if (clientId && clientSecret && refreshToken) {
        console.log('Using OAuth2 for Google Drive with client:', clientId.substring(0, 20) + '...');
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

    console.warn('No Google Drive credentials configured. Uploads will be disabled.');
    return null;
}

function getDriveClient() {
    const auth = getAuthClient();
    if (!auth) return null;
    return google.drive({ version: 'v3', auth });
}

/**
 * Dịch lỗi thô của Google Drive/OAuth thành một câu tiếng Việt chỉ đúng nguyên
 * nhân, để admin/editor biết ngay phải xoay token hay dọn quota — thay vì câu
 * chung chung "Check Google Drive configuration" giấu hết manh mối trong log pod.
 */
function moTaLoiDrive(error: unknown): string {
    const chiTiet = thuocTinhLoi<{ error?: unknown; error_description?: unknown; errors?: Array<{ reason?: string; message?: string }> }>(
        thuocTinhLoi<{ data?: unknown }>(error, 'response')?.data ?? error,
        'error',
    );
    const goc = (loiThanhChu(error) + ' ' + JSON.stringify(chiTiet ?? '')).toLowerCase();

    if (goc.includes('invalid_grant')) {
        // Đừng đoán "consent screen đang Testing nên token hết hạn sau 7 ngày" —
        // câu đó từng nằm ở đây và luôn sai: app đã ở "In production" từ lâu.
        // `invalid_grant` hay gặp nhất là token KHÔNG KHỚP CLIENT: refresh token bị
        // ràng buộc vào client đã sinh ra nó, mà Secret cụm có cả AUTH_GOOGLE_* lẫn
        // GOOGLE_OAUTH_CLIENT_*, còn getAuthClient() ưu tiên AUTH_GOOGLE_*.
        return 'Refresh token Google không dùng được (invalid_grant). Hay gặp nhất: token được sinh bằng OAuth client KHÁC với AUTH_GOOGLE_ID hiện tại — sinh lại bằng /api/oauth-refresh (route đó dùng đúng cặp AUTH_GOOGLE_*). Các khả năng khác: quyền đã bị thu hồi ở myaccount.google.com/permissions, mật khẩu Google vừa đổi, hoặc token không dùng suốt 6 tháng.';
    }
    if (goc.includes('storagequotaexceeded')) {
        return 'Google Drive đã hết dung lượng (quota). Nếu đang chạy bằng service account thì nó có 0 quota — phải dùng OAuth2 refresh token của tài khoản có dung lượng.';
    }
    if (goc.includes('invalid_client') || goc.includes('unauthorized_client')) {
        return 'AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET không khớp với client đã sinh refresh token.';
    }
    if (goc.includes('insufficientpermissions') || goc.includes('forbidden') || goc.includes('403')) {
        return 'Không đủ quyền ghi vào thư mục Drive — kiểm tra quyền chia sẻ của folder và GOOGLE_DRIVE_FOLDER_ID.';
    }
    if (goc.includes('notfound') || goc.includes('404')) {
        return 'Không tìm thấy thư mục Drive — GOOGLE_DRIVE_FOLDER_ID có thể sai hoặc đã bị xoá.';
    }
    return 'Lỗi Google Drive: ' + loiThanhChu(error);
}

const IMAGE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
const FILES_FOLDER_ID = process.env.GOOGLE_DRIVE_FILES_FOLDER_ID || '';
const VIDEOS_FOLDER_ID = process.env.GOOGLE_DRIVE_VIDEOS_FOLDER_ID || '';

export interface UploadResult {
    id: string;
    url: string;
    name: string;
}

/**
 * Upload an image to Google Drive (images folder)
 * Images are made PUBLIC for display in blog posts
 */
export async function uploadToGoogleDrive(
    buffer: Buffer,
    fileName: string,
    mimeType: string
): Promise<UploadResult | null> {
    return uploadToDriveFolder(buffer, `${Date.now()}_${fileName}`, mimeType, IMAGE_FOLDER_ID, true);
}

/**
 * Upload a demo file to Google Drive (files folder)
 * Demo files are PRIVATE — only shared via API when user logs in
 */
export async function uploadFileToDrive(
    buffer: Buffer,
    fileName: string,
    mimeType: string
): Promise<UploadResult | null> {
    return uploadToDriveFolder(buffer, fileName, mimeType, FILES_FOLDER_ID, false);
}

/**
 * Core upload function — same auth, just different folder
 * @param makePublic - if true, set 'Anyone with the link' permission (for images)
 */
async function uploadToDriveFolder(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    folderId: string,
    makePublic: boolean = true
): Promise<UploadResult | null> {
    const drive = getDriveClient();
    if (!drive) {
        console.error('Google Drive client not available');
        throw new Error('Chưa cấu hình Google Drive credentials (thiếu AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET / GOOGLE_OAUTH_REFRESH_TOKEN trong Secret k8s).');
    }

    try {
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                parents: folderId ? [folderId] : undefined,
            },
            media: { mimeType, body: stream },
            fields: 'id, name, webViewLink',
        });

        const fileId = response.data.id;
        if (!fileId) throw new Error('No file ID returned');

        // Only set public access for images, NOT for demo files
        if (makePublic) {
            await drive.permissions.create({
                fileId,
                requestBody: { role: 'reader', type: 'anyone' },
            });
        }

        const url = makePublic
            ? `https://lh3.googleusercontent.com/d/${fileId}=s0`
            : `https://drive.google.com/file/d/${fileId}/view`;

        return {
            id: fileId,
            url,
            name: response.data.name || fileName,
        };
    } catch (error) {
        console.error('Error uploading to Google Drive:', loiThanhChu(error));
        const chiTiet = thuocTinhLoi<{ data?: unknown }>(error, 'response')?.data;
        if (chiTiet) {
            console.error('Google Drive API Error Details:', JSON.stringify(chiTiet, null, 2));
        }
        throw new Error(moTaLoiDrive(error));
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
 * List images in the images folder
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
        const query = IMAGE_FOLDER_ID
            ? `'${IMAGE_FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`
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

/**
 * List demo files in the files folder
 */
export async function listGoogleDriveFiles(pageSize = 200): Promise<Array<{
    id: string;
    name: string;
    downloadUrl: string;
    webViewLink: string;
    createdTime: string;
    size: string;
    mimeType: string;
}>> {
    const drive = getDriveClient();
    if (!drive) return [];

    try {
        const query = FILES_FOLDER_ID
            ? `'${FILES_FOLDER_ID}' in parents and trashed = false`
            : `trashed = false`;

        const response = await drive.files.list({
            q: query,
            pageSize,
            fields: 'files(id, name, createdTime, size, mimeType, webViewLink)',
            orderBy: 'name',
        });

        return (response.data.files || []).map(file => ({
            id: file.id || '',
            name: file.name || '',
            downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
            webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
            createdTime: file.createdTime || '',
            size: file.size || '0',
            mimeType: file.mimeType || '',
        }));
    } catch (error) {
        console.error('Error listing Google Drive files:', error);
        return [];
    }
}

/**
 * Upload a video to Google Drive (videos folder)
 */
export async function uploadVideoToDrive(
    buffer: Buffer,
    fileName: string,
    mimeType: string
): Promise<UploadResult | null> {
    return uploadToDriveFolder(buffer, `${Date.now()}_${fileName}`, mimeType, VIDEOS_FOLDER_ID);
}

/**
 * List videos in the videos folder
 */
export async function listGoogleDriveVideos(pageSize = 50): Promise<Array<{
    id: string;
    name: string;
    url: string;
    thumbnailUrl: string;
    createdTime: string;
    size: string;
    mimeType: string;
}>> {
    const drive = getDriveClient();
    if (!drive) return [];

    try {
        const query = VIDEOS_FOLDER_ID
            ? `'${VIDEOS_FOLDER_ID}' in parents and mimeType contains 'video/' and trashed = false`
            : `mimeType contains 'video/' and trashed = false`;

        const response = await drive.files.list({
            q: query,
            pageSize,
            fields: 'files(id, name, createdTime, size, mimeType, thumbnailLink)',
            orderBy: 'createdTime desc',
        });

        return (response.data.files || []).map(file => ({
            id: file.id || '',
            name: file.name || '',
            url: `https://drive.google.com/file/d/${file.id}/preview`,
            thumbnailUrl: file.thumbnailLink || `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`,
            createdTime: file.createdTime || '',
            size: file.size || '0',
            mimeType: file.mimeType || '',
        }));
    } catch (error) {
        console.error('Error listing Google Drive videos:', error);
        return [];
    }
}
