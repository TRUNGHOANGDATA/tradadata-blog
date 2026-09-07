import { NextResponse } from 'next/server';
import { loiThanhChu } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { revalidateTaxonomy } from '@/lib/cache';

// GET /api/admin/tags — List all tags
export async function GET() {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { data, error } = await supabaseAdmin
            .from('tags')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;

        return NextResponse.json({ tags: data || [] });
    } catch (error) {
        console.error('Error fetching tags:', error);
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}

function generateSlug(name: string): string {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
}

// POST /api/admin/tags — Create a tag
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!supabaseAdmin) return NextResponse.json({ error: 'DB error' }, { status: 500 });

        const { name } = await request.json();
        if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

        const slug = generateSlug(name);
        const { data, error } = await supabaseAdmin.from('tags').insert({ name, slug }).select().single();
        if (error) throw error;

        revalidateTaxonomy();

        return NextResponse.json({ tag: data }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}

// DELETE /api/admin/tags
export async function DELETE(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!supabaseAdmin) return NextResponse.json({ error: 'DB error' }, { status: 500 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        // Remove from post_tags first
        await supabaseAdmin.from('post_tags').delete().eq('tag_id', id);
        const { error } = await supabaseAdmin.from('tags').delete().eq('id', id);
        if (error) throw error;

        revalidateTaxonomy();

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}
