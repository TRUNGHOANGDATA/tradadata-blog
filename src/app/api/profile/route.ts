import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { auth } from '@/lib/auth';

// GET /api/profile — return current user's profile
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server error' }, { status: 500 });
        }

        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('full_name, email, phone, avatar_url, is_subscribed, role')
            .eq('email', session.user.email)
            .single();

        // Get orders
        const { data: orders } = await supabaseAdmin
            .from('orders')
            .select('id, order_code, amount, status, created_at, paid_at, products(name, product_type)')
            .eq('email', session.user.email)
            .order('created_at', { ascending: false });

        // Get subscriptions
        const { data: subscriptions } = await supabaseAdmin
            .from('user_subscriptions')
            .select('id, starts_at, expires_at, products(name)')
            .eq('user_email', session.user.email)
            .order('expires_at', { ascending: false });

        return NextResponse.json({
            profile: profile || { full_name: session.user.name, email: session.user.email },
            orders: orders || [],
            subscriptions: subscriptions || [],
        });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// PATCH /api/profile — update name and phone
export async function PATCH(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server error' }, { status: 500 });
        }

        const { full_name, phone } = await request.json();

        // Validate phone if provided
        if (phone && !/^0[35789][0-9]{8}$/.test(phone)) {
            return NextResponse.json({ error: 'Số điện thoại không hợp lệ' }, { status: 400 });
        }

        const updates: Record<string, unknown> = {};
        if (full_name !== undefined) updates.full_name = full_name.trim();
        if (phone !== undefined) updates.phone = phone.trim() || null;

        const { data: existing } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', session.user.email)
            .single();

        if (existing) {
            await supabaseAdmin
                .from('profiles')
                .update(updates)
                .eq('id', existing.id);
        } else {
            await supabaseAdmin
                .from('profiles')
                .insert({ email: session.user.email, ...updates });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
