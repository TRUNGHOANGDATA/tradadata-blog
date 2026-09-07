import 'highlight.js/styles/vs2015.css';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import { auth } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, ChevronRight, BookOpen, Sparkles, ArrowRight, Tag, Pencil } from 'lucide-react';
import { getPostBySlug, getPostBySlugForPreview, getRelatedPosts, getAllPublishedSlugs, getPostTags } from '@/lib/data/posts';
import { SITE_CONFIG } from '@/lib/constants';
import { PostCard } from '@/components/blog/PostCard';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { BookmarkButton } from '@/components/blog/BookmarkButton';
import { Newsletter } from '@/components/blog/Newsletter';
import CopyProtection from '@/components/blog/CopyProtection';
import { CommentSection } from '@/components/blog/CommentSection';
import { CodeBlockClient } from '@/components/blog/CodeBlockClient';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { PinButton } from '@/components/blog/PinButton';
import { ViewTracker } from '@/components/blog/ViewTracker';
import { PreviewBanner } from '@/components/blog/PreviewBanner';

import { DemoDownloadButton } from '@/components/blog/DemoDownloadButton';
import { ArticleContent } from '@/components/blog/ArticleContent';
import { renderPostContent, truncateContent } from '@/lib/highlight-utils';

import { supabaseAdmin } from '@/lib/supabase/server';

// Số block đầu bài cho người chưa mở khoá đọc thử
const PREMIUM_PREVIEW_BLOCKS = 3;

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// ==============================
// Static Generation — Pre-build all blog pages at build time
// ==============================
export async function generateStaticParams() {
    const slugs = await getAllPublishedSlugs();
    return slugs.map((slug) => ({ slug }));
}

// ==============================
// Dynamic SEO Metadata
// ==============================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return { title: 'Không tìm thấy bài viết' };
    }

    const description = (post as any).meta_description || post.excerpt || `Đọc bài viết "${post.title}" trên ${SITE_CONFIG.name}`;
    const keywords = (post as any).keywords || (post.category ? [post.category.name] : []);
    const ogImage = post.cover_image || SITE_CONFIG.ogImage;

    return {
        title: post.title,
        description,
        keywords,
        openGraph: {
            title: post.title,
            description,
            url: `${SITE_CONFIG.url}/blog/${post.slug}`,
            siteName: SITE_CONFIG.name,
            images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
            type: 'article',
            publishedTime: post.published_at || undefined,
            authors: post.author?.full_name ? [post.author.full_name] : [SITE_CONFIG.author],
            locale: 'vi_VN',
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description,
            images: [ogImage],
        },
        alternates: {
            canonical: `${SITE_CONFIG.url}/blog/${post.slug}`,
        },
    };
}

