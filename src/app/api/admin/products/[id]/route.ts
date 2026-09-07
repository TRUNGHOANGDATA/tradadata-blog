import { NextResponse } from 'next/server';
import { loiThanhChu } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) throw new Error('DB not setup');

        const { id } = await props.params;
        const { data, error } = await supabaseAdmin
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return NextResponse.json({ product: data });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) throw new Error('DB not setup');

        const body = await request.json();
        const { name, description, price, product_type, is_active, features, sort_order, duration_days, image_url, section_id } = body;

        const { id } = await props.params;

        const { data, error } = await supabaseAdmin
            .from('products')
            .update({
                name,
                description,
                price: parseFloat(price),
                product_type,
                is_active,
                features,
                sort_order: parseInt(sort_order) || 0,
                duration_days: duration_days ? parseInt(duration_days) : null,
                image_url: image_url || null,
                section_id: section_id || null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ product: data });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) throw new Error('DB not setup');

        // Note: you might want to prevent deleting a product if it has orders
        // Here we just let Supabase throw an error if FK constraint fails
        const { id } = await props.params;
        const { error } = await supabaseAdmin
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}
