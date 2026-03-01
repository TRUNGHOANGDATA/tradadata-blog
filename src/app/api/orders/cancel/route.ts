import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { order_code, email } = await request.json();

        if (!order_code || !email) {
            return NextResponse.json({ error: 'Thiếu thông tin đơn hàng' }, { status: 400 });
        }

        // Fetch the order to verify ownership and status
        const { data: order, error: fetchError } = await supabaseAdmin
            .from('orders')
            .select('id, status, email, coupon_code')
            .eq('order_code', order_code)
            .single();

        if (fetchError || !order) {
            return NextResponse.json({ error: 'Đơn hàng không tồn tại' }, { status: 404 });
        }

        // Only allow cancel if pending and owned by user
        if (order.status === 'paid') {
            return NextResponse.json({ error: 'Không thể huỷ đơn hàng đã thanh toán' }, { status: 400 });
        }

        if (order.email !== email) {
            return NextResponse.json({ error: 'Bạn không có quyền huỷ đơn hàng này' }, { status: 403 });
        }

        // If coupon was used, decrement usage and remove user_coupons record
        if (order.coupon_code) {
            const { data: coupon } = await supabaseAdmin
                .from('coupons')
                .select('id, used_count')
                .eq('code', order.coupon_code)
                .single();

            if (coupon) {
                // Decrement used_count (don't go below 0)
                await supabaseAdmin
                    .from('coupons')
                    .update({ used_count: Math.max(0, (coupon.used_count || 0) - 1) })
                    .eq('id', coupon.id);

                // Remove user_coupons record
                await supabaseAdmin
                    .from('user_coupons')
                    .delete()
                    .eq('coupon_id', coupon.id)
                    .eq('user_email', email);
            }
        }

        // Hard delete the order from database
        const { error: deleteError } = await supabaseAdmin
            .from('orders')
            .delete()
            .eq('id', order.id);

        if (deleteError) {
            console.error('Error deleting order:', deleteError);
            return NextResponse.json({ error: 'Không thể huỷ đơn hàng' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Đã huỷ đơn hàng thành công' });

    } catch (error: any) {
        console.error('Error cancelling order:', error);
        return NextResponse.json({ error: error.message || 'Lỗi hệ thống' }, { status: 500 });
    }
}
