import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Xoá cache liên quan tới bài viết sau khi ghi dữ liệu.
 *
 * Vì sao cần: `src/lib/data/posts.ts` bọc mọi query danh sách/bài viết trong
 * `unstable_cache` với tag 'posts'. Không gọi hàm này thì bài vừa publish vẫn
 * hiện nội dung cũ cho tới khi cache tự hết hạn (2-5 phút).
 *
 * LƯU Ý: `/blog/[slug]` KHÔNG phải trang tĩnh dù có `generateStaticParams` —
 * nó gọi `auth()` để gating Premium nên bị render động mọi request. Cái giữ cho
 * nó nhanh là data cache, không phải route cache.
 *
 * Gọi hàm này ở MỌI API route có ghi vào bảng posts / post_tags / post_categories.
 * Đừng gọi trong route đếm lượt xem — sẽ phá sạch cache mỗi lần có người đọc bài.
 *
 * @param slugs Các slug bị ảnh hưởng. Khi đổi slug, truyền cả slug cũ lẫn slug mới.
 * @param postId Id bài viết, để xoá cache HTML đã render (tag `post-<id>`).
 */
export function revalidatePost(slugs: (string | null | undefined)[] = [], postId?: string | null) {
    // Data cache của tầng lib/data/posts.ts
    revalidateTag('posts');

    // HTML đã render từ Tiptap JSON (cache riêng theo bài)
    if (postId) {
        revalidateTag(`post-${postId}`);
    }

    // Route cache của các trang tĩnh có liệt kê bài viết
    revalidatePath('/');
    revalidatePath('/blog');
    // Phan trang la route segment tinh (/blog/trang/2, /blog/trang/3...) nen phai
    // xoa ca chung, khong thi bai moi khong day duoc cac trang sau.
    revalidatePath('/blog/trang/[so]', 'page');
    revalidatePath('/sitemap.xml');

    // Trang chi tiết của từng bài
    const seen = new Set<string>();
    for (const slug of slugs) {
        if (!slug || seen.has(slug)) continue;
        seen.add(slug);
        revalidatePath(`/blog/${slug}`);
    }
}

/**
 * Xoá cache các trang danh mục / tag. Gọi khi sửa categories, tags,
 * hoặc khi đổi danh mục của một bài viết.
 */
export function revalidateTaxonomy() {
    revalidateTag('posts');
    revalidateTag('categories');
    revalidatePath('/categories');
    revalidatePath('/category/[slug]', 'page');
    revalidatePath('/category/[slug]/trang/[so]', 'page');
    revalidatePath('/tag/[slug]', 'page');
}

/**
 * Xoá cache cấu hình site (`site_settings`).
 *
 * Footer nằm trong layout gốc và đọc `social_links`, nên truy vấn đó phải được
 * cache — nếu không thì MỌI trang render động đều phải chờ một vòng gọi Supabase
 * trước khi gửi được byte đầu tiên, và `loading.tsx` cũng không kịp hiện.
 * Gọi hàm này sau khi admin lưu cài đặt để thay đổi hiện ra ngay.
 */
export function revalidateSettings() {
    revalidateTag('settings');
    revalidatePath('/', 'layout');
}

/**
 * Xoá cache danh mục hàm + ví dụ của /thuc-hanh (`src/lib/data/vi-du-ham.ts`).
 * Gọi ở mọi API route ghi vào bảng `vi_du_ham`. Trang /thuc-hanh là tĩnh và đọc
 * danh mục lúc render nên phải xoá cả route cache của nó.
 */
export function revalidateViDuHam() {
    revalidateTag('vi-du-ham');
    revalidatePath('/thuc-hanh');
}
