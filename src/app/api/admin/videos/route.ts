import { NextResponse } from 'next/server';
import { loiThanhChu } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { listGoogleDriveVideos, uploadVideoToDrive, deleteFromGoogleDrive } from '@/lib/storage/google-drive';

// GET /api/admin/videos — List videos from Google Drive
export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
        const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);

        const allFiles = await listGoogleDriveVideos(100);
        const totalFiles = allFiles.length;
        const totalPages = Math.ceil(totalFiles / limit);
        const startIndex = (page - 1) * limit;
        const files = allFiles.slice(startIndex, startIndex + limit);

        return NextResponse.json({
            files,
            pagination: { page, limit, totalFiles, totalPages, hasMore: page < totalPages },
        });
    } catch (error) {
        console.error('Error listing videos:', error);
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}

// POST /api/admin/videos — Upload a video
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

        if (!file.type.startsWith('video/')) {
            return NextResponse.json({ error: 'Only video files are allowed' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadVideoToDrive(buffer, file.name, file.type);

        if (!result) {
            return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true, file: result });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}

// DELETE /api/admin/videos — Delete a video
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
        if (!success) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}
