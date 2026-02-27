import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// Public endpoint to check order status (no auth required — order_code is the secret)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const orderCode = searchParams.get('order_code');

    if (!orderCode || !supabaseAdmin) {
        return NextResponse.json({ status: 'unknown' });
    }

    const { data } = await supabaseAdmin
        .from('orders')
        .select('status')
        .eq('order_code', orderCode)
        .single();

    return NextResponse.json({ status: data?.status || 'unknown' });
}
