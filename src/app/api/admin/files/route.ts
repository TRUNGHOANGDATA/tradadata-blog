import { NextResponse } from 'next/server';
import { loiThanhChu } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { uploadFileToDrive, listGoogleDriveFiles, deleteFromGoogleDrive } from '@/lib/storage/google-drive';

const ALLOWED_TYPES = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'application/vnd.ms-excel', // xls
    'text/csv',
    'application/zip',
    'application/pdf',
    'application/json',
];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

// GET /api/admin/files — List demo files from Google Drive
export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const files = await listGoogleDriveFiles(200);
        return NextResponse.json({ files, total: files.length });
    } catch (error) {
        console.error('Error listing files:', error);
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}

// POST /api/admin/files — Upload a demo file
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: `File too large. Max: ${MAX_SIZE / 1024 / 1024}MB` }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadFileToDrive(buffer, file.name, file.type);

        if (!result) {
            return NextResponse.json({ error: 'Upload failed. Check Google Drive configuration.' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            id: result.id,
            name: result.name,
            url: result.url,
            downloadUrl: `https://drive.google.com/uc?export=download&id=${result.id}`,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}

// DELETE /api/admin/files — Delete a demo file
export async function DELETE(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const success = await deleteFromGoogleDrive(id);
        return NextResponse.json({ success });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}
