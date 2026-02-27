import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/gmail';
import { generateNewPostEmailHtml } from '@/lib/email/templates/new-post';

export async function POST(request: Request) {
    try {
        const { postId } = await request.json();

        if (!postId) {
            return NextResponse.json({ error: 'Thiếu postId' }, { status: 400 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 });
        }

        // 1. Fetch Post Data
        const { data: post, error: postError } = await supabaseAdmin
            .from('posts')
            .select('*, categories(name)')
            .eq('id', postId)
            .single();

        if (postError || !post) {
            console.error('Lỗi khi fetch bài viết:', postError);
            return NextResponse.json({ error: 'Không tìm thấy bài viết' }, { status: 404 });
        }

        // 2. Lấy danh sách Subscribers (Status = 'active')
        const { data: subscribers, error: subError } = await supabaseAdmin
            .from('subscribers')
            .select('id, email')
            .eq('status', 'active');

        if (subError || !subscribers || subscribers.length === 0) {
            return NextResponse.json({ success: true, message: 'Không có người đăng ký nào để gửi' });
        }

        // 3. Batching & Queueing (Mock implementation for simplicity, production should use real batches)
        const batchSize = 90;
        const totalSubscribers = subscribers.length;
        const batches = Math.ceil(totalSubscribers / batchSize);


        // Chỉ xử lý và gửi liền lô 1 (trong giới hạn < 90/ngày của Gmail)
        const firstBatch = subscribers.slice(0, batchSize);

        // Ghi dữ liệu vào email_queue cho tương lai (CRON job sẽ xử lý các lô sau)
        const queueData = subscribers.map((sub, index) => {
            const batchIndex = Math.floor(index / batchSize);
            const scheduled_at = new Date();
            // Lùi ngày cho các lô tiếp theo (chờ 24h mỗi 90 mail)
            scheduled_at.setDate(scheduled_at.getDate() + batchIndex);

            return {
                post_id: postId,
                subscriber_id: sub.id,
                status: batchIndex === 0 ? 'sent' : 'pending', // Lô 1 coi như gửi luôn
                scheduled_at: scheduled_at.toISOString()
            };
        });

        // Insert vào bảng email_queue
        const { error: queueError } = await supabaseAdmin
            .from('email_queue')
            .insert(queueData);

        if (queueError) {
            console.error('Lỗi tạo queue:', queueError);
            // Vẫn tiếp tục chạy để gửi mail cho dù queue lỗi
        }

        // 4. Gửi thực tế cho lô 1
        let successCount = 0;
        let failCount = 0;

        for (const sub of firstBatch) {
            const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(sub.email)}`;
            const postUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`;

            const html = generateNewPostEmailHtml({
                postTitle: post.title,
                postExcerpt: post.excerpt,
                postUrl: postUrl,
                coverImage: post.cover_image,
                categoryName: post.categories ? (Array.isArray(post.categories) ? post.categories[0].name : post.categories.name) : 'Cập nhật',
                unsubscribeUrl
            });

            const result = await sendEmail(
                sub.email,
                `🔥 Bài viết mới: ${post.title}`,
                html
            );

            if (result.success) {
                successCount++;
            } else {
                failCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Đã gửi thành công ${successCount}/${firstBatch.length} email (Lô 1). Các lô còn lại được đưa vào hàng đợi.`,
            queued: totalSubscribers - firstBatch.length
        });

    } catch (error) {
        console.error('Send newsletter error:', error);
        return NextResponse.json({ error: 'Đã có lỗi xảy ra' }, { status: 500 });
    }
}
