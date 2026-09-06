import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Xoá cache liên quan tới bài viết sau khi ghi dữ liệu.
 *
 * Vì sao cần: `/blog/[slug]` được pre-render tĩnh qua `generateStaticParams` và
 * `src/lib/data/posts.ts` bọc query trong `unstable_cache`. Nếu không gọi hàm này,
 * bài viết đã publish sẽ giữ nguyên nội dung cũ cho tới lần deploy tiếp theo.
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
    revalidatePath('/categories');
    revalidatePath('/category/[slug]', 'page');
    revalidatePath('/tag/[slug]', 'page');
}
