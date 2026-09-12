import { supabaseAdmin } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';
import { anToan, kiemLoiTruyVan } from '@/lib/data/an-toan';
import { extractTextFromContent, calculateReadingTime } from '@/lib/utils';
import type { Post, Category, HangBaiVietTho } from '@/types';

// Enhance post with computed fields if necessary
//
// `stripContent` BẮT BUỘC bật cho mọi hàm trả về DANH SÁCH bài viết.
// Lý do: các query dùng select('*') nên kéo về cả cột `content`. Danh sách bài
// được truyền xuống Client Component (BlogListClient, PinnedSlider), mà props của
// Client Component thì Next serialize vào RSC payload gửi thẳng cho trình duyệt.
// Không cắt ở đây thì toàn bộ nội dung bài Premium tải được từ /blog dù có paywall.
// Danh sách cũng không cần `content` — chỉ dùng title/excerpt/cover.
function formatPost(post: HangBaiVietTho, { stripContent = false }: { stripContent?: boolean } = {}): Post {
    // `content` lưu dạng chuỗi JSON Tiptap ⇒ phải bóc text thuần bằng
    // extractTextFromContent (khớp cách admin tính reading_time), không dùng
    // typeof === 'object' vì chuỗi luôn trượt điều kiện đó ⇒ mọi bài ra 1 phút.
    const textForReadingTime = extractTextFromContent(post.content) || post.excerpt || '';

    // Tính reading_time TRƯỚC khi bỏ content
    const formatted = {
        ...post,
        reading_time: calculateReadingTime(textForReadingTime),
    };

    if (stripContent) {
        delete formatted.content;
    }

    return formatted as Post;
}

// Alias cho các hàm trả về danh sách — khó quên hơn là truyền option bằng tay
const formatPostForList = (post: HangBaiVietTho): Post => formatPost(post, { stripContent: true });

/**
 * `category:categories(*)` la quan he nhieu-mot: Supabase suy ra kieu MANG (no
 * khong luon biet luc lieu) con runtime tra ve MOT object. Chuan hoa ca hai dang
 * de khong phai cast `any`, va de neu Supabase co doi cach tra thi khong vo.
 */
function chuanHoaDanhMuc(v: unknown): Category[] {
    if (!v) return [];
    return (Array.isArray(v) ? v : [v]) as Category[];
}

/**
 * Truy van danh sach bai viet.
 *
 * Ban chua cache de o duoi, `getPosts` xuat ra la ban DA BOC unstable_cache.
 * Vi sao phai cache: /blog dung `searchParams` nen bi Next ep render dong, tuc
 * `export const revalidate` cua trang khong bao gio ap dung. Neu tang data cung
 * khong cache thi moi request la mot vong goi Supabase — do duoc TTFB 1.3s.
 *
 * Cache duoc gan tag 'posts' nen `revalidatePost()` trong src/lib/cache.ts van
 * xoa sach khi co bai moi. Dung bo tag di.
 */
async function getPostsUncached({
    page = 1,
    limit = 10,
    categoryId,
}: {
    page?: number;
    limit?: number;
    categoryId?: string;
} = {}): Promise<{ data: Post[]; count: number }> {
    if (!supabaseAdmin) return { data: [], count: 0 };

    let query = supabaseAdmin
        .from('posts')
        .select('*, author:profiles(*), category:categories!category_id(*)', { count: 'exact' })
        .eq('status', 'published')
        .order('published_at', { ascending: false });

    if (categoryId) {
        // Use junction table for multi-category support
        const { data: postIds } = await supabaseAdmin
            .from('post_categories')
            .select('post_id')
            .eq('category_id', categoryId);

        if (postIds && postIds.length > 0) {
            query = query.in('id', postIds.map(r => r.post_id));
        } else {
            return { data: [], count: 0 };
        }
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    // Ném chứ không trả rỗng — xem src/lib/data/an-toan.ts.
    kiemLoiTruyVan(error, 'posts.getPosts');

    // Fetch all categories for these posts from junction table
    const postIds = (data || []).map(p => p.id);
    const postCategoriesMap: Record<string, Category[]> = {};
    if (postIds.length > 0) {
        const { data: pcData } = await supabaseAdmin
            .from('post_categories')
            .select('post_id, category:categories(*)')
            .in('post_id', postIds);
        if (pcData) {
            for (const pc of pcData) {
                if (!postCategoriesMap[pc.post_id]) postCategoriesMap[pc.post_id] = [];
                postCategoriesMap[pc.post_id].push(...chuanHoaDanhMuc(pc.category));
            }
        }
    }

    return {
        data: (data || []).map(p => {
            const junctionCategories = postCategoriesMap[p.id] || [];
            // Use junction table category as primary if post.category is null
            const primaryCategory = p.category || junctionCategories[0] || null;
            return formatPostForList({
                ...p,
                category: primaryCategory,
                categories: junctionCategories.length > 0 ? junctionCategories : (p.category ? [p.category] : []),
            });
        }),
        count: count || 0,
    };
}

export const getPosts = anToan(
    unstable_cache(
        getPostsUncached,
        ['posts-list-v1'],
        { revalidate: 120, tags: ['posts'] } // 2 phut; revalidatePost() xoa ngay khi can
    ),
    { data: [], count: 0 }
);

// Cached version — prevents duplicate DB queries between generateMetadata and BlogPostPage
export const getPostBySlug = unstable_cache(
    async (slug: string): Promise<Post | null> => {
        if (!supabaseAdmin) return null;

        const { data, error } = await supabaseAdmin
            .from('posts')
            .select('*, author:profiles(*), category:categories!category_id(*)')
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

        // Không có bài là 404 thật -> null. Lỗi hệ thống -> ném, để trang ISR giữ
        // bản cũ thay vì cache một trang 404 suốt một giờ. CỐ Ý không bọc anToan.
        if (kiemLoiTruyVan(error, 'posts.getPostBySlug', { boQuaKhongCoDong: true })) return null;

        return formatPost(data);
    },
    ['post-by-slug-v2'],
    { revalidate: 300, tags: ['posts'] } // Cache 5 phút
);

// Uncached — loads ANY post by slug (draft or published), for admin preview
export async function getPostBySlugForPreview(slug: string): Promise<Post | null> {
    if (!supabaseAdmin) return null;

    const { data, error } = await supabaseAdmin
        .from('posts')
        .select('*, author:profiles(*), category:categories!category_id(*)')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error(`Error fetching post preview ${slug}:`, error);
        return null;
    }

    return formatPost(data);
}

