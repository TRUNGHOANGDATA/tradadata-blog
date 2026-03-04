import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

// GET: Check if user has phone number
export async function GET() {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    const { data } = await supabaseAdmin
        .from('profiles')
        .select('phone')
        .eq('email', session.user.email)
        .single();

    return NextResponse.json({ phone: data?.phone || null });
}

// PUT: Update phone number
export async function PUT(request: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    const { phone } = await request.json();

    // Validate
    if (!phone || typeof phone !== 'string') {
        return NextResponse.json({ error: 'Vui lòng nhập số điện thoại' }, { status: 400 });
    }

    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10 || !cleaned.startsWith('0')) {
        return NextResponse.json({ error: 'Số điện thoại phải có 10 chữ số, bắt đầu bằng 0' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
        .from('profiles')
        .update({ phone: cleaned })
        .eq('email', session.user.email);

    if (error) {
        return NextResponse.json({ error: 'Không thể cập nhật: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, phone: cleaned });
}
