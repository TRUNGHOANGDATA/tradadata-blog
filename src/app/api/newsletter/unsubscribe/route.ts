import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return new NextResponse('Thiếu thông tin email để hủy đăng ký', { status: 400 });
        }

        if (!supabaseAdmin) {
            return new NextResponse('Supabase Admin Not Configured', { status: 500 });
        }

        const { error } = await supabaseAdmin
            .from('subscribers')
            .update({ status: 'unsubscribed' })
            .eq('email', email);

        if (error) {
            console.error('Error unsubscribing:', error);
            return new NextResponse('Lỗi server khi hủy đăng ký', { status: 500 });
        }

        // Return a simple HTML page confirming the unsubscription
        return new NextResponse(`
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Hủy đăng ký thành công - ERX Blog</title>
                <style>
                    body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f3f4f6; }
                    .card { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; max-width: 500px; }
                    h1 { color: #111827; }
                    p { color: #4b5563; line-height: 1.5; }
                    a { display: inline-block; margin-top: 20px; background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>Hủy đăng ký thành công</h1>
                    <p>Rất tiếc vì ERX Blog không còn phù hợp với nhu cầu của bạn lúc này. Email <b>${email}</b> đã được xóa khỏi danh sách nhận thông báo.</p>
                    <a href="/">Quay lại Trang chủ</a>
                </div>
            </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });

    } catch (error) {
        console.error('Unsubscribe error:', error);
        return new NextResponse('Đã có lỗi xảy ra', { status: 500 });
    }
}
