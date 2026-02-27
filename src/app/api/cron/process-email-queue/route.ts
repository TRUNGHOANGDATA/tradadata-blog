import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/gmail';
import { generateNewPostEmailHtml } from '@/lib/email/templates/new-post';

export async function GET(request: Request) {
    try {
        // Auth check
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 });
        }

        // 1. Fetch pending emails scheduled for now or earlier (Limit to 90/run)
        const { data: queueItems, error: fetchError } = await supabaseAdmin
            .from('email_queue')
            .select(`
                id, 
                post_id, 
                subscriber_id,
                posts ( title, excerpt, slug, cover_image, categories (name) ),
                subscribers ( email, status )
            `)
            .eq('status', 'pending')
            .lte('scheduled_at', new Date().toISOString())
            .limit(90);

        if (fetchError) {
            console.error('Lỗi khi fetch queue:', fetchError);
            return NextResponse.json({ error: 'Lỗi database' }, { status: 500 });
        }

        if (!queueItems || queueItems.length === 0) {
            return NextResponse.json({ success: true, message: 'Queue is empty' });
        }


        let successCount = 0;
        let failCount = 0;

        // 2. Process each item in the queue
        for (const item of queueItems) {
            const subscriber = Array.isArray(item.subscribers) ? item.subscribers[0] : item.subscribers;
            const post = Array.isArray(item.posts) ? item.posts[0] : item.posts;

            if (!subscriber || subscriber.status !== 'active' || !post) {
                await supabaseAdmin
                    .from('email_queue')
                    .update({ status: 'failed', error_message: 'Khách chưa subscribe hoặc không tìm thấy data' })
                    .eq('id', item.id);
                continue;
            }

            const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
            const postUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`;
            const categoryName = post.categories ? (Array.isArray(post.categories) ? (post.categories as any[])[0]?.name : (post.categories as any).name) : 'Cập nhật';

            const html = generateNewPostEmailHtml({
                postTitle: post.title,
                postExcerpt: post.excerpt,
                postUrl: postUrl,
                coverImage: post.cover_image,
                categoryName: categoryName,
                unsubscribeUrl
            });

            // Tiêu đề email
            const subject = `🔥 Bài viết mới: ${post.title}`;

            // Gửi qua Nodemailer
            const result = await sendEmail(subscriber.email, subject, html);

            if (result.success) {
                await supabaseAdmin
                    .from('email_queue')
                    .update({ status: 'sent', sent_at: new Date().toISOString() })
                    .eq('id', item.id);
                successCount++;
            } else {
                await supabaseAdmin
                    .from('email_queue')
                    .update({ status: 'failed', error_message: String(result.error) })
                    .eq('id', item.id);
                failCount++;
            }
        }


        return NextResponse.json({
            success: true,
            message: `Processed ${queueItems.length} emails. Success: ${successCount}, Failed: ${failCount}`
        });

    } catch (error) {
        console.error('CRON Job error:', error);
        return NextResponse.json({ error: 'Đã có lỗi xảy ra' }, { status: 500 });
    }
}
