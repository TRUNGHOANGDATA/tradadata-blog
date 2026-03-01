import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/gmail';
import { getEmailTemplate } from '@/lib/email/template-engine';

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

        // 4. Chuẩn bị variables cho template
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tradadata.com';
        const postUrl = `${appUrl}/blog/${post.slug}`;
        const categoryName = post.categories ? (Array.isArray(post.categories) ? post.categories[0]?.name : post.categories.name) : '';
        const coverImageHtml = post.cover_image
            ? `<img src="${post.cover_image}" alt="${post.title}" style="width:100%;height:auto;max-height:280px;object-fit:cover;display:block;">`
            : '';
        const categoryHtml = categoryName
            ? `<span class="badge">${categoryName}</span>`
            : '';

        // 5. Gửi thực tế cho lô 1
        let successCount = 0;
        let failCount = 0;

        for (const sub of firstBatch) {
            const unsubscribeUrl = `${appUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(sub.email)}`;

            try {
                const { subject, html } = await getEmailTemplate('new_post', {
                    title: post.title,
                    excerpt: post.excerpt || '',
                    post_url: postUrl,
                    cover_image: coverImageHtml,
                    category: categoryHtml,
                    unsubscribe_url: unsubscribeUrl,
                });

                const result = await sendEmail(sub.email, subject, html);

                if (result.success) {
                    successCount++;
                } else {
                    failCount++;
                }
            } catch {
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
