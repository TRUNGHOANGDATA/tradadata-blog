// ============================================
// Database Types
// ============================================

export type UserRole = 'admin' | 'editor' | 'reader';
export type PostStatus = 'draft' | 'published' | 'archived';

export interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    sort_order?: number; // Optional, not in DB
    created_at: string;
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: Record<string, unknown> | null; // Tiptap JSON
    cover_image: string | null;
    author_id: string;
    category_id: string | null;
    keywords?: string[] | null;
    status: PostStatus;
    is_premium: boolean; // Renamed from is_gated
    reading_time?: number; // Optional, computed on frontend
    view_count: number;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    // Relations (populated via join)
    author?: Profile;
    category?: Category;
    categories?: Category[];  // All categories from junction table
    tags?: Tag[];
    is_pinned?: boolean;
    pinned_at?: string | null;
    demo_url?: string | null;
    demo_label?: string | null;
}

export interface PostTag {
    post_id: string;
    tag_id: string;
}

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
    // Relations
    user?: Profile;
}

// ============================================
// UI / Component Types
// ============================================

export interface NavItem {
    label: string;
    href: string;
    icon?: string;
}

export interface PostCardProps {
    post: Post;
    variant?: 'default' | 'featured' | 'compact';
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath: string;
}
