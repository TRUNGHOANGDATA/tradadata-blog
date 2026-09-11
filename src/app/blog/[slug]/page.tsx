import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import {
    getPostBySlug,
    getRelatedPosts,
    getAllPublishedSlugs,
    getPostTags,
} from '@/lib/data/posts';
import { SITE_CONFIG } from '@/lib/constants';
import { renderPostContent, truncateContent } from '@/lib/highlight-utils';
import { BaiViet } from './BaiViet';

// Số block đầu bài cho người chưa mở khoá đọc thử
const PREMIUM_PREVIEW_BLOCKS = 3;

type Props = {
    params: Promise<{ slug: string }>;
};

/**
 * Trang bài viết — TĨNH.
 *
 * Trước đây route này gọi `auth()` (để gating Premium) và đọc `searchParams`
 * (để admin xem bản nháp qua `?preview=true`). Cả hai đều ép Next render ĐỘNG
 * mọi request, nên trang trả `Cache-Control: private, no-cache, no-store` —
 * không tầng nào cache được, kể cả trình duyệt: bấm Back cũng tải lại từ đầu.
 * Đo ngày 08/09/2026 trên production, 8 mẫu × 3 bài: TTFB 0,21-0,96s, có nhịp
 * 2,08s; trong khi các trang tĩnh khác chỉ 0,15s.
 *
 * Hai việc cần biết người xem đã được dọn đi:
 *   - xem bản nháp  -> route riêng `/blog/[slug]/xem-truoc` (động, kiểm quyền)
 *   - gating Premium -> HTML tĩnh chỉ chứa phần đọc thử; phần trả phí do
 *     `MoKhoaPremium` xin qua `/api/posts/[slug]/noi-dung-premium`, nơi kiểm
 *     đăng nhập và `is_subscribed`.
 *
 * ⚠️ ĐỪNG thêm `auth()`, `cookies()`, `headers()` hay `searchParams` vào file
 * này — một lần gọi là mất sạch cache của cả 161 bài. Cần dữ liệu theo người
 * xem thì làm ở Client Component hoặc route API.
 */
export const revalidate = 3600;

export async function generateStaticParams() {
    const slugs = await getAllPublishedSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return { title: 'Không tìm thấy bài viết' };
    }

    const description = post.meta_description || post.excerpt || `Đọc bài viết "${post.title}" trên ${SITE_CONFIG.name}`;
    const keywords = post.keywords || (post.category ? [post.category.name] : []);
    const ogImage = post.cover_image || SITE_CONFIG.ogImage;

    return {
        title: post.title,
        description,
        keywords,
        authors: [{ name: post.author?.full_name || SITE_CONFIG.author }],
        alternates: {
            canonical: `${SITE_CONFIG.url}/blog/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description,
            url: `${SITE_CONFIG.url}/blog/${post.slug}`,
            type: 'article',
            publishedTime: post.published_at || post.created_at,
            modifiedTime: post.updated_at,
            authors: [post.author?.full_name || SITE_CONFIG.author],
            images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description,
            images: [ogImage],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;

    const post = await getPostBySlug(slug);
    if (!post) {
        notFound();
    }

    const postTags = await getPostTags(post.id);

    // Bài Premium: CẮT nội dung trước khi render. Bản đầy đủ không bao giờ có
    // mặt trong HTML tĩnh, nên không lấy được bằng View Source hay tắt CSS.
    const laPremium = !!post.is_premium;
    const noiDungDeRender = laPremium
        ? truncateContent(post.content, PREMIUM_PREVIEW_BLOCKS)
        : post.content;

    const tagIds = postTags.map((t) => t.id);
    const [noiDungDaRender, relatedPosts] = await Promise.all([
        noiDungDeRender
            ? (async () => {
                // Hai biến thể dùng cache key KHÁC NHAU. Bản đầy đủ nằm ở
                // `post-content-<id>` (route API dùng đúng key này), bản đọc thử ở
                // `post-content-preview-<id>`. Dùng chung một key là có ngày phục
                // vụ bản đầy đủ cho người chưa mua.
                const layNoiDung = unstable_cache(
                    async (contentRaw: unknown) => renderPostContent(contentRaw),
                    [laPremium ? `post-content-preview-${post.id}` : `post-content-${post.id}`],
                    { revalidate: 3600, tags: [`post-${post.id}`] }
                );
                return layNoiDung(noiDungDeRender);
            })()
            : Promise.resolve({
                html: '<p class="text-fg-subtle italic">Bài viết này chưa có nội dung.</p>',
                toc: [] as { id: string; text: string; level: number }[],
            }),
        getRelatedPosts(post.id, tagIds, 3),
    ]);

    return (
        <BaiViet
            post={post}
            htmlContent={noiDungDaRender.html}
            // Bài Premium không có mục lục: mục lục dựng ở server mà server
            // không được biết người xem có quyền hay không, nên dựng từ phần
            // đọc thử sẽ lộ cấu trúc phần trả phí. Bài thường vẫn có như cũ.
            toc={laPremium ? [] : noiDungDaRender.toc}
            postTags={postTags}
            relatedPosts={relatedPosts}
        />
    );
}
