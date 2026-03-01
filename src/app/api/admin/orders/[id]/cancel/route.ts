import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { updateOrderStatusInSheet } from '@/lib/google-sheets';

export async function POST(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        // Chỉ admin mới có quyền
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
            .select('*, products(name, product_type)')
            .eq('id', id)
            .single();

        if (fetchError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.status === 'cancelled') {
            return NextResponse.json({ error: 'Order is already cancelled' }, { status: 400 });
        }

        // Nếu đơn đã paid, cần thu hồi quyền
        if (order.status === 'paid') {
            const productType = (order.products as any)?.product_type;
            if (productType === 'subscription') {
                const { data: profile } = await supabaseAdmin
                    .from('profiles')
                    .select('id')
                    .eq('email', order.email)
                    .single();

                if (profile) {
                    await supabaseAdmin
                        .from('profiles')
                        .update({ is_subscribed: false })
                        .eq('id', profile.id);
                }
            }
        }

        // Hoàn trả mã giảm giá nếu có
        if (order.coupon_code) {
            const { data: coupon } = await supabaseAdmin
                .from('coupons')
                .select('id, used_count')
                .eq('code', order.coupon_code)
                .single();

            if (coupon) {
                // Giảm used_count (không xuống dưới 0)
                await supabaseAdmin
                    .from('coupons')
                    .update({ used_count: Math.max(0, (coupon.used_count || 0) - 1) })
                    .eq('id', coupon.id);

                // Xoá user_coupons record để khách dùng lại được
                await supabaseAdmin
                    .from('user_coupons')
                    .delete()
                    .eq('coupon_id', coupon.id)
                    .eq('user_email', order.email);
            }
        }

        // 2. Cập nhật state order thành cancelled
        const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update({
                status: 'cancelled',
            })
            .eq('id', id);

        if (updateError) throw updateError;

        // 3. Cập nhật trạng thái trên Google Sheets (chạy ngầm)
        updateOrderStatusInSheet(order.order_code, 'Đã huỷ').catch(err => {
            console.error('Lỗi khi update Google Sheets sau khi huỷ đơn:', err);
        });

        return NextResponse.json({ success: true, message: 'Đã huỷ đơn hàng thành công' });

    } catch (error: any) {
        console.error('Error cancelling order:', error);
        return NextResponse.json({ error: error.message || 'Lỗi hệ thống' }, { status: 500 });
    }
}
