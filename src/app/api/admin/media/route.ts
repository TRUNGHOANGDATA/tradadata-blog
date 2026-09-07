import { NextResponse } from 'next/server';
import { loiThanhChu } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { listGoogleDriveImages, deleteFromGoogleDrive } from '@/lib/storage/google-drive';

// GET /api/admin/media — List images from Google Drive with pagination
export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
        const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);

        // Fetch all files (Google Drive API doesn't natively support offset pagination well)
        // We fetch a larger batch and slice for the requested page
        const allFiles = await listGoogleDriveImages(100);
        const totalFiles = allFiles.length;
        const totalPages = Math.ceil(totalFiles / limit);
        const startIndex = (page - 1) * limit;
        const files = allFiles.slice(startIndex, startIndex + limit);

        return NextResponse.json({
            files,
            pagination: {
                page,
                limit,
                totalFiles,
                totalPages,
                hasMore: page < totalPages,
            },
        });
    } catch (error) {
        console.error('Error listing media:', error);
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}

// DELETE /api/admin/media — Delete an image from Google Drive
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
        if (!success) {
            return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}
