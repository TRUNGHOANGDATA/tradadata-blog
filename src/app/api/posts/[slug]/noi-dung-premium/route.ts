import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { auth } from '@/lib/auth';
import { loiThanhChu } from '@/lib/errors';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getPostBySlug } from '@/lib/data/posts';
import { renderPostContent } from '@/lib/highlight-utils';

type RouteParams = { params: Promise<{ slug: string }> };

/**
 * GET /api/posts/[slug]/noi-dung-premium
 *
 * Trả PHẦN THÂN ĐẦY ĐỦ của một bài Premium, chỉ cho người đã mua.
 *
 * Đây là RÀO BẢO MẬT THẬT của paywall, không phải rào UI:
 * `/blog/[slug]` giờ là trang TĨNH nên HTML nó trả về giống nhau với mọi
 * người và chỉ chứa vài block đọc thử. Nội dung trả phí không nằm trong HTML
 * đó, nên không lấy được bằng View Source hay tắt CSS. Đường duy nhất tới
 * nội dung đầy đủ là route này, và nó kiểm:
 *   1. có đăng nhập,
 *   2. `profiles.is_subscribed` = true.
 *
 * ĐỪNG bọc bước kiểm quyền bằng `unstable_cache`: cache dùng chung cho mọi
 * khách nên sẽ phục vụ nội dung của người đã mua cho người chưa mua.
 * Chỉ phần RENDER (không phụ thuộc người xem) mới được cache.
 *
 * Trả `no-store` để không tầng nào giữ lại phản hồi có nội dung trả phí.
 */
export async function GET(_request: Request, { params }: RouteParams) {
    try {
        const { slug } = await params;

        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Bạn cần đăng nhập để đọc bài viết này.' },
                { status: 401, headers: { 'Cache-Control': 'no-store' } }
            );
        }

        const post = await getPostBySlug(slug);
        if (!post) {
            return NextResponse.json(
                { error: 'Không tìm thấy bài viết.' },
                { status: 404, headers: { 'Cache-Control': 'no-store' } }
            );
        }

        // Bài không phải Premium thì thân bài đã nằm sẵn trong HTML tĩnh —
        // gọi vào đây là sai luồng, không phục vụ để khỏi có hai đường lấy nội dung.
        if (!post.is_premium) {
            return NextResponse.json(
                { error: 'Bài viết này không phải Premium.' },
                { status: 400, headers: { 'Cache-Control': 'no-store' } }
            );
        }

        if (!supabaseAdmin) {
            return NextResponse.json(
                { error: 'Chưa cấu hình cơ sở dữ liệu.' },
                { status: 500, headers: { 'Cache-Control': 'no-store' } }
            );
        }

        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('is_subscribed')
            .eq('email', session.user.email)
            .single();

        if (!profile?.is_subscribed) {
            return NextResponse.json(
                { error: 'Bài viết này dành cho thành viên Premium.' },
                { status: 403, headers: { 'Cache-Control': 'no-store' } }
            );
        }

        // Chỉ tới đây mới được render bản đầy đủ. Dùng ĐÚNG cache key mà trang
        // bài viết vẫn dùng cho bản đầy đủ (`post-content-<id>`) để không phải
        // parse Tiptap lại lần nữa; key này khác `post-content-preview-<id>`
        // nên không có đường lẫn bản đầy đủ sang người chưa mở khoá.
        const layNoiDung = unstable_cache(
            async (contentRaw: unknown) => renderPostContent(contentRaw),
            [`post-content-${post.id}`],
            { revalidate: 3600, tags: [`post-${post.id}`] }
        );
        const { html, toc } = await layNoiDung(post.content);

        return NextResponse.json(
            { html, toc },
            { headers: { 'Cache-Control': 'no-store' } }
        );
    } catch (e) {
        console.error('[noi-dung-premium] loi:', loiThanhChu(e));
        return NextResponse.json(
            { error: 'Không tải được nội dung.' },
            { status: 500, headers: { 'Cache-Control': 'no-store' } }
        );
    }
}
