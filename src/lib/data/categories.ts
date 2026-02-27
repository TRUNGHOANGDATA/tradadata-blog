import { supabaseAdmin } from '@/lib/supabase/server';
import type { Category } from '@/types';

export async function getCategories(): Promise<Category[]> {
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

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
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
