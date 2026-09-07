import { NextResponse } from 'next/server';
import { loiThanhChu } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

// GET /api/admin/users — List all users
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('*, is_subscribed')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ users: data || [] });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}

// PUT /api/admin/users — Update user role
export async function PUT(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized — admin only' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { id, role } = await request.json();

        if (!id || !role || !['admin', 'editor', 'reader'].includes(role)) {
            return NextResponse.json({ error: 'Invalid ID or role' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('profiles')
            .update({ role })
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}

// PATCH /api/admin/users — Toggle premium (is_subscribed) for a user
export async function PATCH(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized — admin only' }, { status: 401 });
        }

        const { id, is_subscribed } = await request.json();

        if (!id || typeof is_subscribed !== 'boolean') {
            return NextResponse.json({ error: 'Invalid ID or is_subscribed value' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('profiles')
            .update({ is_subscribed })
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error toggling premium:', error);
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}
