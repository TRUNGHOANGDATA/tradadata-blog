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
    // Co that trong DB va duoc dung o generateMetadata cua /blog/[slug].
    // Truoc day thieu khai o day nen code phai viet `post.meta_description`.
    meta_description?: string | null;
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

/**
 * San pham nhung kem trong truy van `orders` (`select('*, products(...)')`).
 *
 * Supabase khong sinh kieu cho quan he nhung, nen truoc day 12 cho phai viet
 * `(order.products as SanPhamNhung)?.name`. Khai mot lan o day de vua bo `any` vua ghi
 * lai duoc thuc te la cac cot nay CO THE thieu (tuy `select` goi gi).
 */
export type SanPhamNhung = {
    name?: string | null;
    product_type?: string | null;
    duration_days?: number | null;
    price?: number | null;
    description?: string | null;
} | null;

/**
 * Mot node trong cay Tiptap JSON (`posts.content`).
 * Chi khai nhung truong code thuc su doc, du de bo `any` khi di cay.
 */
export type NodeTiptap = {
    type?: string;
    text?: string;
    content?: NodeTiptap[];
    attrs?: Record<string, unknown>;
    marks?: { type?: string;[k: string]: unknown }[];
    [k: string]: unknown;
};

/**
 * Hang bai viet THO tu Supabase, truoc khi qua `formatPost`.
 *
 * Khac `Post` o cho: quan he nhung (`author`, `category`, `post_categories`,
 * `tags`) chua duoc chuan hoa, va co the la object hoac mang tuy `select` goi gi.
 * Truoc day khai `any` nen khong ai biet dieu do.
 *
 * Index signature de trong de con doc duoc cot moi ma chua kip khai — nhung
 * `id` thi bat buoc, va do la thu `any` khong dam bao noi.
 */
export type HangBaiVietTho = Partial<Omit<Post, 'author' | 'category' | 'categories' | 'tags'>> & {
    id: string;
    // Quan he nhung: co the la object hoac mang tuy `select` goi gi, nen de `unknown`
    // va buoc noi dung phai chuan hoa truoc khi dung.
    author?: unknown;
    category?: unknown;
    categories?: unknown;
    tags?: unknown;
    post_categories?: unknown;
};
