import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// Public endpoint to get site settings (social links, contact info, etc.)
export async function GET() {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json({ settings: {} });
        }

        const { data, error } = await supabaseAdmin.from('site_settings').select('key, value');
        if (error) throw error;

        const settings = data?.reduce((acc: Record<string, string>, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return NextResponse.json({ settings: settings || {} });
    } catch {
        return NextResponse.json({ settings: {} });
    }
}
