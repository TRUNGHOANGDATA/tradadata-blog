import { supabaseAdmin } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';
import type { Post } from '@/types';

// Utility to calculate reading time based on content or excerpt length
function calculateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s/g).length;
    return Math.ceil(noOfWords / wordsPerMinute);
}

// Enhance post with computed fields if necessary
function formatPost(post: any): Post {
    let textForReadingTime = post.excerpt || '';
    if (post.content && typeof post.content === 'object') {
        // Rough estimate if tiptap json
        textForReadingTime += JSON.stringify(post.content);
    }

    return {
        ...post,
        reading_time: calculateReadingTime(textForReadingTime) || 3, // Default 3 mins
    } as Post;
}

export async function getPosts({
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
    let postCategoriesMap: Record<string, any[]> = {};
    if (postIds.length > 0) {
        const { data: pcData } = await supabaseAdmin
            .from('post_categories')
            .select('post_id, category:categories(*)')
            .in('post_id', postIds);
        if (pcData) {
            for (const pc of pcData) {
                if (!postCategoriesMap[pc.post_id]) postCategoriesMap[pc.post_id] = [];
                if (pc.category) postCategoriesMap[pc.post_id].push(pc.category);
            }
        }
    }

    return {
        data: (data || []).map(p => {
            const junctionCategories = postCategoriesMap[p.id] || [];
            // Use junction table category as primary if post.category is null
            const primaryCategory = p.category || junctionCategories[0] || null;
            return formatPost({
                ...p,
                category: primaryCategory,
                categories: junctionCategories.length > 0 ? junctionCategories : (p.category ? [p.category] : []),
            });
        }),
        count: count || 0,
    };
}

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
    ['post-by-slug'],
    { revalidate: 300, tags: ['posts'] } // Cache 5 phút
);

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
                            relatedPosts.push(formatPost(p));
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
                        relatedPosts.push(formatPost(p));
                    }
                }
            }
        }

        return relatedPosts;
    },
    ['related-posts'],
    { revalidate: 600, tags: ['posts'] } // Cache 10 phút
);

export async function getPinnedPosts(limit = 5): Promise<Post[]> {
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

    const catMap: Record<string, any[]> = {};
    if (pcData) {
        for (const pc of pcData) {
            if (!catMap[pc.post_id]) catMap[pc.post_id] = [];
            if (pc.category) catMap[pc.post_id].push(pc.category);
        }
    }

    return data.map(p => {
        const jCats = catMap[p.id] || [];
        return formatPost({
            ...p,
            category: p.category || jCats[0] || null,
            categories: jCats.length > 0 ? jCats : (p.category ? [p.category] : []),
        });
    });
}

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

export async function searchPosts(query: string): Promise<Post[]> {
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

    return (data || []).map(formatPost);
}
