import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { loiThanhChu } from '@/lib/errors';
import { supabaseAdmin } from '@/lib/supabase/server';

function generateOrderCode() {
    const chars = 'ABCDEF0123456789';
    let code = 'TDD-';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { user_email, user_id, product_id, duration_days } = await request.json();

        if (!user_email || !product_id) {
            return NextResponse.json({ error: 'Email và sản phẩm là bắt buộc' }, { status: 400 });
        }

        // Get product info
        const { data: product, error: productError } = await supabaseAdmin
            .from('products')
            .select('id, name, duration_days, product_type')
            .eq('id', product_id)
            .single();

        if (productError || !product) {
            return NextResponse.json({ error: 'Sản phẩm không tồn tại' }, { status: 404 });
        }

        // Calculate duration
        const days = duration_days || product.duration_days || 30;

        // Find user profile
        let finalUserId = user_id || null;
        let userName = '';
        let userPhone = '';
        if (!finalUserId) {
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('id, full_name, phone')
                .eq('email', user_email)
                .single();
            finalUserId = profile?.id || null;
            userName = profile?.full_name || '';
            userPhone = profile?.phone || '';
        } else {
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('full_name, phone')
                .eq('id', finalUserId)
                .single();
            userName = profile?.full_name || '';
            userPhone = profile?.phone || '';
        }

        // 1. Create a 0đ order for tracking
        const orderCode = generateOrderCode();
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                order_code: orderCode,
                email: user_email,
                full_name: userName,
                phone: userPhone,
                product_id: product.id,
                amount: 0,
                status: 'paid',
                paid_at: new Date().toISOString(),
                admin_note: `Admin cấp miễn phí (${days} ngày) bởi ${session.user.email}`,
            })
            .select('id')
            .single();

        if (orderError) throw orderError;

        // 2. Subscription stacking: starts_at = max(now, current_expires_at)
        const { data: existingSub } = await supabaseAdmin
            .from('user_subscriptions')
            .select('expires_at')
            .eq('user_email', user_email)
            .order('expires_at', { ascending: false })
            .limit(1)
            .single();

        const now = new Date();
        let startsAt = now;
        if (existingSub && new Date(existingSub.expires_at) > now) {
            startsAt = new Date(existingSub.expires_at);
        }

        const expiresAt = new Date(startsAt);
        expiresAt.setDate(expiresAt.getDate() + days);

        // 3. Create subscription linked to the order
        const { error: subError } = await supabaseAdmin
            .from('user_subscriptions')
            .insert({
                user_email,
                user_id: finalUserId,
                product_id,
                starts_at: startsAt.toISOString(),
                expires_at: expiresAt.toISOString(),
                order_id: order.id,
            });

        if (subError) throw subError;

        // 4. Update profile is_subscribed = true
        if (finalUserId) {
            await supabaseAdmin
                .from('profiles')
                .update({ is_subscribed: true })
                .eq('id', finalUserId);
        } else {
            await supabaseAdmin
                .from('profiles')
                .update({ is_subscribed: true })
                .eq('email', user_email);
        }

        return NextResponse.json({
            success: true,
            order_code: orderCode,
            subscription: {
                starts_at: startsAt.toISOString(),
                expires_at: expiresAt.toISOString(),
                duration_days: days,
            },
            message: `Đã cấp ${product.name} cho ${user_email} (${days} ngày, hết hạn ${expiresAt.toLocaleDateString('vi-VN')}). Đơn: ${orderCode}`
        });

    } catch (error) {
        console.error('Error adding subscription:', error);
        return NextResponse.json({ error: loiThanhChu(error) || 'Lỗi hệ thống' }, { status: 500 });
    }
}
