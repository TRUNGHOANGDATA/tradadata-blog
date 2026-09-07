import { NextResponse } from 'next/server';
import { loiThanhChu } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

type RouteParams = { params: Promise<{ id: string }> };

// DELETE /api/comments/[id] — Delete a comment (owner or admin only)
export async function DELETE(_request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        // Get comment to verify ownership
        const { data: comment, error: fetchError } = await supabaseAdmin
            .from('comments')
            .select('id, user_id')
            .eq('id', id)
            .single();

        if (fetchError || !comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }

        // Resolve profileId from DB
        let userId: string | undefined = session.user.profileId;
        if (userId) {
            const { data: check } = await supabaseAdmin.from('profiles').select('id').eq('id', userId).single();
            if (!check) userId = undefined;
        }
        if (!userId) {
            const { data: profile } = await supabaseAdmin.from('profiles').select('id').eq('email', session.user.email).single();
            if (profile) userId = profile.id;
        }

        // Only allow owner or admin to delete
        if (comment.user_id !== userId && session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Bạn chỉ có thể xoá bình luận của mình' }, { status: 403 });
        }

        // Delete comment (cascade will remove child replies)
        const { error } = await supabaseAdmin
            .from('comments')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}
