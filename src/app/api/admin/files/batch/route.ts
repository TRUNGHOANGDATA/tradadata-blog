import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { uploadFileToDrive } from '@/lib/storage/google-drive';
import { auth } from '@/lib/auth';

// Batch upload endpoint — dùng cho script upload hàng loạt (không có session trình duyệt).
// Xác thực bằng BATCH_UPLOAD_API_KEY riêng, KHÔNG dùng SUPABASE_SERVICE_ROLE_KEY:
// service role key mà lộ ra là mất toàn bộ database.
// Usage: POST /api/admin/files/batch, header `Authorization: Bearer $BATCH_UPLOAD_API_KEY`
// Admin/editor đang đăng nhập cũng gọi được trực tiếp.

const MAX_SIZE = 100 * 1024 * 1024; // 100MB

// So sánh chuỗi theo thời gian hằng định để tránh timing attack
function safeCompare(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
}

async function isAuthorized(request: Request): Promise<boolean> {
    const apiKey = process.env.BATCH_UPLOAD_API_KEY;
    const authHeader = request.headers.get('authorization');

    if (apiKey && authHeader?.startsWith('Bearer ')) {
        if (safeCompare(authHeader.slice('Bearer '.length), apiKey)) {
            return true;
        }
    }

    // Fallback: admin/editor đang đăng nhập
    const session = await auth();
    return session?.user?.role === 'admin' || session?.user?.role === 'editor';
}

export async function POST(request: Request) {
    try {
        if (!(await isAuthorized(request))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: `File quá lớn. Tối đa: ${MAX_SIZE / 1024 / 1024}MB` },
                { status: 400 }
            );
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
