import 'highlight.js/styles/vs2015.css';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, ChevronRight, BookOpen, Sparkles, ArrowRight, Tag } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Post } from '@/types';
import { SITE_CONFIG } from '@/lib/constants';
import { PostCard } from '@/components/blog/PostCard';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { BookmarkButton } from '@/components/blog/BookmarkButton';
import { Newsletter } from '@/components/blog/Newsletter';
import CopyProtection from '@/components/blog/CopyProtection';
import { CommentSection } from '@/components/blog/CommentSection';
import { CodeBlockClient } from '@/components/blog/CodeBlockClient';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { ViewTracker } from '@/components/blog/ViewTracker';
import { DemoDownloadButton } from '@/components/blog/DemoDownloadButton';
import { ArticleContent } from '@/components/blog/ArticleContent';
import { NutQuanTri } from '@/components/blog/NutQuanTri';
import { MoKhoaPremium } from '@/components/blog/MoKhoaPremium';

/**
 * Thân trang bài viết, dùng chung cho hai route:
 *   - `/blog/[slug]`            — TĨNH, phục vụ mọi khách
 *   - `/blog/[slug]/xem-truoc`  — ĐỘNG, admin/editor xem bản nháp
 *
 * Vì sao phải tách: trước đây một route lo cả hai việc, và nó gọi `auth()` để
 * biết người xem là ai. Chỉ cần đọc cookie là Next ép route render ĐỘNG mọi
 * request, nên trang bài viết trả `Cache-Control: private, no-cache, no-store`
 * — không tầng nào cache được, kể cả trình duyệt (bấm Back là tải lại).
 * Đo ngày 08/09/2026: TTFB 0,21-0,96s (có nhịp 2,08s) so với 0,15s của trang tĩnh.
 *
 * Component này CỐ Ý không nhận `session` và không gọi `auth()`. Thứ gì phụ
 * thuộc người xem thì để Client Component tự lo:
 *   - nút "Sửa bài viết" / ghim  -> `NutQuanTri` (useSession, tự ẩn)
 *   - phần thân bài Premium      -> `MoKhoaPremium` (gọi API có kiểm quyền)
 * Nhờ vậy HTML tĩnh giống nhau với mọi người và cache được an toàn.
 */
type Props = {
    post: Post;
    htmlContent: string;
    toc: { id: string; text: string; level: number }[];
    /* Chi khai 3 truong component nay dung. `getPostTags` khong tra
       `created_at` nen khai `Tag[]` la sai kieu; noi long thanh `any` thi mat
       luon cho chan. */
    postTags: { id: string; name: string; slug: string }[];
    relatedPosts: Post[];
    /** Bài Premium hiện trọn nội dung (route xem-truoc đã kiểm quyền ở server). */
    laXemTruoc?: boolean;
    /**
     * Banner "đang xem bản nháp", do route xem-truoc TRUYỀN VÀO dưới dạng node.
     *
     * Cố ý không `import PreviewBanner` ở đây: file này dùng chung cho trang
     * công khai, nên import tĩnh là component đó bị gói vào bundle của mọi
     * trang bài viết dù không bao giờ chạy. Đo được 08/09/2026: ~0,7 KB gz.
     */
    banner?: ReactNode;
};

export function BaiViet({ post, htmlContent, toc, postTags, relatedPosts, laXemTruoc = false, banner }: Props) {
    // Manually format date to avoid hydration mismatches between Server and Client
    const d = new Date(post.published_at || post.created_at);
    const formattedDate = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

    // JSON-LD Structured Data for Google Rich Results
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.meta_description || post.excerpt || '',
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
        keywords: (post.keywords || []).join(', ') || post.category?.name || '',
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
            {banner}

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

                            <NutQuanTri postId={post.id} daGhim={!!post.is_pinned} />

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
                            {post.is_premium && !laXemTruoc ? (
                                /* Bài Premium: server chỉ đưa vài block đọc thử vào HTML
                                   tĩnh; phần còn lại do client xin qua API có kiểm quyền.
                                   Route xem-truoc là ngoại lệ — nó đã kiểm admin ở server
                                   nên dựng sẵn trọn bài. */
                                <MoKhoaPremium slug={post.slug} htmlXemThu={htmlContent} />
                            ) : (
                                <ArticleContent
                                    htmlContent={htmlContent}
                                    className="prose max-w-[55ch]"
                                />
                            )}



                            {/* Demo File Download Button — self-checks availability client-side */}
                            <DemoDownloadButton
                                demoUrl={post.demo_url || undefined}
                                demoLabel={post.demo_label || undefined}
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
