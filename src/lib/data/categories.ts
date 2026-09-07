import { unstable_cache } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { Category } from '@/types';

async function getCategoriesUncached(): Promise<Category[]> {
    if (!supabaseAdmin) return [];

    // Sort by created_at since sort_order is not in DB
    const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    return data as Category[];
}

async function getCategoryBySlugUncached(slug: string): Promise<Category | null> {
    if (!supabaseAdmin) return null;

    const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error(`Error fetching category ${slug}:`, error);
        return null;
    }

    return data as Category;
}

/**
 * Danh muc rat it doi ma duoc doc o gan nhu moi trang (header, /blog, sidebar),
 * nen cache 10 phut. Tag 'categories' — `revalidateTaxonomy()` trong
 * src/lib/cache.ts xoa ngay khi admin sua danh muc.
 */
export const getCategories = unstable_cache(
    getCategoriesUncached,
    ['categories-all-v1'],
    { revalidate: 600, tags: ['categories'] }
);

export const getCategoryBySlug = unstable_cache(
    getCategoryBySlugUncached,
    ['category-by-slug-v1'],
    { revalidate: 600, tags: ['categories'] }
);

/**
 * Dem so bai da publish theo tung danh muc, doc qua bang noi `post_categories`.
 *
 * Truoc day doan nay duoc viet LAP Y NGUYEN trong `src/app/page.tsx` va
 * `src/app/categories/page.tsx`, moi cho hai truy van tho khong cache. Gom lai
 * mot cho de sua mot lan, va de cache dung mot ban.
 *
 * Tra ve map { category_id: so_bai }.
 */
export const getCategoryPostCounts = unstable_cache(
    async (): Promise<Record<string, number>> => {
        if (!supabaseAdmin) return {};

        const [{ data: publishedPosts }, { data: junction }] = await Promise.all([
            supabaseAdmin.from('posts').select('id').eq('status', 'published'),
            supabaseAdmin.from('post_categories').select('category_id, post_id'),
        ]);

        const publishedIds = new Set((publishedPosts || []).map((p: { id: string }) => p.id));
        const counts: Record<string, number> = {};
        (junction || []).forEach((pc: { category_id: string | null; post_id: string }) => {
            if (pc.category_id && publishedIds.has(pc.post_id)) {
                counts[pc.category_id] = (counts[pc.category_id] || 0) + 1;
            }
        });
        return counts;
    },
    ['category-post-counts-v1'],
    // Doi khi publish bai moi HOAC sua danh muc -> gan ca hai tag
    { revalidate: 300, tags: ['posts', 'categories'] }
);
