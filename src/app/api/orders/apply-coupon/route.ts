import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { auth } from '@/lib/auth';

// POST /api/orders/apply-coupon — apply or remove coupon on a pending order
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
        }
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server error' }, { status: 500 });
        }

        const { order_code, coupon_code, action } = await request.json();

        if (!order_code) {
            return NextResponse.json({ error: 'Thiếu mã đơn hàng' }, { status: 400 });
        }

        // Fetch order
        const { data: order } = await supabaseAdmin
            .from('orders')
            .select('*, products(price)')
            .eq('order_code', order_code)
            .eq('email', session.user.email)
            .eq('status', 'pending')
            .single();

        if (!order) {
            return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 });
        }

        const originalAmount = order.original_amount || (order.products as any)?.price || order.amount;

        // ====== REMOVE COUPON ======
        if (action === 'remove') {
            // Restore original amount
            await supabaseAdmin
                .from('orders')
                .update({ amount: originalAmount, coupon_code: null })
                .eq('id', order.id);

            // Decrement coupon used_count if there was a coupon
            if (order.coupon_code) {
                const { data: coupon } = await supabaseAdmin
                    .from('coupons')
                    .select('id')
                    .eq('code', order.coupon_code)
                    .single();

                if (coupon) {
                    await supabaseAdmin.rpc('decrement_coupon_usage', { coupon_id_input: coupon.id });

                    // Remove user_coupons record
                    await supabaseAdmin
                        .from('user_coupons')
                        .delete()
                        .eq('coupon_id', coupon.id)
                        .eq('user_email', session.user.email);
                }
            }

            return NextResponse.json({
                success: true,
                new_amount: originalAmount,
                coupon_code: null,
            });
        }

        // ====== APPLY COUPON ======
        if (!coupon_code) {
            return NextResponse.json({ error: 'Thiếu mã giảm giá' }, { status: 400 });
        }

        // If there's already a coupon, remove it first
        if (order.coupon_code) {
            const { data: oldCoupon } = await supabaseAdmin
                .from('coupons')
                .select('id')
                .eq('code', order.coupon_code)
                .single();

            if (oldCoupon) {
                await supabaseAdmin.rpc('decrement_coupon_usage', { coupon_id_input: oldCoupon.id });
                await supabaseAdmin
                    .from('user_coupons')
                    .delete()
                    .eq('coupon_id', oldCoupon.id)
                    .eq('user_email', session.user.email);
            }
        }

        // Validate new coupon
        const { data: coupon } = await supabaseAdmin
            .from('coupons')
            .select('*')
            .eq('code', coupon_code.toUpperCase().trim())
            .eq('is_active', true)
            .single();

        if (!coupon) {
            return NextResponse.json({ error: 'Mã giảm giá không tồn tại hoặc đã hết hạn' }, { status: 400 });
        }

        // Check expiry
        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
            return NextResponse.json({ error: 'Mã giảm giá đã hết hạn' }, { status: 400 });
        }

        // Check usage limit
        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            return NextResponse.json({ error: 'Mã giảm giá đã hết lượt sử dụng' }, { status: 400 });
        }

        // Check per-user limit
        if (coupon.per_user_limit) {
            const { count } = await supabaseAdmin
                .from('user_coupons')
                .select('id', { count: 'exact', head: true })
                .eq('coupon_id', coupon.id)
                .eq('user_email', session.user.email);
            if (count !== null && count >= coupon.per_user_limit) {
                return NextResponse.json({ error: 'Bạn đã sử dụng hết lượt cho mã này' }, { status: 400 });
            }
        }

        // Check product restriction
        const { data: restrictions } = await supabaseAdmin
            .from('coupon_products')
            .select('product_id')
            .eq('coupon_id', coupon.id);

        const restrictedIds = (restrictions || []).map((r: any) => r.product_id);
        if (restrictedIds.length > 0 && !restrictedIds.includes(order.product_id)) {
            return NextResponse.json({ error: 'Mã giảm giá không áp dụng cho sản phẩm này' }, { status: 400 });
        }

        // Check min order
        if (coupon.min_order_amount && originalAmount < coupon.min_order_amount) {
            return NextResponse.json({ error: `Đơn hàng tối thiểu ${coupon.min_order_amount.toLocaleString()}đ` }, { status: 400 });
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discount_type === 'percent') {
            discount = (originalAmount * coupon.discount_value) / 100;
            if (coupon.max_discount && discount > coupon.max_discount) {
                discount = coupon.max_discount;
            }
        } else {
            discount = coupon.discount_value;
        }
        if (discount > originalAmount) discount = originalAmount;

        const newAmount = originalAmount - discount;

        // Update order
        await supabaseAdmin
            .from('orders')
            .update({ amount: newAmount, coupon_code: coupon.code })
            .eq('id', order.id);

        // Increment coupon usage
        await supabaseAdmin.rpc('increment_coupon_usage', { coupon_id_input: coupon.id });

        // Record user usage
        await supabaseAdmin.from('user_coupons').insert({
            coupon_id: coupon.id,
            user_email: session.user.email,
            used_at: new Date().toISOString(),
        });

        return NextResponse.json({
            success: true,
            new_amount: newAmount,
            discount,
            coupon_code: coupon.code,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value,
        });
    } catch (err) {
        console.error('Apply coupon error:', err);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}
