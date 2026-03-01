import 'highlight.js/styles/vs2015.css';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import { auth } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, ChevronRight, BookOpen, Sparkles, ArrowRight, Tag, Pencil } from 'lucide-react';
import { getPostBySlug, getRelatedPosts } from '@/lib/data/posts';
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
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { common, createLowlight } from 'lowlight';
import r_lang from 'highlight.js/lib/languages/r';
import powershell from 'highlight.js/lib/languages/powershell';
import csharp from 'highlight.js/lib/languages/csharp';
import yaml_lang from 'highlight.js/lib/languages/yaml';
import vbnet from 'highlight.js/lib/languages/vbnet';
import { registerCustomLanguages, LANGUAGE_DISPLAY_NAMES } from '@/lib/highlight-languages';

const lowlight = createLowlight(common);
lowlight.register('r', r_lang);
lowlight.register('powershell', powershell);
lowlight.register('csharp', csharp);
lowlight.register('yaml', yaml_lang);
lowlight.register('vb', vbnet);
registerCustomLanguages(lowlight);

const tiptapExtensions = [
    StarterKit.configure({ codeBlock: false }),
    ImageExtension.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full mx-auto' } }),
    LinkExtension.configure({ openOnClick: false, HTMLAttributes: { class: 'text-brand-600 dark:text-brand-400 underline hover:no-underline' } }),
    CodeBlockLowlight.configure({ lowlight }),
    Youtube.configure({ HTMLAttributes: { class: 'rounded-xl overflow-hidden mx-auto' }, width: 640, height: 360 }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Highlight.configure({ multicolor: false }),
    Underline,
    TextStyle,
    Table.configure({ resizable: false }),
    TableRow,
    TableCell,
    TableHeader,
    TaskList,
    TaskItem.configure({ nested: true }),
];

// Helper: convert lowlight HAST nodes to HTML string
function hastToHtml(nodes: any[]): string {
    return nodes.map((node: any) => {
        if (node.type === 'text') return node.value;
        if (node.type === 'element') {
            const cls = node.properties?.className?.join(' ');
            const tag = node.tagName || 'span';
            const inner = node.children ? hastToHtml(node.children) : '';
            return cls ? `<${tag} class="${cls}">${inner}</${tag}>` : `<${tag}>${inner}</${tag}>`;
        }
        return '';
    }).join('');
}

// Decode HTML entities back to plain text for lowlight processing
function decodeHtmlEntities(html: string): string {
    return html
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/');
}

// Transform <pre><code> (and raw <pre>) into beautiful code blocks with macOS header + copy button
function transformCodeBlocks(html: string): string {
    // Use a robust approach: find all <pre...> blocks and wrap them
    const result: string[] = [];
    let remaining = html;

    while (remaining.length > 0) {
        // Find next <pre tag
        const preStart = remaining.indexOf('<pre');
        if (preStart === -1) {
            result.push(remaining);
            break;
        }

        // Push everything before the <pre>
        result.push(remaining.substring(0, preStart));

        // Find the closing </pre>
        const preEnd = remaining.indexOf('</pre>', preStart);
        if (preEnd === -1) {
            result.push(remaining.substring(preStart));
            break;
        }

        const fullPreBlock = remaining.substring(preStart, preEnd + 6);
        remaining = remaining.substring(preEnd + 6);

        // Extract language from class="language-xxx" in the <code> tag
        let language = 'code';
        const langMatch = fullPreBlock.match(/class="language-(\w+)"/);
        if (langMatch) {
            language = langMatch[1];
        }

        // Extract the code content (inside <code>...</code> or directly in <pre>)
        let codeContent = '';
        const codeTagMatch = fullPreBlock.match(/<code[^>]*>([\s\S]*?)<\/code>/);
        if (codeTagMatch) {
            codeContent = codeTagMatch[1];
        } else {
            // Raw <pre> without <code>
            const preTagEnd = fullPreBlock.indexOf('>');
            codeContent = fullPreBlock.substring(preTagEnd + 1, fullPreBlock.length - 6);
        }

        // Apply syntax highlighting using lowlight
        let highlightedCode = codeContent;
        try {
            // Strip existing hljs spans if any, decode HTML entities for lowlight
            const plainText = decodeHtmlEntities(codeContent.replace(/<[^>]*>/g, ''));
            const langAlias = language === 'vba' ? 'vb' : language;

            let highlighted;
            if (language !== 'code' && lowlight.registered(langAlias)) {
                highlighted = lowlight.highlight(langAlias, plainText);
            } else {
                highlighted = lowlight.highlightAuto(plainText);
            }

            if (highlighted?.children) {
                highlightedCode = hastToHtml(highlighted.children);
            }
        } catch (e) {
            // If highlighting fails, use the original content
            console.error('Lowlight highlighting failed:', e);
        }

        const displayLang = LANGUAGE_DISPLAY_NAMES[language] || language.charAt(0).toUpperCase() + language.slice(1);

        // Build the beautiful code block
        result.push(
            `<div class="code-block-wrapper">` +
            `<div class="code-header">` +
            `<div class="dots"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span><span class="lang-label">${displayLang}</span></div>` +
            `<button data-copy-btn title="Copy code"><span class="copy-icon">📋 Copy</span><span class="check-icon hidden">✅ Copied!</span></button>` +
            `</div>` +
            `<pre><code class="language-${language}">${highlightedCode}</code></pre>` +
            `</div>`
        );
    }

    return result.join('');
}

import { supabaseAdmin } from '@/lib/supabase/server';

type Props = {
    params: Promise<{ slug: string }>;
};

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

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;

    // Fetch post from Supabase
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const session = await auth();
    const isAdminOrEditor = session?.user?.role === 'admin' || session?.user?.role === 'editor';
    let isPremiumUnlocked = !post.is_premium;

    // Bypass cached NextAuth session and query real-time profile status
    if (!isPremiumUnlocked && session?.user?.email && supabaseAdmin) {
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('is_subscribed')
            .eq('email', session.user.email)
            .single();

        isPremiumUnlocked = profile?.is_subscribed || false;
    }

    // Render HTML from Tiptap JSON content
    let htmlContent = '';
    let toc: { id: string, text: string, level: number }[] = [];

    if (post.content) {
        const getCachedContent = unstable_cache(
            async (contentRaw: any) => {
                let parsedHtml = '';
                let parsedToc: { id: string, text: string, level: number }[] = [];
                try {
                    const jsonContent = typeof contentRaw === 'string' ? JSON.parse(contentRaw) : contentRaw;

                    // Extract TOC from JSON
                    const slugify = (text: string) => {
                        return text.toString().toLowerCase()
                            .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
                            .replace(/[èéẹẻẽêềếệểễ]/g, "e")
                            .replace(/[ìíịỉĩ]/g, "i")
                            .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
                            .replace(/[ùúụủũưừứựửữ]/g, "u")
                            .replace(/[ỳýỵỷỹ]/g, "y")
                            .replace(/đ/g, "d")
                            .replace(/\s+/g, '-')
                            .replace(/[^\w\-]+/g, '')
                            .replace(/\-\-+/g, '-')
                            .replace(/^-+/, '')
                            .replace(/-+$/, '');
                    };

                    const getText = (node: any): string => {
                        if (node.type === 'text') return node.text || '';
                        if (node.content) return node.content.map(getText).join('');
                        return '';
                    };

                    if (jsonContent?.content) {
                        jsonContent.content.forEach((node: any) => {
                            if (node.type === 'heading' && node.attrs?.level) {
                                const text = getText(node);
                                if (text.trim()) {
                                    const id = slugify(text) || `heading-${parsedToc.length}`;
                                    parsedToc.push({ id, text, level: node.attrs.level });
                                }
                            }
                        });
                    }

                    let rawHtml = transformCodeBlocks(generateHTML(jsonContent, tiptapExtensions));

                    // Inject IDs to HTML tags for TOC linking
                    let tocIndex = 0;
                    parsedHtml = rawHtml.replace(/<h([1-6])(.*?)>(.*?)<\/h\1>/g, (match, level, attrs, innerHtml) => {
                        if (tocIndex < parsedToc.length) {
                            const id = parsedToc[tocIndex].id;
                            tocIndex++;
                            const cleanAttrs = attrs.replace(/id="[^"]*"/g, '');
                            return `<h${level}${cleanAttrs} id="${id}" class="scroll-mt-24 group relative">${innerHtml} <a href="#${id}" class="opacity-0 group-hover:opacity-100 absolute -left-6 top-1/2 -translate-y-1/2 text-surface-300 hover:text-brand-500 transition-opacity" aria-hidden="true">#</a></h${level}>`;
                        }
                        return match;
                    });
                } catch (e) {
                    console.error('Error parsing post content:', e);
                    parsedHtml = '<p>Error loading content.</p>';
                }
                return { html: parsedHtml, toc: parsedToc };
            },
            [`post-content-${post.id}`], // Tiêu chí Cache dựa trên ID bài viết
            { revalidate: 3600, tags: [`post-${post.id}`] } // Tự làm mới bộ rác sau 1h
        );

        const cached = await getCachedContent(post.content);
        htmlContent = cached.html;
        toc = cached.toc;
    } else {
        htmlContent = '<p className="text-surface-500 italic">Bài viết này chưa có nội dung.</p>';
    }

    // Protect Premium Content — only for subscribed users
    if (!isPremiumUnlocked) {
        htmlContent = `
            <div class="relative mb-16">
                <div class="pointer-events-none select-none blur-sm opacity-60 h-64 overflow-hidden">
                    ${htmlContent}
                </div>
                <div class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-surface-50 dark:from-surface-950 via-surface-50/80 dark:via-surface-950/80 to-transparent p-6 text-center">
                    <div class="p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full mb-4 mt-20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">Nội dung Premium</h3>
                    <p class="text-surface-600 dark:text-surface-400 max-w-md mb-8">Bài viết này dành cho thành viên Premium. Đăng ký gói Premium để truy cập toàn bộ nội dung chất lượng cao.</p>
                    ${session?.user
                ? `<a href="/pricing" class="inline-flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-600 !text-white !no-underline font-medium rounded-xl transition-colors shadow-lg">Nâng cấp Premium</a>`
                : `<a href="/login?callbackUrl=/blog/${post.slug}" class="inline-flex items-center justify-center px-6 py-3 bg-brand-600 hover:bg-brand-700 !text-white !no-underline font-medium rounded-xl transition-colors shadow-lg">Đăng nhập để tiếp tục</a>`
            }
                </div>
            </div>
        `;
    }

    // Manually format date to avoid hydration mismatches between Server and Client
    const d = new Date(post.published_at || post.created_at);
    const formattedDate = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

    // Fetch post tags
    let postTags: { id: string; name: string; slug: string }[] = [];
    if (supabaseAdmin) {
        const { data: ptData } = await supabaseAdmin
            .from('post_tags')
            .select('tag_id, tags(id, name, slug)')
            .eq('post_id', post.id);
        if (ptData) {
            postTags = ptData.map((pt: any) => pt.tags).filter(Boolean);
        }
    }
    const tagIds = postTags.map(t => t.id);

    // Get related posts (tags priority > category fallback)
    const relatedPosts = post.category_id
        ? await getRelatedPosts(post.category_id, post.id, 2, tagIds)
        : [];

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

    return (
        <article className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-16">
            {/* JSON-LD for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ReadingProgress />
            <CodeBlockClient />
            <ViewTracker slug={post.slug} />
            {/* Hero Section */}
            <div className="relative w-full h-[50vh] min-h-[400px] max-h-[600px] mt-16 md:mt-20">
                <Image
                    src={post.cover_image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop'}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/60 to-transparent" />

                {/* Header Content */}
                <div className="absolute inset-0 flex flex-col justify-end">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
                        {/* Breadcrumbs */}
                        <nav className="flex items-center gap-2 text-sm text-surface-300 mb-6">
                            <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
                            <ChevronRight className="h-4 w-4" />
                            <Link href="/blog" className="hover:text-white transition-colors">Bài viết</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-white truncate max-w-[200px] md:max-w-none">{post.title}</span>
                        </nav>

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
                            <Link
                                href={`/admin/posts/${post.id}/edit`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/25 text-xs font-medium mb-4 hover:bg-white/25 transition-colors backdrop-blur-sm"
                            >
                                <Pencil className="h-3 w-3" />
                                Sửa bài viết
                            </Link>
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

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Sidebar - Social Share & Navigation */}
                    <div className="hidden lg:block lg:col-span-2">
                        <div className="sticky top-24 space-y-8">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-sm font-medium"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Quay lại
                            </Link>

                            <div>
                                <BookmarkButton postId={post.id} variant="button" className="w-full justify-center mb-8" />

                                <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 uppercase tracking-wider mb-4">
                                    Chia sẻ
                                </h3>
                                <ShareButtons title={post.title} orientation="vertical" />
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <div className="col-span-1 lg:col-span-7">
                        {/* Mobile Share & Bookmark (Hidden on Desktop) */}
                        <div className="lg:hidden pb-6 border-b border-surface-200 dark:border-surface-800 mb-8 space-y-6">
                            <BookmarkButton postId={post.id} variant="button" className="w-full justify-center" />
                            <ShareButtons title={post.title} orientation="horizontal" />
                        </div>

                        <CopyProtection>
                            {post.excerpt && (
                                <p className="text-xl text-surface-600 dark:text-surface-400 font-medium leading-relaxed mb-8 italic border-l-4 border-brand-500 pl-6">
                                    &quot;{post.excerpt}&quot;
                                </p>
                            )}

                            <div
                                className="prose prose-lg dark:prose-invert prose-brand max-w-none prose-img:rounded-xl prose-pre:bg-surface-900 prose-pre:text-surface-100"
                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                            />
                        </CopyProtection>

                        {/* Tag List */}
                        {postTags.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-surface-200 dark:border-surface-800 flex flex-wrap gap-2">
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
                                <div className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800 shadow-sm">
                                    <h3 className="font-bold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
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
            <div className="bg-surface-50 dark:bg-surface-950 px-4 sm:px-6 lg:px-8 mt-16 pt-16 pb-16 border-t border-surface-200 dark:border-surface-800">
                <div className="max-w-7xl mx-auto">
                    <Newsletter />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Related Posts Section */}
                <div className="mt-20 pt-16 border-t border-surface-200 dark:border-surface-800">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Bài viết liên quan</h2>
                            <p className="text-surface-500 mt-1">Khám phá thêm các bài viết cùng chủ đề</p>
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
