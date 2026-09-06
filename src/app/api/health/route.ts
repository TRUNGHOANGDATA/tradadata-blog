import { NextResponse } from 'next/server';

// Health check cho k8s probe và cho bước nghiệm thu của workflow deploy.
// Cố ý KHÔNG chạm database: probe phải phản ánh "process còn sống", chứ
// Supabase chập chờn một nhịp không được làm k8s giết pod.
export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json(
        {
            status: 'ok',
            // APP_VERSION được gắn lúc build image (= commit SHA). Workflow deploy
            // đối chiếu giá trị này để biết chắc image mới đã thực sự chạy,
            // thay vì chỉ tin là rollout đã xong.
            version: process.env.APP_VERSION || 'unknown',
            time: new Date().toISOString(),
        },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
}
