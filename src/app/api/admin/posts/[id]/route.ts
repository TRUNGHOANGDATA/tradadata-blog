import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

type RouteParams = { params: Promise<{ id: string }> };

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

// GET /api/admin/posts/[id] — Get a single post for editing
export async function GET(_request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { data: post, error } = await supabaseAdmin
            .from('posts')
            .select('*, author:profiles(full_name, email), category:categories!category_id(id, name, slug, icon)')
            .eq('id', id)
            .single();

        if (error || !post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Get tags for this post
        const { data: postTags } = await supabaseAdmin
            .from('post_tags')
            .select('tag_id, tags(id, name, slug)')
            .eq('post_id', id);

        // Get categories for this post from junction table
        const { data: postCategories } = await supabaseAdmin
            .from('post_categories')
            .select('category_id')
            .eq('post_id', id);

        return NextResponse.json({
            post: {
                ...post,
                tags: postTags?.map((pt: any) => pt.tags) || [],
                post_categories: postCategories || []
            }
        });
    } catch (error: any) {
        console.error('Error fetching post:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT /api/admin/posts/[id] — Update a post
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { title, excerpt, content, cover_image, category_id, category_ids, status, is_premium, is_featured, tags, custom_slug, meta_description, keywords } = body;

        // Get existing post to check status change
        const { data: existing } = await supabaseAdmin
            .from('posts')
            .select('status, published_at, slug')
            .eq('id', id)
            .single();

        const updateData: any = {
            updated_at: new Date().toISOString(),
        };

        if (title !== undefined) updateData.title = title.trim();
        if (excerpt !== undefined) updateData.excerpt = excerpt?.trim() || null;
        if (content !== undefined) updateData.content = content ? (typeof content === 'string' ? content : JSON.stringify(content)) : null;
        if (cover_image !== undefined) updateData.cover_image = cover_image;
        if (category_id !== undefined) updateData.category_id = category_id || null;
        if (status !== undefined) updateData.status = status;
        if (is_premium !== undefined) updateData.is_premium = is_premium;
        if (is_featured !== undefined) updateData.is_featured = is_featured;

        // SEO fields
        if (custom_slug) updateData.slug = custom_slug.trim();
        if (meta_description !== undefined) updateData.meta_description = meta_description?.trim() || null;
        if (keywords !== undefined) updateData.keywords = keywords && keywords.length > 0 ? keywords : null;

        // Auto-calculate reading time from content
        if (content !== undefined && content) {
            try {
                const text = extractTextFromContent(content);
                const words = text.split(/\s+/).filter(Boolean).length;
                updateData.reading_time = Math.max(1, Math.ceil(words / 200));
            } catch {
                // Silently skip if content format is unexpected
            }
        }

        // Set published_at when first publishing
        if (status === 'published' && existing && existing.status !== 'published') {
            updateData.published_at = new Date().toISOString();
        }

        const { data: post, error } = await supabaseAdmin
            .from('posts')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Update tags if provided
        if (tags !== undefined) {
            // Remove existing tags
            await supabaseAdmin.from('post_tags').delete().eq('post_id', id);

            // Insert new tags
            if (tags.length > 0) {
                const tagInserts = tags.map((tagId: string) => ({
                    post_id: id,
                    tag_id: tagId,
                }));
                await supabaseAdmin.from('post_tags').insert(tagInserts);
            }
        }

        // Update post_categories junction table if category_ids provided
        if (category_ids !== undefined) {
            await supabaseAdmin.from('post_categories').delete().eq('post_id', id);

            if (category_ids.length > 0) {
                const catInserts = category_ids.map((catId: string) => ({
                    post_id: id,
                    category_id: catId,
                }));
                await supabaseAdmin.from('post_categories').insert(catInserts);
            }
        }

        return NextResponse.json({ post });
    } catch (error: any) {
        console.error('Error updating post:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/admin/posts/[id] — Delete a post
export async function DELETE(_request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized — admin only' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        // Delete post tags first (foreign key)
        await supabaseAdmin.from('post_tags').delete().eq('post_id', id);

        // Delete post
        const { error } = await supabaseAdmin.from('posts').delete().eq('id', id);
        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting post:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
