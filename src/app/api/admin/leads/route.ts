import { NextResponse } from 'next/server';
import { loiThanhChu } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

const STATUSES = ['new', 'contacted', 'won', 'lost'] as const;

// GET /api/admin/leads — danh sách khách để lại thông tin ở /phan-mem-ban-hang
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
            .from('software_leads')
            .select('id, full_name, phone, company, note, source, status, created_at')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ leads: data || [] });
    } catch (error) {
        console.error('Error fetching leads:', error);
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}

// PATCH /api/admin/leads — đổi trạng thái một lead
export async function PATCH(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { id, status } = await request.json();
        if (!id || !STATUSES.includes(status)) {
            return NextResponse.json({ error: 'Thiếu id hoặc trạng thái không hợp lệ' }, { status: 400 });
        }

        const { error } = await supabaseAdmin.from('software_leads').update({ status }).eq('id', id);
        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating lead:', error);
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}

// DELETE /api/admin/leads?id=... — xoá lead rác / lead test
export async function DELETE(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const id = new URL(request.url).searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Thiếu id' }, { status: 400 });
        }

        const { error } = await supabaseAdmin.from('software_leads').delete().eq('id', id);
        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting lead:', error);
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}
