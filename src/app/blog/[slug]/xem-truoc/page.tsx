import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import {
    getPostBySlug,
    getPostBySlugForPreview,
    getRelatedPosts,
    getPostTags,
} from '@/lib/data/posts';
import { renderPostContent } from '@/lib/highlight-utils';
import { BaiViet } from '../BaiViet';
import { PreviewBanner } from '@/components/blog/PreviewBanner';

type Props = {
    params: Promise<{ slug: string }>;
};

/**
 * Xem trước bài viết — dành riêng cho admin/editor, kể cả bản nháp.
 *
 * Vì sao là route riêng: trước đây việc này nằm trong `/blog/[slug]` qua
 * `?preview=true`. Chỉ cần đọc `searchParams` là Next ép route render động
 * MỌI request, nên cả 161 bài mất cache chỉ để phục vụ một tính năng mà vài
 * người biên tập dùng vài lần một ngày. Tách ra thì trang công khai tĩnh trở
 * lại, còn route này động thì đúng bản chất — nó phải biết người xem là ai.
 *
 * `noindex`: đây là bản nháp, không được vào chỉ mục tìm kiếm.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Xem trước bài viết',
    robots: { index: false, follow: false },
};

export default async function XemTruocPage({ params }: Props) {
    const { slug } = await params;

    const session = await auth();
    const role = session?.user?.role;
    const laQuanTri = role === 'admin' || role === 'editor';

    // Người thường vào đây thì coi như không có trang, KHÔNG báo "thiếu quyền"
    // — báo vậy là xác nhận có tồn tại một bản nháp mang slug này.
    if (!laQuanTri) {
        notFound();
    }

    // Bài đã đăng đọc bằng hàm có cache; chưa đăng thì mới dùng hàm không cache.
    const post = (await getPostBySlug(slug)) ?? (await getPostBySlugForPreview(slug));
    if (!post) {
        notFound();
    }

    const postTags = await getPostTags(post.id);
    const tagIds = postTags.map((t) => t.id);

    // Admin xem trước thì thấy trọn bài, kể cả bài Premium. KHÔNG cache khâu
    // render ở đây: bản nháp còn đang sửa, cache lại là xem ra bản cũ.
    const noiDung = post.content
        ? renderPostContent(post.content)
        : { html: '<p class="text-fg-subtle italic">Bài viết này chưa có nội dung.</p>', toc: [] };

    const relatedPosts = post.category_id
        ? await getRelatedPosts(post.category_id, post.id, 3, tagIds)
        : [];

    return (
        <BaiViet
            post={post}
            htmlContent={noiDung.html}
            toc={noiDung.toc}
            postTags={postTags}
            relatedPosts={relatedPosts}
            laXemTruoc
            banner={<PreviewBanner postId={post.id} postStatus={post.status} />}
        />
    );
}
