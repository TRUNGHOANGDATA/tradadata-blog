import { NextResponse } from 'next/server';
import { loiThanhChu } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        // Allow admin or editor (or just admin depending on your permissions)
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { amount, note } = body;

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        if (typeof amount !== 'number' || amount < 0) {
            return NextResponse.json({ error: 'Amount must be a valid positive number' }, { status: 400 });
        }

        // Verify order exists and is pending
        const { data: order, error: fetchError } = await supabaseAdmin
            .from('orders')
            .select('status, id')
            .eq('id', id)
            .single();

        if (fetchError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.status !== 'pending') {
            return NextResponse.json({ error: 'Chỉ có thể sửa giá cho đơn hàng đang chờ xác nhận (pending)' }, { status: 400 });
        }

        // Update the order amount and admin_note
        const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update({
                amount: amount,
                admin_note: note || null,
            })
            .eq('id', id);

        if (updateError) {
            console.error('Update amount error:', updateError);
            throw new Error('Failed to update order amount');
        }

        return NextResponse.json({ success: true, message: 'Cập nhật giá thành công' });
    } catch (error) {
        console.error('Error updating order amount:', error);
        return NextResponse.json({ error: loiThanhChu(error) || 'Internal server error' }, { status: 500 });
    }
}
