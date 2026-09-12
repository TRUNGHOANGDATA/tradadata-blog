import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

// GET /api/bookmarks/ids — Trả về TẤT CẢ post_id mà người dùng đã lưu, trong MỘT
// truy vấn. Thay cho việc mỗi BookmarkButton tự gọi /api/bookmarks/check?postId=X.
//
// Vì sao: BookmarkButton gắn trên mọi PostCard, nên một trang danh sách 10 thẻ
// trước đây bắn 10 lần check — mỗi lần lại query `profiles` (thừa) + `user_bookmarks`.
// Đó là ~41% tải PostgREST lúc cao điểm (đo 12/09/2026). Endpoint này để client
// lấy một lần rồi mọi nút tra cứu cục bộ ⇒ N request/trang xuống còn 1.
//
// KHÔNG cache ở tầng server: đây là dữ liệu theo người dùng, cache dùng chung là
// rò danh sách đã lưu sang người khác. Việc gộp được thực hiện ở client
// (src/lib/bookmarks-client.ts) bằng một promise dùng chung.
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ ids: [] });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
        }

        // Tin `profileId` trong token — KHÔNG query `profiles` để "verify". Nếu
        // token cũ/sai thì cùng lắm trả danh sách rỗng, nút hiện "chưa lưu" —
        // vô hại và tự đúng lại sau lần đăng nhập kế. Đổi lại cắt được một truy
        // vấn `profiles` trên mỗi lượt xem của người đã đăng nhập.
        let userId: string | undefined = session.user.profileId;
        if (!userId) {
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('email', session.user.email)
                .single();
            if (!profile) return NextResponse.json({ ids: [] });
            userId = profile.id;
        }

        const { data, error } = await supabaseAdmin
            .from('user_bookmarks')
            .select('post_id')
            .eq('user_id', userId);

        if (error) {
            console.error('Bookmark ids error:', error);
            return NextResponse.json({ error: 'Failed to load bookmarks' }, { status: 500 });
        }

        return NextResponse.json({ ids: (data || []).map(r => r.post_id) });
    } catch (error) {
        console.error('Bookmark ids error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
