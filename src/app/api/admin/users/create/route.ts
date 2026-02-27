import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { email, full_name, phone, role } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email là bắt buộc' }, { status: 400 });
        }

        // Check if profile already exists
        const { data: existingProfile } = await supabaseAdmin
            .from('profiles')
            .select('id, email')
            .eq('email', email)
            .single();

        if (existingProfile) {
            return NextResponse.json({ error: 'Email này đã tồn tại trong hệ thống' }, { status: 409 });
        }

        // Create profile directly — user sẽ đăng nhập qua Google OAuth
        // Khi đăng nhập Google, hệ thống sẽ tự khớp email với profile này
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
                email,
                full_name: full_name || '',
                phone: phone || null,
                role: role || 'reader',
                is_subscribed: false,
            })
            .select('id, email, full_name, role')
            .single();

        if (profileError) throw profileError;

        return NextResponse.json({
            success: true,
            user: profile,
            message: `Tạo tài khoản thành công! Khách hàng đăng nhập bằng Google (${email}) để truy cập.`
        });

    } catch (error: any) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: error.message || 'Lỗi hệ thống' }, { status: 500 });
    }
}
