import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server error' }, { status: 500 });
        }

        const { data, error } = await supabaseAdmin
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch product restrictions for all coupons
        const couponIds = (data || []).map((c: any) => c.id);
        let productMap: Record<string, any[]> = {};

        if (couponIds.length > 0) {
            const { data: cpData } = await supabaseAdmin
                .from('coupon_products')
                .select('coupon_id, product_id, products(id, name)')
                .in('coupon_id', couponIds);

            if (cpData) {
                for (const cp of cpData) {
                    if (!productMap[cp.coupon_id]) productMap[cp.coupon_id] = [];
                    productMap[cp.coupon_id].push(cp.products);
                }
            }
        }

        // Attach product restrictions to each coupon
        // Also fetch latest user emails who used each coupon
        let emailMap: Record<string, string[]> = {};
        if (couponIds.length > 0) {
            const { data: ucData } = await supabaseAdmin
                .from('user_coupons')
                .select('coupon_id, user_email, used_at')
                .in('coupon_id', couponIds)
                .order('used_at', { ascending: false });

            if (ucData) {
                for (const uc of ucData) {
                    if (!emailMap[uc.coupon_id]) emailMap[uc.coupon_id] = [];
                    if (!emailMap[uc.coupon_id].includes(uc.user_email)) {
                        emailMap[uc.coupon_id].push(uc.user_email);
                    }
                }
            }
        }

        const enriched = (data || []).map((c: any) => ({
            ...c,
            applicable_products: productMap[c.id] || [],
            latest_user_emails: emailMap[c.id] || [],
        }));

        return NextResponse.json(enriched);
    } catch {
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server error' }, { status: 500 });
        }

        const body = await request.json();

        // Batch import: body.batch = ["CODE1", "CODE2", ...]
        if (body.batch && Array.isArray(body.batch)) {
            const coupons = body.batch.map((code: string) => ({
                code: code.toUpperCase().trim(),
                discount_type: body.discount_type || 'percent',
                discount_value: body.discount_value || 10,
                min_order_amount: body.min_order_amount || 0,
                max_discount: body.max_discount || null,
                usage_limit: body.usage_limit || null,
                per_user_limit: body.per_user_limit || null,
                expires_at: body.expires_at || null,
                is_active: true,
            }));

            const { data, error } = await supabaseAdmin
                .from('coupons')
                .upsert(coupons, { onConflict: 'code' })
                .select();

            if (error) throw error;

            // If product restrictions specified for batch
            if (body.applicable_product_ids?.length > 0 && data?.length) {
                const cpRows = data.flatMap((coupon: any) =>
                    body.applicable_product_ids.map((pid: string) => ({
                        coupon_id: coupon.id,
                        product_id: pid,
                    }))
                );
                await supabaseAdmin.from('coupon_products').upsert(cpRows, {
                    onConflict: 'coupon_id,product_id',
                });
            }

            return NextResponse.json({ message: `Đã import ${data?.length || 0} mã`, data });
        }

        // Single create
        const {
            code, discount_type, discount_value, min_order_amount,
            max_discount, usage_limit, per_user_limit, expires_at,
            applicable_product_ids,
        } = body;

        if (!code || !discount_value) {
            return NextResponse.json({ error: 'Thiếu mã hoặc giá trị giảm giá' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('coupons')
            .insert({
                code: code.toUpperCase().trim(),
                discount_type: discount_type || 'percent',
                discount_value,
                min_order_amount: min_order_amount || 0,
                max_discount: max_discount || null,
                usage_limit: usage_limit || null,
                per_user_limit: per_user_limit || null,
                expires_at: expires_at || null,
                is_active: true,
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'Mã giảm giá đã tồn tại' }, { status: 409 });
            }
            throw error;
        }

        // Save product restrictions if specified
        if (applicable_product_ids?.length > 0 && data) {
            const cpRows = applicable_product_ids.map((pid: string) => ({
                coupon_id: data.id,
                product_id: pid,
            }));
            await supabaseAdmin.from('coupon_products').insert(cpRows);
        }

        return NextResponse.json(data, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server error' }, { status: 500 });
        }

        const { id, is_active } = await request.json();

        const { error } = await supabaseAdmin
            .from('coupons')
            .update({ is_active })
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server error' }, { status: 500 });
        }

        const { id } = await request.json();

        // Delete product restrictions first (cascades, but be explicit)
        await supabaseAdmin.from('coupon_products').delete().eq('coupon_id', id);

        const { error } = await supabaseAdmin
            .from('coupons')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}
