import { NextResponse } from 'next/server';

// Đọc env lúc chạy, không phải lúc build: key nằm trong Secret của k8s, nếu để
// Next prerender thì file bị nướng vào image với nội dung 404.
export const dynamic = 'force-dynamic';

/**
 * Trả về IndexNow key dạng text thuần tại `/indexnow-key.txt`.
 *
 * IndexNow yêu cầu chứng minh sở hữu host bằng một file text đọc được công khai,
 * nội dung đúng bằng key (đường dẫn được khai trong `keyLocation` của request).
 * Để ở route thay vì `public/` để key chỉ tồn tại ở MỘT chỗ là biến env —
 * chép ra file tĩnh là sớm muộn hai bên lệch nhau và IndexNow trả 403.
 *
 * Key này không phải secret: nó công khai theo thiết kế của giao thức.
 */
export async function GET() {
    const key = process.env.INDEXNOW_KEY;
    if (!key) {
        return new NextResponse('Not found', { status: 404 });
    }

    return new NextResponse(key, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
