import { getPosts, getPinnedPosts } from '@/lib/data/posts';
import { getCategories } from '@/lib/data/categories';
import { getSetting } from '@/lib/data/settings';
import { BlogListClient } from './BlogListClient';
import { Newsletter } from '@/components/blog/Newsletter';
import { PinnedSlider } from '@/components/blog/PinnedSlider';

/**
 * Thân trang danh sách bài viết, dùng chung cho `/blog` (trang 1) và
 * `/blog/trang/[so]` (trang 2 trở lên).
 *
 * Vì sao tách ra thay vì để một trang đọc `searchParams`:
 * dùng `searchParams` là Next ép route render ĐỘNG mọi request, nên
 * `export const revalidate` không bao giờ áp dụng. Đo được ngày 07/09/2026:
 * `/blog` TTFB 0,29-0,41s trong khi `/` (được cache ở tầng route) chỉ 0,14-0,16s.
 * Chia thành route segment thì cả hai trang đều tĩnh và đọc từ cache.
 *
 * Lọc theo danh mục KHÔNG nằm ở đây — đã có route riêng `/category/[slug]`.
 */
export async function DanhSachBlog({ trang }: { trang: number }) {
    const soBaiMoiTrang = Number(await getSetting('posts_per_page', 12)) || 12;

    const [pinnedPosts, { data: posts, count }, categories] = await Promise.all([
        getPinnedPosts(5),
        getPosts({ page: trang, limit: soBaiMoiTrang }),
        getCategories(),
    ]);

    // Bài ghim đã hiện ở slider nên bỏ khỏi lưới — chỉ ở trang 1, vì từ trang 2
    // slider không hiện nữa.
    const idGhim = new Set(pinnedPosts.map(p => p.id));
    const baiHienThi = trang === 1 ? posts.filter(p => !idGhim.has(p.id)) : posts;

    const tongTrang = Math.max(1, Math.ceil(count / soBaiMoiTrang));

    return (
        <>
            {pinnedPosts.length > 0 && trang === 1 && <PinnedSlider posts={pinnedPosts} />}

            <section className="bg-gradient-to-b from-brand-50 to-surface-50 dark:from-surface-900 dark:to-surface-950 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-fg mb-2">Bài viết</h1>
                    <p className="text-fg-subtle text-lg">
                        {trang === 1 ? 'Khám phá kiến thức mới mỗi ngày' : `Trang ${trang} / ${tongTrang}`}
                    </p>
                </div>
            </section>

            <BlogListClient
                initialPosts={baiHienThi}
                categories={categories}
                currentPage={trang}
                totalPages={tongTrang}
                currentCategory=""
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <Newsletter />
            </div>
        </>
    );
}

/** Số trang của danh sách bài viết — dùng cho `generateStaticParams`. */
export async function demSoTrang(): Promise<number> {
    const soBaiMoiTrang = Number(await getSetting('posts_per_page', 12)) || 12;
    const { count } = await getPosts({ page: 1, limit: soBaiMoiTrang });
    return Math.max(1, Math.ceil(count / soBaiMoiTrang));
}
