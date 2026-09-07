import { NextResponse } from 'next/server';
import type { SanPhamNhung } from '@/types';
import { loiThanhChu } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { logOrderToSheet } from '@/lib/google-sheets';
import { sendEmail } from '@/lib/email/gmail';
import { getEmailTemplate } from '@/lib/email/template-engine';

export async function POST(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        // Chỉ admin mới có quyền duyệt đơn
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { id } = await props.params;

        // 1. Lấy thông tin đơn hàng
        const { data: order, error: fetchError } = await supabaseAdmin
            .from('orders')
            .select('*, products(name, product_type, duration_days)')
            .eq('id', id)
            .single();

        if (fetchError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.status === 'paid') {
            return NextResponse.json({ error: 'Order is already paid' }, { status: 400 });
        }

        // 2. Cập nhật state order
        const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update({
                status: 'paid',
                paid_at: new Date().toISOString()
            })
            .eq('id', id);

        if (updateError) throw updateError;

        // 3. Xử lý cấp quyền cho User
        const productType = (order.products as SanPhamNhung)?.product_type;
        const productName = (order.products as SanPhamNhung)?.name;

        if (productType === 'subscription') {
            // Kiểm tra xem profile đã tồn tại chưa
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('email', order.email)
                .single();

            if (profile) {
                // Cập nhật profile đã có
                await supabaseAdmin
                    .from('profiles')
                    .update({ is_subscribed: true })
                    .eq('id', profile.id);
            } else {
                // Tạo profile mới chờ user login (Google sẽ map bằng email)
                await supabaseAdmin
                    .from('profiles')
                    .insert({
                        email: order.email,
                        full_name: order.full_name || '',
                        role: 'reader',
                        is_subscribed: true
                    });
            }

            // Subscription stacking: starts_at = max(now, current_expires_at)
            // Lấy đúng thời hạn của gói; chỉ fallback 30 ngày khi sản phẩm không khai báo
            const durationDays = (order.products as SanPhamNhung)?.duration_days || 30;

            // Check if user has an existing active subscription
            const { data: existingSub } = await supabaseAdmin
                .from('user_subscriptions')
                .select('expires_at')
                .eq('user_email', order.email)
                .order('expires_at', { ascending: false })
                .limit(1)
                .single();

            const now = new Date();
            let startsAt = now;

            // If current subscription hasn't expired, stack from its end date
            if (existingSub && new Date(existingSub.expires_at) > now) {
                startsAt = new Date(existingSub.expires_at);
            }

            const expiresAt = new Date(startsAt);
            expiresAt.setDate(expiresAt.getDate() + durationDays);

            await supabaseAdmin.from('user_subscriptions').insert({
                user_email: order.email,
                user_id: order.user_id || null,
                product_id: order.product_id,
                starts_at: startsAt.toISOString(),
                expires_at: expiresAt.toISOString(),
                order_id: order.id,
            });
        }

        // 4 & 5. Chạy ngầm việc log Google Sheets và Gửi Email để không block UI admin
        const sendSuccessEmail = async () => {
            try {
                const { subject, html } = await getEmailTemplate('payment_success', {
                    name: order.full_name || order.email.split('@')[0],
                    order_code: order.order_code,
                    product_name: productName || 'Gói Premium',
                    amount: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.amount),
                    url: process.env.NEXT_PUBLIC_APP_URL || 'https://tradadata.com'
                });
                await sendEmail(order.email, subject, html);
            } catch (emailErr) {
                console.error('Lỗi khi gửi mail thanh toán thành công:', emailErr);
            }
        };

        Promise.allSettled([
            logOrderToSheet(order.order_code),
            sendSuccessEmail()
        ]);

        return NextResponse.json({ success: true, message: 'Đã duyệt đơn hàng thành công' });

    } catch (error) {
        console.error('Error approving order:', error);
        return NextResponse.json({ error: loiThanhChu(error) || 'Lỗi hệ thống' }, { status: 500 });
    }
}
