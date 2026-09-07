import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server error' }, { status: 500 });
        }

        const { code, order_amount, product_ids, user_email } = await request.json();

        if (!code) {
            return NextResponse.json({ error: 'Vui lòng nhập mã giảm giá' }, { status: 400 });
        }

        // 1. Find active coupon
        const { data: coupon, error } = await supabaseAdmin
            .from('coupons')
            .select('*')
            .eq('code', code.toUpperCase().trim())
            .eq('is_active', true)
            .single();

        if (error || !coupon) {
            return NextResponse.json({ error: 'Mã giảm giá không tồn tại hoặc đã hết hạn' }, { status: 404 });
        }

        // 2. Check expiry
        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
            return NextResponse.json({ error: 'Mã giảm giá đã hết hạn' }, { status: 400 });
        }

        // 3. Check global usage limit
        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            return NextResponse.json({ error: 'Mã giảm giá đã hết lượt sử dụng' }, { status: 400 });
        }

        // 4. Check minimum order amount
        if (order_amount && coupon.min_order_amount && order_amount < coupon.min_order_amount) {
            return NextResponse.json(
                {
                    error: `Đơn hàng tối thiểu ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.min_order_amount)}`,
                },
                { status: 400 }
            );
        }

        // 5. Check per-user limit
        if (coupon.per_user_limit) {
            // Try to get current user email
            let email = user_email;
            if (!email) {
                const session = await auth();
                email = session?.user?.email;
            }

            if (email) {
                // Clean up orphan user_coupons from cancelled/deleted orders
                const { data: userUsages } = await supabaseAdmin
                    .from('user_coupons')
                    .select('id')
                    .eq('coupon_id', coupon.id)
                    .eq('user_email', email);

                if (userUsages && userUsages.length > 0) {
                    // Count active (non-cancelled) orders using this coupon
                    const { data: activeOrders } = await supabaseAdmin
                        .from('orders')
                        .select('id')
                        .eq('email', email)
                        .eq('coupon_code', coupon.code)
                        .neq('status', 'cancelled');

                    const activeCount = activeOrders?.length || 0;

                    // If orphan records exist, clean them up
                    if (userUsages.length > activeCount) {
                        await supabaseAdmin
                            .from('user_coupons')
                            .delete()
                            .eq('coupon_id', coupon.id)
                            .eq('user_email', email);

                        if (activeCount > 0) {
                            const inserts = Array.from({ length: activeCount }, () => ({
                                coupon_id: coupon.id,
                                user_email: email,
                                used_at: new Date().toISOString(),
                            }));
                            await supabaseAdmin.from('user_coupons').insert(inserts);
                        }

                        // Fix used_count
                        await supabaseAdmin
                            .from('coupons')
                            .update({ used_count: Math.max(0, activeCount) })
                            .eq('id', coupon.id);
                    }

                    if (activeCount >= coupon.per_user_limit) {
                        return NextResponse.json(
                            { error: `Bạn đã sử dụng mã này ${activeCount} lần (tối đa ${coupon.per_user_limit} lần)` },
                            { status: 400 }
                        );
                    }
                }
            }
        }

        // 6. Check product restrictions
        const { data: restrictedProducts } = await supabaseAdmin
            .from('coupon_products')
            .select('product_id')
            .eq('coupon_id', coupon.id);

        const restrictedProductIds = (restrictedProducts || []).map((r: { product_id: string }) => r.product_id);

        // If coupon has product restrictions, check if at least one cart product matches
        if (restrictedProductIds.length > 0 && product_ids && product_ids.length > 0) {
            const hasMatch = product_ids.some((pid: string) => restrictedProductIds.includes(pid));
            if (!hasMatch) {
                return NextResponse.json(
                    { error: 'Mã giảm giá không áp dụng cho các khóa học trong giỏ hàng của bạn' },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json({
            code: coupon.code,
            discount_type: coupon.discount_type,
            discount_value: Number(coupon.discount_value),
            max_discount: coupon.max_discount ? Number(coupon.max_discount) : null,
            per_user_limit: coupon.per_user_limit,
            applicable_product_ids: restrictedProductIds.length > 0 ? restrictedProductIds : null,
        });
    } catch {
        return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
    }
}
