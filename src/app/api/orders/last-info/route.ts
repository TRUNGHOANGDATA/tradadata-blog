import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { auth } from '@/lib/auth';

// Returns the most recent order info for auto-fill
export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({});
        }

        if (!supabaseAdmin) {
            return NextResponse.json({});
        }

        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        // Security: only allow fetching own data
        if (email !== session.user.email) {
            return NextResponse.json({});
        }

        const { data } = await supabaseAdmin
            .from('orders')
            .select('full_name, phone')
            .eq('email', email)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        return NextResponse.json(data || {});
    } catch {
        return NextResponse.json({});
    }
}