export default async function BlogPostPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const sp = await searchParams;
    const isPreview = sp?.preview === 'true';

    // Fetch post — use preview function for drafts (admin only)
    let post = await getPostBySlug(slug);

    if (!post && isPreview) {
        // Try loading draft/unpublished post for preview
        post = await getPostBySlugForPreview(slug);
    }

    if (!post) {
        notFound();
    }

    const session = await auth();
    const isAdminOrEditor = session?.user?.role === 'admin' || session?.user?.role === 'editor';

    // Only admins/editors can preview unpublished posts
    if (isPreview && post.status !== 'published' && !isAdminOrEditor) {
        notFound();
    }

    // Fetch tags, premium status, and cached content IN PARALLEL
    const [postTags, isPremiumProfile] = await Promise.all([
        // Tag cua bai: da chuyen sang tang data co cache (tag 'posts')
        getPostTags(post.id),
        // Premium check
        (async () => {
            if (post.is_premium && session?.user?.email && supabaseAdmin) {
                const { data: profile } = await supabaseAdmin
                    .from('profiles')
                    .select('is_subscribed')
                    .eq('email', session.user.email)
                    .single();
                return profile?.is_subscribed || false;
            }
            return false;
        })(),
    ]);

    let isPremiumUnlocked = !post.is_premium || isPremiumProfile;

    // Render HTML from Tiptap JSON content (CACHED)
    let htmlContent = '';
    let toc: { id: string, text: string, level: number }[] = [];

    // Bài Premium chưa mở khoá: CẮT nội dung trước khi render, không chỉ làm mờ bằng CSS.
    // Chỉ phần preview mới được đưa vào HTML trả về client.
    const contentToRender = isPremiumUnlocked
        ? post.content
        : truncateContent(post.content, PREMIUM_PREVIEW_BLOCKS);

    // Get related posts IN PARALLEL with content parsing
    const tagIds = postTags.map((t: any) => t.id);
    const [cachedContent, relatedPosts] = await Promise.all([
        // Content parsing (cached via renderPostContent)
        // Cache key tách riêng 2 biến thể, tránh phục vụ nhầm bản đầy đủ cho người chưa mở khoá
        contentToRender ? (async () => {
            const getCachedContent = unstable_cache(
                async (contentRaw: any) => renderPostContent(contentRaw),
                [isPremiumUnlocked ? `post-content-${post.id}` : `post-content-preview-${post.id}`],
                { revalidate: 3600, tags: [`post-${post.id}`] }
            );
            return getCachedContent(contentToRender);
        })() : Promise.resolve({ html: '<p class="text-fg-subtle italic">Bài viết này chưa có nội dung.</p>', toc: [] as { id: string, text: string, level: number }[] }),
        // Related posts (cached at data layer)
        post.category_id ? getRelatedPosts(post.category_id, post.id, 3, tagIds) : Promise.resolve([]),
    ]);

    htmlContent = cachedContent.html;
    toc = cachedContent.toc;

    // Bài Premium chưa mở khoá: htmlContent lúc này CHỈ chứa phần preview đã cắt ở trên.
    // Phần còn lại không tồn tại trong HTML, nên không thể lấy bằng View Source / tắt CSS.
    if (!isPremiumUnlocked) {
        // TOC dựng từ preview nên cũng không lộ cấu trúc phần trả phí
        toc = [];
        htmlContent = `
            <div class="mb-16">
                <div class="relative">
                    ${htmlContent}
                    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface-50 dark:from-surface-950 to-transparent"></div>
                </div>
                <div class="mt-2 flex flex-col items-center justify-center rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-900/10 p-8 text-center">
                    <div class="p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <h3 class="text-2xl font-bold text-fg mb-2">Phần còn lại dành cho thành viên Premium</h3>
                    <p class="text-surface-600 dark:text-surface-400 max-w-md mb-8">Đăng ký gói Premium để đọc trọn bài viết và toàn bộ nội dung chất lượng cao khác.</p>
                    ${session?.user
                ? `<a href="/courses" class="inline-flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-600 !text-white !no-underline font-medium rounded-xl transition-colors shadow-lg">Nâng cấp Premium</a>`
                : `<a href="/login?callbackUrl=/blog/${post.slug}" class="inline-flex items-center justify-center px-6 py-3 bg-brand-600 hover:bg-brand-700 !text-white !no-underline font-medium rounded-xl transition-colors shadow-lg">Đăng nhập để tiếp tục</a>`
            }
                </div>
            </div>
        `;
    }

    // Manually format date to avoid hydration mismatches between Server and Client
    const d = new Date(post.published_at || post.created_at);
    const formattedDate = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

    // JSON-LD Structured Data for Google Rich Results
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: (post as any).meta_description || post.excerpt || '',
        image: post.cover_image || `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
        datePublished: post.published_at || post.created_at,
        dateModified: post.updated_at,
        author: {
            '@type': 'Person',
            name: post.author?.full_name || SITE_CONFIG.author,
        },
        publisher: {
            '@type': 'Organization',
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_CONFIG.url}/blog/${post.slug}`,
        },
        wordCount: post.reading_time ? post.reading_time * 200 : undefined,
        keywords: ((post as any).keywords || []).join(', ') || post.category?.name || '',
    };

    // BreadcrumbList JSON-LD for Google Rich Results
    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_CONFIG.url },
            { '@type': 'ListItem', position: 2, name: 'Bài viết', item: `${SITE_CONFIG.url}/blog` },
            ...(post.category ? [{ '@type': 'ListItem', position: 3, name: post.category.name, item: `${SITE_CONFIG.url}/category/${post.category.slug}` }] : []),
            { '@type': 'ListItem', position: post.category ? 4 : 3, name: post.title, item: `${SITE_CONFIG.url}/blog/${post.slug}` },
        ],
    };

    return (
        <article className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-16">
            {/* Preconnect to image CDNs for faster loading */}
            <link rel="preconnect" href="https://lh3.googleusercontent.com" />
            <link rel="preconnect" href="https://images.unsplash.com" />
            {/* JSON-LD for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* BreadcrumbList JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <ReadingProgress />
            <CodeBlockClient />
            <ViewTracker slug={post.slug} />

            {/* Breadcrumbs — above cover image */}
            <div className="bg-surface-50 dark:bg-surface-950 border-b border-line mt-16 md:mt-20">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
                    <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Trang chủ</Link>
                    <ChevronRight className="h-4 w-4 text-fg-faint" />
                    <Link href="/blog" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Bài viết</Link>
                    {post.category && (
                        <>
                            <ChevronRight className="h-4 w-4 text-fg-faint" />
                            <Link href={`/category/${post.category.slug}`} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                                {post.category.icon} {post.category.name}
                            </Link>
                        </>
                    )}
                    <ChevronRight className="h-4 w-4 text-fg-faint" />
                    <span className="text-surface-900 dark:text-surface-200 font-medium line-clamp-1">{post.title}</span>
                </nav>
            </div>

            {/* Preview Banner */}
            {isPreview && isAdminOrEditor && (
                <PreviewBanner postId={post.id} postStatus={post.status} />
            )}

            {/* Hero Section — contained like slider */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                <div className="relative w-full h-[380px] md:h-[420px] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                        src={post.cover_image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop'}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                        // BAT BUOC co `sizes` khi dung `fill`: thieu no thi Next coi
                        // anh rong 100vw va trinh duyet xin ban 3840px. Khung that
                        // chi rong toi da ~1216px (max-w-7xl tru padding).
                        sizes="(max-width: 1280px) 100vw, 1216px"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/60 to-transparent" />

                    {/* Header Content */}
                    <div className="absolute inset-0 flex flex-col justify-end">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">

                            {/* Category Badge */}
                            {post.category && (
                                <Link
                                    href={`/category/${post.category.slug}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-600/20 text-brand-300 border border-brand-500/30 text-sm font-medium mb-4 hover:bg-brand-600/30 transition-colors backdrop-blur-sm"
                                >
                                    {post.category.icon && <span>{post.category.icon}</span>}
                                    {post.category.name}
                                </Link>
                            )}

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                                {post.title}
                            </h1>

                            {isAdminOrEditor && (
                                <div className="flex items-center gap-2 mb-4">
                                    <Link
                                        href={`/admin/posts/${post.id}/edit`}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/25 text-xs font-medium hover:bg-white/25 transition-colors backdrop-blur-sm"
                                    >
                                        <Pencil className="h-3 w-3" />
                                        Sửa bài viết
                                    </Link>
                                    <PinButton postId={post.id} initialPinned={!!post.is_pinned} />
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-6 text-sm text-surface-300">
                                {/* Author */}
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-brand-600 border-2 border-surface-800 flex items-center justify-center text-white font-bold">
                                        {post.author?.full_name?.charAt(0) || 'E'}
                                    </div>
                                    <span className="font-medium text-surface-200">{post.author?.full_name || 'Trà Đá Data'}</span>
                                </div>

                                {/* Meta info */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formattedDate}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        <span>{post.reading_time} phút đọc</span>
                                    </div>

                                </div>
                            </div>

                            {/* Tags */}
                            {postTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {postTags.map(tag => (
                                        <Link
                                            key={tag.id}
                                            href={`/tag/${tag.slug}`}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-surface-300 border border-white/20 text-xs font-medium hover:bg-white/20 hover:text-white transition-colors backdrop-blur-sm"
                                        >
                                            <Tag className="h-3 w-3" />
                                            {tag.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Sidebar - Social Share & Navigation */}
                    <div className="hidden lg:block lg:col-span-2">
                        <div className="sticky top-24 space-y-8">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-fg-subtle hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-sm font-medium"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Quay lại
                            </Link>

                            <div>
                                <BookmarkButton postId={post.id} variant="button" className="w-full justify-center mb-8" />

                                <h3 className="text-sm font-semibold text-fg uppercase tracking-wider mb-4">
                                    Chia sẻ
                                </h3>
                                <ShareButtons title={post.title} orientation="vertical" />
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <div className="col-span-1 lg:col-span-7">
                        {/* Mobile Share & Bookmark (Hidden on Desktop) */}
                        <div className="lg:hidden pb-6 border-b border-line mb-8 space-y-6">
                            <BookmarkButton postId={post.id} variant="button" className="w-full justify-center" />
                            <ShareButtons title={post.title} orientation="horizontal" />
                        </div>

                        <CopyProtection>
                            {post.excerpt && (
                                <p className="text-xl text-surface-600 dark:text-surface-400 font-medium leading-relaxed mb-8 italic border-l-4 border-brand-500 pl-6">
                                    &quot;{post.excerpt}&quot;
                                </p>
                            )}

                            {/* Trước đây còn prose-lg / dark:prose-invert / prose-brand /
                                prose-img:* / prose-pre:* — đã bỏ vì repo KHÔNG cài
                                @tailwindcss/typography nên chúng không sinh ra CSS nào,
                                chỉ gây tưởng là đang có tác dụng. Toàn bộ style bài viết
                                nằm trong globals.css.

                                max-w-[55ch] = 590px = ~70 ký tự mỗi dòng, đo bằng canvas với
                                đúng font Inter 17px: ký tự trung bình của tiếng Việt rộng
                                8.43px, còn 1ch = chiều rộng chữ "0" = 10.72px. Đừng đổi sang
                                65-75ch cho "đúng sách" — 68ch ra tận 86 ký tự, rộng hơn cả
                                trước khi sửa. */}
                            <ArticleContent
                                htmlContent={htmlContent}
                                className="prose max-w-[55ch]"
                            />



                            {/* Demo File Download Button — self-checks availability client-side */}
                            <DemoDownloadButton
                                demoUrl={(post as any).demo_url || undefined}
                                demoLabel={(post as any).demo_label || undefined}
                                postSlug={post.slug}
                            />
                        </CopyProtection>

                        {/* Tag List */}
                        {postTags.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-line flex flex-wrap gap-2">
                                {/* Category as a primary tag */}
                                {post.category && (
                                    <Link
                                        href={`/category/${post.category.slug}`}
                                        className="px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 rounded-lg text-sm font-medium hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
                                    >
                                        #{post.category.name.toLowerCase().replace(/\s+/g, '')}
                                    </Link>
                                )}
                                {/* Tags (exclude duplicates of category name) */}
                                {postTags
                                    .filter(tag => !post.category || tag.name.toLowerCase() !== post.category.name.toLowerCase())
                                    .map(tag => (
                                        <Link
                                            key={tag.id}
                                            href={`/tag/${tag.slug}`}
                                            className="px-3 py-1.5 bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 rounded-lg text-sm font-medium hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                                        >
                                            #{tag.name}
                                        </Link>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar - TOC & CTA */}
                    <div className="col-span-1 lg:col-span-3">
                        <div className="sticky top-24 space-y-8">
                            {/* Table of Contents */}
                            {toc.length > 0 && (
                                <div className="bg-card rounded-2xl p-6 border border-line shadow-sm">
                                    <h3 className="font-bold text-fg mb-4 flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                                        Mục lục
                                    </h3>
                                    <ul className="space-y-3 text-sm">
                                        {toc.map((item, index) => {
                                            const minLvl = Math.min(...toc.map(t => t.level));
                                            const paddingLeft = (item.level - minLvl) * 1.25;
                                            return (
                                                <li key={`${item.id}-${index}`} style={{ paddingLeft: `${paddingLeft}rem` }}>
                                                    <a href={`#${item.id}`} className="flex items-start text-surface-600 dark:text-surface-400 font-medium hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                                                        <span className="flex-1 leading-snug">{item.text}</span>
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}

                            {/* Course Promo CTA */}
                            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                                <div className="absolute -right-6 -top-6 text-white/10">
                                    <Sparkles className="h-32 w-32" />
                                </div>
                                <div className="relative z-10">
                                    <div className="inline-flex px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-bold tracking-wider uppercase mb-4 text-brand-100">
                                        Khoá học chuyên sâu
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">Muốn làm chủ {post.category?.name}?</h3>
                                    <p className="text-brand-100 text-sm mb-6 leading-relaxed">
                                        Tham gia khóa học E-Learning của Trà Đá Data để được hướng dẫn chi tiết từ A-Z với Case Study thực tế.
                                    </p>
                                    <Link
                                        href="/courses"
                                        className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-colors"
                                    >
                                        Tìm hiểu ngay
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Comment Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <CommentSection postId={post.id} />
            </div>

            {/* Newsletter Subscription (Full width) */}
            <div className="bg-surface-50 dark:bg-surface-950 px-4 sm:px-6 lg:px-8 mt-16 pt-16 pb-16 border-t border-line">
                <div className="max-w-7xl mx-auto">
                    <Newsletter />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Related Posts Section */}
                <div className="mt-20 pt-16 border-t border-line">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-fg">Bài viết liên quan</h2>
                            <p className="text-fg-subtle mt-1">Khám phá thêm các bài viết cùng chủ đề</p>
                        </div>
                        <Link href="/blog" className="hidden md:inline-flex items-center font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                            Xem tất cả <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedPosts.map(p => (
                            <PostCard key={p.id} post={p} />
                        ))}
                    </div>
                </div>
            </div>
        </article >
    );
}
