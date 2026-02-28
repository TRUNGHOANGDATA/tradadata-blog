import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/gmail';
import { getEmailTemplate } from '@/lib/email/template-engine';

// Cron job: check subscriptions expiring within 3 days and send renewal reminders
export async function GET(request: Request) {
    try {
        // Verify cron secret
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
        }

        const now = new Date();
        const threeDaysLater = new Date(now);
        threeDaysLater.setDate(threeDaysLater.getDate() + 3);

        // Find subscriptions expiring in the next 3 days that haven't been reminded
        // We only check the LATEST subscription per user (stacking means multiple rows)
        const { data: expiring, error } = await supabaseAdmin
            .rpc('get_expiring_subscriptions', {
                check_date: threeDaysLater.toISOString(),
                current_date: now.toISOString(),
            });

        if (error) {
            // Fallback: direct query if RPC doesn't exist
            const { data: subData, error: subError } = await supabaseAdmin
                .from('user_subscriptions')
                .select('user_email, expires_at, products(name)')
                .gte('expires_at', now.toISOString())
                .lte('expires_at', threeDaysLater.toISOString());

            if (subError) throw subError;

            const emailsSent: string[] = [];
            const uniqueUsers = new Map<string, any>();

            // Deduplicate by email — only send one reminder per user
            for (const sub of (subData || [])) {
                if (!uniqueUsers.has(sub.user_email)) {
                    uniqueUsers.set(sub.user_email, sub);
                }
            }

            for (const [email, sub] of uniqueUsers) {
                try {
                    const productName = (sub.products as any)?.name || 'Gói Premium';
                    const expiresFormatted = new Date(sub.expires_at).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    });

                    const { subject, html } = await getEmailTemplate('renewal_reminder', {
                        name: email.split('@')[0],
                        product_name: productName,
                        expires_at: expiresFormatted,
                        url: process.env.NEXT_PUBLIC_APP_URL || 'https://tradadata.vercel.app',
                    });

                    await sendEmail(email, subject, html);
                    emailsSent.push(email);
                } catch (emailErr) {
                    console.error(`Failed to send renewal email to ${email}:`, emailErr);
                }
            }

            return NextResponse.json({
                success: true,
                reminders_sent: emailsSent.length,
                emails: emailsSent,
            });
        }

        return NextResponse.json({ success: true, message: 'Checked via RPC', data: expiring });
    } catch (error: any) {
        console.error('Subscription check error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
