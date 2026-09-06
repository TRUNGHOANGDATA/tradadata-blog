import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { revalidateTaxonomy } from '@/lib/cache';

// GET /api/admin/categories — List all categories
export async function GET() {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { data, error } = await supabaseAdmin
            .from('categories')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;

        return NextResponse.json({ categories: data || [] });
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Helper: generate slug
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// POST /api/admin/categories — Create a new category
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { name, description, icon, color } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const slug = generateSlug(name);

        const { data, error } = await supabaseAdmin
            .from('categories')
            .insert({ name, slug, description: description || null, icon: icon || null, color: color || null })
            .select()
            .single();

        if (error) throw error;

        revalidateTaxonomy();

        return NextResponse.json({ category: data }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT /api/admin/categories — Update a category
export async function PUT(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { id, name, description, icon, color } = body;

        if (!id || !name) {
            return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });
        }

        const slug = generateSlug(name);

        const { data, error } = await supabaseAdmin
            .from('categories')
            .update({ name, slug, description: description || null, icon: icon || null, color: color || null })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        revalidateTaxonomy();

        return NextResponse.json({ category: data });
    } catch (error: any) {
        console.error('Error updating category:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/admin/categories — Delete a category
export async function DELETE(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
        if (error) throw error;

        revalidateTaxonomy();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
