import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { auth } from '@/lib/auth';
import { loiThanhChu } from '@/lib/errors';
import { supabaseAdmin } from '@/lib/supabase/server';
import { revalidatePost } from '@/lib/cache';

/**
 * POST /api/admin/posts/dang-loat — xuất bản NHIỀU bài trong một lượt.
 *
 * Vì sao cần route riêng thay vì gọi `PUT /api/admin/posts/[id]` N lần:
 * PUT đó gọi `revalidatePost()` mỗi lần, mà hàm này xoá cache của `/`, `/blog`,
 * mọi trang phân trang và mọi trang danh mục. Đăng 20 bài kiểu đó là 20 lần
 * xoá sạch cache của cả site, cộng 20 vòng HTTP. Ở đây gom thành MỘT lần ghi DB
 * và MỘT lần revalidate.
 *
 * CỐ Ý không index luôn trong route này: gửi Google Indexing API mất ~200ms mỗi
 * URL và có thể lỗi vì lý do bên ngoài (quota, service account chưa được thêm
 * vào Search Console). Ghép hai việc vào một request là lỗi index sẽ làm hỏng
 * cả việc xuất bản. Client gọi `/api/admin/index-url` sau, với slug mà route
 * này trả về — route đó đã nhận mảng sẵn.
 */
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
            return NextResponse.json({ error: 'Không có quyền' }, { status: 401 });
        }
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Chưa cấu hình cơ sở dữ liệu' }, { status: 500 });
        }

        const { ids } = await request.json();
        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'Thiếu danh sách `ids`' }, { status: 400 });
        }
        // Chặn lô quá lớn: mỗi lô là một lần xoá cache toàn site, và người dùng
        // khó kiểm soát được kết quả nếu chọn cả trăm bài một lúc.
        if (ids.length > 50) {
            return NextResponse.json(
                { error: `Tối đa 50 bài mỗi lượt, đang chọn ${ids.length}` },
                { status: 400 }
            );
        }

        const { data: hienCo, error: loiDoc } = await supabaseAdmin
            .from('posts')
            .select('id, slug, title, status')
            .in('id', ids);
        if (loiDoc) throw loiDoc;

        if (!hienCo || hienCo.length === 0) {
            return NextResponse.json({ error: 'Không tìm thấy bài nào' }, { status: 404 });
        }

        // Bài đã xuất bản thì BỎ QUA, không ghi lại `published_at` — ghi lại là
        // đổi ngày xuất bản, làm sai thứ tự bài trên trang chủ.
        const canDang = hienCo.filter((p) => p.status !== 'published');
        const daXuatBan = hienCo.filter((p) => p.status === 'published');

        if (canDang.length === 0) {
            return NextResponse.json({
                message: 'Tất cả bài đã chọn đều đã xuất bản rồi.',
                daDang: [],
                boQua: daXuatBan.map((p) => ({ id: p.id, slug: p.slug, title: p.title })),
                slugs: daXuatBan.map((p) => p.slug),
            });
        }

        const bayGio = new Date().toISOString();
        const { data: ketQua, error: loiGhi } = await supabaseAdmin
            .from('posts')
            .update({ status: 'published', published_at: bayGio, updated_at: bayGio })
            .in('id', canDang.map((p) => p.id))
            .select('id, slug, title');
        if (loiGhi) throw loiGhi;

        const daDang = ketQua ?? [];

        // MỘT lần revalidate cho cả lô.
        revalidatePost(daDang.map((p) => p.slug));
        // HTML đã render của từng bài (tag `post-<id>`). Với bài lần đầu xuất bản
        // thì cache này chưa tồn tại nên đây chỉ là phòng trường hợp bài từng
        // published rồi bị chuyển về nháp và giờ đăng lại.
        for (const p of daDang) {
            revalidateTag(`post-${p.id}`);
        }

        return NextResponse.json({
            message: daXuatBan.length > 0
                ? `Đã xuất bản ${daDang.length} bài, bỏ qua ${daXuatBan.length} bài đã xuất bản trước đó.`
                : `Đã xuất bản ${daDang.length} bài.`,
            daDang,
            boQua: daXuatBan.map((p) => ({ id: p.id, slug: p.slug, title: p.title })),
            // Gồm CẢ bài bỏ qua: người dùng chọn chúng nên vẫn muốn chúng được
            // gửi index, kể cả khi không cần xuất bản lại.
            slugs: [...daDang.map((p) => p.slug), ...daXuatBan.map((p) => p.slug)],
        });
    } catch (error) {
        console.error('[dang-loat] loi:', loiThanhChu(error));
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}
