import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { loiThanhChu } from '@/lib/errors';
import { uploadToGoogleDrive } from '@/lib/storage/google-drive';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: `Invalid file type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(', ')}` },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: `File too large. Max size: ${MAX_SIZE / 1024 / 1024}MB` },
                { status: 400 }
            );
        }

        // Convert File to Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Upload to Google Drive
        const result = await uploadToGoogleDrive(buffer, file.name, file.type);

        if (!result) {
            return NextResponse.json(
                { error: 'Upload failed. Check Google Drive configuration.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            url: result.url,
            id: result.id,
            name: result.name,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: loiThanhChu(error) },
            { status: 500 }
        );
    }
}