// Cached version — related posts don't change frequently
//
// CHẤM ĐIỂM thay vì "ưu tiên tag rồi fallback danh mục": mỗi ứng viên được cộng
// điểm theo SỐ tag chung và SỐ danh mục chung với bài đang đọc, rồi sort giảm dần.
// Nhờ vậy bài chung 3 tag đứng trên bài chung 1 tag — bản cũ chỉ sort theo ngày
// nên xếp ngang nhau. Danh mục lấy từ junction `post_categories` (đa chủ đề),
// không chỉ cột `category_id` cũ, nên bài nhiều chủ đề match đủ mọi hướng.
export const getRelatedPosts = anToan(unstable_cache(
    async (currentPostId: string, tagIds: string[] = [], limit = 3): Promise<Post[]> => {
        if (!supabaseAdmin) return [];

        // Danh mục của chính bài đang đọc — lấy từ junction để phủ bài đa chủ đề.
        const { data: ownCats } = await supabaseAdmin
            .from('post_categories')
            .select('category_id')
            .eq('post_id', currentPostId);
        const categoryIds = [...new Set((ownCats || []).map(r => r.category_id))];

        // Chung tag là tín hiệu "cùng chủ đề" mạnh hơn chung danh mục (danh mục rộng),
        // nên tag nặng điểm hơn.
        const TAG_WEIGHT = 3;
        const CAT_WEIGHT = 1;
        const scores = new Map<string, number>();

        if (tagIds.length > 0) {
            const { data } = await supabaseAdmin
                .from('post_tags')
                .select('post_id')
                .in('tag_id', tagIds)
                .neq('post_id', currentPostId);
            for (const r of data || []) {
                scores.set(r.post_id, (scores.get(r.post_id) || 0) + TAG_WEIGHT);
            }
        }

        if (categoryIds.length > 0) {
            const { data } = await supabaseAdmin
                .from('post_categories')
                .select('post_id')
                .in('category_id', categoryIds)
                .neq('post_id', currentPostId);
            for (const r of data || []) {
                scores.set(r.post_id, (scores.get(r.post_id) || 0) + CAT_WEIGHT);
            }
        }

        if (scores.size === 0) return [];

        // Chỉ giữ bài đã publish; cần `published_at` để tie-break khi cùng điểm.
        const candidateIds = [...scores.keys()];
        const { data: posts, error: loiPosts } = await supabaseAdmin
            .from('posts')
            .select('*, author:profiles(*), category:categories!category_id(*)')
            .eq('status', 'published')
            .in('id', candidateIds);
        kiemLoiTruyVan(loiPosts, 'posts.getRelatedPosts');

        if (!posts) return [];

        return posts
            .sort((a, b) => {
                const diff = (scores.get(b.id) || 0) - (scores.get(a.id) || 0);
                if (diff !== 0) return diff;
                // Cùng điểm: bài mới hơn lên trước.
                return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime();
            })
            .slice(0, limit)
            .map(formatPostForList);
    },
    ['related-posts-v2'],
    { revalidate: 600, tags: ['posts'] } // Cache 10 phút
), []);

