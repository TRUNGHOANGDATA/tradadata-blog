import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

// GET /api/admin/posts — List all posts (including drafts) for admin
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { data, error } = await supabaseAdmin
            .from('posts')
            .select('*, author:profiles(full_name, email), category:categories(name, slug, icon)')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ posts: data || [] });
    } catch (error: any) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Helper: generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Helper: extract plain text from TipTap JSON content
function extractTextFromContent(content: any): string {
    if (!content) return '';
    if (typeof content === 'string') {
        try { content = JSON.parse(content); } catch { return content; }
    }
    let text = '';
    function walk(node: any) {
        if (node.text) text += node.text + ' ';
        if (node.content) node.content.forEach(walk);
    }
    walk(content);
    return text.trim();
}

// Helper: calculate reading time (200 words/min)
function calculateReadingTime(text: string): number {
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

// POST /api/admin/posts — Create a new post
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { title, excerpt, content, cover_image, category_id, status, is_premium, tags, custom_slug, meta_description, keywords } = body;

        if (!title || title.trim().length === 0) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        // Generate unique slug (use custom_slug if provided)
        let slug = custom_slug?.trim() || generateSlug(title);
        const { data: existingSlug } = await supabaseAdmin
            .from('posts')
            .select('slug')
            .eq('slug', slug)
            .single();

        if (existingSlug) {
            slug = `${slug}-${Date.now().toString(36)}`;
        }

        // Resolve author profileId from DB
        let authorId: string | undefined = session.user.profileId;
        if (authorId) {
            const { data: check } = await supabaseAdmin.from('profiles').select('id').eq('id', authorId).single();
            if (!check) authorId = undefined;
        }
        if (!authorId && session.user.email) {
            const { data: profile } = await supabaseAdmin.from('profiles').select('id').eq('email', session.user.email).single();
            if (profile) authorId = profile.id;
        }

        // Create post
        const postData: any = {
            title: title.trim(),
            slug,
            excerpt: excerpt?.trim() || null,
            content: content ? (typeof content === 'string' ? content : JSON.stringify(content)) : null,
            cover_image: cover_image || null,
            category_id: category_id || null,
            status: status || 'draft',
            is_premium: is_premium || false,
            author_id: authorId,
            published_at: status === 'published' ? new Date().toISOString() : null,
            meta_description: meta_description?.trim() || null,
            keywords: keywords && keywords.length > 0 ? keywords : null,
        };

        // Auto-calculate reading time
        try {
            if (content) {
                postData.reading_time = calculateReadingTime(extractTextFromContent(content));
            }
        } catch {
            // Skip if content format is unexpected
        }

        const { data: post, error } = await supabaseAdmin
            .from('posts')
            .insert(postData)
            .select()
            .single();

        if (error) throw error;

        // Handle tags if provided
        if (tags && tags.length > 0 && post) {
            const tagInserts = tags.map((tagId: string) => ({
                post_id: post.id,
                tag_id: tagId,
            }));

            await supabaseAdmin.from('post_tags').insert(tagInserts);
        }

        return NextResponse.json({ post }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating post:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
