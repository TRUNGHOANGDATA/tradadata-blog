import { NextResponse } from 'next/server';
import { uploadFileToDrive } from '@/lib/storage/google-drive';

// Batch upload endpoint — protected by service role key (no session needed)
// Usage: POST /api/admin/files/batch with Authorization header
export async function POST(request: Request) {
    try {
        // Auth via service role key
        const authHeader = request.headers.get('authorization');
        const expectedKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!authHeader || authHeader !== `Bearer ${expectedKey}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadFileToDrive(buffer, file.name, file.type);

        if (!result) {
            return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            id: result.id,
            name: result.name,
            downloadUrl: `https://drive.google.com/uc?export=download&id=${result.id}`,
        });
    } catch (error: any) {
        console.error('Batch upload error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