async function getPinnedPostsUncached(limit = 5): Promise<Post[]> {
    if (!supabaseAdmin) return [];

    const { data, error } = await supabaseAdmin
        .from('posts')
        .select('*, author:profiles(*), category:categories!category_id(*)')
        .eq('status', 'published')
        .eq('is_pinned', true)
        .order('pinned_at', { ascending: false })
        .limit(limit);

    kiemLoiTruyVan(error, 'posts.getPinnedPosts');

    if (!data || data.length === 0) return [];

    // Enrich with junction table categories
    const postIds = data.map(p => p.id);
    const { data: pcData } = await supabaseAdmin
        .from('post_categories')
        .select('post_id, category:categories(*)')
        .in('post_id', postIds);

    const catMap: Record<string, Category[]> = {};
    if (pcData) {
        for (const pc of pcData) {
            if (!catMap[pc.post_id]) catMap[pc.post_id] = [];
            catMap[pc.post_id].push(...chuanHoaDanhMuc(pc.category));
        }
    }

    return data.map(p => {
        const jCats = catMap[p.id] || [];
        return formatPostForList({
            ...p,
            category: p.category || jCats[0] || null,
            categories: jCats.length > 0 ? jCats : (p.category ? [p.category] : []),
        });
    });
}

// KHONG boc cache rieng: no goi getPosts (da cache) nen tu huong cache theo.
// Boc them mot lop nua chi ton bo nho ma khong nhanh hon.
export async function getLatestPosts(limit = 6): Promise<Post[]> {
    const { data } = await getPosts({ limit });
    return data;
}

// Get all published slugs — for generateStaticParams (SSG)
export const getAllPublishedSlugs = unstable_cache(
    async (): Promise<string[]> => {
        if (!supabaseAdmin) return [];
        const { data, error } = await supabaseAdmin
            .from('posts')
            .select('slug')
            .eq('status', 'published');
        // Dùng ở generateStaticParams: DB lỗi thì build PHẢI đỏ, không được
        // lặng lẽ sinh 0 trang bài. CỐ Ý không bọc anToan.
        kiemLoiTruyVan(error, 'posts.getAllPublishedSlugs');
        return (data || []).map(p => p.slug);
    },
    ['all-published-slugs'],
    { revalidate: 3600, tags: ['posts'] }
);

async function searchPostsUncached(query: string): Promise<Post[]> {
    if (!supabaseAdmin || !query) return [];

    const { data, error } = await supabaseAdmin
        .from('posts')
        .select('*, author:profiles(*), category:categories!category_id(*)')
        .eq('status', 'published')
        .ilike('title', `%${query}%`)
        .order('published_at', { ascending: false })
        .limit(10);

    kiemLoiTruyVan(error, 'posts.searchPosts');

    return (data || []).map(formatPostForList);
}

export const getPinnedPosts = anToan(
    unstable_cache(
        getPinnedPostsUncached,
        ['pinned-posts-v1'],
        { revalidate: 300, tags: ['posts'] }
    ),
    []
);

/**
 * Tim kiem co cache 60 giay.
 *
 * Khoa cache la chuoi nguoi dung go nen khong gioi han so khoa. 60 giay du de
 * chan viec go lai/tai lai cung tu khoa lien tuc ma khong phinh cache tren dia.
 */
export const searchPosts = anToan(
    unstable_cache(
        searchPostsUncached,
        ['search-posts-v1'],
        { revalidate: 60, tags: ['posts'] }
    ),
    []
);

/**
 * Tag cua mot bai viet. Truoc day viet tho ngay trong /blog/[slug] — ma trang do
 * render DONG moi request (vi goi `auth()` de gating Premium), nen truy van nay
 * chay lai moi luot doc bai.
 *
 * KHONG cache duoc chung voi truy van kiem tra `profiles.is_subscribed` ben canh:
 * cai do la du lieu theo NGUOI DUNG, cache lai la ro quyen Premium sang nguoi khac.
 */
export const getPostTags = anToan(unstable_cache(
    async (postId: string): Promise<{ id: string; name: string; slug: string }[]> => {
        if (!supabaseAdmin) return [];
        const { data, error } = await supabaseAdmin
            .from('post_tags')
            .select('tag_id, tags(id, name, slug)')
            .eq('post_id', postId);
        kiemLoiTruyVan(error, 'posts.getPostTags');
        type Row = { tags: { id: string; name: string; slug: string } | null };
        return ((data as Row[] | null) || []).map(pt => pt.tags).filter((t): t is { id: string; name: string; slug: string } => !!t);
    },
    ['post-tags-v1'],
    { revalidate: 300, tags: ['posts'] }
), []);
