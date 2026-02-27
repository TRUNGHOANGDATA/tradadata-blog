import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        // Fetch all subscriptions with product and user info
        const { data: subscriptions, error } = await supabaseAdmin
            .from('user_subscriptions')
            .select(`
                id, user_email, user_id, product_id, starts_at, expires_at, order_id, created_at,
                products(id, name, product_type, duration_days),
                orders(order_code, amount, admin_note, status)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch profiles for display names
        const emails = [...new Set((subscriptions || []).map(s => s.user_email))];
        const { data: profiles } = await supabaseAdmin
            .from('profiles')
            .select('email, full_name, phone')
            .in('email', emails);

        const profileMap = new Map((profiles || []).map(p => [p.email, p]));

        // Fetch unique products for filter dropdown
        const { data: products } = await supabaseAdmin
            .from('products')
            .select('id, name')
            .order('name');

        // Enrich subscriptions with profile info
        const enriched = (subscriptions || []).map(sub => ({
            ...sub,
            user_name: profileMap.get(sub.user_email)?.full_name || '',
            user_phone: profileMap.get(sub.user_email)?.phone || '',
        }));

        return NextResponse.json({ subscriptions: enriched, products: products || [] });
    } catch (error: any) {
        console.error('Error fetching subscriptions:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
