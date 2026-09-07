import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase/server';
import { SITE_CONFIG } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE_CONFIG.url;
    const now = new Date();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
        { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/categories`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/courses`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/phan-mem-ban-hang`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${baseUrl}/search`, lastModified: now, changeFrequency: 'weekly', priority: 0.4 },
        { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
        { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    ];

    // Dynamic: published blog posts
    let postPages: MetadataRoute.Sitemap = [];
    if (supabaseAdmin) {
        const { data: posts } = await supabaseAdmin
            .from('posts')
            .select('slug, updated_at, published_at')
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (posts) {
            postPages = posts.map((post) => ({
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: new Date(post.updated_at || post.published_at),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }));
        }
    }

    // Dynamic: categories
    let categoryPages: MetadataRoute.Sitemap = [];
    if (supabaseAdmin) {
        const { data: categories } = await supabaseAdmin
            .from('categories')
            .select('slug, created_at');

        if (categories) {
            categoryPages = categories.map((cat) => ({
                url: `${baseUrl}/category/${cat.slug}`,
                lastModified: new Date(cat.created_at),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }));
        }
    }

    // Dynamic: tags
    let tagPages: MetadataRoute.Sitemap = [];
    if (supabaseAdmin) {
        const { data: tags } = await supabaseAdmin
            .from('tags')
            .select('slug, created_at');

        if (tags) {
            tagPages = tags.map((tag) => ({
                url: `${baseUrl}/tag/${tag.slug}`,
                lastModified: new Date(tag.created_at),
                changeFrequency: 'weekly' as const,
                priority: 0.5,
            }));
        }
    }

    return [...staticPages, ...postPages, ...categoryPages, ...tagPages];
}
