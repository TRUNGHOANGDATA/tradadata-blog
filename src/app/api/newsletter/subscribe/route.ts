import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/gmail';
import { getEmailTemplate } from '@/lib/email/template-engine';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
    try {
        // Rate limit: 5 subscribe requests per minute per IP
        const ip = getClientIp(request);
        const limiter = rateLimit(`subscribe:${ip}`, { maxRequests: 5, windowSizeSeconds: 60 });
        if (!limiter.success) {
            return NextResponse.json(
                { error: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' },
                { status: 429, headers: { 'Retry-After': String(limiter.resetIn) } }
            );
        }

        const { email, full_name, phone } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Email không hợp lệ' },
                { status: 400 }
            );
        }

        if (!supabaseAdmin) {
            return NextResponse.json(
                { error: 'Supabase admin not configured' },
                { status: 500 }
            );
        }

        let isNewOrResubscribed = false;
        let responseMessage = 'Đăng ký thành công';

        // Check if already subscribed
        const { data: existingSubscriber } = await supabaseAdmin
            .from('subscribers')
            .select('id, status')
            .eq('email', email)
            .single();

        if (existingSubscriber) {
            // Update with new info if provided, and reactivate if unsubscribed
            const updateData: any = {};

            if (existingSubscriber.status === 'unsubscribed') {
                updateData.status = 'active';
                isNewOrResubscribed = true;
            } else {
                responseMessage = 'Email này đã đăng ký trước đó';
            }

            if (full_name) updateData.full_name = full_name;
            if (phone) updateData.phone = phone;

            if (Object.keys(updateData).length > 0) {
                await supabaseAdmin
                    .from('subscribers')
                    .update(updateData)
                    .eq('id', existingSubscriber.id);
            }
        } else {
            // Insert new subscriber
            const insertData: any = { email, status: 'active' };
            if (full_name) insertData.full_name = full_name;
            if (phone) insertData.phone = phone;

            const { error: insertError } = await supabaseAdmin
                .from('subscribers')
                .insert(insertData);

            if (insertError) {
                console.error('Error inserting subscriber:', insertError);
                return NextResponse.json(
                    { error: 'Lỗi server khi đăng ký' },
                    { status: 500 }
                );
            }
            isNewOrResubscribed = true;
        }

        // Send welcome email ONLY if new or resubscribed
        if (isNewOrResubscribed) {
            try {
                const { subject, html } = await getEmailTemplate('welcome', {
                    name: full_name || email.split('@')[0],
                    email: email,
                    url: process.env.NEXT_PUBLIC_APP_URL || 'https://go.erx.vn',
                    unsubscribe_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`
                });
                await sendEmail(email, subject, html);
            } catch (emailError) {
                console.error('Error sending welcome email:', emailError);
                // Vẫn trả về thành công vì đã insert DB
            }
        }

        return NextResponse.json({ success: true, message: responseMessage });
    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json(
            { error: 'Đã có lỗi xảy ra' },
            { status: 500 }
        );
    }
}
