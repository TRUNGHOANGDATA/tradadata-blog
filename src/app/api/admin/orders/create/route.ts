import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { logOrderToSheet } from '@/lib/google-sheets';
import { sendEmail } from '@/lib/email/gmail';
import { getEmailTemplate } from '@/lib/email/template-engine';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { email, product_id, amount, full_name, phone, status, admin_note } = body;

        if (!email || !product_id) {
            return NextResponse.json({ error: 'Email và sản phẩm là bắt buộc' }, { status: 400 });
        }

        // Get product info
        const { data: product, error: productError } = await supabaseAdmin
            .from('products')
            .select('name, price, product_type, duration_days')
            .eq('id', product_id)
            .single();

        if (productError || !product) {
            return NextResponse.json({ error: 'Sản phẩm không tồn tại' }, { status: 404 });
        }

        // Generate order code
        const orderCode = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();

        const finalAmount = amount ?? product.price;
        const orderStatus = status || 'pending';
        const now = new Date().toISOString();

        // Find user_id if profile exists
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();

        // Create order
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                order_code: orderCode,
                email,
                full_name: full_name || '',
                phone: phone || '',
                product_id,
                amount: finalAmount,
                original_amount: product.price,
                status: orderStatus,
                admin_note: admin_note || `Tạo thủ công bởi Admin (${session.user.email})`,
                user_id: profile?.id || null,
                paid_at: orderStatus === 'paid' ? now : null,
            })
            .select('*')
            .single();

        if (orderError) throw orderError;

        // If status = paid, auto-create subscription
        if (orderStatus === 'paid' && product.product_type === 'subscription') {
            // Update or create profile with is_subscribed = true
            if (profile) {
                await supabaseAdmin
                    .from('profiles')
                    .update({ is_subscribed: true })
                    .eq('id', profile.id);
            } else {
                await supabaseAdmin
                    .from('profiles')
                    .insert({
                        email,
                        full_name: full_name || '',
                        role: 'reader',
                        is_subscribed: true,
                    });
            }

            // Subscription stacking
            const durationDays = product.duration_days || 30;
            const { data: existingSub } = await supabaseAdmin
                .from('user_subscriptions')
                .select('expires_at')
                .eq('user_email', email)
                .order('expires_at', { ascending: false })
                .limit(1)
                .single();

            const nowDate = new Date();
            let startsAt = nowDate;
            if (existingSub && new Date(existingSub.expires_at) > nowDate) {
                startsAt = new Date(existingSub.expires_at);
            }

            const expiresAt = new Date(startsAt);
            expiresAt.setDate(expiresAt.getDate() + durationDays);

            await supabaseAdmin.from('user_subscriptions').insert({
                user_email: email,
                user_id: profile?.id || null,
                product_id,
                starts_at: startsAt.toISOString(),
                expires_at: expiresAt.toISOString(),
                order_id: order.id,
            });

            // Send email & log to sheet in background
            Promise.allSettled([
                logOrderToSheet(orderCode),
                (async () => {
                    try {
                        const { subject, html } = await getEmailTemplate('payment_success', {
                            name: full_name || email.split('@')[0],
                            order_code: orderCode,
                            product_name: product.name || 'Gói Premium',
                            amount: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalAmount),
                            url: process.env.NEXT_PUBLIC_APP_URL || 'https://tradadata.vercel.app'
                        });
                        await sendEmail(email, subject, html);
                    } catch (e) {
                        console.error('Error sending email:', e);
                    }
                })()
            ]);
        }

        return NextResponse.json({
            success: true,
            order: { id: order.id, order_code: orderCode },
            message: orderStatus === 'paid'
                ? 'Đã tạo đơn hàng và cấp quyền thành công'
                : 'Đã tạo đơn hàng (chờ xác nhận)'
        });

    } catch (error: any) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: error.message || 'Lỗi hệ thống' }, { status: 500 });
    }
}
