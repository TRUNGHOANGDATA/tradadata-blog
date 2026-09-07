import { NextResponse } from 'next/server';
import { loiThanhChu } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ email: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { email } = await params;
        if (!email) {
            return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { data: orders, error } = await supabaseAdmin
            .from('orders')
            .select('*, products(name)')
            .eq('email', decodeURIComponent(email))
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ orders: orders || [] });
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}
