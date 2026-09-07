import { supabaseAdmin } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';
import type { Post, Category, HangBaiVietTho } from '@/types';

// Utility to calculate reading time based on content or excerpt length
function calculateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s/g).length;
    return Math.ceil(noOfWords / wordsPerMinute);
}

// Enhance post with computed fields if necessary
//
// `stripContent` BẮT BUỘC bật cho mọi hàm trả về DANH SÁCH bài viết.
// Lý do: các query dùng select('*') nên kéo về cả cột `content`. Danh sách bài
// được truyền xuống Client Component (BlogListClient, PinnedSlider), mà props của
// Client Component thì Next serialize vào RSC payload gửi thẳng cho trình duyệt.
// Không cắt ở đây thì toàn bộ nội dung bài Premium tải được từ /blog dù có paywall.
// Danh sách cũng không cần `content` — chỉ dùng title/excerpt/cover.
function formatPost(post: HangBaiVietTho, { stripContent = false }: { stripContent?: boolean } = {}): Post {
    let textForReadingTime = post.excerpt || '';
    if (post.content && typeof post.content === 'object') {
        // Rough estimate if tiptap json
        textForReadingTime += JSON.stringify(post.content);
    }

    // Tính reading_time TRƯỚC khi bỏ content
    const formatted = {
        ...post,
        reading_time: calculateReadingTime(textForReadingTime) || 3, // Default 3 mins
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

    if (error) {
        console.error('Error fetching posts:', error);
        return { data: [], count: 0 };
    }

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

export const getPosts = unstable_cache(
    getPostsUncached,
    ['posts-list-v1'],
    { revalidate: 120, tags: ['posts'] } // 2 phut; revalidatePost() xoa ngay khi can
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

        if (error) {
            console.error(`Error fetching post ${slug}:`, error);
            return null;
        }

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
export const getRelatedPosts = unstable_cache(
    async (categoryId: string, currentPostId: string, limit = 3, tagIds?: string[]): Promise<Post[]> => {
        if (!supabaseAdmin) return [];

        const relatedPosts: Post[] = [];
        const seenIds = new Set<string>([currentPostId]);

        // Priority 1: Posts sharing the same tags
        if (tagIds && tagIds.length > 0) {
            const { data: taggedPostIds } = await supabaseAdmin
                .from('post_tags')
                .select('post_id')
                .in('tag_id', tagIds)
                .neq('post_id', currentPostId);

            if (taggedPostIds && taggedPostIds.length > 0) {
                const uniqueIds = [...new Set(taggedPostIds.map(r => r.post_id))];
                const { data: tagPosts } = await supabaseAdmin
                    .from('posts')
                    .select('*, author:profiles(*), category:categories!category_id(*)')
                    .eq('status', 'published')
                    .in('id', uniqueIds)
                    .order('published_at', { ascending: false })
                    .limit(limit);

                if (tagPosts) {
                    for (const p of tagPosts) {
                        if (!seenIds.has(p.id) && relatedPosts.length < limit) {
                            seenIds.add(p.id);
                            relatedPosts.push(formatPostForList(p));
                        }
                    }
                }
            }
        }

        // Priority 2 (fallback): Posts in same category
        if (relatedPosts.length < limit && categoryId) {
            const { data: catPosts } = await supabaseAdmin
                .from('posts')
                .select('*, author:profiles(*), category:categories!category_id(*)')
                .eq('status', 'published')
                .eq('category_id', categoryId)
                .neq('id', currentPostId)
                .order('published_at', { ascending: false })
                .limit(limit);

            if (catPosts) {
                for (const p of catPosts) {
                    if (!seenIds.has(p.id) && relatedPosts.length < limit) {
                        seenIds.add(p.id);
                        relatedPosts.push(formatPostForList(p));
                    }
                }
            }
        }

        return relatedPosts;
    },
    ['related-posts'],
    { revalidate: 600, tags: ['posts'] } // Cache 10 phút
);

async function getPinnedPostsUncached(limit = 5): Promise<Post[]> {
    if (!supabaseAdmin) return [];

    const { data, error } = await supabaseAdmin
        .from('posts')
        .select('*, author:profiles(*), category:categories!category_id(*)')
        .eq('status', 'published')
        .eq('is_pinned', true)
        .order('pinned_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching pinned posts:', error);
        return [];
    }

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
        if (error) { console.error('Error fetching slugs:', error); return []; }
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

    if (error) {
        console.error('Error searching posts:', error);
        return [];
    }

    return (data || []).map(formatPostForList);
}

export const getPinnedPosts = unstable_cache(
    getPinnedPostsUncached,
    ['pinned-posts-v1'],
    { revalidate: 300, tags: ['posts'] }
);

/**
 * Tim kiem co cache 60 giay.
 *
 * Khoa cache la chuoi nguoi dung go nen khong gioi han so khoa. 60 giay du de
 * chan viec go lai/tai lai cung tu khoa lien tuc ma khong phinh cache tren dia.
 */
export const searchPosts = unstable_cache(
    searchPostsUncached,
    ['search-posts-v1'],
    { revalidate: 60, tags: ['posts'] }
);

/**
 * Tag cua mot bai viet. Truoc day viet tho ngay trong /blog/[slug] — ma trang do
 * render DONG moi request (vi goi `auth()` de gating Premium), nen truy van nay
 * chay lai moi luot doc bai.
 *
 * KHONG cache duoc chung voi truy van kiem tra `profiles.is_subscribed` ben canh:
 * cai do la du lieu theo NGUOI DUNG, cache lai la ro quyen Premium sang nguoi khac.
 */
export const getPostTags = unstable_cache(
    async (postId: string): Promise<{ id: string; name: string; slug: string }[]> => {
        if (!supabaseAdmin) return [];
        const { data } = await supabaseAdmin
            .from('post_tags')
            .select('tag_id, tags(id, name, slug)')
            .eq('post_id', postId);
        type Row = { tags: { id: string; name: string; slug: string } | null };
        return ((data as Row[] | null) || []).map(pt => pt.tags).filter((t): t is { id: string; name: string; slug: string } => !!t);
    },
    ['post-tags-v1'],
    { revalidate: 300, tags: ['posts'] }
);
