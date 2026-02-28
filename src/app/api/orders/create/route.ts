import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email/gmail';
import { getEmailTemplate } from '@/lib/email/template-engine';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
    try {
        // Rate limit: 10 order requests per minute per IP
        const ip = getClientIp(request);
        const limiter = rateLimit(`order:${ip}`, { maxRequests: 10, windowSizeSeconds: 60 });
        if (!limiter.success) {
            return NextResponse.json(
                { error: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' },
                { status: 429, headers: { 'Retry-After': String(limiter.resetIn) } }
            );
        }

        const { product_id, email, full_name, phone, coupon_code } = await request.json();

        if (!product_id || !email || !full_name) {
            return NextResponse.json(
                { error: 'Vui lòng điền đầy đủ thông tin' },
                { status: 400 }
            );
        }

        if (!supabaseAdmin) {
            return NextResponse.json(
                { error: 'Supabase admin not configured' },
                { status: 500 }
            );
        }

        // Lấy thông tin sản phẩm để check giá
        const { data: product, error: productError } = await supabaseAdmin
            .from('products')
            .select('id, name, price, is_active')
            .eq('id', product_id)
            .single();

        if (productError || !product || !product.is_active) {
            return NextResponse.json(
                { error: 'Sản phẩm không tồn tại hoặc đã ngừng cung cấp' },
                { status: 404 }
            );
        }

        // Calculate final amount (apply coupon if provided)
        let finalAmount = product.price;
        let appliedCouponId: string | null = null;
        let appliedCouponCode: string | null = null;

        if (coupon_code) {
            const { data: coupon } = await supabaseAdmin
                .from('coupons')
                .select('*')
                .eq('code', coupon_code.toUpperCase().trim())
                .eq('is_active', true)
                .single();

            if (coupon) {
                // Verify coupon is still valid
                const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
                const isOverLimit = coupon.usage_limit && coupon.used_count >= coupon.usage_limit;

                if (!isExpired && !isOverLimit) {
                    // Check per-user limit
                    let canUse = true;
                    if (coupon.per_user_limit && email) {
                        const { count } = await supabaseAdmin
                            .from('user_coupons')
                            .select('id', { count: 'exact', head: true })
                            .eq('coupon_id', coupon.id)
                            .eq('user_email', email);
                        if (count !== null && count >= coupon.per_user_limit) {
                            canUse = false;
                        }
                    }

                    // Check product restriction
                    if (canUse) {
                        const { data: restrictions } = await supabaseAdmin
                            .from('coupon_products')
                            .select('product_id')
                            .eq('coupon_id', coupon.id);

                        const restrictedIds = (restrictions || []).map((r: any) => r.product_id);
                        if (restrictedIds.length > 0 && !restrictedIds.includes(product_id)) {
                            canUse = false;
                        }
                    }

                    if (canUse) {
                        let discount = 0;
                        if (coupon.discount_type === 'percent') {
                            discount = (product.price * coupon.discount_value) / 100;
                            if (coupon.max_discount && discount > coupon.max_discount) {
                                discount = coupon.max_discount;
                            }
                        } else {
                            discount = coupon.discount_value;
                        }
                        if (discount > product.price) discount = product.price;

                        finalAmount = product.price - discount;
                        appliedCouponId = coupon.id;
                        appliedCouponCode = coupon.code;
                    }
                }
            }
        }

        // Tạo order_code duy nhất (vd: TDD-A1BC23)
        const randomString = crypto.randomBytes(3).toString('hex').toUpperCase();
        const order_code = `TDD-${randomString}`;

        // Hạn thanh toán (ví dụ: 24h sau)
        const expires_at = new Date();
        expires_at.setHours(expires_at.getHours() + 24);

        // Lưu order vào db
        const { data: newOrder, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                order_code,
                product_id,
                email,
                full_name,
                phone,
                amount: finalAmount,
                original_amount: product.price,
                coupon_code: appliedCouponCode || null,
                status: 'pending',
                expires_at: expires_at.toISOString(),
            })
            .select()
            .single();

        if (orderError) {
            console.error('Error creating order:', orderError);
            return NextResponse.json(
                { error: 'Không thể tạo đơn hàng. Vui lòng thử lại.' },
                { status: 500 }
            );
        }

        // If coupon was applied, increment used_count and record user usage
        if (appliedCouponId) {
            // Increment used_count
            await supabaseAdmin.rpc('increment_coupon_usage', { coupon_id_input: appliedCouponId });

            // Record user usage
            if (email) {
                await supabaseAdmin.from('user_coupons').insert({
                    coupon_id: appliedCouponId,
                    user_email: email,
                    used_at: new Date().toISOString(),
                });
            }
        }

        // Gửi email xác nhận lên đơn (chạy ngầm để không block UI)
        const sendPendingEmail = async () => {
            try {
                const amountText = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalAmount);
                const { subject, html } = await getEmailTemplate('payment_pending', {
                    name: full_name || email.split('@')[0],
                    order_code: newOrder.order_code,
                    product_name: product.name || 'Gói Premium',
                    amount: amountText,
                    url: process.env.NEXT_PUBLIC_APP_URL || 'https://tradadata.vercel.app'
                });
                await sendEmail(email, subject, html);
            } catch (emailErr) {
                console.error('Lỗi khi gửi mail payment pending:', emailErr);
            }
        };

        sendPendingEmail();

        return NextResponse.json({
            success: true,
            order_code: newOrder.order_code,
            applied_coupon: appliedCouponCode,
            final_amount: finalAmount,
        });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { error: 'Đã có lỗi xảy ra. Mời bạn thử lại.' },
            { status: 500 }
        );
    }
}
