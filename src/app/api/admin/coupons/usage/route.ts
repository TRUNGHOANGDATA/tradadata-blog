import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { auth } from '@/lib/auth';

// GET /api/admin/coupons/usage?coupon_id=xxx
export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server error' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const couponId = searchParams.get('coupon_id');

        if (!couponId) {
            return NextResponse.json({ error: 'Missing coupon_id' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('user_coupons')
            .select('*')
            .eq('coupon_id', couponId)
            .order('used_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(data || []);
    } catch {
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}
